import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export { authOptions } from "@/lib/auth"
export { default } from "next-auth"

export const getSession = () => getServerSession(authOptions)