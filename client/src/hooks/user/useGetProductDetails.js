import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetProductDetails(pId) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`product/get/${pId}`);
        if (!res.data) {
          return toast.error(`Product Not Found 😥`);
        } else setProduct(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, []);

  return { isLoading, error, product };
}

export default useGetProductDetails;
