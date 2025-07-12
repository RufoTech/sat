"use client"

import { useState } from "react"

export default function Component() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [specsExpanded, setSpecsExpanded] = useState(true)

  const thumbnails = [
    "/images/watch-main.png",
    "/images/watch-main.png",
    "/images/watch-main.png",
    "/images/watch-main.png",
    "/images/watch-main.png",
  ]

  const colorOptions = [
    { 
      name: "Red", 
      value: "bg-red-500",
      image: "/images/watch-red.png"
    },
    { 
      name: "Blue", 
      value: "bg-blue-500",
      image: "/images/watch-blue.png"
    },
    { 
      name: "Green", 
      value: "bg-green-500",
      image: "/images/watch-green.png"
    },
    { 
      name: "Yellow", 
      value: "bg-yellow-400",
      image: "/images/watch-yellow.png"
    },
    { 
      name: "Black", 
      value: "bg-gray-900",
      image: "/images/watch-black.png"
    },
    { 
      name: "White", 
      value: "bg-gray-100 border border-gray-300",
      image: "/images/watch-white.png"
    },
    { 
      name: "Purple", 
      value: "bg-purple-500",
      image: "/images/watch-purple.png"
    },
  ]

  const specifications = [
    { label: "MOVEMENT", value: "Japanese Automatic With 2 Hands / Small Second" },
    { label: "CASE MATERIAL", value: "Stainless Steel" },
    { label: "CASE SIZE (mm)", value: "43" },
    { label: "CASE THICKNESS (mm)", value: "13" },
    { label: "LUG TO LUG (mm)", value: "51" },
    { label: "INDEX & LUMINOUS", value: "Applied Index With Swiss Super Luminova" },
    { label: "LENS", value: "Sapphire Lens" },
    { label: "CROWN TYPE", value: "Screw Down" },
    { label: "BAND", value: "22mm Nylon Strap With Strap Buckle" },
    { label: "WATER RESISTANCE", value: "15 ATM" },
    { label: "WATCH WEIGHT (g)", value: "92" },
    { label: "WARRANTY", value: "2 Years International Warranty" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm text-gray-600 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center">
            <span>Home</span>
            <span className="mx-1 sm:mx-2">/</span>
            <span className="hidden sm:inline">Spinnaker</span>
            <span className="hidden sm:inline mx-2">/</span>
            <span className="text-gray-900 truncate">
              <span className="hidden lg:inline">
                Spinnaker Fleuss Automatic SpongeBob SquarePants Frenemies Sandy White Limited Edition
              </span>
              <span className="lg:hidden">SpongeBob Watch</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="order-1">
            <div className="flex flex-col sm:flex-row lg:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex sm:flex-col lg:flex-col gap-2 order-2 sm:order-1 lg:order-1 overflow-x-auto sm:overflow-visible">
                {thumbnails.map((thumb, index) => (
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
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 order-1 sm:order-2 lg:order-2">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={colorOptions[selectedColor].image || thumbnails[selectedImage] || "/placeholder.svg"}
                    alt="SpongeBob SquarePants Watch"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColor(index)
                      setSelectedImage(0) // Reset to first thumbnail when color changes
                    }}
                    className={`w-10 h-10 rounded-full ${color.value} flex items-center justify-center transition-all duration-200 ${
                      selectedColor === index
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : "hover:ring-1 hover:ring-gray-300"
                    }`}
                    title={color.name}
                  >
                    {selectedColor === index && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="order-2 space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Spinnaker Fleuss Automatic SpongeBob SquarePants Frenemies Sandy White Limited Edition
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3 sm:mt-4">$395.00 USD</p>
            </div>

            {/* Specifications */}
            <div className="border rounded-lg">
              <button
                onClick={() => setSpecsExpanded(!specsExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm sm:text-base">SPECIFICATIONS</span>
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

            {/* Add to Cart */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 sm:py-4 px-6 rounded-lg text-base sm:text-lg font-semibold transition-colors duration-200 touch-manipulation">
              ADD TO CART
            </button>

            {/* Features */}
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
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">Worldwide*</p>
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">30 Day</p>
                <p className="text-xs text-gray-500">Returns</p>
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Authorized</p>
                <p className="text-xs text-gray-500">Dealer</p>
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
                <p className="text-xs sm:text-sm text-gray-600 font-medium">100% Secure</p>
                <p className="text-xs text-gray-500">Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}