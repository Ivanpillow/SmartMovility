"use client";

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ParkingCard } from '@/components/parking/ParkingCard';
import { parkingLots } from '@/data/parkingData';
import {
  applyDistanceFromLocation,
  DEFAULT_USER_LOCATION,
  loadUserLocation,
  rankParkings,
  type UserCoordinates,
} from '@/lib/parkingRouting';

export default function OptionsPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);

  useEffect(() => {
    const location = loadUserLocation();
    if (location) setUserLocation(location);
  }, []);

  const sortedParkings = useMemo(() => {
    const location = userLocation ?? DEFAULT_USER_LOCATION;
    return rankParkings(applyDistanceFromLocation(parkingLots, location));
  }, [userLocation]);

  const mainParkings = sortedParkings.slice(0, 3);

  return (
    <div className="min-h-dvh bg-background page-enter">
      <div className="w-full mx-auto min-h-dvh flex flex-col">
        <div className="bg-[#1153a6] text-white px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-6">
          <button
            onClick={() => router.push('/')}
            className="mb-4 flex items-center gap-2 text-white hover:text-blue-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-2xl font-bold">Opciones de estacionamiento</h1>
          <p className="text-blue-100 text-sm mt-1">Selecciona el que mejor te convenga</p>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="space-y-4">
            {mainParkings.map((parking, index) => (
              <motion.div
                key={parking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ParkingCard parking={parking} isRecommended={parking.isRecommended} />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border"
            >
              <h3 className="font-semibold text-base mb-2">Estacionamiento en Calle</h3>
              <p className="text-sm text-muted-foreground mb-3">
                 Ordenado por distancia caminando y porcentaje de disponibilidad
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Alta disponibilidad</span>
                </div>
                 <span className="text-sm text-muted-foreground">~{mainParkings[2]?.distance ?? 0}m</span>
              </div>

              <button
                onClick={() => router.push('/mapa?parking=3')}
                className="w-full bg-[#1153a6] text-white py-3 rounded-xl font-medium hover:bg-[#0d4080] transition-colors"
              >
                Llévame ahí
              </button>
            </motion.div>
          </div>

          <button
            onClick={() => router.push('/recomendaciones')}
            className="w-full mt-6 bg-white dark:bg-card border border-border py-4 px-6 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Ver todas las opciones
          </button>
        </div>
      </div>
    </div>
  );
}
