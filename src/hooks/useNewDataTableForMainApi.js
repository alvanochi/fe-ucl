import { useState, useEffect } from "react";
import axios from "axios";
import { toastAlert } from "../lib/sweetalert";
import useUser from "./useUser";

export const useNewDataTableForMainApi = (url, options = {}, searchValue) => {
  const { user } = useUser({ redirectTo: "/login" });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [sort, setSort] = useState({});

  const refresh = () => {
    toastAlert("info", "Mengambil Data!", 1000);
    fetchData();
  };

  const canNext = () => page < pageCount;
  const canPrev = () => page > 1;
  const getSortBy = (key) => sort[key] ?? null;
  const sortBy = (key) => {
    setSort((state) => {
      const isSameAsBefore = state[key] ?? false;
      return {
        [key]: isSameAsBefore && state[key] === "desc" ? "asc" : "desc",
      };
    });
  };

  const fetchData = async () => {
    setLoading(true);

    const [keySort, valueObjSort] = Object.entries(sort)[0] || ["id", "desc"];

    const query = {
      dataTable: true,
      orderField: keySort,
      orderValue: valueObjSort,
      filter: options.filter || [],
      filterValue: options.filterValue || [],
      page: page,
      perPage: pageSize,
      start: (page - 1) * pageSize,
      length: pageSize,
    };

    try {
      const response = await axios.get(url, { params: query });
      setLoading(false);

      const finalData =
        options?.transformResponse &&
        typeof options.transformResponse === "function"
          ? response.data.data.map((data) => options.transformResponse(data))
          : response.data.data;

      let filteredData = finalData;

      if (searchValue) {
        const searchText = searchValue.toLowerCase();
        filteredData = finalData.filter((row) => {
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
                  if (
                    Object.prototype.hasOwnProperty.call(cellValue, innerKey)
                  ) {
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
          return false;
        });
      }

      const totalFilteredRecords = filteredData.length;
      setRecordsTotal(
        searchValue ? totalFilteredRecords : response.data.recordsTotal
      );

      const calculatedPageCount = Math.ceil(
        (searchValue ? totalFilteredRecords : response.data.recordsTotal) /
          pageSize
      );
      setPageCount(calculatedPageCount);

      const currentPageData = filteredData;

      setData(currentPageData);

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
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    fetchData();
  }, [page, user, searchValue, sort]);

  return {
    dataNew: data,
    pageNew: page,
    loadingNew: loading,
    recordsTotalNew: recordsTotal,
    pageCountNew: pageCount,
    refreshNew: refresh,
    fetchDataNew: fetchData,
    setDataNew: setData,
    setPageNew: setPage,
    canNextNew: canNext,
    canPrevNew: canPrev,
    sortByNew: sortBy,
    getSortByNew: getSortBy,
    setPageSizeNew: setPageSize, // Add this to update page size if needed
  };
};

export default useNewDataTableForMainApi;
