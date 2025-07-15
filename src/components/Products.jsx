"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Heart, ShoppingBag, Filter } from "lucide-react";
import { collection, getDocs, limit, query, startAfter, orderBy } from "firebase/firestore";
import { db } from "./Firebase";
import { Link } from "react-router-dom";
import { useCart } from "./CardContext";
import { useFavorites } from "./FavoriteContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function LuxuryProductShowcase() {
  const [filters, setFilters] = useState({
    brands: [],
    gender: [],
    colors: [],
    priceRange: [0, 1000],
  });
  const [sortBy, setSortBy] = useState("featured");
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    gender: true,
    color: true,
  });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Context'leri kullan
  const { addToCart, loading: cartLoading } = useCart();
  const { 
    favorites, 
    loading: favLoading, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useFavorites();

  // Firebase'den ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let q;
        if (sortBy === "newest") {
          q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(itemsPerPage));
        } else if (sortBy === "price-low") {
          q = query(collection(db, "products"), orderBy("price", "asc"), limit(itemsPerPage));
        } else if (sortBy === "price-high") {
          q = query(collection(db, "products"), orderBy("price", "desc"), limit(itemsPerPage));
        } else {
          q = query(collection(db, "products"), limit(itemsPerPage));
        }

        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imageUrls: doc.data().imageUrls || [],
          price: parseFloat(doc.data().price).toFixed(2),
          originalPrice: doc.data().originalPrice ? parseFloat(doc.data().originalPrice).toFixed(2) : null,
        }));

        setProducts(productsData);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(productsData.length === itemsPerPage);
        
        // Toplam ürün sayısını al (filtreleme için)
        const countQuery = await getDocs(collection(db, "products"));
        setTotalProducts(countQuery.size);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortBy]);

  // Sayfa değişikliğinde ürünleri yükle
  const loadMoreProducts = async () => {
    try {
      setLoading(true);
      let q;
      if (sortBy === "newest") {
        q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      } else if (sortBy === "price-low") {
        q = query(
          collection(db, "products"),
          orderBy("price", "asc"),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      } else if (sortBy === "price-high") {
        q = query(
          collection(db, "products"),
          orderBy("price", "desc"),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      } else {
        q = query(
          collection(db, "products"),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      }

      const querySnapshot = await getDocs(q);
      const newProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        imageUrls: doc.data().imageUrls || [],
        price: parseFloat(doc.data().price).toFixed(2),
        originalPrice: doc.data().originalPrice ? parseFloat(doc.data().originalPrice).toFixed(2) : null,
      }));

      setProducts(prev => [...prev, ...newProducts]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(newProducts.length === itemsPerPage);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Daha fazla ürün yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: "featured", label: "Öne Çıkanlar" },
    { value: "price-low", label: "Fiyat: Düşükten Yükseğe" },
    { value: "price-high", label: "Fiyat: Yüksekten Düşüğe" },
    { value: "name", label: "İsim: A'dan Z'ye" },
    { value: "newest", label: "Yeniler" },
  ];

  // Mevcut filtre seçeneklerini dinamik olarak oluştur
  const availableBrands = [...new Set(products.map((p) => p.brand))];
  const availableGenders = [...new Set(products.map((p) => p.gender))];
  const availableColors = [...new Set(products.map((p) => p.color))];

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const brandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const genderMatch = filters.gender.length === 0 || filters.gender.includes(product.gender);
      const colorMatch = filters.colors.length === 0 || filters.colors.includes(product.color);
      const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      return brandMatch && genderMatch && colorMatch && priceMatch;
    });

    // Ürünleri sırala
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        filtered.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        break;
      default:
        // Öne çıkanlar - orijinal sıra
        break;
    }
    return filtered;
  }, [filters, sortBy, products]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1); // Varsayılan olarak 1 adet ekle
      toast.success(`${product.name} sepete eklendi!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Hata:", err);
      toast.error("Sepete eklemek için giriş yapmalısınız!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleToggleWishlist = async (product) => {
    try {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id);
        toast.info("Favorilərdən çıxarıldı", {
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
        toast.success("Favorilərə əlavə edildi", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Favori əməliyyatı xətası:", err);
      if (err.message === "Giriş yapmalısınız") {
        toast.error("Favorilərə əlavə etmək üçün giriş etməlisiniz!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Xəta baş verdi, zəhmət olmasa yenidən cəhd edin", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const clearAllFilters = () => {
    setFilters({ brands: [], gender: [], colors: [], priceRange: [0, 1000] });
  };

  // Ürün Kartı Bileşeni
  const ProductCard = ({ product }) => {
    const isHovered = hoveredCard === product.id;
    const imageUrls = product.imageUrls || [];
    const mainImage = imageUrls.length > 0 ? imageUrls[0] : "/placeholder.svg";
    
    return (
      <div
        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group max-w-sm mx-auto"
        onMouseEnter={() => setHoveredCard(product.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Resim Container */}
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <img
              src={mainImage}
              alt={`${product.brand} ${product.name}`}
              width={300}
              height={300}
              className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
            />
            {/* Favori Butonu */}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleWishlist(product);
              }}
              className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Favorilere ekle"
              disabled={favLoading}
            >
              <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'} transition-colors`} />
            </button>
            {/* İndirim Etiketi */}
            {product.onSale && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded">
                İNDİRİM
              </div>
            )}
          </div>
        </Link>

        {/* Ürün Bilgileri */}
        <div className="p-6 space-y-3">
          <Link to={`/products/${product.id}`} className="block">
            {/* Marka ve İsim */}
            <div className="space-y-1">
              <h3 className="text-lg leading-tight">
                <span className="italic text-gray-800 font-serif">{product.brand}</span>{" "}
                <span className="font-normal">{product.name}</span>
              </h3>
              <p className="text-sm text-gray-600 font-medium">{product.color || "Renk bilgisi yok"}</p>
            </div>
            {/* Fiyat */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">₼{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₼{product.originalPrice}</span>
              )}
            </div>
          </Link>
          
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
    );
  };

  const FilterContent = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Marka Filtresi */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Markalar
          {expandedSections.brands ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.brands && (
          <div className="space-y-2">
            {availableBrands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleFilterChange("brands", brand)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span className="ml-2 text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Cinsiyet Filtresi */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("gender")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Cinsiyet
          {expandedSections.gender ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.gender && (
          <div className="space-y-2">
            {availableGenders.map((gender) => (
              <label key={gender} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.gender.includes(gender)}
                  onChange={() => handleFilterChange("gender", gender)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span className="ml-2 text-sm text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Renk Filtresi */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("color")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          Renkler
          {expandedSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.color && (
          <div className="space-y-2">
            {availableColors.map((color) => (
              <label key={color} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.colors.includes(color)}
                  onChange={() => handleFilterChange("colors", color)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <span className="ml-2 text-sm text-gray-700">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Filtreleri Temizle Butonu */}
      <button onClick={clearAllFilters} className="w-full text-sm text-gray-600 hover:text-gray-900 underline">
        Tüm Filtreleri Temizle
      </button>
    </div>
  );

  if (loading && currentPage === 1) {
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
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Lüks Saat Kolleksiyamız</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Müasir zövqlərə uyğun, xüsusi zövqlə hazırlanmış premium saat kolleksiyamızı kəşf edin.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtreler - Masaüstü */}
          <div className="hidden md:block w-64 flex-shrink-0 sticky top-8 self-start">
            <FilterContent />
          </div>

          {/* Mobil Filtre */}
          {isMobileFilterOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
              aria-hidden="true"
            ></div>
          )}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-title"
          >
            <div className="p-6 pb-0">
              <h2 id="mobile-filter-title" className="text-xl font-semibold text-gray-900 mb-4">
                Filtreler
              </h2>
              <FilterContent />
            </div>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
              aria-label="Filtreleri kapat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Ana İçerik */}
          <div className="flex-1">
            {/* Ürün sayısı ve sıralama */}
            <div className="flex items-center justify-between mb-8">
              {/* Mobil filtre butonu */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-2 border border-gray-300 rounded px-4 py-2 text-sm bg-white hover:bg-gray-50"
                aria-controls="mobile-filter-sidebar"
                aria-expanded={isMobileFilterOpen}
              >
                <Filter className="w-4 h-4" />
                Filtreler
              </button>

              <div className="text-sm text-gray-600">
                {filteredAndSortedProducts.length} ürün (Toplam: {totalProducts})
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Ürün Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Sonuç yoksa */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Filtrelerinize uygun ürün bulunamadı.</p>
                <button onClick={clearAllFilters} className="mt-4 text-gray-900 underline hover:no-underline">
                  Tüm filtreleri temizle
                </button>
              </div>
            )}

            {/* Pagination / Daha Fazla Yükle */}
            {hasMore && filteredAndSortedProducts.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMoreProducts}
                  disabled={loading}
                  className={`px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                </button>
              </div>
            )}
          </div>
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
            <h3 className="text-lg font-semibold mb-2">Ücretsiz Kargo</h3>
            <p className="text-gray-600">200 TL üzeri tüm siparişlerde ücretsiz kargo</p>
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
            <h3 className="text-lg font-semibold mb-2">2 Yıl Garanti</h3>
            <p className="text-gray-600">Tüm ürünlerimiz 2 yıl garantilidir</p>
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
            <h3 className="text-lg font-semibold mb-2">Uzman Desteği</h3>
            <p className="text-gray-600">7/24 uzman müşteri desteği</p>
          </div>
        </div>
      </div>
    </div>
  );
}