import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapIcon } from './icons';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

function FitToResults({ locations }) {
  const map = useMap();
  useEffect(() => {
    if (!locations?.length) return;
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 6, { animate: true });
      return;
    }
    const bounds = locations.map((p) => [p.lat, p.lng]);
    map.fitBounds(bounds, { padding: [40, 40], animate: true });
  }, [locations, map]);
  return null;
}

function FocusSelected({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected) map.setView([selected.lat, selected.lng], 6, { animate: true });
  }, [selected, map]);
  return null;
}

export default function MapView({ locations, selected }) {
  return (
    <div className="w-full overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between px-5 py-3">
        <p className="flex items-center gap-1.5 text-sm font-bold text-stone-800"><MapIcon className="h-4 w-4 text-emerald-700" /> Live map · {locations.length} pins</p>
        <p className="hidden text-xs text-stone-500 sm:block">Click a pin, then open the detail page</p>
      </div>
      <div className="h-[380px] w-full">
        <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <FitToResults locations={locations} />
          {selected && <FocusSelected selected={selected} />}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((place) => (
            <Marker key={place.id} position={[place.lat, place.lng]}>
              <Popup>
                <strong>{place.name}</strong>
                <br />★ {place.rating} · {place.vibe}
                <br />
                <Link to={`/explore/${place.id}`}>View details →</Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
