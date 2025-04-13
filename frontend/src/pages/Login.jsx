import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import login from '../assets/assets/login.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [currState, setCurrState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if ((currState === 'Sign Up' && (!name || !email || !password)) ||
        (currState === 'Login' && (!email || !password))) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const endpoint = currState === 'Sign Up' ? 'register' : 'login';
      const payload = currState === 'Sign Up' ? { name, email, password } : { email, password };

      const response = await axios.post(`${backendUrl}/api/user/${endpoint}`, payload);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 py-8">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Form Side */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
          <form
            onSubmit={onSubmitHandler}
            className="w-full max-w-md space-y-5"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {currState}
            </h3>

            {currState === 'Sign Up' && (
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-600">Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter your name"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-600">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              {currState === 'Sign Up' ? 'Sign Up' : 'Login'}
            </button>

            <div className="text-sm text-gray-600 text-center">
              {currState === 'Login' ? (
                <>
                  Don’t have an account?{' '}
                  <span
                    onClick={() => setCurrState('Sign Up')}
                    className="text-blue-500 cursor-pointer underline"
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => setCurrState('Login')}
                    className="text-blue-500 cursor-pointer underline"
                  >
                    Login
                  </span>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Image Side */}
        <div className="w-full md:w-1/2 xs:hidden md:block">
          <img src={login} alt="login-img" className="object-cover w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;