import { useState, useEffect } from "react";
import axios from "axios";
import { toastAlert } from "../lib/sweetalert";
import useUser from "./useUser";
import useDebounce from "./useDebounce";

export const useNewDataTableNew = (
  url,
  options = {},
  searchValue,
  defaultSort = "id"
) => {
  const { user } = useUser({ redirectTo: "/login" });
  const { debounce } = useDebounce();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [sort, setSort] = useState({ [defaultSort]: "desc" }); // Set default sort column

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

    const keySort = Object.keys(sort)[0] || defaultSort;
    const valueObjSort = sort[keySort] || "desc";

    const query = {
      limit: pageSize,
      page: page,
      order: keySort, // Sorting by the selected column or default
      orderBy: valueObjSort, // Sort direction
      filter: options.filter || [],
      filterValue: options.filterValue || [],
      search: searchValue,
    };

    try {
      const response = await axios.get(url, { params: query });
      setLoading(false);

      const res = response?.data;
      let finalRows = [];
      let finalTotal = 0;
      let finalTotalPage = 1;

      if (res) {
        if (Array.isArray(res.data)) {
          // Format standard backend: { status: 'success', data: [...], totalData: 10, totalPages: 1 }
          finalRows = res.data;
          finalTotal = res.totalData ?? res.total ?? finalRows.length;
          finalTotalPage = res.totalPages ?? res.total_page ?? Math.ceil(finalTotal / pageSize) ?? 1;
        } else if (res.data && Array.isArray(res.data.rows)) {
          // Format legacy UCL: { data: { rows: [...], total: 10, total_page: 1 } }
          finalRows = res.data.rows;
          finalTotal = res.data.total ?? finalRows.length;
          finalTotalPage = res.data.total_page ?? Math.ceil(finalTotal / pageSize) ?? 1;
        } else if (Array.isArray(res.rows)) {
          // Format direct rows: { rows: [...], total: 10 }
          finalRows = res.rows;
          finalTotal = res.total ?? res.recordsTotal ?? finalRows.length;
          finalTotalPage = res.total_page ?? res.pageCount ?? Math.ceil(finalTotal / pageSize) ?? 1;
        } else if (Array.isArray(res)) {
          // Direct array: [...]
          finalRows = res;
          finalTotal = finalRows.length;
          finalTotalPage = Math.ceil(finalTotal / pageSize) ?? 1;
        } else if (res.data && typeof res.data === "object") {
          finalRows = res.data.rows || [];
          finalTotal = res.data.total || finalRows.length;
          finalTotalPage = res.data.total_page || 1;
        }
      }

      setRecordsTotal(finalTotal || 0);
      setPageCount(finalTotalPage || 1);
      setData(finalRows || []);

      if (options.onLoad && typeof options.onLoad === "function") {
        options.onLoad(finalRows || []);
      }
    } catch (error) {
      setLoading(false);
      if (error.name === "AxiosError" && error.response) {
        toastAlert("error", error.response.data.message || "Error occurred");
      } else {
        toastAlert("error", "Internal Server Error!");
      }
      setData([]);
      setRecordsTotal(0);
      setPageCount(0);
    }
  };

  const debounceSearch = debounce(fetchData, 500);

  useEffect(() => {
    debounceSearch();
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
  };
};

export default useNewDataTableNew;
