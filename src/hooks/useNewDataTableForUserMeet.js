import { useState, useEffect } from "react";
import axios from "axios";
import { toastAlert } from "../lib/sweetalert";
import useUser from "./useUser";
import useDebounce from "./useDebounce";

export const useNewDataTableForUserMeet = (url, options = {}, searchValue) => {
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

  const canNext = () => page + 1 < pageCount;
  const canPrev = () => page - 1 > pageCount;
  const getSortBy = (key) => sort[key] ?? null;
  const sortBy = (key) => {
    setSort((state) => {
      const isSameAsBefore = state[key] ?? false;
      return { [key]: isSameAsBefore && state[key] == "desc" ? "asc" : "desc" };
    });
  };

  const adjustedPage = page - 1;

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

    // Create the query with pagination parameters
    const query = {
      dataTable: true,
      orderField: keySort || "id",
      orderValue: valueObjSort || "desc",
      filter: options.filter || [],
      filterValue: options.filterValue || [],
      page: page, // Send the current page number
      perPage: pageSize, // Send the current page size
    };

    try {
      const response = await axios.get(url, { params: query });
      setLoading(false);

      const finalData =
        options?.transformResponse &&
        typeof options.transformResponse === "function"
          ? response.data.data.map((data) => options.transformResponse(data))
          : response.data.data;

      // Use the records total count and pageCount returned from the backend
      setRecordsTotal(response.data.recordsTotal || finalData.length);
      setPageCount(
        response.data.pageCount || Math.ceil(finalData.length / pageSize)
      );
      setData(finalData);

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

  const performSearch = () => {
    fetchData();
  };

  const debounceSearch = debounce(performSearch, 500);

  useEffect(() => {
    debounceSearch();
  }, [page, user, searchValue, sort]);

  return {
    data,
    page,
    loading,
    recordsTotal,
    pageCount,
    refresh,
    fetchData,
    setData,
    setPage,
    canNext,
    canPrev,
    sortBy,
    getSortBy,
  };
};

export default useNewDataTableForUserMeet;
