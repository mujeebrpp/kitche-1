"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ingredientSchema } from "@/lib/validations"
import { z } from "zod"
import { hasRole, ROLES } from "@/lib/roles"

// Type definitions
type Ingredient = z.infer<typeof ingredientSchema> & {
  id: string
  stock: Array<{
    quantity: number
  }>
  purchases: Array<{
    unitPrice: number
  }>
}

interface StockItem {
  id: string
  quantity: number
  ingredient: {
    id: string
    name: string
    unit: string
  }
}

interface Purchase {
  id: string
  ingredient: {
    id: string
    name: string
    unit: string
  }
  quantity: number
  unitPrice: number
  totalCost: number
  purchasedAt: string
}

type TabType = 'stock' | 'ingredients' | 'purchases'

export default function UnifiedStockPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('stock')
  
  // Data states
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [showIngredientForm, setShowIngredientForm] = useState(false)
  const [ingredientFormData, setIngredientFormData] = useState({
    name: "",
    unit: "",
  })
  
  // Edit ingredient states
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null)
  const [editIngredientData, setEditIngredientData] = useState({
    name: "",
    unit: "",
  })
  const [purchaseFormData, setPurchaseFormData] = useState({
    ingredientId: '',
    quantity: '',
    unitPrice: '',
    totalCost: '',
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchAllData()
  }, [session, status, router])

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchStock(),
        fetchIngredients(),
        fetchPurchases()
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStock = async () => {
    const response = await fetch("/api/stock")
    if (response.ok) {
      const data = await response.json()
      setStockItems(data)
    }
  }

  const fetchIngredients = async () => {
    const response = await fetch("/api/ingredients")
    if (response.ok) {
      const data = await response.json()
      setIngredients(data)
    }
  }

  const fetchPurchases = async () => {
    const response = await fetch("/api/purchases")
    if (response.ok) {
      const data = await response.json()
      setPurchases(data)
    }
  }

  // Ingredient form handlers
  const handleIngredientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingredientFormData),
      })

      if (response.ok) {
        setIngredientFormData({ name: "", unit: "" })
        setShowIngredientForm(false)
        fetchIngredients()
      }
    } catch (error) {
      console.error("Error creating ingredient:", error)
    }
  }

  // Edit ingredient handlers
  const startEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient.id)
    setEditIngredientData({
      name: ingredient.name,
      unit: ingredient.unit,
    })
  }

  const cancelEditIngredient = () => {
    setEditingIngredient(null)
    setEditIngredientData({ name: "", unit: "" })
  }

  const handleUpdateIngredient = async (ingredientId: string) => {
    try {
      const response = await fetch(`/api/ingredients/${ingredientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editIngredientData),
      })

      if (response.ok) {
        setEditingIngredient(null)
        setEditIngredientData({ name: "", unit: "" })
        fetchIngredients()
        fetchStock() // Refresh stock to show updated units
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update ingredient")
      }
    } catch (error) {
      console.error("Error updating ingredient:", error)
      alert("Failed to update ingredient")
    }
  }

  const handleDeleteIngredient = async (ingredientId: string, ingredientName: string) => {
    if (!confirm(`Are you sure you want to delete &quot;${ingredientName}&quot;? This will also delete all associated stock and purchase records.`)) {
      return
    }

    try {
      const response = await fetch(`/api/ingredients/${ingredientId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchIngredients()
        fetchStock()
        fetchPurchases()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete ingredient")
      }
    } catch (error) {
      console.error("Error deleting ingredient:", error)
      alert("Failed to delete ingredient")
    }
  }

  // Purchase form handlers
  const handlePurchaseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'quantity' || name === 'unitPrice') {
      const quantity = name === 'quantity' ? parseFloat(value) : parseFloat(purchaseFormData.quantity)
      const unitPrice = name === 'unitPrice' ? parseFloat(value) : parseFloat(purchaseFormData.unitPrice)
      
      if (!isNaN(quantity) && !isNaN(unitPrice)) {
        setPurchaseFormData(prev => ({
          ...prev,
          [name]: value,
          totalCost: (quantity * unitPrice).toString()
        }))
      } else {
        setPurchaseFormData(prev => ({
          ...prev,
          [name]: value,
        }))
      }
    } else {
      setPurchaseFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredientId: purchaseFormData.ingredientId,
          quantity: parseFloat(purchaseFormData.quantity),
          unitPrice: parseFloat(purchaseFormData.unitPrice),
          totalCost: parseFloat(purchaseFormData.totalCost),
        }),
      })

      if (response.ok) {
        setPurchaseFormData({
          ingredientId: '',
          quantity: '',
          unitPrice: '',
          totalCost: '',
        })
        fetchPurchases()
        fetchStock()
        fetchIngredients()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error creating purchase:", error)
      alert("Failed to create purchase")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const TabButton = ({ tab, label, icon }: { tab: TabType; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-1 px-3 py-2 font-medium text-sm rounded-md transition-colors min-h-[44px] ${
        activeTab === tab
          ? "bg-primary-100 text-primary-800 border-b-2 border-primary-500"
          : "text-primary-600 hover:text-primary-700 hover:bg-primary-50"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-primary-50">
      <header className="bg-white shadow border-b-2 border-primary-100">
        <div className="max-w-[600px] mx-auto px-4">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-primary-900">Stock Management</h1>
            <p className="mt-1 text-sm text-primary-700">Manage ingredients, stock levels, and purchases</p>
          </div>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-primary-200">
          <nav className="flex space-x-2 overflow-x-auto">
            <TabButton tab="stock" label="Current Stock" icon="📦" />
            <TabButton tab="ingredients" label="Ingredients" icon="🥬" />
            <TabButton tab="purchases" label="Purchases" icon="🛒" />
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {/* Stock Tab */}
          {activeTab === 'stock' && (
            <div>
              <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100">
                <div className="px-4 py-4 border-b border-primary-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">📦</span>
                    <div>
                      <h2 className="text-lg font-medium text-primary-900">Current Stock Levels</h2>
                      <p className="text-sm text-primary-600">
                        Real-time overview of all ingredient stock levels
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="divide-y divide-primary-100">
                  {stockItems.length === 0 ? (
                    <li className="px-4 py-8 text-center text-primary-600">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-lg font-medium text-primary-800">No stock items found</p>
                      <p className="text-sm mt-2">Add ingredients and make purchases to see stock levels</p>
                    </li>
                  ) : (
                    stockItems.map((item) => (
                      <li key={item.id}>
                        <div className="px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-primary-900">
                                {item.ingredient.name}
                              </h3>
                              <p className="text-sm text-primary-600">
                                Unit: {item.ingredient.unit}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-lg font-medium ${
                                  item.quantity < 10 ? "text-red-600" : "text-primary-600"
                                }`}
                              >
                                {item.quantity} {item.ingredient.unit}
                              </p>
                              <p className="text-sm text-primary-600">
                                {item.quantity < 10 ? "Low stock" : "In stock"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Ingredients Tab */}
          {activeTab === 'ingredients' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
                <div>
                  <h2 className="text-lg font-medium text-primary-900">Ingredients Management</h2>
                  <p className="mt-1 text-sm text-primary-600">
                    Add and manage all available ingredients
                  </p>
                </div>
                <button
                  onClick={() => setShowIngredientForm(!showIngredientForm)}
                  className="group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                >
                  Add Ingredient
                </button>
              </div>

              {showIngredientForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6 border border-primary-100">
                  <h3 className="text-lg font-medium mb-4 text-primary-900">Add New Ingredient</h3>
                  <form onSubmit={handleIngredientSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-700">
                          Name
                        </label>
                        <input
                          type="text"
                          value={ingredientFormData.name}
                          onChange={(e) =>
                            setIngredientFormData({ ...ingredientFormData, name: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-700">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={ingredientFormData.unit}
                          onChange={(e) =>
                            setIngredientFormData({ ...ingredientFormData, unit: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                          required
                          placeholder="e.g., kg, g, litre, piece"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        type="submit"
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 min-h-[44px] font-medium"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowIngredientForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 min-h-[44px] font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white shadow overflow-hidden rounded-lg border border-primary-100">
                {ingredients.length === 0 ? (
                  <div className="px-4 py-8 text-center text-primary-600">
                    <div className="text-6xl mb-4">🥬</div>
                    <p className="text-lg font-medium text-primary-800">No ingredients found</p>
                    <p className="text-sm mt-2">Add your first ingredient to get started</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-primary-100">
                    {ingredients.map((ingredient) => (
                      <li key={ingredient.id}>
                        <div className="px-4 py-3">
                          {editingIngredient === ingredient.id ? (
                            // Edit mode
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-primary-700">
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editIngredientData.name}
                                    onChange={(e) =>
                                      setEditIngredientData({ ...editIngredientData, name: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                                    autoFocus
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-primary-700">
                                    Unit
                                  </label>
                                  <input
                                    type="text"
                                    value={editIngredientData.unit}
                                    onChange={(e) =>
                                      setEditIngredientData({ ...editIngredientData, unit: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                                    placeholder="e.g., kg, g, litre, piece"
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <button
                                  onClick={() => handleUpdateIngredient(ingredient.id)}
                                  disabled={!editIngredientData.name.trim() || !editIngredientData.unit.trim()}
                                  className="group relative flex justify-center py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[36px] shadow-sm disabled:opacity-50"
                                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                                >
                                  Save Changes
                                </button>
                                <button
                                  onClick={cancelEditIngredient}
                                  className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-400 min-h-[36px] font-medium text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">🥬</span>
                                  <div>
                                    <h3 className="text-lg font-medium text-primary-900 truncate">
                                      {ingredient.name}
                                    </h3>
                                    <p className="text-sm text-primary-600">
                                      Unit: {ingredient.unit}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:items-end space-y-2">
                                <div className="flex flex-col sm:text-right space-y-1">
                                  <p className="text-sm font-medium text-primary-900">
                                    Stock: {ingredient.stock[0]?.quantity || 0} {ingredient.unit}
                                  </p>
                                  <p className="text-sm text-primary-600">
                                    Last price: ₹{ingredient.purchases[0]?.unitPrice || "N/A"}
                                  </p>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                  <Link
                                    href={`/stock/${ingredient.id}/purchase-history`}
                                    className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 min-h-[32px]"
                                  >
                                    Purchase History
                                  </Link>
                                  <button
                                    onClick={() => startEditIngredient(ingredient)}
                                    className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 min-h-[32px]"
                                  >
                                    Edit
                                  </button>
                                  {hasRole(session?.user?.role, ROLES.ADMIN) && (
                                    <button
                                      onClick={() => handleDeleteIngredient(ingredient.id, ingredient.name)}
                                      className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 min-h-[32px]"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === 'purchases' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🛒</span>
                  <div>
                    <h2 className="text-lg font-medium text-primary-900">Purchase Management</h2>
                    <p className="text-sm text-primary-600">
                      Record new purchases and view purchase history
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Purchase Form */}
                <div className="bg-white rounded-lg shadow border border-primary-100 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl">🛒</span>
                    <h3 className="text-lg font-semibold text-primary-900">Add New Purchase</h3>
                  </div>
                  <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="ingredientId" className="block text-sm font-medium text-primary-700">
                        Ingredient
                      </label>
                      <select
                        id="ingredientId"
                        name="ingredientId"
                        value={purchaseFormData.ingredientId}
                        onChange={handlePurchaseInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                      >
                        <option value="">Select an ingredient</option>
                        {ingredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name} ({ingredient.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-primary-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          value={purchaseFormData.quantity}
                          onChange={handlePurchaseInputChange}
                          required
                          min="0.01"
                          step="0.01"
                          className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                        />
                      </div>

                      <div>
                        <label htmlFor="unitPrice" className="block text-sm font-medium text-primary-700">
                          Unit Price (₹)
                        </label>
                        <input
                          type="number"
                          id="unitPrice"
                          name="unitPrice"
                          value={purchaseFormData.unitPrice}
                          onChange={handlePurchaseInputChange}
                          required
                          min="0.01"
                          step="0.01"
                          className="mt-1 block w-full rounded-md border-primary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="totalCost" className="block text-sm font-medium text-primary-700">
                        Total Cost (₹)
                      </label>
                      <input
                        type="number"
                        id="totalCost"
                        name="totalCost"
                        value={purchaseFormData.totalCost}
                        readOnly
                        className="mt-1 block w-full rounded-md border-primary-300 bg-primary-50 shadow-sm min-h-[44px]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 min-h-[44px] shadow-sm"
                      style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                    >
                      Add Purchase & Update Stock
                    </button>
                  </form>
                </div>

                {/* Recent Purchases */}
                <div className="bg-white rounded-lg shadow border border-primary-100 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl">📋</span>
                    <h3 className="text-lg font-semibold text-primary-900">Recent Purchases</h3>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {purchases.length === 0 ? (
                      <div className="text-center py-8 text-primary-600">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-lg font-medium text-primary-800">No purchases yet</p>
                        <p className="text-sm mt-2">Add your first purchase to track inventory</p>
                      </div>
                    ) : (
                      purchases.slice(0, 10).map((purchase) => (
                        <div key={purchase.id} className="border-b border-primary-100 pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-primary-900">{purchase.ingredient.name}</h4>
                              <p className="text-sm text-primary-600">
                                {purchase.quantity} {purchase.ingredient.unit} × ₹{purchase.unitPrice}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary-900">₹{purchase.totalCost}</p>
                              <p className="text-xs text-primary-600">
                                {new Date(purchase.purchasedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Purchase History Table */}
              <div className="mt-6 bg-white rounded-lg shadow border border-primary-100 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">📊</span>
                  <h3 className="text-lg font-semibold text-primary-900">Complete Purchase History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-primary-200">
                    <thead className="bg-primary-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                          Ingredient
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
                            {new Date(purchase.purchasedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary-900">
                            {purchase.ingredient.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                            {purchase.quantity} {purchase.ingredient.unit}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-primary-900">
                            ₹{purchase.unitPrice}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary-900">
                            ₹{purchase.totalCost}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}