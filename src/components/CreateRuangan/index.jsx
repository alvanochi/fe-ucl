"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Card from "../Card";

export default function Map() {
  return (
    <>
      <Card>
        <Card.Header className="bg-primary-600 text-white text-center text-sm mt-4">
          Peta Sebaran
        </Card.Header>
        <Card.Body>
          <div className="relative" style={{ height: "700px", width: "100%" }}>
            <MapContainer
              preferCanvas={true}
              center={[-6.560879822341944, 106.79239034070446]}
              zoom={20}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </MapContainer>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
