import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { evaluateAnswer } from "@/lib/gemini"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { questionId } = await req.json()

    if (!questionId) {
      return NextResponse.json(
        { error: "questionId missing" },
        { status: 400 }
      )
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { answer: true },
    })

    if (!question || !question.answer) {
      return NextResponse.json(
        { error: "Answer not found" },
        { status: 404 }
      )
    }

    const aiEvaluation = await evaluateAnswer(
      question.content,
      question.answer.content
    )

    const evaluation = await prisma.evaluation.upsert({
      where: { answerId: question.answer.id },
      update: {
        correctness: aiEvaluation.correctness,
        clarity: aiEvaluation.clarity,
        depth: aiEvaluation.depth,
        feedback: aiEvaluation.feedback,
        idealAnswer: aiEvaluation.idealAnswer,
      },
      create: {
        correctness: aiEvaluation.correctness,
        clarity: aiEvaluation.clarity,
        depth: aiEvaluation.depth,
        feedback: aiEvaluation.feedback,
        idealAnswer: aiEvaluation.idealAnswer,
        answerId: question.answer.id,
      },
    })

    if (aiEvaluation.correctness < 6) {
      await prisma.weakTopic.upsert({
        where: {
          userId_topic: {
            userId,
            topic: question.topic,
          },
        },
        update: {
          frequency: { increment: 1 },
        },
        create: {
          userId,
          topic: question.topic,
          frequency: 1,
        },
      })
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Evaluation failed" },
      { status: 500 }
    )
  }
}