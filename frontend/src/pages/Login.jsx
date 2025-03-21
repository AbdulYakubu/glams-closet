import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import login from '../assets/assets/login.png'

const Login = () => {


    const {token, setToken, navigat} = useContext(ShopContext)
    const [currState, setCurrState] = useState('Sign Up')

  return (
      <div className='absolute top-0 left-0 h-full w-full z-50 bg-white'>
          {/*container */}
          <div className='flex h-full w-full'>
              {/*Image side */}
              <div className='w-1/2  sm:hidden sm:block'>
                  <img src={login} alt="login-img" className='object-cover h-full w-full' />
                  </div>
          {/*Form side*/}
          <div className='flex w-full sm:w-1/2 items-center justify-center text-[90%]'>
              <form className='flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5'>
                  <div className='w-full mb-4'>
                      <h3 className='bold-36'>{ currState}</h3>
                  </div>
                  {currState === "Sign Up" && (
                      <div className='w-full'>
                          <label htmlFor="name" className='medium-15'>Name</label>
                          <input
                              type="text"
                              placeholder='Name'
                              className='w-full px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-primary mt-1'
                              required
                          />
                      </div>
                  )}
                  <div className='w-full'>
                          <label htmlFor="email" className='medium-15'>Email</label>
                          <input
                              type="text"
                              placeholder='Email'
                              className='w-full px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-primary mt-1'
                              required
                          />
                  </div>
                  <div className='w-full'>
                          <label htmlFor="password" className='medium-15'>Password</label>
                          <input
                              type="text"
                              placeholder='Password'
                              className='w-full px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-primary mt-1'
                              required
                          />
                  </div>
                  <button  className='btn-dark w-full mt-5 !py-[8px] !rounded'>
                      {currState === 'Sign Up' ? 'Sign Up' : 'Login'}
                     
                      </button>
                       <div className='w-full flex flex-col gap-y-3'>
                          <div className='cursor-pointer underline medium-15'> Forgot your password?</div>
                          {currState === "Login" ? (
                              <div className='cursor-pointer underline medium-15'>
                                  Don't have an account?
                                  <span onClick={() => setCurrState('Sign Up')}
                                      className='cursor-pointer underline medium-15' 
                                  > Create account</span>
                              </div>
                          ) : ( 
                                  <div className='underline medium-15'> Already have an account?
                                      <span onClick={() => setCurrState('Login')}
                                          className='cursor-pointer'
                                      > Login</span>
                                  </div>
                          )}
                      </div>
              </form>
              </div>
              </div>
    </div>
  )
}

export default Login