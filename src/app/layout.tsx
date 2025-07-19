import type { Metadata } from "next"
import "./globals.css"
import AuthSessionProvider from "@/components/providers/session-provider"
import Navigation from "@/components/navigation"

export const metadata: Metadata = {
  title: "Shanis Kitchen Stock Management",
  description: "Manage your kitchen inventory and production",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthSessionProvider>
          <Navigation />
          <main>{children}</main>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
