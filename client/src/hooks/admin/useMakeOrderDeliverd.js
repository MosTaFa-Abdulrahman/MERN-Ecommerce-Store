import { useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";
import { useParams } from "react-router";

function useMakeOrderDeliverd() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id: orderId } = useParams();

  const deliverOrder = async () => {
    setIsLoading(true);
    try {
      const res = await makeRequest.put(`order/deliver/${orderId}`);
      if (!res.data) {
        return toast.error(`Order Not Delieverd 😥`);
      } else return toast.success(`Order Delieverd Successfully 🥰`);
    } catch (error) {
      toast.error(`${error.message} 😥`);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, deliverOrder };
}

export default useMakeOrderDeliverd;
