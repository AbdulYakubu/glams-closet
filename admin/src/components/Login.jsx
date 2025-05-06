import React, { useState, useEffect } from "react";
import login from "../assets/login_img.png";
import axiosInstance from "../axiosInstance"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { TbLoader } from "react-icons/tb";

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();

  // Auto-focus email input on mount
  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) emailInput.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      onSubmitHandler(e);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(`/api/user/admin`, formData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("auth_token", token);
        setToken(token);
        toast.success(`Welcome back, ${user.name || 'Admin'}!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });
        navigate("/"); // Consider redirecting to dashboard instead of home
      } else {
        throw new Error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     `Server error: ${error.response.status}`;
        // Specific error messages for common cases
        if (error.response.status === 401) {
          errorMessage = "Invalid credentials. Please try again.";
        } else if (error.response.status === 403) {
          errorMessage = "Access denied. You don't have admin privileges.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col sm:flex-row">
      {/* Left Panel - Image */}
      <div className="hidden sm:block sm:w-1/2 bg-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-800 opacity-20"></div>
        <img
          src={login}
          alt="Admin portal illustration"
          className="object-cover h-full w-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://source.unsplash.com/random/800x600/?admin,security";
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-2xl font-bold text-white">Admin Portal</h3>
          <p className="text-gray-200 mt-2">
            Secure access to your administration dashboard
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full sm:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10 transition-all duration-300 hover:shadow-xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <FiLock className="text-indigo-600 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 mt-2">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start">
              <svg
                className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 transition-all duration-200 ${
                  isFocused.email ? "text-indigo-600" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail
                    className={`transition-colors duration-200 ${
                      isFocused.email ? "text-indigo-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  onKeyDown={handleKeyDown}
                  placeholder="admin@example.com"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1 transition-all duration-200 ${
                  isFocused.password ? "text-indigo-600" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock
                    className={`transition-colors duration-200 ${
                      isFocused.password ? "text-indigo-500" : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  required
                  minLength="6"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff
                      className={`text-lg ${
                        isFocused.password ? "text-indigo-500" : "text-gray-400"
                      } hover:text-gray-600 transition-colors`}
                    />
                  ) : (
                    <FiEye
                      className={`text-lg ${
                        isFocused.password ? "text-indigo-500" : "text-gray-400"
                      } hover:text-gray-600 transition-colors`}
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md"
                }`}
              >
                {loading ? (
                  <>
                    <TbLoader className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in <FiArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Need help?{" "}
              <a
                href="mailto:support@example.com"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;