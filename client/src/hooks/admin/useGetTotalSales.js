import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetTotalSales() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalSales, setTotalSales] = useState(null);

  useEffect(() => {
    const getTotalSales = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`/order/total-sales`);
        if (!res.data) {
          return toast.error(`TotalSales Not Found 😥`);
        } else setTotalSales(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getTotalSales();
  }, []);

  return { isLoading, error, totalSales };
}

export default useGetTotalSales;
