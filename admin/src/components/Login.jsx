import React, { useState } from "react";
import login from "../assets/login_img.png";
import axiosInstance from "../axiosInstance"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { TbLoader } from "react-icons/tb";

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `/api/user/admin`;
      console.log("Login Request - URL:", url);
      console.log("Login Request - Payload:", formData);

      const response = await axiosInstance.post(url, formData, {
        timeout: 10000,
      });

      console.log("Login Response:", response.data);

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("auth_token", token);
        setToken(token);
        toast.success(`Welcome back, ${user.name}!`);
        navigate("/");
      } else {
        throw new Error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error("Login Error:", error.response.data);
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
        console.error("Login Error:", error.message);
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row">
      <div className="hidden sm:block sm:w-1/2 bg-indigo-600">
        <img
          src={login}
          alt="Login illustration"
          className="object-cover h-full w-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://source.unsplash.com/random/800x600/?login";
          }}
        />
      </div>

      <div className="w-full sm:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Please enter your credentials</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmitHandler} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength="6"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? (
                  <>
                    <TbLoader className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Don't have an account?{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Contact admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;