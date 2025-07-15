import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, query, where, collection, limit, getDocs } from "firebase/firestore";
import { db, auth } from "./Firebase";
import { useCart } from "./CardContext";
import { useFavorites } from "./FavoriteContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from "firebase/auth";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [specsExpanded, setSpecsExpanded] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [user, setUser] = useState(null);
  
  const { addToCart, loading: cartLoading } = useCart();
  const { 
    favorites, 
    loading: favLoading, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useFavorites();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const formatted = {
            id: docSnap.id,
            ...data,
            imageUrls: data.imageUrls || [],
            price: parseFloat(data.price).toFixed(2),
            originalPrice: data.originalPrice ? parseFloat(data.originalPrice).toFixed(2) : null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          };
          setProduct(formatted);

          if (formatted.category) {
            fetchRelated(formatted.category, formatted.id);
          }
        } else {
          setError("Ürün bulunamadı");
        }
      } catch (err) {
        console.error("Ürün yüklenirken hata:", err);
        setError("Ürün yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (category, excludeId) => {
      try {
        const q = query(
          collection(db, "products"),
          where("category", "==", category),
          where("__name__", "!=", excludeId),
          limit(4)
        );
        const snap = await getDocs(q);
        setRelatedProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("İlgili ürünler yüklenirken hata:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product, quantity);
      toast.success(`${product.name} (${quantity} ədəd) səbətə əlavə edildi!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Xəta:", err);
      toast.error("Səbətə əlavə etmək üçün qeydiyyatdan keçin!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (!user) {
        toast.error("Favorilere eklemek için giriş yapmalısınız!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id);
        toast.info("Favorilerdən çıxarıldı", {
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
        toast.success("Favorilere əlavə edildi", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
      toast.error("Bir hata oluştu, lütfen tekrar deneyin", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(q => q - 1);

  const specifications = [
    { label: "Material", value: product?.caseMaterial || "N/A" },
    { label: "Ölçü(mm)", value: product?.caseSize || "N/A" },
    { label: "Qalınlıq(mm)", value: product?.caseThickness || "N/A" },
    { label: "Boynuzdan boynuza(mm)", value: product?.lugToLug || "N/A" },
    { label: "Lens", value: product?.lens || "N/A" },
    { label: "Tac növü", value: product?.crownType || "N/A" },
    { label: "Qayış", value: product?.band || "N/A" },
    { label: "Suya Dayanıqlılıq", value: product?.waterResistance || "N/A" },
    { label: "Qram (g)", value: product?.watchWeight || "N/A" },
    { label: "Garanti", value: product?.warranty || "2 Yıl" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Ürün bulunamadı!</p>
      </div>
    );
  }

  const imageUrls = product.imageUrls || [];
  const mainImage = imageUrls.length > 0 ? imageUrls[selectedImage] : "/placeholder.svg";
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      
      <nav className="px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm text-gray-600 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-1 sm:mx-2">/</span>
            <a href={`/category/${product.category}`} className="hover:text-blue-600">
              {product.category || "Ürünler"}
            </a>
            <span className="mx-1 sm:mx-2">/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Ürün Görselleri */}
          <div className="order-1">
            <div className="flex flex-col sm:flex-row lg:flex-row gap-4">
              {imageUrls.length > 1 && (
                <div className="flex sm:flex-col lg:flex-col gap-2 order-2 sm:order-1 lg:order-1 overflow-x-auto sm:overflow-visible">
                  {imageUrls.map((thumb, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                        selectedImage === index
                          ? "border-blue-500 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={thumb || "/placeholder.svg"}
                        alt={`Product view ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className={`flex-1 order-1 ${imageUrls.length > 1 ? 'sm:order-2 lg:order-2' : ''}`}>
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
                  {product.onSale && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                      {discountPercentage}% İNDİRİM
                    </div>
                  )}
                  <img
                    src={mainImage}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Rəng</h3>
              <p className="text-gray-700">{product.color || "Renk bilgisi yok"}</p>
            </div>
          </div>

          {/* Ürün Bilgileri */}
          <div className="order-2 space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.brand} {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₼{product.price}
                </p>
                {product.originalPrice && (
                  <p className="text-lg text-gray-500 line-through">₺{product.originalPrice}</p>
                )}
                {product.onSale && (
                  <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                    İNDİRİM
                  </span>
                )}
              </div>
              
           
            </div>

            <div className="border rounded-lg">
              <button
                onClick={() => setSpecsExpanded(!specsExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm sm:text-base">Texniki Parametrlər</span>
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-200 ${specsExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {specsExpanded && (
                <div className="px-4 pb-4 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  {specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="font-medium text-gray-700">{spec.label}:</span>
                      <span className="text-gray-600 sm:col-span-2">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock <= 0}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-base font-semibold transition-colors duration-200 ${
                  cartLoading ? 'opacity-75 cursor-not-allowed' : ''
                } ${
                  product.stock <= 0 ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''
                }`}
              >
                {product.stock <= 0 ? 'STOKTA YOK' : 
                 cartLoading ? 'ƏLAVƏ EDİLİR...' : 'Səbətə Əlavə Et'}
              </button>
              
              <button 
                onClick={handleToggleFavorite}
                disabled={favLoading}
                className={`p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                  favLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label={isFavorite(product.id) ? "Favorilerden çıkar" : "Favorilere ekle"}
              >
                <svg
                  className={`w-5 h-5 ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <div className="text-sm text-red-500">
                Son {product.stock} ürün kaldı!
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 sm:pt-4">
              <div className="text-center">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 mb-1 sm:mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Pulsuz Çatdırılma</p>
                <p className="text-xs text-gray-500">Bakı Daxili</p>
              </div>
              <div className="text-center">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 mb-1 sm:mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{product.warranty || "2 Yıl"}</p>
                <p className="text-xs text-gray-500">Garanti</p>
              </div>
              <div className="text-center">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 mb-1 sm:mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75A9.75 9.75 0 0112 2.25z"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">7/24</p>
                <p className="text-xs text-gray-500">Dəstək</p>
              </div>
              <div className="text-center">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400 mb-1 sm:mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Təhlükəsiz</p>
                <p className="text-xs text-gray-500">Alış Veriş</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benzer Ürünler */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((related) => (
                <div key={related.id} className="group">
                  <a href={`/product/${related.id}`} className="block">
                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                      <img
                        src={related.imageUrls[0] || "/placeholder.svg"}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {related.name}
                    </h3>
                    <p className="text-sm text-gray-600">₼{related.price}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}