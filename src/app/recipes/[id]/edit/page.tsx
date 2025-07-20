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
}

export default function EditRecipePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const recipeId = params.id as string

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [newQuantity, setNewQuantity] = useState("")

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
        setName(data.name)
        setDescription(data.description || "")
        setRecipeItems(data.recipeItems)
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

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (response.ok) {
        router.push(`/recipes/${recipeId}`)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update recipe")
      }
    } catch (error) {
      console.error("Error updating recipe:", error)
      alert("Failed to update recipe")
    } finally {
      setSaving(false)
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
        setRecipeItems([...recipeItems, newItem])
        setNewIngredient("")
        setNewQuantity("")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add ingredient")
      }
    } catch (error) {
      console.error("Error adding ingredient:", error)
      alert("Failed to add ingredient")
    }
  }

  const handleRemoveIngredient = async (itemId: string) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/items?itemId=${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRecipeItems(recipeItems.filter(item => item.id !== itemId))
      } else {
        const error = await response.json()
        alert(error.error || "Failed to remove ingredient")
      }
    } catch (error) {
      console.error("Error removing ingredient:", error)
      alert("Failed to remove ingredient")
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
            <h1 className="text-2xl font-bold text-primary-900">Edit Recipe</h1>
            <p className="text-sm text-primary-700">Update recipe details and ingredients</p>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-lg shadow border border-primary-100">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-700">
                Recipe Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-primary-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">🥬</span>
                <h3 className="text-lg font-medium text-primary-900">Ingredients</h3>
              </div>
              
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
                      {ingredients.map((ingredient) => (
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
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddIngredient}
                      disabled={!newIngredient || !newQuantity}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 min-h-[44px] font-medium w-full sm:w-auto"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {recipeItems.length > 0 ? (
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
                      {recipeItems.map((item) => (
                        <tr key={item.id} className="hover:bg-primary-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                            {item.ingredient.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-700">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-600">
                            {item.ingredient.unit}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleRemoveIngredient(item.id)}
                              className="text-red-600 hover:text-red-900 min-h-[32px] px-2 py-1 rounded font-medium"
                            >
                              Remove
                            </button>
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
                  <p className="text-sm mt-2">Add ingredients using the form above</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 min-h-[44px] font-medium"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => router.push(`/recipes/${recipeId}`)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 min-h-[44px] font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}