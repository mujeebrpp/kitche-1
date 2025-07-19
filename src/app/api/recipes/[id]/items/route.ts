import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// POST /api/recipes/[id]/items
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { ingredientId, quantity } = body

    if (!ingredientId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Ingredient and valid quantity are required" },
        { status: 400 }
      )
    }

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if ingredient exists
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
    })

    if (!ingredient) {
      return NextResponse.json({ error: "Ingredient not found" }, { status: 404 })
    }

    // Check if ingredient already exists in recipe
    const existingItem = await prisma.recipeItem.findFirst({
      where: {
        recipeId: id,
        ingredientId,
      },
    })

    if (existingItem) {
      return NextResponse.json(
        { error: "Ingredient already exists in this recipe" },
        { status: 400 }
      )
    }

    const recipeItem = await prisma.recipeItem.create({
      data: {
        recipeId: id,
        ingredientId,
        quantity: parseFloat(quantity),
      },
      include: {
        ingredient: true,
      },
    })

    return NextResponse.json(recipeItem)
  } catch (error) {
    console.error("Error adding recipe item:", error)
    return NextResponse.json(
      { error: "Failed to add recipe item" },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes/[id]/items
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      )
    }

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if recipe item exists and belongs to this recipe
    const recipeItem = await prisma.recipeItem.findUnique({
      where: { id: itemId },
    })

    if (!recipeItem || recipeItem.recipeId !== id) {
      return NextResponse.json(
        { error: "Recipe item not found" },
        { status: 404 }
      )
    }

    await prisma.recipeItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ message: "Recipe item deleted successfully" })
  } catch (error) {
    console.error("Error deleting recipe item:", error)
    return NextResponse.json(
      { error: "Failed to delete recipe item" },
      { status: 500 }
    )
  }
}