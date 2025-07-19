"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { orderSchema } from "@/lib/validations"
import { hasAnyRole, ROLES } from "@/lib/roles"
import { z } from "zod"

type Order = z.infer<typeof orderSchema> & {
  id: string
  orderDate: string
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    recipe: {
      id: string
      name: string
    }
  }>
}

interface Recipe {
  id: string
  name: string
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    status: "pending",
    items: [] as Array<{ recipeId: string; quantity: number; unitPrice: number }>,
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchOrders()
    fetchRecipes()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes")
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate that we have at least one item
      if (formData.items.length === 0) {
        alert("Please add at least one item to the order")
        return
      }

      // Validate that all items have recipeId and positive quantity
      const validItems = formData.items.filter(
        item => item.recipeId && item.quantity > 0 && item.unitPrice >= 0
      )
      
      if (validItems.length === 0) {
        alert("Please add valid items with recipe, quantity and price")
        return
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: validItems
        }),
      })

      if (response.ok) {
        setFormData({
          customerName: "",
          status: "pending",
          items: [],
        })
        setShowForm(false)
        fetchOrders()
      } else {
        const error = await response.json()
        alert(`Error creating order: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to create order. Please try again.")
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { recipeId: "", quantity: 1, unitPrice: 0 }],
    })
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      } else {
        const error = await response.json()
        alert(`Error updating status: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Check if user can change order status (Admin or Manager only)
  const canChangeStatus = hasAnyRole(session?.user?.role, [ROLES.ADMIN, ROLES.MANAGER])

  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-white shadow border-b-2 border-primary-100">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">Orders</h1>
              <p className="text-sm text-primary-700">Manage customer orders</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
            >
              New Order
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6 border border-primary-100">
            <h2 className="text-lg font-medium mb-4 text-primary-900">New Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div>
                <h3 className="text-md font-medium text-primary-900 mb-3">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="border border-primary-200 rounded-lg p-4 bg-primary-50">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5">
                          <label className="block text-sm font-medium text-primary-700 mb-1">
                            Recipe
                          </label>
                          <select
                            value={item.recipeId}
                            onChange={(e) => updateItem(index, "recipeId", e.target.value)}
                            className="w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                          >
                            <option value="">Select recipe</option>
                            {recipes.map((recipe) => (
                              <option key={recipe.id} value={recipe.id}>
                                {recipe.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-primary-700 mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", parseInt(e.target.value) || 1)
                            }
                            className="w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                          />
                        </div>
                        
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-primary-700 mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)
                            }
                            className="w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                          />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-primary-700 mb-1 sm:invisible">
                            Action
                          </label>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-full bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm min-h-[44px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-3 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 min-h-[44px] font-medium"
                >
                  + Add Item
                </button>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 min-h-[44px] font-medium"
                >
                  Create Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 min-h-[44px] font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100">
          {orders.length === 0 ? (
            <div className="px-4 py-8 text-center text-primary-600">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-lg font-medium text-primary-800">No orders yet</p>
              <p className="text-sm mt-2">Create your first order to get started</p>
            </div>
          ) : (
            <ul className="divide-y divide-primary-100">
              {orders.map((order) => (
                <li key={order.id}>
                  <div className="px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📦</span>
                          <div>
                            <h3 className="text-lg font-medium text-primary-900 truncate">
                              {order.customerName}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
                              <p className="text-sm text-primary-600">
                                <span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-primary-600">
                                <span className="font-medium">Items:</span> {order.orderItems.length}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:text-right space-y-2">
                        {canChangeStatus ? (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-sm font-medium rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px] ${
                              order.status === "completed"
                                ? "text-primary-600 bg-primary-50"
                                : order.status === "pending"
                                ? "text-yellow-600 bg-yellow-50"
                                : order.status === "delivered"
                                ? "text-purple-600 bg-purple-50"
                                : order.status === "cancelled"
                                ? "text-red-600 bg-red-50"
                                : "text-primary-600 bg-primary-50"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <div className={`text-sm font-medium rounded-md px-3 py-2 min-h-[44px] flex items-center justify-center ${
                            order.status === "completed"
                              ? "text-primary-600 bg-primary-50"
                              : order.status === "pending"
                              ? "text-yellow-600 bg-yellow-50"
                              : order.status === "delivered"
                              ? "text-purple-600 bg-purple-50"
                              : order.status === "cancelled"
                              ? "text-red-600 bg-red-50"
                              : "text-primary-600 bg-primary-50"
                          }`} title="Only Admin and Manager roles can change order status">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        )}
                        <p className="text-lg font-semibold text-primary-900">
                          Total: ₹{order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
