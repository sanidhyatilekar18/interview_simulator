import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"]

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lastSession = await prisma.interviewSession.findFirst({
    where: { userId: session.user.id },
    include: { score: true },
    orderBy: { startedAt: "desc" },
  })

  if (!lastSession || !lastSession.score) {
    return NextResponse.json({
      recommended: "Easy",
      reason: "No previous sessions found. Starting with Easy!",
    })
  }

  const { totalScore } = lastSession.score
  const currentIndex = DIFFICULTY_ORDER.indexOf(lastSession.difficulty)

  let recommended = lastSession.difficulty
  let reason = ""

  if (totalScore >= 7 && currentIndex < DIFFICULTY_ORDER.length - 1) {
    recommended = DIFFICULTY_ORDER[currentIndex + 1]
    reason = `Great job! You scored ${totalScore.toFixed(1)}/10 last time. Level up! 🚀`
  } else if (totalScore < 5 && currentIndex > 0) {
    recommended = DIFFICULTY_ORDER[currentIndex - 1]
    reason = `You scored ${totalScore.toFixed(1)}/10 last time. Let's practice more at a lower level.`
  } else {
    recommended = lastSession.difficulty
    reason = `You scored ${totalScore.toFixed(1)}/10. Keep practicing at this level.`
  }

  return NextResponse.json({ recommended, reason })
}