"use client";

import { ArrowLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { parkingLots } from '@/data/parkingData';
import { getStatusColor } from '@/types/parking';
import {
  applyDistanceFromLocation,
  DEFAULT_USER_LOCATION,
  loadUserLocation,
  rankParkings,
  type UserCoordinates,
} from '@/lib/parkingRouting';

export default function RecommendationsPage() {
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

  const bestParking = sortedParkings[0];
  const alternatives = sortedParkings.slice(1);

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
          <h1 className="text-2xl font-bold">Mejores opciones disponibles</h1>
          <p className="text-blue-100 text-sm mt-1">Ordenadas por distancia y disponibilidad</p>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-2xl p-5 mb-6 border-2 border-[#1153a6] shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#1153a6] p-2 rounded-full">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <h2 className="font-semibold text-lg">El mejor estacionamiento para ti es:</h2>
            </div>

            <div
              onClick={() => router.push(`/detalle/${bestParking.id}`)}
              className="bg-white dark:bg-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{bestParking.name}</h3>
                  <p className="text-sm text-muted-foreground">{bestParking.distance}m de distancia</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: getStatusColor(bestParking.status) }}>
                    {bestParking.availableSpaces}
                  </p>
                  <p className="text-xs text-muted-foreground">disponibles</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${bestParking.occupancyPercentage}%`,
                      backgroundColor: getStatusColor(bestParking.status),
                    }}
                  />
                </div>
                <span className="text-sm font-semibold" style={{ color: getStatusColor(bestParking.status) }}>
                  {bestParking.occupancyPercentage}%
                </span>
              </div>

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(`/mapa?parking=${bestParking.id}`);
                }}
                className="w-full bg-[#1153a6] text-white py-3 rounded-xl font-medium hover:bg-[#0d4080] transition-colors"
              >
                Llévame ahí
              </button>
            </div>
          </motion.div>

          <div>
            <h3 className="font-semibold text-base mb-4">Alternativas cercanas</h3>
            <div className="space-y-3">
              {alternatives.map((parking, index) => (
                <motion.div
                  key={parking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/detalle/${parking.id}`)}
                  className="bg-card rounded-xl p-4 border border-border cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{parking.name}</h4>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getStatusColor(parking.status) }}
                      />
                      <span className="text-sm font-medium" style={{ color: getStatusColor(parking.status) }}>
                        {parking.availableSpaces}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{parking.distance}m</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${parking.occupancyPercentage}%`,
                            backgroundColor: getStatusColor(parking.status),
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{parking.occupancyPercentage}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push('/mapa')}
            className="w-full mt-6 bg-white dark:bg-card border border-border py-4 px-6 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Ver todo en el mapa
          </button>
        </div>
      </div>
    </div>
  );
}
