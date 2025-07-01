// src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';


// 🔁 This component updates the map center and zoom
function ChangeMapView({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, 6); // zoom level: 6
    }
  }, [coords]);

  return null;
}

function MapView({ locations, selected }) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-xl">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {selected && <ChangeMapView coords={[selected.lat, selected.lng]} />}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((place, i) => (
          <Marker key={i} position={[place.lat, place.lng]}>
            <Popup>
              <strong>{place.name}</strong><br />
              {place.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
