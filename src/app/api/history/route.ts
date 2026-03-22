import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: session.user.id },
    include: {
      score: true,
      questions: {
        include: {
          answer: {
            include: { evaluation: true },
          },
        },
      },
    },
    orderBy: { startedAt: "desc" },
  })

  return NextResponse.json(sessions)
}