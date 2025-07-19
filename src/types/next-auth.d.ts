import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

type UserRole = "ADMIN" | "MANAGER" | "CUSTOMER" | "CHEF"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username?: string | null
      role?: UserRole
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username?: string | null
    password?: string | null
    role?: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    username?: string | null
    role?: UserRole
  }
}
