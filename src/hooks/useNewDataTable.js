import { useState, useEffect } from "react";
import axios from "axios";
import { toastAlert } from "../lib/sweetalert";
import useUser from "./useUser";

export const useNewDataTable = (url, options = {}, searchValue) => {
  const { user } = useUser({ redirectTo: "/login" });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [recordsTotal, setRecordsTotal] = useState(0);

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
      length: -1,
      start: 0,
    };

    try {
      const response = await axios.get(url, { params: query });
      setLoading(false);

      const finalData =
        options?.transformResponse &&
        typeof options.transformResponse === "function"
          ? response.data.data.map((data) => options.transformResponse(data))
          : response.data.data;

      const filteredData = finalData.filter((row) => {
        const searchText = searchValue.toLowerCase();
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            const cellValue = row[key];
            if (
              typeof cellValue === "string" &&
              cellValue.toLowerCase().includes(searchText)
            ) {
              return true;
            }
            if (
              typeof cellValue === "number" ||
              typeof cellValue === "boolean"
            ) {
              if (cellValue.toString().toLowerCase().includes(searchText)) {
                return true;
              }
            }
            if (typeof cellValue === "object" && cellValue !== null) {
              for (const innerKey in cellValue) {
                if (Object.prototype.hasOwnProperty.call(cellValue, innerKey)) {
                  const innerValue = cellValue[innerKey];
                  if (
                    typeof innerValue === "string" &&
                    innerValue.toLowerCase().includes(searchText)
                  ) {
                    return true;
                  }
                }
              }
            }
          }
        }
        // Jika tidak ada kolom yang cocok dengan nilai pencarian, kembalikan false
        return false;
      });

      setRecordsTotal(filteredData.length);

      const calculatedPageCount = Math.ceil(filteredData.length / pageSize);

      const pageStartIndex = (page - 1) * pageSize;
      const pageEndIndex = Math.min(page * pageSize, filteredData.length);
      const currentPageData = filteredData.slice(pageStartIndex, pageEndIndex);

      setData(currentPageData);
      setPageCount(calculatedPageCount);

      options?.onLoad &&
        typeof options.onLoad === "function" &&
        options.onLoad(currentPageData);
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
  }, [page, user, searchValue]);

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
  };
};

export default useNewDataTable;
