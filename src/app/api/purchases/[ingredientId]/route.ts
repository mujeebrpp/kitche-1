import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ingredientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ingredientId } = await params

    // Validate ingredientId
    if (!ingredientId) {
      return NextResponse.json(
        { error: "Ingredient ID is required" },
        { status: 400 }
      )
    }

    // Check if ingredient exists
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
    })

    if (!ingredient) {
      return NextResponse.json(
        { error: "Ingredient not found" },
        { status: 404 }
      )
    }

    // Fetch purchase history for the ingredient
    const purchases = await prisma.purchase.findMany({
      where: {
        ingredientId,
      },
      include: {
        ingredient: true,
      },
      orderBy: {
        purchasedAt: "desc",
      },
    })

    // Calculate summary statistics
    const totalPurchases = purchases.length
    const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0)
    const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0)
    const averageUnitPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0

    return NextResponse.json({
      ingredient,
      purchases,
      summary: {
        totalPurchases,
        totalQuantity,
        totalCost,
        averageUnitPrice,
      },
    })
  } catch (error) {
    console.error("Error fetching purchase history:", error)
    return NextResponse.json(
      { error: "Failed to fetch purchase history" },
      { status: 500 }
    )
  }
}