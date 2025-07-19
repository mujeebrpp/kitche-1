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

    const ingredients = await prisma.ingredient.findMany({
      include: {
        stock: {
          select: {
            quantity: true,
          },
        },
        purchases: {
          select: {
            unitPrice: true,
          },
          orderBy: {
            purchasedAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(ingredients)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
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
    const { name, unit } = body

    // Validate input
    if (!name || !unit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if ingredient already exists
    const existingIngredient = await prisma.ingredient.findUnique({
      where: {
        name,
      },
    })

    if (existingIngredient) {
      return NextResponse.json(
        { error: "Ingredient with this name already exists" },
        { status: 400 }
      )
    }

    // Create the ingredient
    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        unit,
      },
      include: {
        stock: {
          select: {
            quantity: true,
          },
        },
        purchases: {
          select: {
            unitPrice: true,
          },
          orderBy: {
            purchasedAt: "desc",
          },
          take: 1,
        },
      },
    })

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error("Error creating ingredient:", error)
    return NextResponse.json(
      { error: "Failed to create ingredient" },
      { status: 500 }
    )
  }
}