export interface ParkingLot {
  id: string;
  name: string;
  totalSpaces: number;
  occupiedSpaces: number;
  availableSpaces: number;
  distance: number;
  occupancyPercentage: number;
  status: 'available' | 'medium' | 'saturated';
  coordinates: {
    lat: number;
    lng: number;
  };
  isRecommended?: boolean;
}

export type ParkingStatus = 'available' | 'medium' | 'saturated';

export const getStatusColor = (status: ParkingStatus): string => {
  switch (status) {
    case 'available':
      return '#10b981'; 
    case 'medium':
      return '#f59e0b'; 
    case 'saturated':
      return '#ef4444'; 
  }
};

export const getStatusText = (status: ParkingStatus): string => {
  switch (status) {
    case 'available':
      return 'Alta disponibilidad';
    case 'medium':
      return 'Ocupación media';
    case 'saturated':
      return 'Saturado';
  }
};
