import React, { useEffect, useRef } from 'react';

import './Map.css';

interface MapProps {
  className?: string;
  style?: React.CSSProperties;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

const Map: React.FC<MapProps> = ({ className = '', style, center, zoom }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({
      position: center,
      map: map,
    });
  }, [center, zoom]);
  return <div className={`map ${className}`} style={style} ref={mapRef}></div>;
};

export default Map;
