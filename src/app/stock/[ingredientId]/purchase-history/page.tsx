"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface Purchase {
  id: string
  quantity: number
  unitPrice: number
  totalCost: number
  purchasedAt: string
}

interface Ingredient {
  id: string
  name: string
  unit: string
}

interface PurchaseHistoryData {
  ingredient: Ingredient
  purchases: Purchase[]
  summary: {
    totalPurchases: number
    totalQuantity: number
    totalCost: number
    averageUnitPrice: number
  }
}

export default function PurchaseHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const ingredientId = params.ingredientId as string

  const [data, setData] = useState<PurchaseHistoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchPurchaseHistory()
  }, [session, status, router, ingredientId])

  const fetchPurchaseHistory = async () => {
    try {
      const response = await fetch(`/api/purchases/${ingredientId}`)
      if (response.ok) {
        const data = await response.json()
        setData(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch purchase history")
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error)
      setError("Failed to fetch purchase history")
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

  if (error) {
    return (
      <div className="min-h-screen bg-primary-50">
        <div className="max-w-[600px] mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <Link
              href="/stock"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 min-h-[44px]"
            >
              Back to Stock
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-primary-50">
        <div className="max-w-[600px] mx-auto px-4 py-8">
          <div className="text-center text-primary-600">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg font-medium text-primary-800">No data available</p>
          </div>
        </div>
      </div>
    )
  }

  const { ingredient, purchases, summary } = data

  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-white shadow border-b-2 border-primary-100">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="py-4">
            <div className="flex items-center space-x-2 text-sm text-primary-600">
              <Link href="/stock" className="hover:text-primary-700">
                Stock Management
              </Link>
              <span>›</span>
              <span>Purchase History</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-900 mt-2">
              Purchase History: {ingredient.name}
            </h1>
            <p className="mt-1 text-sm text-primary-700">
              Complete purchase history for {ingredient.name} ({ingredient.unit})
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-primary-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📋</span>
                <div>
                  <dt className="text-sm font-medium text-primary-600">Total Purchases</dt>
                  <dd className="text-xl font-bold text-primary-900">{summary.totalPurchases}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-primary-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📦</span>
                <div>
                  <dt className="text-sm font-medium text-primary-600">Total Quantity</dt>
                  <dd className="text-xl font-bold text-primary-900">
                    {summary.totalQuantity.toFixed(2)} {ingredient.unit}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-primary-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💰</span>
                <div>
                  <dt className="text-sm font-medium text-primary-600">Total Cost</dt>
                  <dd className="text-xl font-bold text-primary-900">₹{summary.totalCost.toFixed(2)}</dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-primary-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <dt className="text-sm font-medium text-primary-600">Avg Unit Price</dt>
                  <dd className="text-xl font-bold text-primary-900">
                    ₹{summary.averageUnitPrice.toFixed(2)}/{ingredient.unit}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100">
          <div className="px-4 py-4 border-b border-primary-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📊</span>
              <div>
                <h3 className="text-lg font-medium text-primary-900">
                  Purchase History
                </h3>
                <p className="text-sm text-primary-600">
                  All purchases of {ingredient.name} sorted by date (newest first)
                </p>
              </div>
            </div>
          </div>
          
          {purchases.length === 0 ? (
            <div className="px-4 py-8 text-center text-primary-600">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-primary-800">No purchases</h3>
              <p className="text-sm mt-2 text-primary-600">No purchases found for this ingredient.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-primary-200">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-100">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-primary-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                        {new Date(purchase.purchasedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                        {purchase.quantity.toFixed(2)} {ingredient.unit}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                        ₹{purchase.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                        ₹{purchase.totalCost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <Link
            href="/stock"
            className="inline-flex items-center px-4 py-2 border border-primary-300 shadow-sm text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 min-h-[44px]"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Stock Management
          </Link>
        </div>
      </main>
    </div>
  )
}