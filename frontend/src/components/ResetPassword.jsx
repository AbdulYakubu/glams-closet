
import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!newPassword) newErrors.newPassword = "New password is required";
    else if (newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
        token,
        newPassword,
      });
      if (response.data.success) {
        toast.success("Password reset successful");
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
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h3>
        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Reset password form">
          <div className="relative">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className={`w-full mt-1 px-4 py-2 border ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              } rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
              required
              aria-invalid={!!errors.newPassword}
              aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.newPassword && (
              <p id="newPassword-error" className="text-red-500 text-xs mt-1">
                {errors.newPassword}
              </p>
            )}
          </div>
          <PasswordStrengthMeter password={newPassword} />
          <div className="relative">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
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
            {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
