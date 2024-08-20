"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useRouter } from "next/router";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Form from "../../../components/Form";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import useCRUD from "../../../hooks/useCRUD";
import useMenu from "../../../hooks/useMenu";
import useUser from "../../../hooks/useUser";
import { Loading } from "../../../components/Loading";
import { useState } from "react";

export default function RuangCreate() {
  const router = useRouter();
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, setActive } = useMenu();
  const [previewImage, setPreviewImage] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  const API_URL = `${process.env.API_ENDPOINT}/ruangan`;
  const INITIAL_FORM = {
    nama_ruangan: "",
    alamat: "",
    lat: "",
    long: "",
    foto: "",
  };

  const { formdata, submitHandler } = useCRUD(API_URL, INITIAL_FORM, {
    rules: [
      { field: "nama_ruangan", label: "Nama Ruangan" },
      { field: "alamat", label: "Alamat" },
      { field: "lat", label: "lattitude" },
      { field: "long", label: "longtitude" },
    ],
    success: () => router.push(prefix + menu.url),
  });

  const { form, inputHandler, setForm } = formdata;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      inputHandler(e);
    }
  };

  // Handle map click to get lat, long and address
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;

        setMarkerPosition([lat, lng]);
        setForm((prevForm) => ({
          ...prevForm,
          lat,
          long: lng,
        }));

        // Reverse geocoding to get the address
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await response.json();
        const address = data.display_name;

        // Update the form field with the address
        setForm((prevForm) => ({
          ...prevForm,
          alamat: address,
        }));
      },
    });

    return null;
  };

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader title={menu.label} icon={menu.icon} handler={setActive} />

      <Card>
        <Card.Body>
          <div className="relative" style={{ height: "700px", width: "100%" }}>
            <MapContainer
              preferCanvas={true}
              center={[-6.560879822341944, 106.79239034070446]}
              zoom={20}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", cursor: "pointer" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <MapClickHandler />
              {markerPosition && (
                <Marker position={markerPosition}>
                  <Popup>{form.alamat}</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </Card.Body>
      </Card>
      <Form onSubmit={submitHandler} type="formdata">
        <Card className="mt-4">
          <Card.Header className="text-center">Ruangan</Card.Header>
          <Card.Body className="space-y-4">
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Nama Ruangan <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="nama_ruangan"
                value={form.nama_ruangan}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Alamat <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="alamat"
                value={form.alamat}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Lattitude <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="lat"
                value={form.lat}
                onChange={inputHandler}
                required
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                longtitude <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <Form.Input
                type="text"
                className="flex-1"
                name="long"
                value={form.long}
                onChange={inputHandler}
              />
            </Form.Group>
            <Form.Group className="flex items-baseline gap-3">
              <Form.Label className="min-w-[18rem]">
                Foto <span className="text-danger-600">*</span>
              </Form.Label>
              <span>:</span>
              <div className="block flex-1 space-y-2">
                <Form.Input
                  type="file"
                  className="flex-1"
                  name="foto"
                  onChange={handleImageChange}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="foto"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            </Form.Group>
          </Card.Body>
        </Card>
        <div className="flex gap-4 mt-4">
          <Button
            as="a"
            href={prefix + menu.url}
            variant="secondary"
            className="w-full h-12"
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" className="w-full h-12">
            Konfirmasi
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
