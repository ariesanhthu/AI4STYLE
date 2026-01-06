'use client'
import { Chatbot } from "@/features/chatbot/components/chatbot"
// import { Header } from "@/features/home/components/header"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  return (
    <div className="min-h-screen flex overflow-x-hidden relative">
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 w-full",
          isChatbotOpen && "md:pr-[500px]"
        )}
      >
        <Header />
      </div>

      <main
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300 flex-1 w-full max-w-full pt-16",
          isChatbotOpen && "md:pr-[500px]"
        )}
      >
        <div className="flex-1 w-full overflow-x-hidden">
          {children}
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </main>
      <Chatbot isOpen={isChatbotOpen} onToggle={setIsChatbotOpen} />
    </div>
  )
}