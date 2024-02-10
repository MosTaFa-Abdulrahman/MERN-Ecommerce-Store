import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetAllOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getAllOrders = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`/order/all/get`);
        if (!res.data) {
          return toast.error(`Orders Not Found 😥`);
        } else setOrders(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getAllOrders();
  }, []);

  return { isLoading, error, orders };
}

export default useGetAllOrders;
