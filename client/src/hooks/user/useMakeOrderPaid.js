import { useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";
import { useParams } from "react-router";

function useMakeOrderPaid() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id: orderId } = useParams();

  const payOrder = async () => {
    setIsLoading(true);
    try {
      const res = await makeRequest.put(`order/pay/${orderId}`);
      if (!res.data) {
        return toast.error(`Order Not Paid 😥`);
      } else return toast.success(`Order Paid Successfully 🥰`);
    } catch (error) {
      toast.error(`${error.message} 😥`);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, payOrder };
}

export default useMakeOrderPaid;
