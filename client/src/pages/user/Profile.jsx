import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { makeRequest } from "../../requestMethod";
import { setCredentials } from "../../redux/authSlice";

// bcrypt Password Before Sending to API
import bcrypt from "bcryptjs";

function Profile() {
  const [loading, setLoading] = useState(false);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // hash password before sending to api
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, parseInt(salt));

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
    setPassword(userInfo?.password);
  }, [userInfo.email, userInfo.username, userInfo?.password]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      return toast.warning("Fill All This Fields Please 😍");
    }
    if (password.length < 6) {
      return toast.error("Password less than 6 Items 🙄");
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await makeRequest.put(`/user/update/${userInfo._id}`, {
        username,
        email,
        password: hashedPassword,
      });
      const userData = res.data;
      toast.success("User Updated Successfuly 😍🤗");
      dispatch(setCredentials({ ...userData }));
      localStorage.setItem("userInfo", JSON.stringify(userData));
      navigate(`/profile/${userInfo._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Update Profile
          </h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block mb-2 text-gray-500">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                className="form-input p-2 border rounded-sm w-full text-gray-400"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-500">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-input p-2 border rounded-sm w-full text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-500">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-input p-2 border rounded-sm w-full text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                disabled={loading}
                onClick={handleUpdateProfile}
              >
                Update
              </button>

              {userInfo && (
                <Link
                  to="/user-orders"
                  className="bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-700"
                >
                  My Orders
                </Link>
              )}
            </div>

            {loading && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
