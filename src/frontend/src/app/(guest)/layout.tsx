'use client'
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { CartProvider } from "@/features/user-cart/context/cart-context"
import { ThemeProvider } from "next-themes"

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        disableTransitionOnChange
      >
        <Header/>
        <main className="min-h-screen flex flex-col flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer/>
      </ThemeProvider>
    </main>
  )
}