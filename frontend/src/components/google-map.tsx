"use client";

import {
  GoogleMap as GMap,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

import { appEnv } from "@/lib/env";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

interface GoogleMapProps {
  address: string;
}

function GoogleMapWithScript({ address }: GoogleMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: appEnv.GOOGLE_MAPS_API_KEY,
  });
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!address) return;
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${appEnv.GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        } else {
          console.error("Geocoding API error:", data.status);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };
    fetchCoordinates();
  }, [address]);

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;
  if (!coordinates) return <p>Loading location...</p>;

  return (
    <GMap mapContainerStyle={mapContainerStyle} zoom={17} center={coordinates}>
      <MarkerF
        position={coordinates}
        onClick={() => {
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
          window.open(googleMapsUrl, "_blank");
        }}
      />
    </GMap>
  );
}

const GoogleMap: React.FC<GoogleMapProps> = ({ address }) => {
  if (!appEnv.isGoogleMapsEnabled) {
    return (
      <p className="text-sm text-t-dark">
        Map preview is disabled in the take-home setup.
      </p>
    );
  }

  return <GoogleMapWithScript address={address} />;
};

export default GoogleMap;
