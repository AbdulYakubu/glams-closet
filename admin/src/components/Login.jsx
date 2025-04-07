
import React, { useState } from 'react';
import login from '../assets/login_img.png';
import { backend_url } from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({setToken}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Sending:", { email, password }); 
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${backend_url}/api/user/admin`, { email, password });
      if (response.data.success) {
        setToken(response.data.token); // Assuming the token is in the response
        navigate('/');
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      const message = error.response?.data?.message || 
                    error.message || 
                    "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='absolute top-0 left-0 h-full w-full z-50 bg-white'>
      <div className='flex h-full w-full'>
        {/* Image side */}
        <div className='w-1/2 hidden sm:block'>
          <img src={login} alt="login-img" className='object-cover h-full w-full' />
        </div>
        {/* Form side */}
        <div className='flex w-full sm:w-1/2 items-center justify-center'>
          <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5'>
            <div className='w-full mb-4'>
              <h3 className='bold-36'>Login</h3>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className='w-full'>
                <label htmlFor="email" className='medium-15'>Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder='Email'
                  required
                  className='w-full px-3 py-1.5 ring-slate-900/10 bg-[#c1e8ef36] mt-1'
                />
              </div>
              <div className='w-full'>
                <label htmlFor="password" className='medium-15'>Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  placeholder='Password'
                  required
                  className='w-full px-3 py-1.5 ring-slate-900/10 bg-[#c1e8ef36] mt-1'
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='btn-dark w-full mt-5 !py-[9px]'
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;