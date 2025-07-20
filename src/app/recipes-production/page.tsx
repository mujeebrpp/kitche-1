"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { recipeSchema, productionSchema } from "@/lib/validations"
import { z } from "zod"

type Recipe = z.infer<typeof recipeSchema> & {
  id: string
  recipeItems: Array<{
    id: string
    quantity: number
    ingredient: {
      id: string
      name: string
      unit: string
    }
  }>
}

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

interface RecipeOption {
  id: string
  name: string
}

export default function RecipesProductionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'recipes' | 'production'>('recipes')
  
  // Recipes state
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showRecipeForm, setShowRecipeForm] = useState(false)
  const [recipeFormData, setRecipeFormData] = useState({
    name: "",
    description: "",
  })
  
  // Production state
  const [productions, setProductions] = useState<Production[]>([])
  const [recipeOptions, setRecipeOptions] = useState<RecipeOption[]>([])
  const [showProductionForm, setShowProductionForm] = useState(false)
  const [productionFormData, setProductionFormData] = useState({
    recipeId: "",
    quantity: 1,
    labourCost: 0,
    overheadCost: 0,
    packagingCost: 0,
  })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchInitialData()
  }, [session, status, router])

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchRecipes(),
        fetchProductions(),
        fetchRecipeOptions()
      ])
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

  const fetchProductions = async () => {
    try {
      const response = await fetch("/api/production")
      if (response.ok) {
        const data = await response.json()
        setProductions(data)
      }
    } catch (error) {
      console.error("Error fetching productions:", error)
    }
  }

  const fetchRecipeOptions = async () => {
    try {
      const response = await fetch("/api/recipes")
      if (response.ok) {
        const data = await response.json()
        setRecipeOptions(data)
      }
    } catch (error) {
      console.error("Error fetching recipe options:", error)
    }
  }

  const handleRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeFormData),
      })

      if (response.ok) {
        setRecipeFormData({ name: "", description: "" })
        setShowRecipeForm(false)
        fetchRecipes()
        fetchRecipeOptions()
      }
    } catch (error) {
      console.error("Error creating recipe:", error)
    }
  }

  const handleProductionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/production", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productionFormData),
      })

      if (response.ok) {
        setProductionFormData({
          recipeId: "",
          quantity: 1,
          labourCost: 0,
          overheadCost: 0,
          packagingCost: 0,
        })
        setShowProductionForm(false)
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
          <div className="py-4">
            <h1 className="text-2xl font-bold text-primary-900">Recipes & Production</h1>
            <p className="text-sm text-primary-700">Manage recipes and production batches</p>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-primary-200">
            <nav className="-mb-px flex space-x-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('recipes')}
                className={`py-2 px-3 border-b-2 font-medium text-sm min-h-[44px] whitespace-nowrap ${
                  activeTab === 'recipes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
                }`}
              >
                📝 Recipes
              </button>
              <button
                onClick={() => setActiveTab('production')}
                className={`py-2 px-3 border-b-2 font-medium text-sm min-h-[44px] whitespace-nowrap ${
                  activeTab === 'production'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
                }`}
              >
                🏭 Production
              </button>
            </nav>
          </div>
        </div>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-primary-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📝</span>
              <div>
                <h3 className="text-sm font-medium text-primary-600">Total Recipes</h3>
                <p className="text-xl font-bold text-primary-900">{recipes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-primary-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏭</span>
              <div>
                <h3 className="text-sm font-medium text-primary-600">Total Production</h3>
                <p className="text-xl font-bold text-primary-900">{productions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-primary-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📦</span>
              <div>
                <h3 className="text-sm font-medium text-primary-600">Items Produced</h3>
                <p className="text-xl font-bold text-primary-900">
                  {productions.reduce((sum, p) => sum + p.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-primary-100">
            <div className="flex items-center space-x-2">
              <span className="text-xl">💰</span>
              <div>
                <h3 className="text-sm font-medium text-primary-600">Total Value</h3>
                <p className="text-xl font-bold text-primary-900">
                  ₹{productions.reduce((sum, p) => sum + (p.productionCost?.totalProductionCost || 0), 0).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'recipes' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl font-bold text-primary-900">Recipes</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setActiveTab('production')
                    setShowProductionForm(true)
                  }}
                  className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                >
                  Quick Production
                </button>
                <button
                  onClick={() => setShowRecipeForm(!showRecipeForm)}
                  className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                >
                  Add Recipe
                </button>
              </div>
            </div>

            {showRecipeForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6 border border-primary-100">
                <h3 className="text-lg font-medium mb-4 text-primary-900">Add New Recipe</h3>
                <form onSubmit={handleRecipeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={recipeFormData.name}
                      onChange={(e) =>
                        setRecipeFormData({ ...recipeFormData, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700">
                      Description
                    </label>
                    <textarea
                      value={recipeFormData.description}
                      onChange={(e) =>
                        setRecipeFormData({ ...recipeFormData, description: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="submit"
                      className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
                      style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                    >
                      Save Recipe
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRecipeForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 min-h-[44px] font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100">
              {recipes.length === 0 ? (
                <div className="px-4 py-8 text-center text-primary-600">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg font-medium text-primary-800">No recipes yet</p>
                  <p className="text-sm mt-2">Create your first recipe to get started</p>
                </div>
              ) : (
                <ul className="divide-y divide-primary-100">
                  {recipes.map((recipe) => {
                    const recipeProductions = productions.filter(p => p.recipe.id === recipe.id)
                    const totalProduced = recipeProductions.reduce((sum, p) => sum + p.quantity, 0)
                    
                    return (
                      <li key={recipe.id}>
                        <div className="px-4 py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">📝</span>
                                <div>
                                  <h3 className="text-lg font-medium text-primary-900 truncate">
                                    {recipe.name}
                                  </h3>
                                  <p className="text-sm text-primary-600">
                                    {recipe.description || 'No description'}
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0 mt-1">
                                    <p className="text-sm text-primary-600">
                                      <span className="font-medium">Ingredients:</span> {recipe.recipeItems.length}
                                    </p>
                                    <p className="text-sm text-primary-600">
                                      <span className="font-medium">Produced:</span> {totalProduced}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <button
                                onClick={() => router.push(`/recipes/${recipe.id}`)}
                                className="bg-primary-100 text-primary-700 px-3 py-2 rounded-md hover:bg-primary-200 text-sm font-medium min-h-[44px]"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
                                className="bg-primary-600 text-white px-3 py-2 rounded-md hover:bg-primary-700 text-sm font-medium min-h-[44px]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setActiveTab('production')
                                  setShowProductionForm(true)
                                  setProductionFormData(prev => ({ ...prev, recipeId: recipe.id }))
                                }}
                                className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
                                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                              >
                                Produce
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            
            {/* Recent Productions */}
            {productions.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">🏭</span>
                  <h3 className="text-xl font-bold text-primary-900">Recent Productions</h3>
                </div>
                <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100">
                  <ul className="divide-y divide-primary-100">
                    {productions.slice(0, 5).map((production) => (
                      <li key={production.id}>
                        <div className="px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-md font-medium text-primary-900">
                                {production.recipe.name}
                              </h4>
                              <p className="text-sm text-primary-600">
                                Quantity: {production.quantity} • {new Date(production.producedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-md font-medium text-primary-900">
                                ₹{production.productionCost?.totalProductionCost.toFixed(2) || "0.00"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'production' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl font-bold text-primary-900">Production</h2>
              <button
                onClick={() => setShowProductionForm(!showProductionForm)}
                className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              >
                New Production
              </button>
            </div>

            {showProductionForm && (
              <div className="bg-white p-6 rounded-lg shadow mb-6 border border-primary-100">
                <h3 className="text-lg font-medium mb-4 text-primary-900">New Production Batch</h3>
                <form onSubmit={handleProductionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700">
                      Recipe
                    </label>
                    <select
                      value={productionFormData.recipeId}
                      onChange={(e) =>
                        setProductionFormData({ ...productionFormData, recipeId: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select a recipe</option>
                      {recipeOptions.map((recipe) => (
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
                        value={productionFormData.quantity}
                        onChange={(e) =>
                          setProductionFormData({
                            ...productionFormData,
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
                        value={productionFormData.labourCost}
                        onChange={(e) =>
                          setProductionFormData({
                            ...productionFormData,
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
                        value={productionFormData.overheadCost}
                        onChange={(e) =>
                          setProductionFormData({
                            ...productionFormData,
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
                        value={productionFormData.packagingCost}
                        onChange={(e) =>
                          setProductionFormData({
                            ...productionFormData,
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
                      className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
                      style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                    >
                      Start Production
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProductionForm(false)}
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
                  <p className="text-sm mt-2">Start your first production batch to track costs</p>
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
                            <p className="text-sm text-primary-600">
                              <span className="font-medium">Ingredients:</span> ₹{production.productionCost?.ingredientCost.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
