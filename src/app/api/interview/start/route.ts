import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateQuestions } from "@/lib/gemini"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()
    const { role, difficulty, topic } = body

    const sessionRecord = await prisma.interviewSession.create({
      data: {
        role,
        difficulty,
        topic,
        userId,
      },
    })

    const aiResponse = await generateQuestions(role, difficulty, topic)

    let questions
    if (typeof aiResponse === "object") {
      questions = aiResponse
    } else {
      const cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
      questions = JSON.parse(cleaned)
    }

    await prisma.question.createMany({
      data: questions.map((q: any) => ({
        content: q.question,
        topic,
        difficulty,
        sessionId: sessionRecord.id,
      })),
    })

    return NextResponse.json({
      session: sessionRecord,
      questions,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({ message: "API working" })
}