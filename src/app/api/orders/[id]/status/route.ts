import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasAnyRole, ROLES } from "@/lib/roles"
import { z } from "zod"

const statusUpdateSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "delivered", "cancelled"]),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has Admin or Manager role
    if (!hasAnyRole(session.user.role, [ROLES.ADMIN, ROLES.MANAGER])) {
      return NextResponse.json(
        { error: "Access denied. Only Admin and Manager roles can change order status." },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    const { status } = statusUpdateSchema.parse(body)

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            recipe: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("Error updating order status:", error)
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    )
  }
}
