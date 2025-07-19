import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { productionSchema } from "@/lib/validations"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productions = await prisma.production.findMany({
      include: {
        recipe: true,
        productionCost: true,
      },
      orderBy: { producedAt: "desc" },
    })

    return NextResponse.json(productions)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch productions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = productionSchema.parse(body)

    // Get recipe with ingredients
    const recipe = await prisma.recipe.findUnique({
      where: { id: validatedData.recipeId },
      include: {
        recipeItems: {
          include: {
            ingredient: {
              include: {
                stock: true,
                purchases: {
                  orderBy: { purchasedAt: "desc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if enough stock for production
    for (const item of recipe.recipeItems) {
      const requiredQuantity = item.quantity * validatedData.quantity
      const availableStock = item.ingredient.stock[0]?.quantity || 0
      
      if (availableStock < requiredQuantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.ingredient.name}` },
          { status: 400 }
        )
      }
    }

    // Calculate ingredient costs
    let ingredientCost = 0
    for (const item of recipe.recipeItems) {
      const requiredQuantity = item.quantity * validatedData.quantity
      const unitPrice = item.ingredient.purchases[0]?.unitPrice || 0
      ingredientCost += requiredQuantity * unitPrice
    }

    // Create production
    const production = await prisma.production.create({
      data: {
        recipeId: validatedData.recipeId,
        quantity: validatedData.quantity,
        labourCost: validatedData.labourCost,
        overheadCost: validatedData.overheadCost,
        packagingCost: validatedData.packagingCost,
      },
    })

    // Create production cost record
    const totalProductionCost =
      ingredientCost +
      validatedData.labourCost +
      validatedData.overheadCost +
      validatedData.packagingCost

    await prisma.productionCost.create({
      data: {
        productionId: production.id,
        ingredientCost,
        labourCost: validatedData.labourCost,
        overheadCost: validatedData.overheadCost,
        packagingCost: validatedData.packagingCost,
        totalProductionCost,
      },
    })

    // Update stock levels
    for (const item of recipe.recipeItems) {
      const requiredQuantity = item.quantity * validatedData.quantity
      const currentStock = item.ingredient.stock[0]
      
      if (currentStock) {
        await prisma.stock.update({
          where: { id: currentStock.id },
          data: { quantity: currentStock.quantity - requiredQuantity },
        })
      }
    }

    return NextResponse.json(production, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to create production" },
      { status: 500 }
    )
  }
}