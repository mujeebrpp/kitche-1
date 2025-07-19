import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/recipes/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        recipeItems: {
          include: {
            ingredient: true,
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    )
  }
}

// PUT /api/recipes/[id]
export async function PUT(
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
    const { name, description } = body

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Recipe name is required" },
        { status: 400 }
      )
    }

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if name is already taken by another recipe
    const nameConflict = await prisma.recipe.findFirst({
      where: {
        name: name.trim(),
        NOT: { id },
      },
    })

    if (nameConflict) {
      return NextResponse.json(
        { error: "Recipe name already exists" },
        { status: 400 }
      )
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        recipeItems: {
          include: {
            ingredient: true,
          },
        },
      },
    })

    return NextResponse.json(updatedRecipe)
  } catch (error) {
    console.error("Error updating recipe:", error)
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    )
  }
}

// DELETE /api/recipes/[id]
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

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if recipe is used in production or orders
    const hasProductions = await prisma.production.count({
      where: { recipeId: id },
    })

    const hasOrders = await prisma.orderItem.count({
      where: { recipeId: id },
    })

    if (hasProductions > 0 || hasOrders > 0) {
      return NextResponse.json(
        { error: "Cannot delete recipe that is used in production or orders" },
        { status: 400 }
      )
    }

    await prisma.recipe.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Recipe deleted successfully" })
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    )
  }
}