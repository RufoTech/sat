"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./Firebase";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "./CardContext";
import { useFavorites } from "./FavoriteContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ProductCards() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Belirttiğiniz ürün ID'leri
  const productIds = [
    "um0E51s5XdC3h36hAKOD",
    "RQeuohA5H5z5buJv8AIM",
    "lBOQLTqnGSszQMyQjt3a",
    "wYty1QygmnQjxE7A0CnV"
  ];

  // Context'ler
  const { addToCart, loading: cartLoading } = useCart();
  const { 
    favorites, 
    loading: favLoading, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useFavorites();

  // Firebase'den belirli ID'lere göre ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Ürünleri tek tek çekmek için
        const productsPromises = productIds.map(async (id) => {
          const docRef = doc(db, "products", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            return {
              id: docSnap.id,
              ...docSnap.data(),
              imageUrls: docSnap.data().imageUrls || [],
              price: parseFloat(docSnap.data().price).toFixed(2),
              originalPrice: docSnap.data().originalPrice ? 
                parseFloat(docSnap.data().originalPrice).toFixed(2) : null
            };
          }
          return null;
        });

        const productsData = (await Promise.all(productsPromises)).filter(Boolean);
        setProducts(productsData);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
        toast.error("Ürünler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} Səbətə Əlavə Olundu!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Hata:", err);
      toast.error("Səbətə Əlavə Etmək Üçün Giriş Edin!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleToggleWishlist = async (product) => {
    try {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id);
        toast.info("Favorilerden çıkarıldı", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrls: product.imageUrls,
          brand: product.brand
        });
        toast.success("Favorilere eklendi", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
      toast.error("Favorilere eklemek için giriş yapmalısınız!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Bu Həftənin Trend Məhsulları</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Sizin Üçün Xususi Seçilmiş Saatlar
          </p>
        </div>

        {/* Ürün Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Resim Container */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                  src={product.imageUrls[0] || "/placeholder.svg"}
                  alt={`${product.brand} ${product.name}`}
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Favori Butonu */}
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 ${
                    hoveredCard === product.id ? "opacity-100" : "opacity-0"
                  }`}
                  disabled={favLoading}
                >
                  <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'} transition-colors`} />
                </button>

                {/* İndirim Etiketi */}
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded">
                    İNDİRİM
                  </div>
                )}
              </div>

              {/* Ürün Bilgileri */}
              <div className="p-6 space-y-3">
                {/* Marka ve İsim */}
                <div className="space-y-1">
                  <h3 className="text-lg leading-tight">
                    <span className="italic text-gray-800 font-serif">{product.brand}</span>{" "}
                    <span className="font-normal">{product.name}</span>
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">{product.specifications || "Özel seçilmiş ürün"}</p>
                </div>

                {/* Fiyat */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-gray-900">₼{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₼{product.originalPrice}</span>
                  )}
                </div>

                {/* Sepete Ekle Butonu */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={cartLoading || product.stock <= 0}
                  className={`w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 font-medium tracking-wide transition-colors duration-300 flex items-center justify-center gap-2 ${
                    cartLoading ? 'opacity-75 cursor-not-allowed' : ''
                  } ${
                    product.stock <= 0 ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.stock <= 0 ? 'STOKTA YOK' : 
                   cartLoading ? 'EKLEMİYOR...' : 'Səbətə Əlavə Et'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Özellikler Bölümü */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Pulsuz Çatdırılma</h3>
            <p className="text-gray-600">Şəhər Daxili Pulsuz Çatdırılma</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">6 Ay Garanti</h3>
            <p className="text-gray-600">Tüm Məhsullar 6 Ay Garantilidir</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75A9.75 9.75 0 0112 2.25z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Texniki Dəstək</h3>
            <p className="text-gray-600">7/24 Saat Mütəxəssisləri Tərəfindən Dəstək</p>
          </div>
        </div>
      </div>
    </div>
  );
}