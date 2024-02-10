import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

// Admin Controller
function useGetProductsQuery(keyword) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setdata] = useState([]);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const getTProductsQuery = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`/product/pagesize/get?${keyword}`);
        if (!res.data) {
          return toast.error("Not Found Products 😥");
        } else setdata(res.data);
      } catch (error) {
        setIsError(error.message);
        toast.error(`${error.message} 😥`);
      } finally {
        setIsLoading(false);
      }
    };
    getTProductsQuery();
  }, []);

  return { isLoading, isError, data };
}

export default useGetProductsQuery;
