import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { questionId, content } = await req.json()

 const answer = await prisma.answer.upsert({
  where: {
    questionId,
  },
  update: {
    content,
  },
  create: {
    questionId,
    content,
  },
})

  return NextResponse.json(answer)
}