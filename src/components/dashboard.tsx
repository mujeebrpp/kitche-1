"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  // Role-based menu items
  const getAllMenuItems = () => {
    const userRole = session?.user?.role as "ADMIN" | "MANAGER" | "CHEF" | "CUSTOMER" | undefined

    const baseItems = [
      {
        title: "Orders",
        description: userRole === "CUSTOMER" ? "View your orders" : "Manage customer orders",
        href: "/orders",
        icon: "📦",
        roles: ["ADMIN", "MANAGER", "CHEF", "CUSTOMER"],
      },
    ]

    const operationalItems = [
      {
        title: "Stock Management",
        description: "View current stock levels & manage purchases",
        href: "/stock",
        icon: "📈",
        roles: ["ADMIN", "MANAGER", "CHEF"],
      },
      {
        title: "Recipes & Production",
        description: "Manage recipes and track production batches",
        href: "/recipes-production",
        icon: "🍳",
        roles: ["ADMIN", "MANAGER", "CHEF"],
      },
      {
        title: "Reports & Analytics",
        description: "View business analytics and reports",
        href: "/reports",
        icon: "📊",
        roles: ["ADMIN", "MANAGER"],
      },
    ]

    const adminItems = [
      {
        title: "User Management",
        description: "Manage system users and permissions",
        href: "/users",
        icon: "👥",
        roles: ["ADMIN"],
      },
    ]

    const allItems = [...baseItems, ...operationalItems, ...adminItems]
    
    return allItems.filter(item => 
      userRole && item.roles.includes(userRole)
    )
  }

  const menuItems = getAllMenuItems()

  return (
    <div className="min-h-screen bg-primary-50">
      <main className="max-w-[600px] mx-auto px-4 py-6">
        {/* Welcome section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary-900 mb-2">
            Welcome, {session?.user?.name || session?.user?.username}!
          </h2>
          <p className="text-primary-700">
            {session?.user?.role === "ADMIN" && "Full system administration and management"}
            {session?.user?.role === "MANAGER" && "Kitchen operations and staff management"}
            {session?.user?.role === "CHEF" && "Recipe creation and production management"}
            {session?.user?.role === "CUSTOMER" && "View your orders and account information"}
          </p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {session?.user?.role} Access Level
          </div>
        </div>

        {/* Mobile-first grid - single column on mobile, 2 columns on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative bg-white p-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-primary-100 hover:border-primary-300 active:bg-primary-50"
            >
              <div className="flex items-start space-x-4">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-primary-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-primary-600 leading-relaxed">{item.description}</p>
                </div>
                <span
                  className="pointer-events-none flex-shrink-0 text-primary-300 group-hover:text-primary-500 transition-colors"
                  aria-hidden="true"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
