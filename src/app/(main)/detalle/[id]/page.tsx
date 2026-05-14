"use client";

import { ArrowLeft, MapPin, Users, CheckCircle2, Navigation } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { parkingLots } from '@/data/parkingData';
import { StatusBadge } from '@/components/parking/StatusBadge';
import { getStatusColor } from '@/types/parking';
import {
  applyDistanceFromLocation,
  DEFAULT_USER_LOCATION,
  estimateWalkingMinutes,
  loadUserLocation,
  rankParkings,
  type UserCoordinates,
} from '@/lib/parkingRouting';

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);

  useEffect(() => {
    const location = loadUserLocation();
    if (location) setUserLocation(location);
  }, []);

  const parkings = useMemo(() => {
    const location = userLocation ?? DEFAULT_USER_LOCATION;
    return rankParkings(applyDistanceFromLocation(parkingLots, location));
  }, [userLocation]);

  const parking = parkings.find((item) => item.id === id);

  if (!parking) {
    return (
      <div className="min-h-dvh bg-background page-enter flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Estacionamiento no encontrado</p>
          <button onClick={() => router.push('/')} className="text-[#1153a6] font-medium">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background page-enter">
      <div className="w-full mx-auto min-h-dvh flex flex-col">
        <div className="bg-[#1153a6] text-white px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-white hover:text-blue-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-2xl font-bold">{parking.name}</h1>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Estado actual</h2>
              <StatusBadge status={parking.status} />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Ocupación</span>
                <span className="text-2xl font-bold" style={{ color: getStatusColor(parking.status) }}>
                  {parking.occupancyPercentage}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${parking.occupancyPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: getStatusColor(parking.status) }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-[#1153a6]" />
                </div>
                <p className="text-2xl font-bold">{parking.totalSpaces}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
                <p className="text-2xl font-bold">{parking.occupiedSpaces}</p>
                <p className="text-xs text-muted-foreground">Ocupados</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <p className="text-2xl font-bold">{parking.availableSpaces}</p>
                <p className="text-xs text-muted-foreground">Disponibles</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6"
          >
            <h2 className="font-semibold text-lg mb-4">Ubicación</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#1153a6]" />
              </div>
              <div>
                <p className="font-medium">{parking.distance}m de distancia</p>
                <p className="text-sm text-muted-foreground">
                  Aproximadamente {estimateWalkingMinutes(parking.distance)} min caminando
                </p>
              </div>
            </div>
          </motion.div>

          {parking.status === 'available' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-6 shadow-sm border border-green-200 dark:border-green-800 mb-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Recomendado</h3>
                  <p className="text-sm text-muted-foreground">
                    Alta disponibilidad. Este estacionamiento es una excelente opción para ti en este momento.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/mapa')}
              className="flex-1 bg-white dark:bg-card border border-border py-4 px-6 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Ver en mapa
            </button>

            <button
              onClick={() => router.push(`/mapa?parking=${parking.id}`)}
              className="flex-1 bg-[#1153a6] text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#0d4080] transition-colors"
            >
              <Navigation className="w-5 h-5" />
              Navegar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
