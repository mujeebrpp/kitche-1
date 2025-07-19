"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ReportData {
  stock: Array<{
    id: string
    quantity: number
    ingredient: {
      id: string
      name: string
      unit: string
      purchases: Array<{
        unitPrice: number
      }>
    }
  }>
  production: Array<{
    id: string
    quantity: number
    producedAt: string
    recipe: {
      name: string
    }
    productionCost: {
      ingredientCost: number
      labourCost: number
      overheadCost: number
      packagingCost: number
      totalProductionCost: number
    } | null
  }>
  orders: Array<{
    id: string
    customerName: string
    orderDate: string
    status: string
    orderItems: Array<{
      quantity: number
      unitPrice: number
      totalPrice: number
      recipe: {
        name: string
      }
    }>
  }>
  summary: {
    totalProductionCost: number
    totalOrderValue: number
    lowStockCount: number
    totalIngredients: number
  }
}

export default function ReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchReports()
  }, [session, status, router])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports")
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center text-primary-600">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg font-medium text-primary-800">No report data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-white shadow border-b-2 border-primary-100">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">Reports</h1>
              <p className="text-sm text-primary-700">View analytics and insights</p>
            </div>
            <button
              onClick={() => fetchReports()}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 min-h-[44px] font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-primary-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💰</span>
                <div>
                  <div className="text-xl font-bold text-primary-900">
                    ₹{reportData.summary.totalProductionCost.toFixed(2)}
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    Total Production Cost
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-primary-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📈</span>
                <div>
                  <div className="text-xl font-bold text-primary-900">
                    ₹{reportData.summary.totalOrderValue.toFixed(2)}
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    Total Order Value
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-primary-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="text-xl font-bold text-primary-900">
                    {reportData.summary.lowStockCount}
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    Low Stock Items
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-primary-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🥬</span>
                <div>
                  <div className="text-xl font-bold text-primary-900">
                    {reportData.summary.totalIngredients}
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    Total Ingredients
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Report */}
        <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100 mb-6">
          <div className="px-4 py-4 border-b border-primary-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📦</span>
              <h3 className="text-lg font-medium text-primary-900">
                Current Stock
              </h3>
            </div>
          </div>
          <div>
            <ul className="divide-y divide-primary-100">
              {reportData.stock.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-900">
                        {item.ingredient.name}
                      </p>
                      <p className="text-sm text-primary-600">
                        Unit: {item.ingredient.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          item.quantity < 10 ? "text-red-600" : "text-primary-600"
                        }`}
                      >
                        {item.quantity} {item.ingredient.unit}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Production */}
        <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100 mb-6">
          <div className="px-4 py-4 border-b border-primary-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏭</span>
              <h3 className="text-lg font-medium text-primary-900">
                Recent Production
              </h3>
            </div>
          </div>
          <div>
            <ul className="divide-y divide-primary-100">
              {reportData.production.slice(0, 5).map((prod) => (
                <li key={prod.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-900">
                        {prod.recipe.name}
                      </p>
                      <p className="text-sm text-primary-600">
                        {new Date(prod.producedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary-900">
                        {prod.quantity} units
                      </p>
                      <p className="text-sm text-primary-600">
                        Cost: ₹{prod.productionCost?.totalProductionCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100">
          <div className="px-4 py-4 border-b border-primary-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📦</span>
              <h3 className="text-lg font-medium text-primary-900">
                Recent Orders
              </h3>
            </div>
          </div>
          <div>
            <ul className="divide-y divide-primary-100">
              {reportData.orders.slice(0, 5).map((order) => (
                <li key={order.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-900">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-primary-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary-900">
                        ₹{order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-primary-600">{order.status}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}