"use client";

import { Sparkles, ChevronRight, HelpCircle, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ParkingCard } from '@/components/parking/ParkingCard';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { getRecommendedParking } from '@/data/parkingData';

export default function HomePage() {
  const router = useRouter();
  const recommendedParking = getRecommendedParking();

  return (
    <div className="min-h-dvh bg-background page-enter">
      <div className="w-full mx-auto min-h-dvh flex flex-col">
        <div className="bg-[#1153a6] text-white px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold mb-1">SmartMovility</h1>
              <p className="text-blue-100 text-sm">Encuentra tu estacionamiento ideal</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/ayuda')}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                aria-label="Abrir ayuda"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-2xl p-4 mb-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-[#1153a6] p-2 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-semibold text-lg">Mejor opción disponible para ti</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Seleccionado por cercanía y menor ocupación
            </p>

            <ParkingCard parking={recommendedParking} isRecommended={true} />
          </motion.div>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => router.push('/mapa')}
              className="w-full bg-white dark:bg-card border border-border py-4 px-6 rounded-xl font-medium flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              <span>Ver mapa completo</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => router.push('/opciones')}
              className="w-full bg-white dark:bg-card border border-border py-4 px-6 rounded-xl font-medium flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              <span>Elegir otra opción</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => router.push('/chatbot')}
              className="w-full bg-white dark:bg-card border border-border py-4 px-6 rounded-xl font-medium flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              <span>Hablar con el chatbot</span>
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-card p-3 rounded-xl border border-border text-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Disponible</p>
              <p className="font-semibold">3</p>
            </div>

            <div className="bg-white dark:bg-card p-3 rounded-xl border border-border text-center">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-950 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Medio</p>
              <p className="font-semibold">2</p>
            </div>

            <div className="bg-white dark:bg-card p-3 rounded-xl border border-border text-center">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">Saturado</p>
              <p className="font-semibold">1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
