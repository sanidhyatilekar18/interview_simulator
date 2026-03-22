import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise <{ id: string }> }
) {
    const { id } = await params
  const session = await prisma.interviewSession.findUnique({
  where: { id },
  include: {
    questions: {
      include: {
        answer: {
          include: {
            evaluation: true
          }
        }
      }
    }
  }
})

  return NextResponse.json(session)
}