import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Stock, Ingredient } from "@prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get stock report
    const stockReport = await prisma.stock.findMany({
      include: {
        ingredient: {
          include: {
            purchases: {
              orderBy: { purchasedAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        ingredient: {
          name: "asc",
        },
      },
    })

    // Get production report
    const productionReport = await prisma.production.findMany({
      include: {
        recipe: true,
        productionCost: true,
      },
      orderBy: { producedAt: "desc" },
      take: 10,
    })

    // Get order report
    const orderReport = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            recipe: true,
          },
        },
      },
      orderBy: { orderDate: "desc" },
      take: 10,
    })

    // Calculate total costs
    const totalProductionCost = await prisma.productionCost.aggregate({
      _sum: {
        totalProductionCost: true,
      },
    })

    const totalOrderValue = await prisma.orderItem.aggregate({
      _sum: {
        totalPrice: true,
      },
    })

    // Get low stock items
    const lowStockItems = stockReport.filter(
      (item: Stock & { ingredient: Ingredient }) => item.quantity < 10
    )

    const report = {
      stock: stockReport,
      production: productionReport,
      orders: orderReport,
      summary: {
        totalProductionCost: totalProductionCost._sum.totalProductionCost || 0,
        totalOrderValue: totalOrderValue._sum.totalPrice || 0,
        lowStockCount: lowStockItems.length,
        totalIngredients: stockReport.length,
      },
    }

    return NextResponse.json(report)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    )
  }
}