"use client"

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Heart, ShoppingBag, Filter } from "lucide-react";

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

  // Her ürüne statik link ekledim
  const allProducts = [
    {
      id: 1,
      name: "Blanche",
      brand: "Curren",
      specifications: "Quartz, Ø 41mm, Gold",
      price: 250.0,
      image: "/curren-blanch/curren-gold.png",
      gender: "Men",
      color: "Black",
      link: "productdetails" // Statik link
    },
    {
      id: 2,
      name: "Corsa",
      brand: "Curren",
      specifications: "Quartz Chronograph, Ø 44mm, Leather",
      price: 430.0,
      originalPrice: 520.0,
      image: "/placeholder.svg?height=300&width=300",
      onSale: true,
      gender: "Men",
      color: "Brown",
      link: "/products/curren-corsa" // Statik link
    },
    {
      id: 3,
      name: "Strada",
      brand: "Curren",
      specifications: "Automatic, Ø 42mm, Black",
      price: 360.0,
      image: "/placeholder.svg?height=300&width=300",
      gender: "Unisex",
      color: "Black",
      link: "/products/curren-strada" // Statik link
    },
    {
      id: 4,
      name: "Monaco",
      brand: "Polo",
      specifications: "Manual Wind, Ø 39mm, Steel",
      price: 180.0,
      image: "/placeholder.svg?height=300&width=300",
      gender: "Women",
      color: "Silver",
      link: "/products/polo-monaco" // Statik link
    },
    {
      id: 5,
      name: "Terra Limited Edition",
      brand: "Poedagar",
      specifications: "Automatic, Ø 45mm, Carbon",
      price: 495.0,
      image: "/placeholder.svg?height=300&width=300",
      gender: "Men",
      color: "Black",
      link: "/products/poedagar-terra" // Statik link
    },
    {
      id: 6,
      name: "Ring Rose Gold",
      brand: "BindBond",
      specifications: "Quartz, Ø 36mm, Rose Gold",
      price: 150.0,
      image: "/placeholder.svg?height=300&width=300",
      gender: "Women",
      color: "Rose Gold",
      link: "/products/bindbond-ring" // Statik link
    },
    {
      id: 7,
      name: "SnakeQueen 39mm",
      brand: "ZHOWE",
      specifications: "Automatic, Ø 39mm, Cherry Red",
      price: 599.0,
      image: "/placeholder.svg?height=300&width=300",
      gender: "Women",
      color: "Red",
      link: "/products/zhowe-snakequeen" // Statik link
    },
    {
      id: 8,
      name: "Classic Heritage",
      brand: "Danlex",
      specifications: "Automatic, Ø 40mm, Gold",
      price: 850.0,
      image: "/placeholder.svg?height=300&width=300",
      gender: "Men",
      color: "Gold",
      link: "/products/danlex-classic" // Statik link
    },
    {
      id: 9,
      name: "Elegance Pro",
      brand: "Jhui",
      specifications: "Quartz, Ø 38mm, Silver",
      price: 720.0,
      image: "/placeholder.svg?height=300&width=300",
      gender: "Women",
      color: "Silver",
      link: "/products/jhui-elegance" // Statik link
    },
    {
      id: 10,
      name: "Sport Master",
      brand: "TAG Heuer",
      specifications: "Chronograph, Ø 43mm, Blue",
      price: 920.0,
      originalPrice: 1100.0,
      image: "/placeholder.svg?height=300&width=300",
      onSale: true,
      gender: "Unisex",
      color: "Blue",
      link: "/products/tagheuer-sport" // Statik link
    },
  ];
  
  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
    { value: "newest", label: "Newest First" },
  ];
  
  const availableBrands = [...new Set(allProducts.map((p) => p.brand))];
  const availableGenders = ["Men", "Women", "Unisex"];
  const availableColors = [...new Set(allProducts.map((p) => p.color))];

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const brandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const genderMatch = filters.gender.length === 0 || filters.gender.includes(product.gender);
      const colorMatch = filters.colors.length === 0 || filters.colors.includes(product.color);
      const priceMatch = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      return brandMatch && genderMatch && colorMatch && priceMatch;
    });

    // Sort products
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
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Featured - keep original order
        break;
    }
    return filtered;
  }, [filters, sortBy]);

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

  const handleAddToCart = (product) => {
    alert(`Added ${product.brand} ${product.name} to cart!`);
  };

  const handleToggleWishlist = (productId) => {
    console.log(`Toggled wishlist for product ${productId}`);
  };

  const clearAllFilters = () => {
    setFilters({ brands: [], gender: [], colors: [], priceRange: [0, 1000] });
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const isHovered = hoveredCard === product.id;
    return (
      <div
        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group max-w-sm mx-auto"
        onMouseEnter={() => setHoveredCard(product.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Image Container with Link */}
        <a href={product.link} className="block">
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <img
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={`${product.brand} ${product.name}`}
              width={300}
              height={300}
              className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
            />
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleToggleWishlist(product.id);
              }}
              className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
            </button>
            {/* Sale Badge */}
            {product.onSale && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded">
                SALE
              </div>
            )}
          </div>
        </a>

        {/* Product Info with Link */}
        <div className="p-6 space-y-3">
          <a href={product.link} className="block">
            {/* Brand and Name */}
            <div className="space-y-1">
              <h3 className="text-lg leading-tight">
                <span className="italic text-gray-800 font-serif">{product.brand}</span>{" "}
                <span className="font-normal">{product.name}</span>
              </h3>
              <p className="text-sm text-gray-600 font-medium">{product.specifications}</p>
            </div>
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-900">₼{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </a>
          
          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product)}
            className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 font-medium tracking-wide transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            ADD TO CART
          </button>
        </div>
      </div>
    );
  };

  const FilterContent = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Brands Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          BRANDS
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
      {/* Gender Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("gender")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          GENDER
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
      {/* Color Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("color")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
        >
          COLOR
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
      {/* Clear Filters Button */}
      <button onClick={clearAllFilters} className="w-full text-sm text-gray-600 hover:text-gray-900 underline">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Luxury Timepieces</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of premium watches, crafted with precision and designed for the modern connoisseur.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0 sticky top-8 self-start">
            <FilterContent />
          </div>

          {/* Mobile Filter Overlay and Sidebar */}
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
                Filters
              </h2>
              <FilterContent />
            </div>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
              aria-label="Close filters"
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

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with product count and sort */}
            <div className="flex items-center justify-between mb-8">
              {/* Filter button for mobile */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-2 border border-gray-300 rounded px-4 py-2 text-sm bg-white hover:bg-gray-50"
                aria-controls="mobile-filter-sidebar"
                aria-expanded={isMobileFilterOpen}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <div className="text-sm text-gray-600">{filteredAndSortedProducts.length} products</div>
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

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No results message */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button onClick={clearAllFilters} className="mt-4 text-gray-900 underline hover:no-underline">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
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
            <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free worldwide shipping on all orders over $200</p>
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
            <h3 className="text-lg font-semibold mb-2">2 Year Warranty</h3>
            <p className="text-gray-600">Comprehensive warranty coverage for peace of mind</p>
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
            <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600">24/7 customer support from watch specialists</p>
          </div>
        </div>
      </div>
    </div>
  );
}