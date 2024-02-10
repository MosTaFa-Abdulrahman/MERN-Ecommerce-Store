import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetUserOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getUserOrders = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`order/mine/get`);
        if (!res.data) {
          return toast.error(`User Orders Not Found 😥`);
        } else setOrders(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getUserOrders();
  }, []);

  return { isLoading, error, orders };
}

export default useGetUserOrders;
