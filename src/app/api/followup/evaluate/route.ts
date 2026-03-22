import { NextResponse } from "next/server"
import { evaluateAnswer } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json()

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Missing question or answer" },
        { status: 400 }
      )
    }

    const evaluation = await evaluateAnswer(question, answer)
    return NextResponse.json(evaluation)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Follow-up evaluation failed" },
      { status: 500 }
    )
  }
}