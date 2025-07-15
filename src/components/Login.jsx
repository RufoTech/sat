import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, provider } from './Firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

const Login = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError('Email yaxud şifrə səhfdir');
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email və şifrə tələb olunur');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError('Email yaxud şifrə səhfdir');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError('Xəta baş verdi');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    
    if (!resetEmail) {
      setResetError('Email ünvanı daxil edin');
      return;
    }

    try {
      setResetLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Şifrə sıfırlama linki email ünvanınıza göndərildi(Link gəlməz isə spam qutusuna baxmağı unutmayın)!');
      setTimeout(() => {
        setShowResetModal(false);
        setResetMessage('');
      }, 3000);
    } catch (error) {
      setResetError('Xəta baş verdi: ' + error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <form
        onSubmit={loginWithEmail}
        className="bg-white p-8 w-[450px] rounded-2xl flex flex-col gap-4 font-sans"
      >
        {user ? (
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
          <>
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Emailinizi daxil edin"
                className="ml-3 flex-1 outline-none"
                required
              />
            </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrənizi Daxil Edin"
                className="ml-3 flex-1 outline-none"
                required
              />
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 576 512"
              >
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
              </svg>
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-2">{error}</div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Məni Xatırla
              </label>
              <button 
                type="button" 
                onClick={() => setShowResetModal(true)}
                className="text-blue-500 hover:underline"
              >
                Şifrəmi Unutdum?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Loading...' : 'Daxil Ol'}
            </button>

            <p className="text-center text-sm">
             Hesabınız Yoxdur?{' '}
              <Link to="/register">
                <button type="button" className="text-blue-500 font-medium">
                  Qeydiyyatdan Keçin
                </button>
              </Link>
            </p>

            <p className="text-center text-sm text-gray-500">Və ya Google ilə daxil ol</p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-lg hover:border-blue-500 transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
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
            </div>
          </>
        )}
      </form>

      {/* Şifrə Sıfırlama Modalı */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Şifrəni Sıfırla</h3>
              <button 
                onClick={() => {
                  setShowResetModal(false);
                  setResetError('');
                  setResetMessage('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            {resetMessage ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {resetMessage}
              </div>
            ) : (
              <>
                <p className="mb-4">Şifrə sıfırlama linki almaq üçün email ünvanınızı daxil edin.</p>
                
                {resetError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {resetError}
                  </div>
                )}
                
                <form onSubmit={handleResetPassword}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email Ünvanı</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Ləğv et
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                        resetLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {resetLoading ? 'Göndərilir...' : 'Göndər'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;