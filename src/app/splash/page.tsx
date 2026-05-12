"use client";

import { MapPin, Navigation, ParkingCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export default function SplashPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#1153a6] via-blue-600 to-blue-700 page-enter">
      <div className="w-full mx-auto min-h-dvh flex flex-col relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 rounded-full bg-white/10"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 right-8 w-16 h-16 rounded-full bg-white/10"
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-32 left-8 w-24 h-24 rounded-full bg-white/10"
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-white">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mb-12"
          >
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <ParkingCircle className="w-14 h-14 text-[#1153a6]" />
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-center mb-3"
            >
              SmartMovility
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-100 text-center text-lg"
            >
              Encuentra tu estacionamiento ideal
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 mb-12 w-full"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Tiempo real</h3>
                <p className="text-sm text-blue-100">Disponibilidad actualizada al instante</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Navegación inteligente</h3>
                <p className="text-sm text-blue-100">Rutas optimizadas a tu destino</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ParkingCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Recomendaciones</h3>
                <p className="text-sm text-blue-100">Las mejores opciones para ti</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 px-8 pb-[calc(3rem+env(safe-area-inset-bottom))]"
        >
          <button
            onClick={() => router.push('/')}
            className="w-full bg-white text-[#1153a6] py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-xl"
          >
            Comenzar
          </button>
          <p className="text-center text-blue-100 text-sm mt-4">CUCEI - Universidad de Guadalajara</p>
        </motion.div>
      </div>
    </div>
  );
}
