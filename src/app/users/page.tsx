"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { hasAnyRole, ROLES } from "@/lib/roles"
import { getRoleDisplayName } from "@/lib/roles"

interface User {
  id: string
  username: string
  name: string | null
  email: string | null
  role: string
  active: boolean
  createdAt: string
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Check if user has admin or manager access
  const hasAccess = session?.user?.role ? hasAnyRole(session.user.role as "ADMIN" | "MANAGER" | "CUSTOMER" | "CHEF", [ROLES.ADMIN, ROLES.MANAGER]) : false
  
  // Check if user is admin (only admins can activate/deactivate users)
  const isAdmin = session?.user?.role === "ADMIN"

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      setError("Please sign in to access this page.")
      setLoading(false)
      return
    }

    if (!hasAccess) {
      setError("Access denied. Admin or Manager privileges required.")
      setLoading(false)
      return
    }

    fetchUsers()
  }, [session, status, hasAccess])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      console.log("Response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Response data:", data)
        setUsers(data.users || [])
      } else {
        let errorData
        try {
          errorData = await response.json()
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError)
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error("API Error:", errorData)
        setError(errorData.error || `Failed to fetch users (${response.status})`)
      }
    } catch (error) {
      console.error("Fetch Error:", error)
      setError("An error occurred while fetching users")
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        // Refresh users list
        fetchUsers()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update user role")
      }
    } catch (error) {
      setError("An error occurred while updating user role")
    }
  }

  const updateUserStatus = async (userId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      })

      if (response.ok) {
        // Refresh users list
        fetchUsers()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update user status")
      }
    } catch (error) {
      setError("An error occurred while updating user status")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600">You need to be signed in to access this page.</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need administrator or manager privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Users</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={!user.active ? "opacity-60" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || user.username}
                        {!user.active && <span className="ml-2 text-xs text-red-500">(Inactive)</span>}
                      </div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email || "No email"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === "ADMIN" 
                        ? "bg-red-100 text-red-800"
                        : user.role === "MANAGER"
                        ? "bg-blue-100 text-blue-800"
                        : user.role === "CHEF"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {getRoleDisplayName(user.role as "ADMIN" | "MANAGER" | "CUSTOMER" | "CHEF")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.active 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                    <div>
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                        disabled={user.id === session?.user?.id} // Prevent self-role change
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="CHEF">Chef</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    {isAdmin && user.id !== session?.user?.id && (
                      <div>
                        <button
                          onClick={() => updateUserStatus(user.id, !user.active)}
                          className={`text-xs px-3 py-1 rounded-md font-medium w-full ${
                            user.active
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {user.active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
