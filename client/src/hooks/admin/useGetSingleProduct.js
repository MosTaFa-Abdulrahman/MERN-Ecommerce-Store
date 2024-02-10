import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

function useGetSingleProduct(pId) {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`product/get/${pId}`);
        const productData = res.data;
        if (!productData) {
          return toast.error(`Product Not Found 😥`);
        } else setProduct(productData);
      } catch (error) {
        toast.error(`${error.message} 😥`);
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [pId]);

  return { isLoading, product };
}

export default useGetSingleProduct;
