import axios from "axios";
import { useEffect, useState } from "react";

export const useFetch = (url, query = {}, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;

      setLoading(true);
      try {
        const response = await axios.get(url, {
          params: query,
          ...options,
        });

        setData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
