import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const score = await prisma.score.findUnique({
    where: { sessionId: id },
  })

  return NextResponse.json(score)
}