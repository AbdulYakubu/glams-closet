
import React from "react";

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, label: "", color: "bg-gray-200" };
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        return { score: 25, label: "Weak", color: "bg-red-500" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-yellow-500" };
      case 3:
        return { score: 75, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 100, label: "Strong", color: "bg-green-500" };
      default:
        return { score: 0, label: "", color: "bg-gray-200" };
    }
  };

  const { score, label, color } = getStrength(password);

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">
        Password Strength: <span className={`font-semibold ${color.replace("bg-", "text-")}`}>{label}</span>
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;