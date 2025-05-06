import React, { useContext, useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const Login = () => {
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [showPassword, setShowPassword] = useState(false);
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  if (!setToken || !backendUrl || !navigate) {
    console.error("ShopContext is not properly provided");
    return <div>Error: Application context is missing</div>;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
          error.config._retry = true;
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            toast.error("Session expired. Please login again.");
            setToken("");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            navigate("/login");
            return Promise.reject(error);
          }
          try {
            const response = await axios.post(`${backendUrl}/api/user/refresh-token`, { refreshToken });
            if (response.data.success) {
              const { token, refreshToken: newRefreshToken } = response.data;
              setToken(token);
              localStorage.setItem("token", token);
              localStorage.setItem("refreshToken", newRefreshToken);
              error.config.headers["Authorization"] = `Bearer ${token}`;
              return axios(error.config);
            }
            throw new Error("Token refresh failed");
          } catch (refreshError) {
            toast.error("Session expired. Please login again.");
            setToken("");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            navigate("/login");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [backendUrl, navigate, setToken]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (currentState === "Sign Up") {
      if (!firstName) newErrors.firstName = "First name is required";
      if (!lastName) newErrors.lastName = "Last name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApiError = (error) => {
    const message = error.response?.data?.message || "An error occurred";
    const errorMap = {
      "not registered": { email: "User not registered. Please sign up." },
      "Invalid password": { password: "Incorrect password." },
      "Not an admin": { email: "This account is not an admin." },
      "already exists": { email: "Email already registered." },
    };
    const matchedError = Object.keys(errorMap).find((key) => message.includes(key));
    setErrors(matchedError ? errorMap[matchedError] : { general: message });
    toast.error(message);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      let payload;
      let endpoint;

      if (currentState === "Sign Up") {
        payload = { firstName, lastName, email, password };
        endpoint = "register";
      } else if (currentState === "Admin Login") {
        payload = { email, password };
        endpoint = "admin";
      } else {
        payload = { email, password };
        endpoint = "login";
      }

      const response = await axios.post(`${backendUrl}/api/user/${endpoint}`, payload);
      if (response.data.success) {
        const { token, refreshToken } = response.data;
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken || "");
        toast.success(`${currentState} successful`);
        navigate(currentState === "Admin Login" ? "/admin" : "/");
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateChange = (newState) => {
    setCurrentState(newState);
    setErrors({});
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{currentState}</h2>
          </div>
          
          <form onSubmit={onSubmitHandler} className="mt-6 space-y-4" role="form">
            {currentState === "Sign Up" && (
              <>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`pl-10 mt-1 p-2 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter first name"
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    />
                  </div>
                  {errors.firstName && (
                    <p id="firstName-error" className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`pl-10 mt-1 p-2 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter last name"
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    />
                  </div>
                  {errors.lastName && (
                    <p id="lastName-error" className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 mt-1 p-2 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email"
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={`pl-10 mt-1 p-2 w-full border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter password"
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <FiEye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {passwordFocused && currentState === "Sign Up" && (
                <PasswordStrengthMeter password={password} />
              )}
              {errors.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            
            {errors.general && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                currentState
              )}
            </button>
          </form>
          
          <div className="mt-6 space-y-3 text-center text-sm">
            {currentState === "Login" && (
              <>
                <p>
                  <Link
                    to="/request-password"
                    className="text-blue-600 hover:underline hover:text-blue-800"
                  >
                    Forgot your password?
                  </Link>
                </p>
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => handleStateChange("Sign Up")}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign Up
                  </button>
                </p>
              </>
            )}
            
            {currentState === "Sign Up" && (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => handleStateChange("Login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </button>
              </p>
            )}
            
            {currentState === "Admin Login" && (
              <p>
                Not an admin?{" "}
                <button
                  onClick={() => handleStateChange("Login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  User Login
                </button>
              </p>
            )}
            
            {currentState !== "Admin Login" && (
              <p>
                Are you an admin?{" "}
                <button
                  onClick={() => handleStateChange("Admin Login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Admin Login
                </button>
              </p>
            )}
          </div>
        </div>
        
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-8">
          <div className="text-center text-white">
            <img 
              src="/assets/login-illustration.svg" 
              alt="Login illustration" 
              className="w-64 h-64 mx-auto mb-6" 
            />
            <h3 className="text-2xl font-bold mb-2">Welcome Back!</h3>
            <p className="opacity-90">
              {currentState === "Sign Up"
                ? "Join our community and start your journey with us."
                : "Please login to access your account and continue shopping."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;