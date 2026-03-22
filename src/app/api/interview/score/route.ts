import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()

    // 1️⃣ Get all questions with evaluation
    const questions = await prisma.question.findMany({
      where: { sessionId },
      include: {
        answer: {
          include: {
            evaluation: true
          }
        }
      }
    })

    if (!questions.length) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 }
      )
    }

    // 2️⃣ Calculate scores
    let total = 0
    let count = 0

    questions.forEach((q) => {
      const evalData = q.answer?.evaluation

      if (evalData) {
        const avg =
          (evalData.correctness +
            evalData.clarity +
            evalData.depth) / 3

        total += avg
        count++
      }
    })

    if (count === 0) {
      return NextResponse.json(
        { error: "No evaluations found" },
        { status: 400 }
      )
    }

    const totalScore = total / count
    const accuracy = (totalScore / 10) * 100

    // 3️⃣ Save score
    const score = await prisma.score.upsert({
      where: { sessionId },
      update: {
        totalScore,
        accuracy
      },
      create: {
        sessionId,
        totalScore,
        accuracy
      }
    })

    return NextResponse.json(score)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Scoring failed" },
      { status: 500 }
    )
  }
}