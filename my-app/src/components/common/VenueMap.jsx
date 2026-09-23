import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin } from "lucide-react";

// Professional custom SVG marker icon avoiding Leaflet Vite asset loading bugs
const createVenueIcon = () =>
  L.divIcon({
    className: "custom-venue-pin",
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 34px;
        background: #059669;
        border: 2.5px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 6px 14px rgba(5, 150, 105, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });

export default function VenueMap({
  lat,
  lng,
  venueName = "Venue Location",
  address = "",
  directionsUrl = null,
  height = "260px",
  zoom = 15,
}) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  const hasCoords =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude !== 0 &&
    longitude !== 0;

  if (!hasCoords) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-6 text-center text-slate-500"
      >
        <MapPin size={28} className="text-slate-400 mb-2" />
        <p className="text-xs font-semibold text-slate-700">Location is not available for this business.</p>
        <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
          Directions are unavailable because this business has not provided a valid location.
        </p>
      </div>
    );
  }

  const markerIcon = createVenueIcon();

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs">
      <div style={{ height }} className="w-full">
        <MapContainer
          center={[latitude, longitude]}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", zIndex: 10 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup className="venue-map-popup">
              <div className="p-1 space-y-1">
                <p className="text-xs font-bold text-slate-900">{venueName}</p>
                {address && <p className="text-[11px] text-slate-600">{address}</p>}
                {directionsUrl && (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold hover:underline mt-1"
                  >
                    <span>Open in Google Maps</span>
                    <Navigation size={10} />
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-slate-800 text-[11px] font-semibold shadow-md border border-slate-200 backdrop-blur-xs transition hover:text-emerald-600"
        >
          <Navigation size={12} className="text-emerald-600" />
          <span>Get Directions</span>
        </a>
      )}
    </div>
  );
}
