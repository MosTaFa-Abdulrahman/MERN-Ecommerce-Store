import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

// Admin Controller
function useGetTopProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTTopProducts = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get("/product/top/get");
        if (!res.data) {
          return toast.error("Not Found Users 😥");
        } else setProducts(res.data);
      } catch (error) {
        setError(error.message);
        toast.error(`${error.message} 😥`);
      } finally {
        setIsLoading(false);
      }
    };
    getTTopProducts();
  }, []);

  return { isLoading, error, products };
}

export default useGetTopProduct;
