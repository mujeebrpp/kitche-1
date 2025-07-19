"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { hasAnyRole, UserRole } from "@/lib/roles"

const navigationItems = [
  { 
    name: "Dashboard", 
    href: "/", 
    roles: ["ADMIN", "MANAGER", "CHEF", "CUSTOMER"] as UserRole[]
  },
  { 
    name: "Stock Ingredients & Purchase", 
    href: "/stock", 
    roles: ["ADMIN", "MANAGER", "CHEF"] as UserRole[]
  },
  { 
    name: "Recipes & Production", 
    href: "/recipes-production", 
    roles: ["ADMIN", "MANAGER", "CHEF"] as UserRole[]
  },
  { 
    name: "Orders", 
    href: "/orders", 
    roles: ["ADMIN", "MANAGER", "CHEF", "CUSTOMER"] as UserRole[]
  },
  { 
    name: "User Management", 
    href: "/users", 
    roles: ["ADMIN"] as UserRole[]
  },
]

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Filter navigation items based on user role
  const userRole = session?.user?.role as UserRole | undefined
  const filteredNavigation = navigationItems.filter(item => 
    hasAnyRole(userRole, item.roles)
  )

  return (
    <nav className="bg-white shadow border-b-2 border-primary-100">
      <div className="max-w-[600px] mx-auto px-4">
        {/* Mobile header */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-primary-800">
              Kitchen Stock
            </h1>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-2">
            {session && (
              <button
                onClick={() => signOut()}
                className="text-xs text-primary-600 hover:text-primary-700 px-2 py-1"
              >
                Sign out
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-primary-600 hover:text-primary-800 hover:bg-primary-50"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="pb-4 border-t border-primary-100">
            <div className="pt-4 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${
                    pathname === item.href
                      ? "bg-primary-100 text-primary-800 border-l-4 border-primary-500"
                      : "text-primary-600 hover:bg-primary-50 hover:text-primary-700"
                  } block px-4 py-3 text-base font-medium`}
                >
                  {item.name}
                </Link>
              ))}
              {session && (
                <div className="px-4 py-2 text-sm text-primary-600 border-t border-primary-100 mt-2 pt-4">
                  <div>{session.user?.name || session.user?.username}</div>
                  <div className="text-xs text-primary-500">
                    {session.user?.role || 'CUSTOMER'} • {session.user?.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
