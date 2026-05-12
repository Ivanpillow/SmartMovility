import { MapPin as MapPinIcon } from 'lucide-react';
import { ParkingStatus, getStatusColor } from '@/types/parking';

interface MapPinProps {
  status: ParkingStatus;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function MapPin({ status, size = 'md', label }: MapPinProps) {
  const color = getStatusColor(status);
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`${sizes[size]} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
        style={{ backgroundColor: color }}
      >
        <MapPinIcon className={`${iconSizes[size]} text-white`} />
      </div>
      {label && (
        <div className="mt-1 bg-white px-2 py-0.5 rounded shadow-sm text-xs font-medium">
          {label}
        </div>
      )}
    </div>
  );
}
