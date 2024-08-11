"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Card from "../Card";
import axios from "axios";
import { useEffect, useState } from "react";
import Form from "../Form";
import Button from "../Button";

export default function Map() {
  const [data, setData] = useState([]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const fetchData = async (tanggal_mulai, tanggal_akhir) => {
    const API_URL = `${process.env.API_ENDPOINT}/laporan/sebaran`;
    try {
      const response = await axios.get(API_URL, {
        params: {
          tanggal_mulai,
          tanggal_akhir,
        },
      });
      if (response.data.isSuccess) {
        setData(response.data.data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilter = () => {
    fetchData(tanggalMulai, tanggalAkhir);
  };

  useEffect(() => {
    fetchData("", "");
  }, []);

  return (
    <>
      <Card className="col-span-2 sm:col-span-8 lg:col-span-8 mt-8">
        <Card.Body>
          <div className="flex gap-4 items-end">
            <Form.Group className="flex-1">
              <Form.Label>Dari Tanggal</Form.Label>
              <Form.Input
                type="date"
                className="w-full"
                name="tanggal_mulai"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="flex-1">
              <Form.Label>Sampai Tanggal</Form.Label>
              <Form.Input
                type="date"
                className="w-full"
                name="tanggal_akhir"
                value={tanggalAkhir}
                onChange={(e) => setTanggalAkhir(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="flex">
              <Button
                variant="primary"
                className="self-stretch w-24 h-12"
                onClick={handleFilter}
              >
                Filter
              </Button>
            </Form.Group>
          </div>
        </Card.Body>
      </Card>

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
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {data.map((location, index) => (
                <Marker key={index} position={[location.lat, location.lng]}>
                  <Popup>
                    <strong>{location.nama_lengkap}</strong>
                    <br />
                    <strong>{location.npm}</strong>
                    <br />
                    <strong>{location.email}</strong>
                    <br />
                    <strong>{location.telp}</strong>
                    <br />
                    <img
                      src={location.image}
                      alt="Profile"
                      width="500"
                      className="mt-2"
                    />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
