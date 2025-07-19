import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasRole, ROLES } from "@/lib/roles"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has admin privileges (only admins can activate/deactivate users)
    const userRole = session.user.role as "ADMIN" | "MANAGER" | "CUSTOMER" | "CHEF" | undefined
    if (!hasRole(userRole, ROLES.ADMIN)) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      )
    }

    const { id } = await params
    const { active } = await request.json()

    // Validate active field
    if (typeof active !== "boolean") {
      return NextResponse.json(
        { error: "Invalid active status. Must be true or false." },
        { status: 400 }
      )
    }

    // Prevent users from deactivating themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own active status" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update user active status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { active },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        active: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      message: `User ${active ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
