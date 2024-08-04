import { useState, useEffect } from "react";
import axios from "axios";
import { toastAlert } from "../lib/sweetalert";
import useUser from "./useUser";
import useDebounce from "./useDebounce";

export const useNewDataTableNew = (url, options = {}, searchValue) => {
  const { user } = useUser({ redirectTo: "/login" });
  const { debounce } = useDebounce();

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
      return { [key]: isSameAsBefore && state[key] == "desc" ? "asc" : "desc" };
    });
  };

  const fetchData = async () => {
    setLoading(true);

    let keySort;
    let valueObjSort;
    const keys = Object.keys(sort);

    keys.forEach((key) => {
      const value = sort[key];
      keySort = key;
      valueObjSort = value;
    });

    const query = {
      limit: pageSize,
      page: page,
      order: keySort || "id",
      orderBy: valueObjSort || "desc",
      filter: options.filter || [],
      filterValue: options.filterValue || [],
      search: searchValue,
    };

    try {
      const response = await axios.get(url, { params: query });
      setLoading(false);

      const { limit, page, total, total_page, rows } = response.data.data;

      setRecordsTotal(total);
      setPageCount(total_page);
      setData(rows);

      if (options.onLoad && typeof options.onLoad === "function") {
        options.onLoad(rows);
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
