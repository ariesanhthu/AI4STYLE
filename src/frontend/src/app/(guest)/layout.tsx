'use client'
import { Chatbot } from "@/features/chatbot/components/chatbot"

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
        {children}
        <Chatbot />
    </main>
  )
}