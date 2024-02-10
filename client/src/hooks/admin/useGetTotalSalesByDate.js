import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetTotalSalesByDate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalSalesByDate, setTotalSalesByDate] = useState([]);

  useEffect(() => {
    const getTotalSalesByDate = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`/order/total-sales-by-date`);
        if (!res.data) {
          return toast.error(`TotalSalesByDate Not Found 😥`);
        } else setTotalSalesByDate(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getTotalSalesByDate();
  }, []);

  return { isLoading, error, totalSalesByDate };
}

export default useGetTotalSalesByDate;
