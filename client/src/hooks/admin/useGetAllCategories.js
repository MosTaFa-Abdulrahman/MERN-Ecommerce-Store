import { useEffect, useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";

// Admin Controller
function useGetAllCategories() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get("/category/get");
        if (!res.data) {
          return toast.error("Not Found Categories 😥");
        } else setCategories(res.data);
      } catch (error) {
        setError(error.message);
        toast.error(`${error.message} 😥`);
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, []);

  return { isLoading, error, categories };
}

export default useGetAllCategories;
