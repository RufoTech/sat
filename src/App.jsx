import { useState, useEffect } from 'react';
import './App.css';
import NavbarComponent from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import LuxuryProductShowcase from './components/Products';
import Component from './components/Product';
import Form from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';

// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Firebase auth
import { auth } from './components/Firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Context Providers
import { CartProvider } from './components/CardContext';
import { FavoritesProvider } from './components/FavoriteContext';
import CheckoutPage from './components/CheckoutPage';
import ThankYouPage from './components/Thankyou';
import ScrollToTop from './components/ScrollTop';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    // Önce Favorites, sonra Cart veya tersini tercih edebilirsiniz
    <FavoritesProvider>
      <CartProvider>
        <BrowserRouter>
        <ScrollToTop/>
          <NavbarComponent user={user} />

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/brands' element={<LuxuryProductShowcase />} />
            <Route path='/products/:id' element={<Component />} />
            <Route path='/login' element={<Form />} />

            <Route path='/register' element={<Register />} />
            <Route path='/adminpanel' element={<AdminPanel />} />
            <Route path='/cart' element={<CheckoutPage/>} />
            <Route path='/thank-you' element={<ThankYouPage/>} />
          </Routes>

          <Footer />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;
