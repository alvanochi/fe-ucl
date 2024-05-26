import { useState, useEffect } from "react";
import axios from "axios";
import { toastAlert } from "../lib/sweetalert";
import useUser from "./useUser";

export const useDatatable = (url, options = {}) => {
  const { user, logout } = useUser({ redirectTo: "/login" });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [totalData, setTotalData] = useState(0);

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

  const sortEntries = Object.entries(sort);
  const sortEntry = sortEntries.length > 0 ? sortEntries[0] : [];
  const sortByName = sortEntry.length > 0 ? sortEntry[0] : "";
  const sorting = sortEntry.length > 1 ? sortEntry[1] : "";

  const fetchData = async () => {
    setLoading(true);

    const query = {
      page: page,
      limit: pageSize,
      sortByName,
      sorting,
      ...filter,
      id_matkul: options.id_matkul || "",
      kelas: options.kelas || "",
    };

    try {
      const request = await axios({
        method: "GET",
        url: url,
        params: query,
      });

      const response = await request.data;
      setLoading(false);

      const finalData =
        options?.transformResponse &&
        typeof options.transformResponse == "function"
          ? response.data.map((data) => options.transformResponse(data))
          : response.data;
      setData(finalData);
      setTotalData(parseInt(response.totalData));
      setPageCount(Math.ceil(parseInt(response.totalData) / pageSize));

      options?.onLoad &&
        typeof options.onLoad == "function" &&
        options.onLoad(finalData);
    } catch (error) {
      if (error) {
        toastAlert("error", "session expired");
        logout();
      } else {
        toastAlert("error", "Internal Server Error!");
      }

      setLoading(false);
      setData([]);
      setPageCount(0);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchData();
  }, [page, filter, sort, user]);

  return {
    data,
    page,
    loading,
    totalData,
    pageCount,
    filter,
    sort,
    refresh,
    fetchData,
    setData,
    setPage,
    setFilter,
    canNext,
    canPrev,
    sortBy,
    getSortBy,
  };
};

export default useDatatable;
