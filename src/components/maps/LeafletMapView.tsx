"use client";

import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import type { ParkingLot } from '@/types/parking';
import type { UserCoordinates } from '@/lib/parkingRouting';
import { DEFAULT_USER_LOCATION } from '@/lib/parkingRouting';

type LeafletMapViewProps = {
  parkings: ParkingLot[];
  selectedId?: string | null;
  recenterToken?: number;
  userLocation?: UserCoordinates | null;
  isPlacingUserPin?: boolean;
  routingTargetId?: string | null;
  onSelect?: (parkingId: string) => void;
  onUserLocationSet?: (location: UserCoordinates) => void;
};

const CUCEI_CENTER: [number, number] = [20.655101702046743, -103.32549526761856];

const statusColors: Record<ParkingLot['status'], string> = {
  available: '#22c55e',
  medium: '#f59e0b',
  saturated: '#ef4444',
};

function createMarkerIcon(status: ParkingLot['status'], selected: boolean) {
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

function parkingPopupHtml(parking: ParkingLot): string {
  return `
    <div style="font-family: Inter, sans-serif; min-width: 180px;">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${parking.name}</div>
      <div style="font-size: 12px; color: ${statusColors[parking.status]}; margin-bottom: 4px;">
        ${parking.status === 'available' ? 'Alta disponibilidad' : parking.status === 'medium' ? 'Disponibilidad media' : 'Saturado'}
      </div>
      <div style="font-size: 12px; margin-bottom: 4px;">${parking.distance}m de distancia</div>
      <div style="font-size: 12px; margin-bottom: 8px;">${parking.availableSpaces} espacios disponibles</div>
    </div>
  `;
}

export function LeafletMapView({
  parkings,
  selectedId,
  recenterToken = 0,
  userLocation = null,
  isPlacingUserPin = false,
  routingTargetId = null,
  onSelect,
  onUserLocationSet,
}: LeafletMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  const selectedParking = useMemo(
    () => parkings.find((parking) => parking.id === selectedId),
    [parkings, selectedId]
  );

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

    parkings.forEach((parking) => {
      const marker = L.marker([parking.coordinates.lat, parking.coordinates.lng], {
        icon: createMarkerIcon(parking.status, parking.id === selectedId),
      })
        .addTo(map)
        .bindPopup(parkingPopupHtml(parking), { maxWidth: 220 });

      marker.on('click', () => {
        onSelect?.(parking.id);
      });

      markersRef.current.set(parking.id, marker);
    });

    mapRef.current = map;

    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 50);

    return () => {
      window.clearTimeout(timer);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      routeLineRef.current?.remove();
      routeLineRef.current = null;
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [parkings, onSelect]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker, parkingId) => {
      const parking = parkings.find((item) => item.id === parkingId);
      if (!parking) return;

      marker.setIcon(createMarkerIcon(parking.status, parkingId === selectedId));
      marker.setPopupContent(parkingPopupHtml(parking));
    });
  }, [parkings, selectedId]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedParking) {
      mapRef.current.flyTo([selectedParking.coordinates.lat, selectedParking.coordinates.lng], 17, {
        animate: true,
        duration: 0.7,
      });
    } else {
      mapRef.current.flyTo(CUCEI_CENTER, 16, {
        animate: true,
        duration: 0.7,
      });
    }
  }, [selectedParking]);

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

    if (!routingTargetId || !userLocation) return;
    const destination = parkings.find((parking) => parking.id === routingTargetId);
    if (!destination) return;

    routeLineRef.current = L.polyline(
      [
        [userLocation.lat, userLocation.lng],
        [destination.coordinates.lat, destination.coordinates.lng],
      ],
      {
        color: '#1153a6',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '10 8',
      }
    ).addTo(mapRef.current);

    mapRef.current.fitBounds(routeLineRef.current.getBounds(), { padding: [56, 56] });
  }, [parkings, routingTargetId, userLocation]);

  useEffect(() => {
    if (!mapRef.current) return;
    const target = userLocation ?? DEFAULT_USER_LOCATION;
    mapRef.current.flyTo([target.lat, target.lng], 16, {
      animate: true,
      duration: 0.7,
    });
  }, [recenterToken, userLocation]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
