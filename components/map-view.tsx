"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface MapViewProps {
  location: { lat: number; lng: number } | null;
  isLocating: boolean;
}

function MapView({ location, isLocating }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize the map in the browser
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    // Initialize the map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        location ? [location.lat, location.lng] : [28.6139, 77.209], // Default to Delhi if no location
        13
      );

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Add marker if location is available
      if (location) {
        L.marker([location.lat, location.lng]).addTo(mapRef.current).bindPopup("Your Location").openPopup();
      }
    }

    // Update map view and marker when location changes
    if (location && mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 13);
      L.marker([location.lat, location.lng]).addTo(mapRef.current).bindPopup("Your Location").openPopup();
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location]);

  return (
    <div className="relative w-full h-full">
      {isLocating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <span className="text-white">Locating...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

export default MapView;