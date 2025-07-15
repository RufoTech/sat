"use client"

import { ChevronDown, Search, ShoppingCart, User as UserIcon, X, Heart } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth, db } from "./Firebase"
import { useCart } from "./CardContext"
import { useFavorites } from "./FavoriteContext"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function NavbarComponent({ user: propUser }) {
  // State management
  const [user, setUser] = useState(propUser || null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [allProducts, setAllProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [favoriteProducts, setFavoriteProducts] = useState([])
  const [loadingFavoriteProducts, setLoadingFavoriteProducts] = useState(true)

  // Refs
  const navigate = useNavigate()
  const userMenuRef = useRef(null)
  const cartRef = useRef(null)
  const favoritesRef = useRef(null)
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)

  // Context hooks
  const { 
    cart, 
    totalItems, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    subtotal,
    getFormattedSubtotal,
    loading: cartLoading,
    addToCart
  } = useCart()

  const { favorites, loading: loadingFavs, removeFromFavorites } = useFavorites()

  // Navigation items
  const navigationItems = [
    { 
      name: "Brend", 
      hasDropdown: true, 
      options: [
        { label: "Curren", path: "/brands" },
        { label: "Omega", path: "/brands" },
        { label: "Poedagar", path: "/brands" },
        { label: "Casio", path: "/brands" },
        { label: "All Brands", path: "/brands" },
      ]
    },
    { 
      name: "Kolleksiya", 
      hasDropdown: true, 
      options: [
        { label: "Luxury", path: "/brands" },
        { label: "Sport", path: "/brands" },
        { label: "Diver", path: "/brands" },
        { label: "Chronograph", path: "/brands" },
        { label: "All Collections", path: "/brands" },
      ]
    },
    { 
      name: "Kişi", 
      hasDropdown: true, 
      options: [
        { label: "Automatic", path: "/brands" },
        { label: "Quartz", path: "/brands" },
        { label: "Smart", path: "/brands" },
        { label: "All Men's Watches", path: "/brands" },
      ]
    },
    { 
      name: "Qadın", 
      hasDropdown: true, 
      options: [
        { label: "Dress", path: "/brands" },
        { label: "Fashion", path: "/brands" },
        { label: "Jewelry", path: "/brands" },
        { label: "All Women's Watches", path: "/brands" },
      ]
    },
    {
      name: "Uşaq",
      hasDropdown: true,
      options: [
        { label: "Latest Collections", path: "/brands" },
        { label: "Featured Items", path: "/brands" },
        { label: "Seasonal Picks", path: "/brands" },
        { label: "View All New Arrivals", path: "/brands" }
      ]
    },
    {
      name: "Endirim",
      hasDropdown: true,
      options: [
        { label: "Special Offers", path: "/brands" },
        { label: "Clearance", path: "/sale/clearance" },
        { label: "Discounts", path: "/sale/discounts" },
        { label: "View All Sales", path: "/sale" }
      ]
    }
  ]

  // Effects
  useEffect(() => {
    if (!propUser) {
      const unsub = onAuthStateChanged(auth, u => setUser(u))
      return () => unsub()
    }
  }, [propUser])

  useEffect(() => {
    const fetchProducts = async () => {
      setSearchLoading(true)
      try {
        const snap = await getDocs(collection(db, "products"))
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setAllProducts(list)
      } catch (err) {
        console.error("Error loading products:", err)
      } finally {
        setSearchLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        const proms = favorites.map(async (fav) => {
          if (!fav.id) return null
          const prodDocRef = doc(db, "products", fav.id)
          const snap = await getDoc(prodDocRef)
          if (snap.exists()) return { id: snap.id, ...snap.data() }
          return null
        })
        const results = await Promise.all(proms)
        setFavoriteProducts(results.filter((p) => p))
      } catch (error) {
        console.error("Error fetching favorite products:", error)
      } finally {
        setLoadingFavoriteProducts(false)
      }
    }

    if (!loadingFavs && isFavoritesOpen) {
      fetchFavoriteProducts()
    }
  }, [favorites, loadingFavs, isFavoritesOpen])

  useEffect(() => {
    const handler = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false)
      }
      if (cartRef.current && !cartRef.current.contains(e.target) && !e.target.closest('[data-cart-button]')) {
        setIsCartOpen(false)
      }
      if (favoritesRef.current && !favoritesRef.current.contains(e.target) && !e.target.closest('[data-favorites-button]')) {
        setIsFavoritesOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target) && !e.target.closest('[data-search-button]')) {
        setIsSearchOpen(false)
        setSearchResults([])
      }
    }
    
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Handlers
  const toggleDropdown = name => setOpenDropdown(openDropdown === name ? null : name)
  const closeDropdown = () => setOpenDropdown(null)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsUserMenuOpen(false)
      navigate("/")
      toast.success("Successfully logged out!")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Error during logout")
    }
  }

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const handleSearchChange = (e) => {
    const text = e.target.value
    setSearchQuery(text)

    if (!text.trim()) {
      setSearchResults([])
      return
    }

    const lower = text.toLowerCase()
    const filtered = allProducts.filter(item => {
      const name = item.name?.toLowerCase() || ''
      const brand = item.brand?.toLowerCase() || ''
      return name.includes(lower) || brand.includes(lower)
    })
    setSearchResults(filtered)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
      setSearchResults([])
    }
  }

  const handleSearchItemClick = (productId) => {
    navigate(`/products/${productId}`)
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleClearCart = () => {
    clearCart()
    toast.success("All items have been removed from your cart!")
  }

  const handleAddFavoriteToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrls: product.imageUrls,
      quantity: 1
    })
    toast.success("Product successfully added to cart!")
  }

  // Derived values
  const nameToShow = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "User"
  const initial = nameToShow.charAt(0).toUpperCase()
  const formattedSubtotal = getFormattedSubtotal()

  return (
    <div className="bg-gray-50">
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
      />

      {/* Promo Banner */}
      <div className="bg-blue-600 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
         Mağazanın Yeni Açılışı İlə Əlaqədər Tüm Saatlara  15% Faiz Endirim 
        </p>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && window.innerWidth < 1024 && (
        <div className="lg:hidden bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-50">
          <div className="flex items-center">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#bd8334] focus:border-[#bd8334]"
                placeholder="Search for watches, brands..."
                autoFocus
              />
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-white bg-[#bd8334] hover:bg-[#a6732d] focus:outline-none focus:ring-1 focus:ring-[#bd8334]"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-40 max-h-80 overflow-y-auto">
              <ul>
                {searchResults.slice(0, 10).map(item => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSearchItemClick(item.id)}
                  >
                    <img
                      src={item.imageUrls?.[0] || "/placeholder-watch.jpg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.brand && <span className="font-semibold">{item.brand}</span>}
                        {item.brand && item.price && ' • '}
                        {item.price ? `${parseFloat(item.price).toFixed(2)} AZN` : 'Price not available'}
                      </p>
                    </div>
                  </li>
                ))}
                {searchResults.length > 10 && (
                  <li className="px-4 py-3 text-center">
                    <button 
                      onClick={() => {
                        navigate('/brands');
                        setIsSearchOpen(false);
                      }}
                      className="text-sm font-medium text-[#bd8334] hover:text-[#a6732d]"
                    >
                      Show More ({searchResults.length - 10} more products)
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Navigation */}
      <nav className="bg-white border-b aas border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Desktop Logo */}
          <div className="hidden lg:flex justify-center py-4 border-b border-gray-100">
            <Link 
              to="/" 
              className="text-4xl playfair-display text-[#bd8334] hover:text-[#a6732d] transition-colors"
            >
              VALORE WATCH
            </Link>
          </div>

          <div className="flex justify-between items-center h-16">
            {/* Left Nav - Desktop */}
            <div className="hidden  lg:flex flex-1 justify-center space-x-8 aaaw">
              {navigationItems.map(item => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-all"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <div 
                        className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-56 bg-white border rounded-md shadow-lg z-20 transition-all duration-200 ${openDropdown === item.name ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                      >
                        {item.options.map(opt => (
                          <Link
                            key={opt.label}
                            to={opt.path}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#bd8334] transition-colors"
                            onClick={closeDropdown}
                          >
                            {opt.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link 
                      to={item.path} 
                      className="px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Logo */}
            <Link 
              to="/" 
              className="lg:hidden flex-1 text-center text-xl playfair-display text-[#bd8334] hover:text-[#a6732d]"
            >
              VALORE WATCH
            </Link>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                data-search-button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favorites Button */}
             

              {/* User Menu */}
              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={nameToShow}
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#bd8334] text-white flex items-center justify-center font-semibold border-2 border-gray-200">
                        {initial}
                      </div>
                    )}
                    <span className="font-medium text-gray-700 hidden md:inline">{nameToShow}</span>
                    <ChevronDown className="w-4 h-4 text-gray-700 hidden md:inline" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-30 py-1">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#bd8334] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#bd8334] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#bd8334] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#bd8334] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* Cart Button */}
              <button 
                data-cart-button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={cartLoading}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
               <button
                data-favorites-button
                onClick={() => setIsFavoritesOpen(true)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 relative"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                {navigationItems.map(item => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className="w-full flex justify-between items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          <span>{item.name}</span>
                          <ChevronDown className={`w-4 h-4 transform ${openDropdown === item.name ? "rotate-180" : ""}`} />
                        </button>
                        {openDropdown === item.name && (
                          <div className="ml-4 space-y-2 mt-1">
                            {item.options.map(opt => (
                              <Link 
                                key={opt.label} 
                                to={opt.path} 
                                className="block py-1.5 px-3 text-gray-600 hover:text-[#bd8334] rounded-md hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                  setIsMenuOpen(false)
                                  closeDropdown()
                                }}
                              >
                                {opt.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link 
                        to={item.path} 
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Search Sidebar */}
      {isSearchOpen && window.innerWidth >= 1024 && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-opacity-30 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
          
          <div 
            ref={searchRef}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            style={{ transform: isSearchOpen ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Məhsul Axtarışı</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="p-6 border-b border-gray-200">
                <div className="flex rounded-md shadow-sm">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="flex-1 min-w-0 block w-full px-3 py-3 rounded-l-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#bd8334] focus:border-[#bd8334]"
                    placeholder="Search for watches, brands..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md text-white bg-[#bd8334] hover:bg-[#a6732d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bd8334]"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {searchLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bd8334]"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="flex-1 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {searchResults.slice(0, 10).map(item => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSearchItemClick(item.id)}
                      >
                        <img
                          src={item.imageUrls?.[0] || "/placeholder-watch.jpg"}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.brand && <span className="font-semibold">{item.brand}</span>}
                            {item.brand && item.price && ' • '}
                            {item.price ? `${parseFloat(item.price).toFixed(2)} AZN` : 'Price not available'}
                          </p>
                        </div>
                      </li>
                    ))}
                    {searchResults.length > 10 && (
                      <li className="px-6 py-4 text-center">
                        <button 
                          onClick={() => {
                            navigate('/brands');
                            setIsSearchOpen(false);
                          }}
                          className="text-sm font-medium text-[#bd8334] hover:text-[#a6732d]"
                        >
                          Show More ({searchResults.length - 10} more products)
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-1">
                    {searchQuery ? "No results found" : "Start searching"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {searchQuery ? "Try different keywords" : "Type product name or brand"}
                  </p>
                </div>
              )}

              <div className="p-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Məhşur Axtarışlar</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      setSearchQuery("Rolex")
                      searchInputRef.current?.focus()
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Rolex
                  </button>
                  <button 
                    onClick={() => {
                      setSearchQuery("Smart watch")
                      searchInputRef.current?.focus()
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Smart watch
                  </button>
                  <button 
                    onClick={() => {
                      setSearchQuery("Women's watch")
                      searchInputRef.current?.focus()
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Women's watch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      <div 
        className={`fixed inset-0 backdrop-blur-sm z-50 overflow-hidden ${isCartOpen ? 'block' : 'hidden'}`}
        style={{ pointerEvents: isCartOpen ? 'auto' : 'none' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            ref={cartRef}
            className="fixed inset-y-0 right-0 max-w-full flex"
            style={{ transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease-in-out' }}
          >
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Alış-veriş Səbəti</h2>
                    <button
                      type="button"
                      className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setIsCartOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      {cart.length === 0 ? (
                        <div className="text-center py-12">
                          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">Səbətiniz Boşdur</h3>
                          <p className="mt-1 text-sm text-gray-500">Məhsul Əlavə Etməyə Başlayın</p>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#bd8334] hover:bg-[#a6732d]"
                          >
                            Alış-verişə dəvam et
                          </button>
                        </div>
                      ) : (
                        <ul className="-my-6 divide-y divide-gray-200">
                          {cart.map((item) => (
                            <li key={item.id} className="py-6 flex">
                              <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                                <img
                                  src={item.imageUrls?.[0] || '/placeholder-watch.jpg'}
                                  alt={item.name}
                                  className="w-full h-full object-cover object-center"
                                  onError={e => {
                                    e.target.onerror = null
                                    e.target.src = '/placeholder-watch.jpg'
                                  }}
                                />
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <Link 
                                        to={`/product/${item.id}`}
                                        onClick={() => setIsCartOpen(false)}
                                        className="hover:text-[#bd8334] transition-colors"
                                      >
                                        {item.name}
                                      </Link>
                                    </h3>
                                    <p className="ml-4">₼{(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                  {item.size && (
                                    <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                                  )}
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  <div className="flex items-center border border-gray-300 rounded-md">
                                    <button 
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                      aria-label="Decrease quantity"
                                    >
                                      -
                                    </button>
                                    <span className="px-3">{item.quantity}</span>
                                    <button 
                                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                      className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                      aria-label="Increase quantity"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeFromCart(item.id)}
                                    className="font-medium text-red-600 hover:text-red-500"
                                  >
                                    Sil
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Ümumi Qiymət</p>
                      <p>₼{formattedSubtotal}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                     50 Manat üstü alışverişlərdə pulsuz çatdırılma
                    </p>
                    <div className="mt-6 space-y-2">
                      <Link
                        to="/cart"
                        onClick={() => setIsCartOpen(false)}
                        className={`flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#bd8334] hover:bg-[#a6732d] ${
                          cartLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        disabled={cartLoading}
                      >
                        {cartLoading ? 'Loading...' : 'Sipariş Səhifəsinə Keç'}
                      </Link>
                      <button
                        onClick={handleClearCart}
                        className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Səbəti Təmizlə
                      </button>
                    </div>
                    <div className="mt-4 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="text-[#bd8334] font-medium hover:text-[#a6732d]"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Alış-verişə dəvam et<span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Sidebar */}
      <div 
        className={`fixed inset-0 backdrop-blur-sm z-50 overflow-hidden ${isFavoritesOpen ? 'block' : 'hidden'}`}
        style={{ pointerEvents: isFavoritesOpen ? 'auto' : 'none' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            ref={favoritesRef}
            className="fixed inset-y-0 right-0 max-w-full flex"
            style={{ transform: isFavoritesOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease-in-out' }}
          >
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Sevimlilər ({favoriteProducts.length})
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setIsFavoritesOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      {loadingFavoriteProducts ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bd8334]"></div>
                        </div>
                      ) : favoriteProducts.length === 0 ? (
                        <div className="text-center py-12">
                          <Heart className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">Sevimlilər Boşdur</h3>
                          <p className="mt-1 text-sm text-gray-500">Sevimlilər Siyahısına Məhsul Əlavə Et</p>
                          <button
                            onClick={() => setIsFavoritesOpen(false)}
                            className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#bd8334] hover:bg-[#a6732d]"
                          >
                            Alış-verişə dəvam et
                          </button>
                        </div>
                      ) : (
                        <>
                          <ul className="-my-6 divide-y divide-gray-200">
                            {favoriteProducts.map((product) => (
                              <li key={product.id} className="py-6 flex">
                                <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                                  {product.imageUrls?.[0] ? (
                                    <img
                                      src={product.imageUrls[0]}
                                      alt={product.name}
                                      className="w-full h-full object-cover object-center"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                      <span className="text-gray-400">No image</span>
                                    </div>
                                  )}
                                </div>

                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link 
                                          to={`/product/${product.id}`}
                                          onClick={() => setIsFavoritesOpen(false)}
                                          className="hover:text-[#bd8334] transition-colors"
                                        >
                                          {product.name}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">₺{product.price?.toFixed(2) || '0.00'}</p>
                                    </div>
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm mt-2">
                                    <button
                                      onClick={() => handleAddFavoriteToCart(product)}
                                      className="flex items-center text-sm font-medium text-[#bd8334] hover:text-[#a6732d]"
                                    >
                                      <ShoppingCart className="w-4 h-4 mr-1" />
                                      Add to Cart
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => removeFromFavorites(product.id)}
                                      className="font-medium text-red-600 hover:text-red-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-6 space-y-2">
                            <button
                              onClick={() => {
                                favoriteProducts.forEach(product => {
                                  addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    imageUrls: product.imageUrls,
                                    quantity: 1
                                  });
                                });
                                toast.success("All favorites added to cart!");
                              }}
                              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#bd8334] hover:bg-[#a6732d]"
                            >
                              <ShoppingCart className="w-5 h-5 mr-2" />
                              Add All to Cart
                            </button>
                            
                            <button
                              onClick={() => {
                                favoriteProducts.forEach(product => {
                                  removeFromFavorites(product.id);
                                });
                                toast.success("All favorites removed!");
                              }}
                              className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50"
                            >
                              <X className="w-5 h-5 mr-2" />
                              Delete All Favorites
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {favoriteProducts.length > 0 && (
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <button
                      onClick={() => setIsFavoritesOpen(false)}
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#bd8334] hover:bg-[#a6732d]"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}