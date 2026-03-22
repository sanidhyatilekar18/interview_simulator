import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const sessions = await prisma.interviewSession.findMany({
    where: { userId },
    include: { score: true },
    orderBy: { startedAt: "asc" },
  })

  const totalInterviews = sessions.length
  const avgAccuracy =
    sessions.reduce((acc, s) => acc + (s.score?.accuracy || 0), 0) /
    (totalInterviews || 1)

  const scoresOverTime = sessions.map((s) => ({
    date: s.startedAt,
    score: s.score?.totalScore || 0,
  }))

  return NextResponse.json({
    totalInterviews,
    avgAccuracy,
    scoresOverTime,
  })
}