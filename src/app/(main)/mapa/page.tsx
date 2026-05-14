"use client";

import { ArrowLeft, RefreshCw, Navigation2, Layers, LocateFixed } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { parkingLots } from '@/data/parkingData';
import { getStatusColor } from '@/types/parking';
import { LeafletMapView } from '@/components/maps/LeafletMapView';
import {
  applyDistanceFromLocation,
  DEFAULT_USER_LOCATION,
  estimateWalkingMinutes,
  loadUserLocation,
  rankParkings,
  saveUserLocation,
  type UserCoordinates,
} from '@/lib/parkingRouting';

export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('parking');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [recenterToken, setRecenterToken] = useState(0);
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [isPlacingUserPin, setIsPlacingUserPin] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const location = loadUserLocation();
    if (location) {
      setUserLocation(location);
    }
  }, []);

  const effectiveLocation = userLocation ?? DEFAULT_USER_LOCATION;
  const rankedParkings = useMemo(
    () => rankParkings(applyDistanceFromLocation(parkingLots, effectiveLocation)),
    [effectiveLocation]
  );
  const selectedParking = useMemo(
    () => rankedParkings.find((p) => p.id === selectedId),
    [rankedParkings, selectedId]
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleRecenter = () => {
    setRecenterToken((value) => value + 1);
  };

  const handleSelect = (parkingId: string) => {
    setIsNavigating(false);
    router.replace(`/mapa?parking=${parkingId}`);
  };

  const handleUserLocationSet = (location: UserCoordinates) => {
    saveUserLocation(location);
    setUserLocation(location);
    setIsPlacingUserPin(false);
  };

  const handleNavigate = () => {
    if (!selectedParking) return;
    if (isNavigating) {
      setIsNavigating(false);
      return;
    }

    if (!userLocation) {
      setIsPlacingUserPin(true);
      return;
    }

    setIsNavigating(true);
  };

  return (
    <div className="min-h-dvh bg-background page-enter">
      <div className="w-full mx-auto min-h-dvh flex flex-col relative">
        <div className="absolute inset-0 z-0">
          <LeafletMapView
            parkings={rankedParkings}
            selectedId={selectedId}
            recenterToken={recenterToken}
            userLocation={userLocation}
            isPlacingUserPin={isPlacingUserPin}
            routingTargetId={isNavigating ? selectedParking?.id : null}
            onSelect={handleSelect}
            onUserLocationSet={handleUserLocationSet}
          />
        </div>

        <div className="relative z-10 bg-white/95 dark:bg-card/95 backdrop-blur-sm border-b border-border px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-foreground hover:text-[#1153a6]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">SmartMovility</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Mostrar leyenda"
              >
                <Layers className="w-5 h-5" />
              </button>
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                aria-label="Actualizar mapa"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {showLegend && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 mx-6 mt-4"
          >
            <div className="bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border">
              <h3 className="font-semibold text-sm mb-3">Disponibilidad</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  <span className="text-xs">Alta</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-xs">Media</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <span className="text-xs">Saturado</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedParking && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 mt-auto mx-6 mb-[calc(98px+env(safe-area-inset-bottom))]"
          >
            <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-base mb-1">{selectedParking.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedParking.distance}m de distancia
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ~{estimateWalkingMinutes(selectedParking.distance)} min caminando
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: getStatusColor(selectedParking.status) }}
                  >
                    {selectedParking.availableSpaces}
                  </p>
                  <p className="text-xs text-muted-foreground">disponibles</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/detalle/${selectedParking.id}`)}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-foreground py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Ver detalles
                </button>
                <button
                  onClick={handleNavigate}
                  className="flex-1 bg-[#1153a6] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#0d4080] transition-colors"
                >
                  <Navigation2 className="w-4 h-4" />
                  {isNavigating
                    ? 'Ocultar ruta'
                    : isPlacingUserPin || !userLocation
                      ? 'Poner ubicación'
                      : 'Navegar'}
                </button>
              </div>

              {!userLocation && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Coloca tu pin para calcular ruta caminando y recomendaciones personalizadas.
                </p>
              )}
            </div>
          </motion.div>
        )}

        <button
          onClick={() => {
            setIsNavigating(false);
            setIsPlacingUserPin((value) => !value);
          }}
          title="Poner mi ubicación"
          className={`absolute right-6 z-10 border border-white/60 dark:border-border/80 p-3 rounded-full shadow-lg backdrop-blur-md transition-colors ${
            isPlacingUserPin
              ? 'bottom-[calc(174px+env(safe-area-inset-bottom))] bg-[#1153a6] text-white'
              : 'bottom-[calc(174px+env(safe-area-inset-bottom))] bg-white/40 dark:bg-card/45 text-foreground hover:bg-white/65 dark:hover:bg-card/70'
          }`}
          aria-label="Poner mi ubicación"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        <button
          onClick={handleRecenter}
          className="absolute bottom-[calc(98px+env(safe-area-inset-bottom))] right-6 z-10 bg-white dark:bg-card p-3 rounded-full shadow-lg border border-border hover:shadow-xl transition-shadow"
          aria-label="Recentrar mapa"
        >
          <div className="w-2 h-2 bg-[#1153a6] rounded-full" />
        </button>
      </div>
    </div>
  );
}
