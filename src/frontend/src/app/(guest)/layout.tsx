'use client'
import { Chatbot } from "@/features/chatbot/components/chatbot"
import { ChatbotProvider, useChatbot } from "@/features/chatbot/contexts/chatbot.context"
// import { Header } from "@/features/home/components/header"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { cn } from "@/lib/utils"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isOpen, openChatbot, closeChatbot } = useChatbot()

  const handleToggle = (open: boolean) => {
    if (open) {
      openChatbot();
    } else {
      closeChatbot();
    }
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden relative">
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 w-full",
          isOpen && "md:pr-[500px]"
        )}
      >
        <Header />
      </div>

      <main
        className={cn(
          "min-h-screen flex flex-col transition-all duration-300 flex-1 w-full max-w-full pt-16",
          isOpen && "md:pr-[500px]"
        )}
      >
        <div className="flex-1 w-full overflow-x-hidden">
          {children}
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </main>
      <Chatbot isOpen={isOpen} onToggle={handleToggle} />
    </div>
  )
}

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatbotProvider>
      <LayoutContent>{children}</LayoutContent>
    </ChatbotProvider>
  )
}