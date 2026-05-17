"use client";

import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import type { EntranceQCEI } from '@/types/entradas';
import { getStatusColor as getEntranceStatusColor, getStatusText } from '@/types/entradas';
import type { ParkingLot } from '@/types/parking';
import type { UserCoordinates } from '@/lib/parkingRouting';
import { fetchWalkingRoute } from '@/lib/streetRouting';

export type MapRoutingTarget =
  | { kind: 'parking'; id: string }
  | { kind: 'entrance'; id: string };

type LeafletMapViewProps = {
  parkings: ParkingLot[];
  entrances?: EntranceQCEI[];
  selectedParkingId?: string | null;
  selectedEntranceId?: string | null;
  recenterToken?: number;
  userLocation?: UserCoordinates | null;
  isPlacingUserPin?: boolean;
  routingTarget?: MapRoutingTarget | null;
  locationConfirmed?: boolean;
  onSelectParking?: (parkingId: string) => void;
  onSelectEntrance?: (entranceId: string) => void;
  onUserLocationSet?: (location: UserCoordinates) => void;
};

const CUCEI_CENTER: [number, number] = [20.655101702046743, -103.32549526761856];

const statusColors: Record<ParkingLot['status'], string> = {
  available: '#22c55e',
  medium: '#f59e0b',
  saturated: '#ef4444',
};

function createParkingMarkerIcon(status: ParkingLot['status'], selected: boolean) {
  const color = statusColors[status];
  const size = selected ? 44 : 36;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:9999px;
        background:${color};
        border:3px solid rgba(255,255,255,0.95);
        box-shadow:0 10px 24px rgba(15,23,42,0.25), 0 0 0 5px ${color}22;
        display:flex;
        align-items:center;
        justify-content:center;
        transform: translateY(-2px);
      ">
        <div style="
          width:${selected ? 12 : 9}px;
          height:${selected ? 12 : 9}px;
          border-radius:9999px;
          background:white;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function createEntranceMarkerIcon(status: EntranceQCEI['status'], selected: boolean) {
  const color = getEntranceStatusColor(status);
  const width = selected ? 40 : 34;
  const height = selected ? 48 : 42;

  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-4px);">
        <div style="
          width:${width}px;
          height:${width}px;
          border-radius:10px;
          background:${color};
          border:3px solid rgba(255,255,255,0.95);
          box-shadow:0 10px 24px rgba(16,89,185,0.35), 0 0 0 5px ${color}33;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-weight:700;
          font-size:${selected ? 15 : 13}px;
          font-family:Inter,sans-serif;
        ">E</div>
        <div style="
          width:0;
          height:0;
          border-left:7px solid transparent;
          border-right:7px solid transparent;
          border-top:9px solid ${color};
          margin-top:-2px;
        "></div>
      </div>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height],
  });
}

function createUserLocationIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:28px;
        height:28px;
        border-radius:9999px;
        background:#1153a6;
        border:3px solid rgba(255,255,255,0.95);
        box-shadow:0 10px 24px rgba(17,83,166,0.35), 0 0 0 8px rgba(17,83,166,0.15);
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function parkingPopupHtml(parking: ParkingLot, locationConfirmed: boolean): string {
  return `
    <div style="font-family: Inter, sans-serif; min-width: 180px;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${parking.name}</div>
      <div style="font-size: 12px; color: ${statusColors[parking.status]}; margin-bottom: 4px;">
        ${parking.status === 'available' ? 'Alta disponibilidad' : parking.status === 'medium' ? 'Disponibilidad media' : 'Saturado'}
      </div>
      <div style="font-size: 12px; margin-bottom: 4px;">${
        locationConfirmed ? `${parking.distance}m de distancia` : 'Marca tu ubicación para ver distancia'
      }</div>
      <div style="font-size: 12px; margin-bottom: 8px;">${parking.availableSpaces} espacios disponibles</div>
    </div>
  `;
}

