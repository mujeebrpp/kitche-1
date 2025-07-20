"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"

interface Ingredient {
  id: string
  name: string
  unit: string
}

interface RecipeItem {
  id: string
  ingredientId: string
  ingredient: Ingredient
  quantity: number
}

interface Recipe {
  id: string
  name: string
  description?: string
  recipeItems: RecipeItem[]
  createdAt: string
  updatedAt: string
}

export default function RecipeDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const recipeId = params.id as string

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  // Ingredient management states
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newIngredient, setNewIngredient] = useState("")
  const [newQuantity, setNewQuantity] = useState("")
  const [editQuantity, setEditQuantity] = useState("")

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchRecipe()
    fetchIngredients()
  }, [session, status, router, recipeId])

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`)
      if (response.ok) {
        const data = await response.json()
        setRecipe(data)
      } else {
        router.push("/recipes-production")
      }
    } catch (error) {
      console.error("Error fetching recipe:", error)
      router.push("/recipes-production")
    } finally {
      setLoading(false)
    }
  }

  const fetchIngredients = async () => {
    try {
      const response = await fetch("/api/ingredients")
      if (response.ok) {
        const data = await response.json()
        setIngredients(data)
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error)
    }
  }

  const handleAddIngredient = async () => {
    if (!newIngredient || !newQuantity) return

    try {
      const response = await fetch(`/api/recipes/${recipeId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredientId: newIngredient,
          quantity: parseFloat(newQuantity),
        }),
      })

      if (response.ok) {
        const newItem = await response.json()
        setRecipe(prev => prev ? {
          ...prev,
          recipeItems: [...prev.recipeItems, newItem]
        } : null)
        setNewIngredient("")
        setNewQuantity("")
        setShowAddForm(false)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add ingredient")
      }
    } catch (error) {
      console.error("Error adding ingredient:", error)
      alert("Failed to add ingredient")
    }
  }

  const handleUpdateIngredient = async (itemId: string) => {
    if (!editQuantity) return

    try {
      const response = await fetch(`/api/recipes/${recipeId}/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          quantity: parseFloat(editQuantity),
        }),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        setRecipe(prev => prev ? {
          ...prev,
          recipeItems: prev.recipeItems.map(item =>
            item.id === itemId ? updatedItem : item
          )
        } : null)
        setEditingItem(null)
        setEditQuantity("")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update ingredient")
      }
    } catch (error) {
      console.error("Error updating ingredient:", error)
      alert("Failed to update ingredient")
    }
  }

  const handleRemoveIngredient = async (itemId: string) => {
    if (!confirm("Are you sure you want to remove this ingredient?")) return

    try {
      const response = await fetch(`/api/recipes/${recipeId}/items?itemId=${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRecipe(prev => prev ? {
          ...prev,
          recipeItems: prev.recipeItems.filter(item => item.id !== itemId)
        } : null)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to remove ingredient")
      }
    } catch (error) {
      console.error("Error removing ingredient:", error)
      alert("Failed to remove ingredient")
    }
  }

  const startEdit = (item: RecipeItem) => {
    setEditingItem(item.id)
    setEditQuantity(item.quantity.toString())
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditQuantity("")
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/recipes-production")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete recipe")
      }
    } catch (error) {
      console.error("Error deleting recipe:", error)
      alert("Failed to delete recipe")
    } finally {
      setDeleting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center text-primary-600">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Recipe Not Found</h2>
          <button
            onClick={() => router.push("/recipes-production")}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 min-h-[44px] font-medium"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-white shadow border-b-2 border-primary-100">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-primary-900">{recipe.name}</h1>
            <p className="text-sm text-primary-700">Recipe details and ingredients</p>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow border border-primary-100">
          <div className="space-y-6">
            {recipe.description && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">📄</span>
                  <h2 className="text-lg font-medium text-primary-900">Description</h2>
                </div>
                <p className="text-primary-700 bg-primary-50 p-3 rounded-md">{recipe.description}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🥬</span>
                  <h2 className="text-lg font-medium text-primary-900">Ingredients</h2>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="group relative flex justify-center py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[36px] shadow-sm"
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                >
                  {showAddForm ? 'Cancel' : 'Add Ingredient'}
                </button>
              </div>

              {showAddForm && (
                <div className="mb-4 bg-primary-50 p-4 rounded-lg border border-primary-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700">Ingredient</label>
                      <select
                        value={newIngredient}
                        onChange={(e) => setNewIngredient(e.target.value)}
                        className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                      >
                        <option value="">Select ingredient</option>
                        {ingredients.filter(ing => !recipe.recipeItems.some(item => item.ingredient.id === ing.id)).map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name} ({ingredient.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700">Quantity</label>
                      <input
                        type="number"
                        step="0.001"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleAddIngredient}
                        disabled={!newIngredient || !newQuantity}
                        className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm disabled:opacity-50 w-full sm:w-auto"
                        style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {recipe.recipeItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-primary-200">
                    <thead className="bg-primary-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                          Ingredient
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-primary-100">
                      {recipe.recipeItems.map((item) => (
                        <tr key={item.id} className="hover:bg-primary-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                            {item.ingredient.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-700">
                            {editingItem === item.id ? (
                              <input
                                type="number"
                                step="0.001"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                                className="w-20 px-2 py-1 border border-primary-300 rounded focus:border-primary-500 focus:ring-primary-500"
                                autoFocus
                              />
                            ) : (
                              item.quantity
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-600">
                            {item.ingredient.unit}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {editingItem === item.id ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleUpdateIngredient(item.id)}
                                  className="text-green-600 hover:text-green-900 min-h-[32px] px-2 py-1 rounded font-medium"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="text-gray-600 hover:text-gray-900 min-h-[32px] px-2 py-1 rounded font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => startEdit(item)}
                                  className="text-blue-600 hover:text-blue-900 min-h-[32px] px-2 py-1 rounded font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleRemoveIngredient(item.id)}
                                  className="text-red-600 hover:text-red-900 min-h-[32px] px-2 py-1 rounded font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-primary-600">
                  <div className="text-6xl mb-4">🥬</div>
                  <p className="text-lg font-medium text-primary-800">No ingredients added yet</p>
                  <p className="text-sm mt-2">Click "Add Ingredient" to get started</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                onClick={() => router.push(`/recipes/${recipeId}/edit`)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 min-h-[44px] font-medium"
              >
                Edit Recipe
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 min-h-[44px] font-medium"
              >
                {deleting ? "Deleting..." : "Delete Recipe"}
              </button>
              <button
                onClick={() => router.push("/recipes-production")}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 min-h-[44px] font-medium"
              >
                Back to Recipes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}