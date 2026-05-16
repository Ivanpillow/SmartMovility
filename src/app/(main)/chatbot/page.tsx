"use client";

import { ArrowLeft, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatPanel } from '@/components/chatbot/ChatPanel';

export default function ChatbotPage() {
  const router = useRouter();

  return (
    <div className="smartmovility-chat-page h-dvh bg-background page-enter flex flex-col overflow-hidden">
      <header className="shrink-0 bg-[#1153a6] text-white px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-4">
        <button
          onClick={() => router.push('/')}
          className="mb-3 flex items-center gap-2 text-white hover:text-blue-100"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Chatbot</h1>
            <p className="text-blue-100 text-sm">Asistente rapido para encontrar estacionamiento</p>
          </div>
        </div>
      </header>

      <main className="relative flex-1 min-h-0 overflow-hidden border-t border-[#1153a6]/15 bg-background">
        <ChatPanel />
      </main>
    </div>
  );
}
