"use client";

import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoadingPage() {
  return (
    <div className="min-h-dvh bg-background page-enter">
      <div className="w-full mx-auto min-h-dvh flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 dark:from-blue-950 dark:via-green-950 dark:to-yellow-950 opacity-30 blur-xl" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-[#1153a6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            <h1 className="text-3xl font-bold mb-2">SmartMovility</h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-base mb-8"
            >
              Actualizando disponibilidad…
            </motion.p>

            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#1153a6]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-auto mb-12 text-center"
          >
            <p className="text-sm text-muted-foreground">Buscando los mejores espacios disponibles</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