function entrancePopupHtml(entrance: EntranceQCEI, locationConfirmed: boolean): string {
  const color = getEntranceStatusColor(entrance.status);
  const distanceLabel = locationConfirmed
    ? `${entrance.distance ?? 0}m de distancia`
    : 'Marca tu ubicación para ver distancia';

  return `
    <div style="font-family: Inter, sans-serif; min-width: 180px;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${entrance.name}</div>
      <div style="font-size: 12px; color: ${color}; margin-bottom: 4px;">${getStatusText(entrance.status)}</div>
      <div style="font-size: 12px; margin-bottom: 8px;">${distanceLabel}</div>
    </div>
  `;
}

function resolveRoutingDestination(
  routingTarget: MapRoutingTarget | null | undefined,
  parkings: ParkingLot[],
  entrances: EntranceQCEI[]
): UserCoordinates | null {
  if (!routingTarget) return null;

  if (routingTarget.kind === 'parking') {
    const parking = parkings.find((item) => item.id === routingTarget.id);
    return parking?.coordinates ?? null;
  }

  const entrance = entrances.find((item) => item.id === routingTarget.id);
  return entrance?.coordinates ?? null;
}

export function LeafletMapView({
  parkings,
  entrances = [],
  selectedParkingId,
  selectedEntranceId,
  recenterToken = 0,
  userLocation = null,
  isPlacingUserPin = false,
  routingTarget = null,
  locationConfirmed = false,
  onSelectParking,
  onSelectEntrance,
  onUserLocationSet,
}: LeafletMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const parkingMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const entranceMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  const selectedParking = useMemo(
    () => parkings.find((parking) => parking.id === selectedParkingId),
    [parkings, selectedParkingId]
  );

  const selectedEntrance = useMemo(
    () => entrances.find((entrance) => entrance.id === selectedEntranceId),
    [entrances, selectedEntranceId]
  );

  const flyTarget = selectedParking ?? selectedEntrance;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: CUCEI_CENTER,
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 15,
      detectRetina: true,
      tileSize: 256,
      updateWhenIdle: true,
    }).addTo(map);

    mapRef.current = map;

    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 50);

    return () => {
      window.clearTimeout(timer);
      parkingMarkersRef.current.forEach((marker) => marker.remove());
      parkingMarkersRef.current.clear();
      entranceMarkersRef.current.forEach((marker) => marker.remove());
      entranceMarkersRef.current.clear();
      routeLineRef.current?.remove();
      routeLineRef.current = null;
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentIds = new Set(parkings.map((parking) => parking.id));

    parkingMarkersRef.current.forEach((marker, parkingId) => {
      if (!currentIds.has(parkingId)) {
        marker.remove();
        parkingMarkersRef.current.delete(parkingId);
      }
    });

    parkings.forEach((parking) => {
      const existing = parkingMarkersRef.current.get(parking.id);
      const isSelected = parking.id === selectedParkingId;

      if (existing) {
        existing.setIcon(createParkingMarkerIcon(parking.status, isSelected));
        existing.setPopupContent(parkingPopupHtml(parking, locationConfirmed));
        existing.setLatLng([parking.coordinates.lat, parking.coordinates.lng]);
        return;
      }

      const marker = L.marker([parking.coordinates.lat, parking.coordinates.lng], {
        icon: createParkingMarkerIcon(parking.status, isSelected),
      })
        .addTo(map)
        .bindPopup(parkingPopupHtml(parking, locationConfirmed), { maxWidth: 220 });

      marker.on('click', () => {
        onSelectParking?.(parking.id);
      });

      parkingMarkersRef.current.set(parking.id, marker);
    });
  }, [parkings, selectedParkingId, locationConfirmed, onSelectParking]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentIds = new Set(entrances.map((entrance) => entrance.id));

    entranceMarkersRef.current.forEach((marker, entranceId) => {
      if (!currentIds.has(entranceId)) {
        marker.remove();
        entranceMarkersRef.current.delete(entranceId);
      }
    });

    entrances.forEach((entrance) => {
      const existing = entranceMarkersRef.current.get(entrance.id);
      const isSelected = entrance.id === selectedEntranceId;

      if (existing) {
        existing.setIcon(createEntranceMarkerIcon(entrance.status, isSelected));
        existing.setPopupContent(entrancePopupHtml(entrance, locationConfirmed));
        existing.setLatLng([entrance.coordinates.lat, entrance.coordinates.lng]);
        return;
      }

      const marker = L.marker([entrance.coordinates.lat, entrance.coordinates.lng], {
        icon: createEntranceMarkerIcon(entrance.status, isSelected),
        zIndexOffset: 500,
      })
        .addTo(map)
        .bindPopup(entrancePopupHtml(entrance, locationConfirmed), { maxWidth: 220 });

      marker.on('click', () => {
        onSelectEntrance?.(entrance.id);
      });

      entranceMarkersRef.current.set(entrance.id, marker);
    });
  }, [entrances, selectedEntranceId, locationConfirmed, onSelectEntrance]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (flyTarget) {
      mapRef.current.flyTo([flyTarget.coordinates.lat, flyTarget.coordinates.lng], 17, {
        animate: true,
        duration: 0.7,
      });
    } else {
      mapRef.current.flyTo(CUCEI_CENTER, 16, {
        animate: true,
        duration: 0.7,
      });
    }
  }, [flyTarget]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!userLocation) {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserLocationIcon(),
        zIndexOffset: 1000,
      })
        .addTo(mapRef.current)
        .bindPopup('<div style="font-size:12px; font-weight:600;">Tu ubicación</div>');
      return;
    }

    userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
  }, [userLocation]);

  useEffect(() => {
    if (!mapRef.current || !mapContainerRef.current) return;

    mapContainerRef.current.style.cursor = isPlacingUserPin ? 'crosshair' : '';

    if (!isPlacingUserPin || !onUserLocationSet) return;

    const handleMapClick = (event: L.LeafletMouseEvent) => {
      onUserLocationSet({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    };

    mapRef.current.on('click', handleMapClick);
    return () => {
      mapRef.current?.off('click', handleMapClick);
    };
  }, [isPlacingUserPin, onUserLocationSet]);

  useEffect(() => {
    if (!mapRef.current) return;

    routeLineRef.current?.remove();
    routeLineRef.current = null;

    if (!routingTarget || !userLocation) return;

    const destination = resolveRoutingDestination(routingTarget, parkings, entrances);
    if (!destination) return;

    const map = mapRef.current;
    const routeColor = routingTarget.kind === 'entrance' ? '#1059b9' : '#1153a6';
    const abortController = new AbortController();

    const drawRoute = (points: [number, number][]) => {
      routeLineRef.current?.remove();
      routeLineRef.current = L.polyline(points, {
        color: routeColor,
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      map.fitBounds(routeLineRef.current.getBounds(), { padding: [56, 56] });
    };

    void (async () => {
      try {
        const points = await fetchWalkingRoute(userLocation, destination, abortController.signal);
        if (abortController.signal.aborted) return;
        drawRoute(points);
      } catch {
        if (abortController.signal.aborted) return;
        drawRoute([
          [userLocation.lat, userLocation.lng],
          [destination.lat, destination.lng],
        ]);
      }
    })();

    return () => {
      abortController.abort();
      routeLineRef.current?.remove();
      routeLineRef.current = null;
    };
  }, [parkings, entrances, routingTarget, userLocation]);

  useEffect(() => {
    if (!mapRef.current || recenterToken === 0) return;
    if (!userLocation) return;

    mapRef.current.flyTo([userLocation.lat, userLocation.lng], 16, {
      animate: true,
      duration: 0.7,
    });
  }, [recenterToken, userLocation]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
