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

    const purchases = await prisma.purchase.findMany({
      include: {
        ingredient: true,
      },
      orderBy: {
        purchasedAt: "desc",
      },
    })

    return NextResponse.json(purchases)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { ingredientId, quantity, unitPrice, totalCost } = body

    // Validate input
    if (!ingredientId || !quantity || !unitPrice || !totalCost) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create the purchase record
    const purchase = await prisma.purchase.create({
      data: {
        ingredientId,
        quantity: parseFloat(quantity),
        unitPrice: parseFloat(unitPrice),
        totalCost: parseFloat(totalCost),
      },
      include: {
        ingredient: true,
      },
    })

    // Update or create stock record
    const existingStock = await prisma.stock.findFirst({
      where: {
        ingredientId,
      },
    })

    if (existingStock) {
      // Update existing stock
      await prisma.stock.update({
        where: {
          id: existingStock.id,
        },
        data: {
          quantity: {
            increment: parseFloat(quantity),
          },
        },
      })
    } else {
      // Create new stock record
      await prisma.stock.create({
        data: {
          ingredientId,
          quantity: parseFloat(quantity),
        },
      })
    }

    return NextResponse.json(purchase)
  } catch (error) {
    console.error("Error creating purchase:", error)
    return NextResponse.json(
      { error: "Failed to create purchase" },
      { status: 500 }
    )
  }
}