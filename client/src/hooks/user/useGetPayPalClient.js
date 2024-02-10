import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetPayPalClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paypal, setPaypal] = useState({});

  useEffect(() => {
    const getPaypal = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get("/config/paypal");
        if (!res.data) {
          return toast.error(`Paypal Error !!~~~ 😥`);
        } else setPaypal(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getPaypal();
  }, []);

  return { isLoading, error, paypal };
}

export default useGetPayPalClient;
