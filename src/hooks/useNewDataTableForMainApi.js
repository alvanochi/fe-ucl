import { useState, useEffect } from "react";
import axios from "axios";
import { toastAlert } from "../lib/sweetalert";
import useUser from "./useUser";
import useDebounce from "./useDebounce";

export const useNewDataTableForMainApi = (
  url,
  options = {},
  searchValue,
  initialSortField = "id",
  initialSortOrder = "desc"
) => {
  const { user } = useUser({ redirectTo: "/login" });

  const { debounce } = useDebounce();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [sort, setSort] = useState({ [initialSortField]: initialSortOrder });
  const [filter, setFilter] = useState({});

  const refresh = () => {
    toastAlert("info", "Mengambil Data!", 500);
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

    const [keySort, valueObjSort] = Object.entries(sort)[0] || [
      initialSortField,
      initialSortOrder,
    ];

    const query = {
      dataTable: true,
      orderField: keySort,
      orderValue: valueObjSort,
      ...filter,
      page: page,
      perPage: pageSize,
      start: (page - 1) * pageSize,
      length: pageSize,
    };

    try {
      const response = await axios.get(url, {
        params: { ...query, search: searchValue },
      });
      setLoading(false);

      const finalData =
        options?.transformResponse &&
        typeof options.transformResponse === "function"
          ? response.data.data.map((data) => options.transformResponse(data))
          : response.data.data;

      const totalRecords = searchValue
        ? finalData.length
        : response.data.recordsTotal;

      const calculatedPageCount = Math.ceil(totalRecords / pageSize);

      const currentPageData = finalData.slice(0, pageSize);

      setData(currentPageData);
      setRecordsTotal(totalRecords);
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

  const performSearch = () => {
    fetchData();
  };

  const debounceSearch = debounce(performSearch, 1000);

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  useEffect(() => {
    debounceSearch();
  }, [page, user, filter, sort, searchValue]);

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
    setPageSizeNew: setPageSize,
    setFilterNew: setFilter,
    filterNew: filter,
  };
};

export default useNewDataTableForMainApi;
