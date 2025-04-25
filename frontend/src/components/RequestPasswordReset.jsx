
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const RequestPasswordReset = () => {
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/request-password-reset`, { email });
      if (response.data.success) {
        toast.success("Password reset email sent");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-fade-in">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Request Password Reset</h3>
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Password reset request form">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              className={`w-full mt-1 px-4 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              required
              aria-invalid={!!error}
              aria-describedby={error ? "email-error" : undefined}
            />
            {error && (
              <p id="email-error" className="text-red-500 text-xs mt-1">
                {error}
              </p>
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
            {isLoading ? "Sending..." : "Send Reset Email"}
          </button>
          <div className="text-sm text-gray-600 text-center">
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer underline hover:text-blue-700"
            >
              Back to Login
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordReset;