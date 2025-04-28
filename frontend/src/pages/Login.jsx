import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import login from "../assets/assets/login.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

const Login = () => {
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [currState, setCurrState] = useState("Sign Up");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (currState === "Sign Up" && !isAdminLogin) {
      if (!firstName) newErrors.firstName = "First name is required";
      if (!lastName) newErrors.lastName = "Last name is required";
      if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
      else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
    switch (field) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const endpoint = isAdminLogin ? "admin" : currState === "Sign Up" ? "register" : "login";
      const payload =
        currState === "Sign Up" && !isAdminLogin
          ? { firstName, lastName, email, password }
          : { email, password };

      const response = await axios.post(`${backendUrl}/api/user/${endpoint}`, payload);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        if (rememberMe) localStorage.setItem("rememberMe", "true");
        toast.success(`Welcome ${currState === "Sign Up" ? "aboard" : "back"}!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "An error occurred";
      toast.error(message);
      if (message.includes("not registered")) setErrors({ email: message });
      if (message.includes("Invalid credentials")) setErrors({ password: message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate(isAdminLogin ? "/admin" : "/");
  }, [token, isAdminLogin, navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && error.response?.data?.message === "Token expired") {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await axios.post(`${backendUrl}/api/user/refresh-token`, {
              refreshToken,
            });
            if (response.data.success) {
              setToken(response.data.token);
              localStorage.setItem("token", response.data.token);
              error.config.headers.Authorization = `Bearer ${response.data.token}`;
              return axios(error.config);
            }
          } catch (refreshError) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("rememberMe");
            setToken(null);
            navigate("/login");
            toast.error("Session expired, please login again");
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [backendUrl, navigate, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300">
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
          <form
            onSubmit={onSubmitHandler}
            className="w-full max-w-md space-y-6 animate-fade-in"
            aria-label="Login or Sign Up form"
          >
            <h3
              className={`text-2xl sm:text-3xl font-bold ${
                isAdminLogin ? "text-red-600" : "text-gray-800"
              } mb-2`}
            >
              {isAdminLogin ? "Admin Login" : currState}
            </h3>

            {currState === "Sign Up" && !isAdminLogin && (
              <>
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-600">
                    First Name
                  </label>
                  <input
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    value={firstName}
                    type="text"
                    placeholder="Enter your first name"
                    className={`w-full mt-1 px-4 py-2 border ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    required
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-600">
                    Last Name
                  </label>
                  <input
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    value={lastName}
                    type="text"
                    placeholder="Enter your last name"
                    className={`w-full mt-1 px-4 py-2 border ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    required
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                onChange={(e) => handleInputChange("email", e.target.value)}
                value={email}
                type="email"
                placeholder="Enter your email"
                className={`w-full mt-1 px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                onChange={(e) => handleInputChange("password", e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full mt-1 px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {(currState === "Sign Up" || currState === "Login") && !isAdminLogin && (
              <PasswordStrengthMeter password={password} />
            )}

            {currState === "Sign Up" && !isAdminLogin && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  value={confirmPassword}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`w-full mt-1 px-4 py-2 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                  required
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAdminLogin}
                  onChange={() => {
                    setIsAdminLogin(!isAdminLogin);
                    setCurrState(isAdminLogin ? "Sign Up" : "Login");
                  }}
                  className="mr-2"
                  id="adminLogin"
                />
                <label htmlFor="adminLogin" className="text-sm text-gray-600">
                  Admin Login
                </label>
              </div>
              {!isAdminLogin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2"
                    id="rememberMe"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Remember Me
                  </label>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:bg-gray-500 flex items-center justify-center ${
                isLoading ? "cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : null}
              {isLoading
                ? "Processing..."
                : isAdminLogin
                ? "Admin Login"
                : currState === "Sign Up"
                ? "Sign Up"
                : "Login"}
            </button>

            {!isAdminLogin && (
              <div className="text-sm text-gray-600 text-center space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                    onClick={() => toast.info("Google OAuth coming soon!")}
                  >
                    <FaGoogle /> <span>Google</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                    onClick={() => toast.info("GitHub OAuth coming soon!")}
                  >
                    <FaGithub /> <span>GitHub</span>
                  </button>
                </div>
                {currState === "Login" ? (
                  <p>
                    Don’t have an account?{" "}
                    <span
                      onClick={() => setCurrState("Sign Up")}
                      className="text-blue-500 cursor-pointer underline hover:text-blue-700"
                    >
                      Sign Up
                    </span>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <span
                      onClick={() => setCurrState("Login")}
                      className="text-blue-500 cursor-pointer underline hover:text-blue-700"
                    >
                      Login
                    </span>
                  </p>
                )}
                <p>
                  <span
                    onClick={() => navigate("/request-password-reset")}
                    className="text-blue-500 cursor-pointer underline hover:text-blue-700"
                  >
                    Forgot Password?
                  </span>
                </p>
              </div>
            )}
          </form>
        </div>

        <div className="w-full md:w-1/2 xs:hidden md:block">
          <img src={login} alt="Login illustration" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;