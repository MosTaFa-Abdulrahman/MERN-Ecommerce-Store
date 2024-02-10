import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../requestMethod";

function useGetUserInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const { username } = useParams();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`user/find/${username}`);
        if (!res.data) {
          return toast.error(`User Not Found 😥`);
        } else setUser(res.data);
      } catch (error) {
        toast.error(`${error.message} 😥`);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);

  return { isLoading, user };
}

export default useGetUserInfo;
