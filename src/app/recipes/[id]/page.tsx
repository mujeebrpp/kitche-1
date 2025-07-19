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
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchRecipe()
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
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">🥬</span>
                <h2 className="text-lg font-medium text-primary-900">Ingredients</h2>
              </div>
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-primary-100">
                      {recipe.recipeItems.map((item) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-primary-600">
                  <div className="text-6xl mb-4">🥬</div>
                  <p className="text-lg font-medium text-primary-800">No ingredients added yet</p>
                  <p className="text-sm mt-2">Edit this recipe to add ingredients</p>
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