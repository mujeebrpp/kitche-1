export type UserRole = "ADMIN" | "MANAGER" | "CUSTOMER" | "CHEF"

export const ROLES = {
  ADMIN: "ADMIN" as const,
  MANAGER: "MANAGER" as const,
  CUSTOMER: "CUSTOMER" as const,
  CHEF: "CHEF" as const,
}

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  CUSTOMER: 1,
  CHEF: 2,
  MANAGER: 3,
  ADMIN: 4,
}

// Check if user has required role or higher
export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

// Check if user has any of the specified roles
export function hasAnyRole(userRole: UserRole | undefined, roles: UserRole[]): boolean {
  if (!userRole) return false
  return roles.includes(userRole)
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "Administrator"
    case "MANAGER":
      return "Manager"
    case "CHEF":
      return "Chef"
    case "CUSTOMER":
      return "Customer"
    default:
      return "Customer"
  }
}

// Get role permissions description
export function getRolePermissions(role: UserRole): string[] {
  switch (role) {
    case "ADMIN":
      return [
        "Full system access",
        "User management",
        "All inventory operations",
        "Recipe management",
        "Production management",
        "Order management",
        "Reports and analytics"
      ]
    case "MANAGER":
      return [
        "Inventory management",
        "Recipe management",
        "Production oversight",
        "Order management",
        "Reports viewing"
      ]
    case "CHEF":
      return [
        "Recipe creation and editing",
        "Production management",
        "Inventory viewing",
        "Order viewing"
      ]
    case "CUSTOMER":
      return [
        "View orders",
        "Basic dashboard access"
      ]
    default:
      return ["Basic access"]
  }
}
