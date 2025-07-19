import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { orderSchema } from "@/lib/validations"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            recipe: true,
          },
        },
      },
      orderBy: { orderDate: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
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
    const validatedData = orderSchema.parse(body)

    let totalAmount = 0
    for (const item of validatedData.items) {
      totalAmount += item.quantity * item.unitPrice
    }

    const order = await prisma.order.create({
      data: {
        customerName: validatedData.customerName,
        status: validatedData.status || "pending",
        orderItems: {
          create: validatedData.items.map((item) => ({
            recipeId: item.recipeId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            recipe: true,
          },
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}