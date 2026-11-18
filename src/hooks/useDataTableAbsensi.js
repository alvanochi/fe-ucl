import { useState, useEffect } from "react";
import axios from "axios";
import { toastAlert } from "../lib/sweetalert";
import useUser from "./useUser";

export const useDatatableAbsensi = (url, options = {}) => {
  const { user } = useUser({ redirectTo: "/login" });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [filter, setFilter] = useState({});

  const refresh = () => {
    toastAlert("info", "Mengambil Data!", 1000);
    fetchData();
  };

  const canNext = () => page + 1 < pageCount;
  const canPrev = () => page - 1 > pageCount;

  const adjustedPage = page - 1;

  const fetchData = async () => {
    setLoading(true);

    const query = {
      dataTable: true,
      orderField: "id",
      orderValue: "desc",
      filter: options.filter || [],
      filterValue: options.filterValue || [],
      ...filter,
      length: pageSize,
      start: (page - 1) * pageSize,
    };

    try {
      const response = await axios.get(url, { params: query });
      setLoading(false);

      const finalData =
        options?.transformResponse &&
        typeof options.transformResponse === "function"
          ? response.data.data.map((data) => options.transformResponse(data))
          : response.data.data;

      setData(finalData);
      setRecordsTotal(parseInt(response.data.recordsTotal));
      setPageCount(Math.ceil(parseInt(response.data.recordsTotal) / pageSize));

      options?.onLoad &&
        typeof options.onLoad === "function" &&
        options.onLoad(finalData);
    } catch (error) {
      if (error.name === "AxiosError" && error?.response)
        toastAlert("error", error.response.data.message);
      else toastAlert("error", "Internal Server Error!");

      setLoading(false);
      setData([]);
      setRecordsTotal(0);
      setPageCount(0);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchData();
  }, [page, user, filter]);

  return {
    dataAbsensi: data,
    pageAbsensi: page,
    loadingAbsensi: loading,
    recordsTotalAbsensi: recordsTotal,
    pageCountAbsensi: pageCount,
    refreshAbsensi: refresh,
    fetchDataAbsensi: fetchData,
    setDataAbsensi: setData,
    setPageAbsensi: setPage,
    canNextAbsensi: canNext,
    canPrevAbsensi: canPrev,
    filter,
    setFilter,
  };
};

export default useDatatableAbsensi;
