import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import the icons

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();

  console.log("id", id + " token", token);

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Password cannot be empty");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    axios.defaults.withCredentials = true;
    try {
      const res = await axios.post(`http://localhost:3000/api/users/reset-password/${id}/${token}`, {
        password,
      })
      if (res.data.status === "Success") {
        toast.success("Password updated successfully");
        navigate("/login");
      } else {
        if (res.data.message === "Invalid token") {
          toast.error("Invalid token");
        } else {
          console.log(res.data);
          toast.success("Password updated successfully");
          navigate("/login");
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="w-full md:w-2/4 xl:w-1/3 p-6 sm:p-8 rounded-lg flex flex-col  shadow-[0px_0px_6px_rgb(0,0,0,0.1)]">
      <h2 className="text-3xl font-medium text-center "> Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium text-black dark:text-gray-200">
            New Password
          </label>
          <div className="relative"> {/* Wrap the input and the icon in a div */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter a new password"
              name="password"
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-primaryColor focus:border-primaryColor"
              onChange={(e) => setPassword(e.target.value) || setError("")}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2" // Position the button
            >
              {showPassword ? <FiEyeOff /> : <FiEye />} {/* Use the icons */}
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <p className="mt-2 ">
        Remember your password?
        <Link to="/login" className="text-primaryColor space-x-5 px-1">
          Login
        </Link>
      </p>
        <button
          type="submit"
          className="mt-6 w-full bg-primaryColor bg-opacity-90 hover:bg-opacity-100 px-4 py-3 text-sm flex items-center justify-center rounded-xl text-white duration-100 "
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;