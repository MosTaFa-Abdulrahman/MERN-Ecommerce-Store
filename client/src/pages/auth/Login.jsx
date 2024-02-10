import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { makeRequest } from "../../requestMethod";
import { setCredentials } from "../../redux/authSlice";

function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return toast.warning("Fill All This Fields Please 😍");
    }

    setLoading(true);

    try {
      const res = await makeRequest.post("/auth/login", {
        username,
        password,
      });
      const userData = res.data;
      toast.success("Login Successfuly 😍");
      dispatch(setCredentials({ ...userData }));
      navigate("/");
    } catch (error) {
      toast.error("Login Error 😥");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="pl-[10rem] flex flex-wrap">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Log In</h1>

          <form onSubmit={handleLogin} className="container w-[29rem]">
            <div className="my-[2rem]">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-400"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {loading && <Loader />}
          </form>

          <div className="mt-4">
            <p>
              New Customer?{" "}
              <Link to="/register" className="text-pink-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
          alt=""
          className="h-[44rem] w-[59%] xl:block md:hidden sm:hidden rounded-lg"
        />
      </section>
    </div>
  );
}

export default Login;
