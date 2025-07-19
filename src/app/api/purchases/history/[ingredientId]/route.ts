import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/purchases/history/[ingredientId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ingredientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ingredientId } = await params

    // Validate ingredient exists
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
    })

    if (!ingredient) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 })
    }

    // Get purchase history for this ingredient
    const purchases = await prisma.purchase.findMany({
      where: { ingredientId },
      orderBy: { purchasedAt: 'desc' },
      include: {
        ingredient: true,
      },
    })

    // Calculate summary statistics
    const totalPurchases = purchases.reduce((sum, p) => sum + p.quantity, 0)
    const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0)
    const avgUnitPrice = purchases.length > 0 ? totalCost / totalPurchases : 0

    return NextResponse.json({
      ingredient,
      purchases,
      summary: {
        totalPurchases,
        totalCost,
        avgUnitPrice,
        purchaseCount: purchases.length,
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