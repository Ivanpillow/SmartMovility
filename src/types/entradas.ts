export interface EntranceQCEI {
  id: string;
  name: string;
  status: EntranceStatus;
  distance?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}
  
  export type EntranceStatus = 'available';
  
  export const getStatusColor = (status: EntranceStatus): string => {
    if (status === 'available') {
      return '#1059b9'; 
    }
      return '#1059b9';
  };
  
  export const getStatusText = (status: EntranceStatus): string => {
    if (status === 'available') {
      return 'Disponible';
    }
      return 'Disponible';
  };


  