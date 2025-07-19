"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { recipeSchema } from "@/lib/validations"
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

export default function RecipesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchRecipes()
  }, [session, status, router])

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes")
      if (response.ok) {
        const data = await response.json()
        setRecipes(data)
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ name: "", description: "" })
        setShowForm(false)
        fetchRecipes()
      }
    } catch (error) {
      console.error("Error creating recipe:", error)
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
              <h1 className="text-2xl font-bold text-primary-900">Recipes</h1>
              <p className="text-sm text-primary-700">Create and manage your recipes</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] font-medium shadow-sm"
              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
            >
              Add Recipe
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6 border border-primary-100">
            <h2 className="text-lg font-medium mb-4 text-primary-900">Add New Recipe</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] font-medium shadow-sm"
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                >
                  Save
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
          {recipes.length === 0 ? (
            <div className="px-4 py-8 text-center text-primary-600">
              <p className="text-lg">No recipes found</p>
              <p className="text-sm mt-2">Create your first recipe to get started</p>
            </div>
          ) : (
            <ul className="divide-y divide-primary-100">
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <div className="px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-primary-900 truncate">
                          {recipe.name}
                        </h3>
                        <p className="text-sm text-primary-600 mt-1">
                          {recipe.description}
                        </p>
                        <p className="text-sm text-primary-500 mt-1">
                          Ingredients: {recipe.recipeItems.length}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:ml-4">
                        <button
                          onClick={() => router.push(`/recipes/${recipe.id}`)}
                          className="bg-primary-100 text-primary-700 px-3 py-2 rounded-md hover:bg-primary-200 text-sm font-medium min-h-[44px] transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
                          className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-medium min-h-[44px] transition-colors shadow-sm"
                          style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                        >
                          Edit
                        </button>
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