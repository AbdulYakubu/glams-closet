import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    //console.log("Login component mounted, token:", token, "backendUrl:", backendUrl);
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
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            {/*console.log("Attempting to refresh token:", refreshToken);*/ }
            if (!refreshToken) {
              //console.log("No refresh token found");
              toast.error("Session expired. Please login again.");
              setToken("");
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              navigate("/login");
              return Promise.reject(error);
            }
            const response = await axios.post(`${backendUrl}/api/user/refresh-token`, { refreshToken });
            if (response.data.success) {
              const { token, refreshToken: newRefreshToken } = response.data;
              {/*console.log("Refresh successful, new token:", token);*/ }
              setToken(token);
              localStorage.setItem("token", token);
              localStorage.setItem("refreshToken", newRefreshToken);
              error.config.headers["Authorization"] = `Bearer ${token}`;
              return axios(error.config);
            }
          } catch (refreshError) {
            {/*console.error("Refresh token error:", refreshError);*/ }
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

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErrors({});

    try {
      let payload;
      let endpoint;

      if (currentState === "Sign Up") {
        if (!firstName || !lastName) {
          setErrors({ firstName: !firstName ? "First name is required" : "", lastName: !lastName ? "Last name is required" : "" });
          return;
        }
        payload = { firstName, lastName, email, password };
        endpoint = "register";
      } else if (currentState === "Admin Login") {
        payload = { email, password };
        endpoint = "admin";
      } else {
        payload = { email, password };
        endpoint = "login";
      }

      {/*console.log("Submitting to:", `${backendUrl}/api/user/${endpoint}`, "Payload:", { email, password: "****" });*/ }
      const response = await axios.post(`${backendUrl}/api/user/${endpoint}`, payload);
      {/*console.log("API response:", response.data);*/ }
      if (response.data.success) {
        const { token, refreshToken } = response.data;
        {/*console.log("Operation successful, token:", token, "refreshToken:", refreshToken);*/ }
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken || "");
        toast.success(`${currentState} successful`);
        navigate(currentState === "Admin Login" ? "/admin" : "/");
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("API error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      const message = error.response?.data?.message || "An error occurred";
      toast.error(message);
      if (message.includes("not registered")) {
        setErrors({ email: "User not registered. Please sign up." });
      } else if (message.includes("Invalid password")) {
        setErrors({ password: "Incorrect password." });
      } else if (message.includes("Not an admin")) {
        setErrors({ email: "This account is not an admin." });
      } else if (message.includes("already exists")) {
        setErrors({ email: "Email already registered." });
      } else {
        setErrors({ general: message });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center">{currentState}</h2>
          <form onSubmit={onSubmitHandler} className="mt-6">
            {currentState === "Sign Up" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`mt-1 p-2 w-full border rounded-md ${errors.firstName ? "border-red-500" : ""}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`mt-1 p-2 w-full border rounded-md ${errors.lastName ? "border-red-500" : ""}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 p-2 w-full border rounded-md ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 p-2 w-full border rounded-md ${errors.password ? "border-red-500" : ""}`}
                placeholder="Enter password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            {errors.general && <p className="text-red-500 text-xs mb-4">{errors.general}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
              {currentState}
            </button>
          </form>
          {currentState === "Login" && (
            <p className="mt-4 text-center text-sm">
              Forgot your password?{" "}
              <Link to="/request-password-reset" className="text-blue-600 hover:underline">
                Reset it here
              </Link>
            </p>
          )}
          <div className="mt-4 text-center text-sm">
            {currentState === "Login" ? (
              <p>
                Don't have an account?{" "}
                <span onClick={() => setCurrentState("Sign Up")} className="text-blue-600 cursor-pointer hover:underline">
                  Sign Up
                </span>
              </p>
            ) : currentState === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <span onClick={() => setCurrentState("Login")} className="text-blue-600 cursor-pointer hover:underline">
                  Login
                </span>
              </p>
            ) : (
              <p>
                Not an admin?{" "}
                <span onClick={() => setCurrentState("Login")} className="text-blue-600 cursor-pointer hover:underline">
                  User Login
                </span>
              </p>
            )}
            {currentState !== "Admin Login" && (
              <p>
                Are you an admin?{" "}
                <span onClick={() => setCurrentState("Admin Login")} className="text-blue-600 cursor-pointer hover:underline">
                  Admin Login
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="hidden md:block w-1/2">
          <img src="/assets/login.png" alt="Login illustration" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;