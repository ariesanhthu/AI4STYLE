'use client'
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Header/>
      <main className="min-h-screen flex flex-col flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer/>
    </main>
  )
}