import { z } from "zod"

// Ingredient schemas
export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
})

export const purchaseSchema = z.object({
  ingredientId: z.string().cuid(),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().positive("Unit price must be positive"),
  totalCost: z.number().positive("Total cost must be positive"),
})

export const stockSchema = z.object({
  ingredientId: z.string().cuid(),
  quantity: z.number().nonnegative("Quantity cannot be negative"),
})

// Recipe schemas
export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
})

export const recipeItemSchema = z.object({
  recipeId: z.string().cuid(),
  ingredientId: z.string().cuid(),
  quantity: z.number().positive("Quantity must be positive"),
})

// Production schemas
export const productionSchema = z.object({
  recipeId: z.string().cuid(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  labourCost: z.number().nonnegative().default(0),
  overheadCost: z.number().nonnegative().default(0),
  packagingCost: z.number().nonnegative().default(0),
})

// Order schemas
export const orderItemSchema = z.object({
  recipeId: z.string().cuid(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  unitPrice: z.number().positive("Unit price must be positive"),
})

export const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  status: z.string().min(1, "Status is required"),
  items: z.array(orderItemSchema),
})

// Distribution schemas
export const distributionSchema = z.object({
  orderId: z.string().cuid(),
  deliveredTo: z.string().min(1, "Delivery location is required"),
})

// Report schemas
export const reportSchema = z.object({
  type: z.string().min(1, "Report type is required"),
  data: z.any(),
})