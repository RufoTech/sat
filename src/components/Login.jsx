// src/components/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from './Firebase'; // Yolunuza görə düzəldin
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const Login = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Auth status dinləyicisi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        navigate('/'); // Əgər artıq login varsa, ana səhifəyə yönləndir
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Google ilə login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate('/'); // login sonrası ana səhifə
    } catch (error) {
      console.error('Giriş zamanı xəta:', error);
    }
  };

  // Çıxış
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login'); // çıxış sonrası login səhifəsi
    } catch (error) {
      console.error('Çıxış zamanı xəta:', error);
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <form
        onSubmit={e => e.preventDefault()}
        className="bg-white p-8 w-[450px] rounded-2xl flex flex-col gap-4 font-sans"
      >
        {user ? (
          // Əgər login varsa
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">
              Salam, {user.displayName} 👋
            </h2>
            <img
              src={user.photoURL}
              alt="Profil şəkli"
              className="w-24 h-24 rounded-full"
            />
            <p className="text-gray-700">{user.email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Çıxış et
            </button>
          </div>
        ) : (
          // Hələ login olunmayıbsa
          <>
            {/* Email Field */}
            <label className="font-semibold text-gray-800">Email</label>
            <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
              </svg>
              <input
                type="text"
                placeholder="Enter your Email"
                className="ml-3 flex-1 outline-none"
              />
            </div>

            {/* Password Field */}
            <label className="font-semibold text-gray-800">Password</label>
            <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="-64 0 512 512"
              >
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
              </svg>
              <input
                type="password"
                placeholder="Enter your Password"
                className="ml-3 flex-1 outline-none"
              />
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 576 512"
              >
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
              </svg>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              <button type="button" className="text-blue-500">
                Forgot password?
              </button>
            </div>

            {/* Sign In */}
            <button className="mt-4 w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              Sign In
            </button>

            <p className="text-center text-sm">
              Don't have an account?{' '}
              <button type="button" className="text-blue-500 font-medium">
                Sign Up
              </button>
            </p>

            <p className="text-center text-sm text-gray-500">Or With</p>

            {/* Social Buttons */}
            <div className="flex flex-col gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-lg hover:border-blue-500 transition"
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FBBB00"
                    d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z"
                  />
                  <path
                    fill="#518EF8"
                    d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176Z"
                  />
                  <path
                    fill="#28B446"
                    d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624Z"
                  />
                  <path
                    fill="#F14336"
                    d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0c62.115,0,119.068,22.126,163.404,58.936Z"
                  />
                </svg>
                Google
              </button>

              {/* Apple */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-lg hover:border-blue-500 transition"
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 22.773 22.773"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0Z" />
                  <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716Z" />
                </svg>
                Apple
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
