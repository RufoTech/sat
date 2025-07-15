import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar() {
  const [qText, setQText] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "products"));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setAllProducts(list);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Dışarı tıklamada kapat
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (window.innerWidth >= 768) {
          setIsOpen(false);
        }
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Arama fonksiyonu
  const handleChange = (e) => {
    const text = e.target.value;
    setQText(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    const lower = text.toLowerCase();
    const filtered = allProducts.filter(item => {
      const name = item.name?.toLowerCase() || '';
      return name.includes(lower);
    });
    setResults(filtered);
  };

  // Büyük ekranlarda animasyonlu aç/kapa
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  };

  // Mobilde modal aç
  const openMobileModal = () => {
    if (window.innerWidth < 768) {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* Desktop Search (Icon + Animated Input) */}
      <div className="hidden md:flex items-center relative" ref={dropdownRef}>
        {isOpen ? (
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden transition-all duration-300">
            <input
              ref={inputRef}
              type="text"
              value={qText}
              onChange={handleChange}
              placeholder="Axtarış..."
              className="py-2 px-4 w-64 focus:outline-none"
            />
            <button 
              onClick={toggleSearch}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={toggleSearch}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <FiSearch size={24} />
          </button>
        )}

        {isOpen && results.length > 0 && (
          <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
            <ul className="max-h-80 overflow-y-auto">
              {results.map(item => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setQText("");
                    setResults([]);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={item.imageUrls?.[0] || "/placeholder-watch.jpg"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.price ? `${parseFloat(item.price).toFixed(2)} AZN` : 'Qiymət yoxdur'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Search (Modal) */}
      <div className="md:hidden" ref={dropdownRef}>
        <button 
          onClick={openMobileModal}
          className="p-2 text-gray-600 hover:text-blue-500"
        >
          <FiSearch size={24} />
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20 px-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl animate-fadeIn">
              <div className="flex items-center border-b p-4">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={qText}
                    onChange={handleChange}
                    placeholder="Məhsul axtar..."
                    className="w-full py-2 px-4 pr-10 focus:outline-none"
                  />
                  {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              {results.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {results.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                      onClick={() => {
                        navigate(`/product/${item.id}`);
                        setQText("");
                        setResults([]);
                        setIsOpen(false);
                      }}
                    >
                      <img
                        src={item.imageUrls?.[0] || "/placeholder-watch.jpg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.price ? `${parseFloat(item.price).toFixed(2)} AZN` : 'Qiymət yoxdur'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {qText ? "Nəticə tapılmadı" : "Axtarış edin"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Animasyon için CSS (tailwind.config.js'ye ekleyin) */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}