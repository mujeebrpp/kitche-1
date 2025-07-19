import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stock = await prisma.stock.findMany({
      include: {
        ingredient: true,
      },
      orderBy: {
        ingredient: {
          name: "asc",
        },
      },
    })

    return NextResponse.json(stock)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock" },
      { status: 500 }
    )
  }
}