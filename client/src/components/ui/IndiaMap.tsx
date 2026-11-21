import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

interface IndiaMapProps {
  interactive?: boolean; // If true, enables clicking states for selection
  selectedStates?: string[];
  onStateSelect?: (stateName: string) => void;
  dataDensity?: Record<string, number>; // State name -> count for choropleth
  showCityPins?: boolean;
}

const INDIA_TOPO = '/india.json';

const MAJOR_CITIES = [
  { name: 'Delhi', coordinates: [77.209, 28.6139], count: '24,000+' },
  { name: 'Mumbai', coordinates: [72.8777, 19.076], count: '31,000+' },
  { name: 'Bangalore', coordinates: [77.5946, 12.9716], count: '28,000+' },
  { name: 'Hyderabad', coordinates: [78.4867, 17.385], count: '18,500+' },
  { name: 'Chennai', coordinates: [80.2707, 13.0827], count: '16,000+' },
  { name: 'Kolkata', coordinates: [88.3639, 22.5726], count: '14,200+' },
  { name: 'Ahmedabad', coordinates: [72.5714, 23.0225], count: '12,800+' },
  { name: 'Jaipur', coordinates: [75.7873, 26.9124], count: '9,500+' },
  { name: 'Lucknow', coordinates: [80.9462, 26.8467], count: '15,000+' },
  { name: 'Pune', coordinates: [73.8567, 18.5204], count: '19,000+' },
];

export const IndiaMap: React.FC<IndiaMapProps> = ({
  interactive = false,
  selectedStates = [],
  onStateSelect,
  dataDensity = {},
  showCityPins = false,
}) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const getColor = (geoName: string) => {
    const isSelected = selectedStates.includes(geoName);
    if (isSelected) return '#ff9933'; // Saffron when selected

    const count = dataDensity[geoName] || 0;
    if (count > 30) return '#1a237e'; // Dark navy
    if (count > 15) return '#1565c0'; // Medium blue
    if (count > 5) return '#60a5fa'; // Light blue
    if (count > 0) return '#93c5fd';

    return '#cbd5e1'; // Neutral slate default
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center">
      {hoveredState && (
        <div className="absolute top-2 left-2 z-10 px-3 py-1.5 rounded-md bg-slate-900/90 text-white text-xs font-semibold shadow-lg border border-slate-700 pointer-events-none">
          {hoveredState}
          {dataDensity[hoveredState] !== undefined && (
            <span className="text-amber-300 ml-1.5 font-bold">
              ({dataDensity[hoveredState]} allocations)
            </span>
          )}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [78.9629, 22.5937], // Center of India
        }}
        className="w-full h-80 sm:h-96 md:h-[460px]"
      >
        <Geographies geography={INDIA_TOPO}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name || geo.properties.st_nm || 'State';
              const isSelected = selectedStates.includes(stateName);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredState(stateName)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => interactive && onStateSelect && onStateSelect(stateName)}
                  style={{
                    default: {
                      fill: getColor(stateName),
                      stroke: '#ffffff',
                      strokeWidth: 0.75,
                      outline: 'none',
                      transition: 'all 250ms',
                      cursor: interactive ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: '#f59e0b',
                      stroke: '#ffffff',
                      strokeWidth: 1.5,
                      outline: 'none',
                      cursor: interactive ? 'pointer' : 'default',
                    },
                    pressed: {
                      fill: '#d97706',
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {showCityPins &&
          MAJOR_CITIES.map((city, idx) => (
            <Marker key={idx} coordinates={city.coordinates as [number, number]}>
              <circle r={5} fill="#ff9933" stroke="#ffffff" strokeWidth={1.5} className="animate-pulse" />
              <circle r={10} fill="#ff9933" opacity={0.3} className="animate-ping" />
              <text
                textAnchor="middle"
                y={-10}
                className="text-[9px] font-bold fill-slate-800 dark:fill-white drop-shadow-sm select-none"
              >
                {city.name}
              </text>
            </Marker>
          ))}
      </ComposableMap>

      {interactive && (
        <p className="text-[11px] text-slate-500 mt-2 text-center">
          💡 Click on states on the map to add or remove them from your preferred location list.
        </p>
      )}
    </div>
  );
};

export default IndiaMap;
