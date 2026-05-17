import { ParkingLot } from '@/types/parking';

export const parkingLots: ParkingLot[] = [
  {
    id: '1',
    name: 'Estacionamiento Alumnos 1',
    totalSpaces: 200,
    occupiedSpaces: 150,
    availableSpaces: 50,
    distance: 120,
    occupancyPercentage: 75,
    status: 'saturated',
    coordinates: {
      lat: 20.654057150061462,
      lng: -103.324657386353
    },
    isRecommended: true
  },
  {
    id: '2',
    name: 'Estacionamiento Alumnos 2',
    totalSpaces: 120,
    occupiedSpaces: 43,
    availableSpaces: 77,
    distance: 260,
    occupancyPercentage: 36,
    status: 'available',
    coordinates: {
      lat: 20.65551077799433,
      lng: -103.32174454251603
    }
  },
  {
    id: '3',
    name: 'Estacionamiento Calle Ganges',
    totalSpaces: 17,
    occupiedSpaces: 6,
    availableSpaces: 11,
    distance: 310,
    occupancyPercentage: 35,
    status: 'available',
    coordinates: {
      lat: 20.654188738239547,
      lng: -103.32705291306306
    }
  },
  {
    id: '4',
    name: 'Estacionamiento Calle Rio Principal',
    totalSpaces: 22,
    occupiedSpaces: 12,
    availableSpaces: 10,
    distance: 355,
    occupancyPercentage: 55,
    status: 'medium',
    coordinates: {
      lat: 20.654471293994135,
      lng: -103.32744336508888
    }
  },
  {
    id: '5',
    name: 'Estacionamiento Calle Av. 5 de Febrero',
    totalSpaces: 32,
    occupiedSpaces: 29,
    availableSpaces: 3,
    distance: 390,
    occupancyPercentage: 91,
    status: 'saturated',
    coordinates: {
      lat: 20.653871871706002,
      lng: -103.32746484404214
    }
  }
];

export const getRecommendedParking = (): ParkingLot => parkingLots[0];
