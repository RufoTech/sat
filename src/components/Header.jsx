"use client"

import { ChevronDown, Search, ShoppingCart, User } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState({})

  const navigationItems = [
    { name: "Brands", hasDropdown: true, options: [
        { label: "Curren", path: "/brands" },
        { label: "Polo", path: "/brands" },
        { label: "Poedagar", path: "/brands" },
        { label: "BindBond", path: "/brands" },
        { label: "All More..", path: "/brands" },
      ]
    },
    { name: "Collections", hasDropdown: true, options: [
        { label: "Curren Chronograph", path: "/collections/curren-chronograph" },
        { label: "Polo Elegant", path: "/collections/polo-elegant" },
        { label: "Poedagar Tourbillon", path: "/collections/poedagar-tourbillon" },
        { label: "BindBond Luxury Quartz", path: "/collections/bindbond-luxury-quartz" },
        { label: "All More..", path: "/collections" },
      ]
    },
    { name: "Men", hasDropdown: true, options: [
        { label: "Curren", path: "/men/curren" },
        { label: "Polo", path: "/men/polo" },
        { label: "Poedagar", path: "/men/poedagar" },
        { label: "BindBond", path: "/men/bindbond" },
        { label: "All More..", path: "/men" },
      ]
    },
    { name: "Women", hasDropdown: true, options: [
        { label: "Michael Kors", path: "/women/michael-kors" },
        { label: "Fossil", path: "/women/fossil" },
        { label: "Guess", path: "/women/guess" },
        { label: "All More..", path: "/women" },
      ]
    },
    { name: "New", hasDropdown: true, options: [
        { label: "Rolex", path: "/new/rolex" },
        { label: "Cartier", path: "/new/cartier" },
      ]
    },
    { name: "Sale", hasDropdown: true, options: [
        { label: "Up to 50%", path: "/sale/50-off" },
        { label: "Up to 70%", path: "/sale/70-off" },
      ]
    },
  ]

  const toggleDropdown = (itemName) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName)
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  const handleSelect = (itemName, optionLabel) => {
    setSelectedOptions(prev => ({ ...prev, [itemName]: optionLabel }))
    closeDropdown()
  }

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <div className="w-full">
        {/* Promotional Banner */}
        <div className="bg-blue-600 text-white text-center py-2 px-4">
          <p className="text-sm font-medium">4th of July Sale | 15% off* orders over $199 Code: FREEDOM</p>
        </div>

        {/* Main Navbar */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo Section */}
            <div className="hidden lg:flex justify-center py-4 border-b border-gray-100">
              <Link to="/" className="flex items-center">
                <span className="playfair-display text-4xl text-[#bd8334]">
                  VALORE WATCH
                </span>
              </Link>
            </div>

            {/* Main Navigation Row */}
            <div className="flex justify-between items-center h-16">
              {/* Left Navigation */}
              <div className="hidden lg:flex items-center space-x-8 lg:flex-1 lg:justify-center">
                {navigationItems.map(item => (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className="flex items-center cursor-pointer space-x-1 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <span>{item.name}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>

                        {openDropdown === item.name && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                            <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                              <div className="py-1">
                                {item.options.map(opt => (
                                  <Link
                                    key={opt.label}
                                    to={opt.path}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    onClick={() => handleSelect(item.name, opt.label)}
                                  >
                                    {opt.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <Link to={item.href} className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Center Logo on mobile */}
              <div className="flex-1 flex justify-center lg:hidden">
                <Link to="/" className="flex items-center">
                  <span className="playfair-display text-xl text-[#bd8334]">
                    VALORE WATCH
                  </span>
                </Link>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-4">
                <Link to="/login" className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>
                <Link to="/search" className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Link>
                <Link to="/cart" className="p-2 rounded-md relative text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Shopping cart</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
                </Link>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
              <div className="lg:hidden border-t border-gray-200 py-4">
                <div className="flex flex-col space-y-4">
                  {navigationItems.map(item => (
                    <div key={item.name}>
                      {item.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => toggleDropdown(`mobile-${item.name}`)}
                            className="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <span>{item.name}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === `mobile-${item.name}` ? "rotate-180" : ""}`} />
                          </button>
                          {openDropdown === `mobile-${item.name}` && (
                            <div className="mt-2 ml-4 space-y-2">
                              {item.options.map(opt => (
                                <Link
                                  key={opt.label}
                                  to={opt.path}
                                  className="block text-gray-600 hover:text-gray-900 py-1"
                                  onClick={() => { setSelectedOptions(prev => ({ ...prev, [`mobile-${item.name}`]: opt.label })); setIsMenuOpen(false); }}
                                >
                                  {opt.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          className="block text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
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
      </div>
    </div>
  )
}
