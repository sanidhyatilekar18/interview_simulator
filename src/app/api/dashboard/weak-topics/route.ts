import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const weakTopics = await prisma.weakTopic.findMany({
    where: { userId: session.user.id },
    orderBy: { frequency: "desc" },
    take: 5,
  })

  return NextResponse.json(weakTopics)
}