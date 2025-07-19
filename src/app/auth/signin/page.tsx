"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function SignIn() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid username or password")
      } else {
        router.push("/")
      }
    } catch (error) {
      setError("An error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold tracking-tight text-primary-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-primary-700">
            Kitchen Stock Management System
          </p>
        </div>
        
        <div className="bg-white py-6 px-6 shadow-lg rounded-lg border border-primary-100">
          <form className="space-y-6" onSubmit={handleCredentialsSignIn}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-primary-300 placeholder-primary-400 text-primary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm min-h-[44px]"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-primary-300 placeholder-primary-400 text-primary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm min-h-[44px]"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 min-h-[44px] shadow-sm"
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              >
                {loading ? "Signing in..." : "Sign in with Username"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-primary-600">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => signIn("google")}
                className="w-full flex justify-center py-3 px-4 border border-primary-300 rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 min-h-[44px]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}