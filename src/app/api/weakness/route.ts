import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generateWeaknessSuggestions } from "@/lib/gemini"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const weakTopics = await prisma.weakTopic.findMany({
    where: { userId: session.user.id },
    orderBy: { frequency: "desc" },
  })

  if (!weakTopics.length) {
    return NextResponse.json([])
  }

  const withSuggestions = await Promise.all(
    weakTopics.map(async (t) => {
      const suggestion = await generateWeaknessSuggestions(
        t.topic,
        t.frequency
      )
      return { ...t, suggestion }
    })
  )

  return NextResponse.json(withSuggestions)
}