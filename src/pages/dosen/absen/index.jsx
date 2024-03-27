import useMenu from "../../../hooks/useMenu";
import Layout from "../../../components/Layout";
import PageHeader from "../../../components/PageHeader";
import Form from "../../../components/Form";
import Button from "../../../components/Button";
import useUser from "../../../hooks/useUser";
import _ from "underscore";
import useDatatable from "../../../hooks/useDatatable";
import useCRUD from "../../../hooks/useCRUD";
import SortIcon from "../../../components/SortIcon";
import { Icon } from "@iconify-icon/react";
import useDataTableAbsensi from "../../../hooks/useDataTableAbsensi";
import axios from "axios";
import DaftarHadirModule from "../../../modules/absen/daftar-hadir";
import RekapKehadiran from "../../../modules/absen/rekap-kehadiran";
import { Loading } from "../../../components/Loading";

export default function Absen() {
  const { user } = useUser({ redirectTo: "/login" });
  const { prefix, menu, active, setActive } = useMenu();

  if ([user, menu].some((item) => item == null)) return <Loading />;
  return (
    <Layout>
      <PageHeader
        title={menu.label}
        icon={menu.icon}
        items={menu.submenus}
        active={active.url}
        handler={setActive}
      />
      <div className="my-8">
        {active.url === "#daftar-hadir" && (
          <DaftarHadirModule baseURL={prefix + menu.url} user={user} />
        )}
        {active.url === "#rekap-kehadiran" && (
          <RekapKehadiran baseURL={prefix + menu.url} user={user} />
        )}
      </div>
    </Layout>
  );
}
