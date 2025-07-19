"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { productionSchema } from "@/lib/validations"
import { z } from "zod"

type Production = z.infer<typeof productionSchema> & {
  id: string
  recipe: {
    id: string
    name: string
  }
  productionCost: {
    ingredientCost: number
    labourCost: number
    overheadCost: number
    packagingCost: number
    totalProductionCost: number
  } | null
  producedAt: string
}

interface Recipe {
  id: string
  name: string
}

export default function ProductionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [productions, setProductions] = useState<Production[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    recipeId: "",
    quantity: 1,
    labourCost: 0,
    overheadCost: 0,
    packagingCost: 0,
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchProductions()
    fetchRecipes()
  }, [session, status, router])

  const fetchProductions = async () => {
    try {
      const response = await fetch("/api/production")
      if (response.ok) {
        const data = await response.json()
        setProductions(data)
      }
    } catch (error) {
      console.error("Error fetching productions:", error)
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
      const response = await fetch("/api/production", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          recipeId: "",
          quantity: 1,
          labourCost: 0,
          overheadCost: 0,
          packagingCost: 0,
        })
        setShowForm(false)
        fetchProductions()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to create production")
      }
    } catch (error) {
      console.error("Error creating production:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-white shadow border-b-2 border-primary-100">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">Production</h1>
              <p className="text-sm text-primary-700">Track production batches and costs</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] font-medium shadow-sm"
              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
            >
              New Production
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6 border border-primary-100">
            <h2 className="text-lg font-medium mb-4 text-primary-900">New Production Batch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700">
                  Recipe
                </label>
                <select
                  value={formData.recipeId}
                  onChange={(e) =>
                    setFormData({ ...formData, recipeId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a recipe</option>
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700">
                    Labour Cost (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.labourCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        labourCost: parseFloat(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700">
                    Overhead Cost (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.overheadCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        overheadCost: parseFloat(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-700">
                    Packaging Cost (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.packagingCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        packagingCost: parseFloat(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] font-medium shadow-sm"
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                >
                  Start Production
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
          {productions.length === 0 ? (
            <div className="px-4 py-8 text-center text-primary-600">
              <div className="text-6xl mb-4">🏭</div>
              <p className="text-lg font-medium text-primary-800">No production batches yet</p>
              <p className="text-sm mt-2">Start your first production batch to track costs and quantities</p>
            </div>
          ) : (
            <ul className="divide-y divide-primary-100">
              {productions.map((production) => (
                <li key={production.id}>
                  <div className="px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🏭</span>
                          <div>
                            <h3 className="text-lg font-medium text-primary-900 truncate">
                              {production.recipe.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
                              <p className="text-sm text-primary-600">
                                <span className="font-medium">Qty:</span> {production.quantity}
                              </p>
                              <p className="text-sm text-primary-600">
                                <span className="font-medium">Date:</span> {new Date(production.producedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:text-right space-y-1">
                        <p className="text-lg font-semibold text-primary-900">
                          Total: ₹{production.productionCost?.totalProductionCost.toFixed(2) || "0.00"}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-primary-600">
                          <span>
                            <span className="font-medium">Ingredients:</span> ₹{production.productionCost?.ingredientCost.toFixed(2) || "0.00"}
                          </span>
                          <span>
                            <span className="font-medium">Labour:</span> ₹{production.productionCost?.labourCost.toFixed(2) || "0.00"}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-primary-600">
                          <span>
                            <span className="font-medium">Overhead:</span> ₹{production.productionCost?.overheadCost.toFixed(2) || "0.00"}
                          </span>
                          <span>
                            <span className="font-medium">Packaging:</span> ₹{production.productionCost?.packagingCost.toFixed(2) || "0.00"}
                          </span>
                        </div>
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