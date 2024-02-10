import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetOrderDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState({});
  const { id: orderId } = useParams();

  useEffect(() => {
    const getOrder = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`order/get/${orderId}`);
        if (!res.data) {
          return toast.error(`Order Not Found 😥`);
        } else setOrder(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getOrder();
  }, []);

  return { isLoading, error, order };
}

export default useGetOrderDetails;
