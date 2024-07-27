import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import { MySwal, loadingAlert, toastAlert } from "../../lib/sweetalert";

const OAuthCallback = () => {
  const router = useRouter();

  async function setLoginSession(data) {
    try {
      const response = await axios({
        url: "/api/login",
        method: "POST",
        data: data,
      });
      return response.data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An unexpected error occurred.",
      });
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const {
        token,
        user_id,
        npm,
        nidn,
        username,
        email,
        role,
        nip,
        nama_lengkap,
        image,
        no_hp,
        imageUrl,
        kode_mhs,
        isverified,
        created_at,
      } = router.query;

      if (token) {
        const data = {
          token,
          user_id,
          npm,
          nidn,
          username,
          email,
          role,
          nip,
          nama_lengkap,
          image,
          no_hp,
          imageUrl,
          kode_mhs,
          isverified,
          created_at,
        };

        let userRole =
          data.role === "Mahasiswa"
            ? "mahasiswa"
            : data.role === "Dosen"
            ? "dosen"
            : data.role === "Admin"
            ? "admin"
            : data.role === "Dosen_Ext"
            ? "dosen_ext"
            : "";

        loadingAlert();
        await setLoginSession(data);
        MySwal.close();

        return router.push(`/${userRole}`);
      } else {
        toastAlert("error", "invalid login");
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  return <div>Loading...</div>;
};

export default OAuthCallback;
