// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import NavbarComponent from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import LuxuryProductShowcase from './components/Products';
import Component from './components/Product';
import Form from './components/Login';

// ➊ Firebase auth importları
import { auth } from './components/Firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  // ➋ user state
  const [user, setUser] = useState(null);

  // ➌ Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      {/* ➍ Navbar-a user prop-u ver */}
      <NavbarComponent user={user} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/brands' element={<LuxuryProductShowcase />} />
        <Route path='/productdetails' element={<Component />} />
        <Route path='/login' element={<Form />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
