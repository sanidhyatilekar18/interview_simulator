import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generateFollowUp } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json()

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        answer: {
          include: { evaluation: true }
        }
      }
    })

    if (!question?.answer?.evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      )
    }

    const { correctness } = question.answer.evaluation

    // Only generate follow-up if weak answer
    if (correctness >= 7) {
      return NextResponse.json({ followUp: null })
    }

    const result = await generateFollowUp(
      question.content,
      question.answer.content,
      question.answer.evaluation.feedback
    )

    return NextResponse.json({ followUp: result.followUp })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Follow-up generation failed" },
      { status: 500 }
    )
  }
}