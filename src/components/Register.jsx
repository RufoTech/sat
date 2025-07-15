import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from './Firebase';

export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(true);
  const [error, setError] = useState('');
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const provider = new GoogleAuthProvider();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name.trim() || !surname.trim()) {
      setError('Zəhmət olmasa həm ad, həm soyad daxil edin.');
      setIsLoading(false);
      return;
    }

    if (!terms) {
      setError('Şərtləri qəbul etməlisiniz.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifrələr uyğun gəlmir.');
      setIsLoading(false);
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, {
        displayName: `${name.trim()} ${surname.trim()}`
      });
      setRedirectToHome(true);
    } catch (err) {
      let msg = err.message;
      switch (err.code) {
        case 'auth/email-already-in-use': 
          msg = 'Bu email artıq istifadə olunub.'; 
          break;
        case 'auth/weak-password': 
          msg = 'Şifrə çox zəifdir (ən az 6 simvol).'; 
          break;
        case 'auth/invalid-email': 
          msg = 'Düzgün email ünvanı daxil edin.'; 
          break;
        default: 
          break;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      const result = await signInWithPopup(auth, provider);
      // Google ilə girişdə avtomatik olaraq profil məlumatları doldurulur
      setRedirectToHome(true);
    } catch (error) {
      setError('Google ilə giriş uğursuz oldu. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setGoogleLoading(false);
    }
  };

  if (redirectToHome) return <Navigate to='/' replace />;

  return (
    <div className="w-[500px] max-w-full px-3 mx-auto mt-6 md:flex-0 shrink-0">
      <div className="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="p-6 mb-0 text-center bg-white border-b-0 rounded-t-2xl">
          <h5 className="text-xl font-bold">Qeydiyyat</h5>
        </div>
        <div className="flex flex-wrap px-3 -mx-3 sm:px-6 xl:px-12">
          <div className="w-full max-w-full px-1 mx-auto flex justify-center">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-gray-700 uppercase transition-all bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300"
            >
              {googleLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg viewBox="0 0 64 64" height="20" width="20">
                    <g fillRule="evenodd" fill="none" strokeWidth="1">
                      <path fill="#4285F4" d="M57.812,30.152 C57.812,27.726 57.616,25.957 57.19,24.121 L29.496,24.121 L29.496,35.067 L45.752,35.067 C45.424,37.788 43.654,41.884 39.721,44.637 L48.422,51.787 L49.029,51.848 C54.6,46.702 57.812,39.131 57.812,30.152 Z" />
                      <path fill="#34A853" d="M29.496,58.992 C37.46,58.992 44.146,56.37 49.029,51.848 L39.721,44.637 C37.231,46.374 33.888,47.587 29.496,47.587 C21.696,47.587 15.076,42.441 12.716,35.33 L3.265,42.405 L3.146,42.736 C7.997,52.372 17.96,58.992 29.496,58.992 Z" />
                      <path fill="#FBBC05" d="M12.716,35.33 C12.093,33.494 11.733,31.528 11.733,29.496 C11.733,27.464 12.093,25.498 12.683,23.662 L3.448,16.112 L3.146,16.255 C1.147,20.254 0,24.744 0,29.496 C0,34.248 1.147,38.738 3.146,42.736 L12.716,35.33 Z" />
                      <path fill="#EB4335" d="M29.496,11.405 C35.035,11.405 38.771,13.798 40.901,15.797 L49.226,7.669 C44.113,2.917 37.46,0 29.496,0 C17.96,0 7.997,6.62 3.146,16.255 L12.683,23.662 C15.076,16.551 21.696,11.405 29.496,11.405 Z" />
                    </g>
                  </svg>
                  Google İlə Dəvam Et
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="relative w-full px-3 mt-2 text-center shrink-0">
          <p className="inline px-4 mb-2 font-semibold bg-white text-sm text-slate-400">Və Ya</p>
        </div>
        <div className="flex-auto p-6">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="text-left">
            <div className="mb-4">
              <input
                aria-label="Name"
                placeholder="Ad"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-fuchsia-300 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <input
                aria-label="Surname"
                placeholder="Soyad"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                required
                className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-fuchsia-300 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <input
                aria-label="Email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-fuchsia-300 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <input
                aria-label="Password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-fuchsia-300 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <input
                aria-label="Confirm Password"
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-fuchsia-300 focus:outline-none"
              />
            </div>
            <div className="min-h-6 pl-7 mb-0.5 block">
              <input
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={e => setTerms(e.target.checked)}
                className="w-5 h-5 rounded after:opacity-0 checked:after:opacity-100 cursor-pointer border border-gray-200 bg-white"
              />
              <label htmlFor="terms" className="ml-1 text-sm text-gray-700 cursor-pointer"> Razıyam{' '}
                <a className="font-bold text-gray-700">Qaydalar və Şərtlərdən</a>
              </label>
            </div>
            <div className="text-center mt-6 mb-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 font-bold uppercase rounded-lg text-white bg-gradient-to-tl from-gray-900 to-slate-800 transition-all ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Qeydiyyatdan Keç'
                )}
              </button>
            </div>
            <p className="mt-4 mb-0 text-sm text-center">
              Hesabın Var?{' '}
              <Link to="/login" className="font-bold text-gray-700 hover:underline">
                Daxil Ol
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}