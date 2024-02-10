import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

// Admin Controller
function useGetAllProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const getproducts = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get("/product/all/get");
        if (!res.data) {
          return toast.error("Not Found Products 😥");
        } else setProducts(res.data);
      } catch (error) {
        setIsError(error.message);
        toast.error(`${error.message} 😥`);
      } finally {
        setIsLoading(false);
      }
    };
    getproducts();
  }, []);

  return { isLoading, isError, products };
}

export default useGetAllProducts;
