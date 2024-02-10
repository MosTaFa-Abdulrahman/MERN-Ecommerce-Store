import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetFilterdProducts({ checked, radio }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterProducts, setFilterProducts] = useState([]);

  useEffect(() => {
    const getFilterdProducts = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.post("product/filtered-products", {
          checked,
          radio,
        });
        if (!res.data) {
          return toast.error(`Filterd Products Not Found 😥`);
        } else setFilterProducts(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getFilterdProducts();
  }, [toast]);

  return { isLoading, error, filterProducts };
}

export default useGetFilterdProducts;
