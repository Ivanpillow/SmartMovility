"use client";

import { MapPin, Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ParkingLot, getStatusColor } from '@/types/parking';
import { StatusBadge } from './StatusBadge';

interface ParkingCardProps {
  parking: ParkingLot;
  showNavigateButton?: boolean;
  isRecommended?: boolean;
}

export function ParkingCard({ parking, showNavigateButton = true, isRecommended = false }: ParkingCardProps) {
  const router = useRouter();
  
  const handleNavigate = () => {
    router.push(`/mapa?parking=${parking.id}`);
  };
  
  const handleViewDetails = () => {
    router.push(`/detalle/${parking.id}`);
  };
  
  return (
    <div 
      className={`bg-card rounded-2xl p-4 shadow-sm border ${
        isRecommended ? 'border-[#1153a6] shadow-md' : 'border-border'
      }`}
      onClick={handleViewDetails}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">{parking.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            <span>{parking.distance}m de distancia</span>
          </div>
        </div>
        <StatusBadge status={parking.status} size="sm" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${parking.occupancyPercentage}%`,
                  backgroundColor: getStatusColor(parking.status)
                }}
              />
            </div>
            <span className="text-sm font-semibold" style={{ color: getStatusColor(parking.status) }}>
              {parking.occupancyPercentage}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {parking.availableSpaces} de {parking.totalSpaces} espacios disponibles
          </p>
        </div>
      </div>
      
      {showNavigateButton && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="w-full bg-[#1153a6] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#0d4080] transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Llévame ahí
        </button>
      )}
    </div>
  );
}
