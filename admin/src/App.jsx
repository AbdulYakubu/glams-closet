import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Constants
export const backend_url = import.meta.env.VITE_BACKEND_URL;
export const currency = "₵";
const AUTH_TOKEN_KEY = "auth_token";

const App = () => {
  const [token, setToken] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      navigate("/");
    }
  }, [token, hasMounted, navigate]);

  const handleLogout = () => {
    setToken("");
  };

  return (
    <main className="min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div className="bg-[#c1e8ef36] text-[#404040]">
          <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row">
            <Sidebar onLogout={handleLogout} />

            <Routes>
              <Route element={<ProtectedRoute token={token} />}>
                <Route path="/" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Route>
            </Routes>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;