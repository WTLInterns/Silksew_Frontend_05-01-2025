
import { useState, useRef, useEffect, useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, User, Heart, ShoppingBag, ChevronDown, X, Menu } from "lucide-react"
import { useFavorites } from "../../context/FavoritesContext"
import { ShopContext } from "../../context/ShopContext"
import FavoriteButton from '../common/FavoriteButton';
import logo from "../../components/Assets/siksewmodified.png"
import { AuthContext } from "../../context/AuthContext"
import Footer from "../Footer/Footer";
import "./Navbar.css"
const Navbar = () => {
  const { products, calculateTotalCartItems } = useContext(ShopContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [subcategoryProducts, setSubcategoryProducts] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [showOnlyProducts, setShowOnlyProducts] = useState(false)
  const [nowTick, setNowTick] = useState(Date.now())
  const mobileNavRef = useRef(null)
  const { favorites } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()
  const favoritesCount = Array.isArray(favorites) ? favorites.length : 0
  const { user } = useContext(AuthContext);

  const cartCount = calculateTotalCartItems()

  // Navigation menu structure matching the image
  const navigationMenu = {
    "All Products": [],
    "Indian & Fusion Wear": [
      "Ethnic Wear",
      "Kurtis",
      "Tops & Tunics",
      "Wedding Wear",
      "Sarees",
      "Lehengas",
      "Salwar Suits",
      "Indo-Western"
    ],
    "Western Wear": [
      "Casual Wear",
      "Formal Wear",
      "Street Style",
      "Smart Casuals",
      "Athleisure",
      "Summer Wear",
      "Winter Wear",
      "Party Wear"
    ],
    "Formal Wear": [
      "Office Wear",
      "Business Casual",
      "Blazers",
      "Formal Dresses",
      "Work Wear"
    ],
    "New Arrivals": []
  }

  // Function to clear subcategory when logo is clicked
  const handleLogoClick = () => {
    setSelectedSubcategory(""); // Clear the selected subcategory
    setSubcategoryProducts([]); // Clear the products
    setShowOnlyProducts(false); // Show homepage content again
    navigate("/"); // Navigate to home
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setShowMobileMenu(false)
        setActiveDropdown(null)
      }
    }
    if (showMobileMenu || activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showMobileMenu, activeDropdown])

  // Global tick to re-render countdowns once per second
  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    if (showMobileMenu) setShowMobileMenu(false)
    if (showMobileSearch) setShowMobileSearch(false)
  }, [location.pathname])

  // Listen for custom events from Hero component
  useEffect(() => {
    const handleNavigateToCategory = (event) => {
      const { category } = event.detail;
      fetchProductsBySubcategory(category);
    };

    window.addEventListener('navigateToCategory', handleNavigateToCategory);

    return () => {
      window.removeEventListener('navigateToCategory', handleNavigateToCategory);
    };
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setSearchResults([]);
      return;
    }

    let matchedSubcategory = null;

    // 1️⃣ Check for exact match first
    Object.entries(navigationMenu).forEach(([menu, subs]) => {
      if (menu.toLowerCase() === query) {
        matchedSubcategory = menu;
      }
      subs.forEach((sub) => {
        if (sub.toLowerCase() === query) {
          matchedSubcategory = sub;
        }
      });
    });

    // 2️⃣ If no exact match, check for partial match (prioritize shortest one)
    if (!matchedSubcategory) {
      let possibleMatches = [];
      Object.entries(navigationMenu).forEach(([menu, subs]) => {
        if (menu.toLowerCase().includes(query)) {
          possibleMatches.push(menu);
        }
        subs.forEach((sub) => {
          if (sub.toLowerCase().includes(query)) {
            possibleMatches.push(sub);
          }
        });
      });

      if (possibleMatches.length > 0) {
        // Choose the shortest/closest match (so "Casual Wear" wins over "Business Casual")
        possibleMatches.sort((a, b) => a.length - b.length);
        matchedSubcategory = possibleMatches[0];
      }
    }

    if (matchedSubcategory) {
      fetchProductsBySubcategory(matchedSubcategory);
      setSearchResults([]);
      return;
    }

    // 3️⃣ Otherwise, search by product name
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchResults.length > 0) {
        navigate(`/product/${searchResults[0]._id}`);
        setSearchQuery("");
        setSearchResults([]);
        return;
      }

      let matchedSubcategory = null;

      // Exact match first
      Object.entries(navigationMenu).forEach(([menu, subs]) => {
        if (menu.toLowerCase() === searchQuery.toLowerCase()) {
          matchedSubcategory = menu;
        }
        subs.forEach((sub) => {
          if (sub.toLowerCase() === searchQuery.toLowerCase()) {
            matchedSubcategory = sub;
          }
        });
      });

      // Partial match if no exact match
      if (!matchedSubcategory) {
        let possibleMatches = [];
        Object.entries(navigationMenu).forEach(([menu, subs]) => {
          if (menu.toLowerCase().includes(searchQuery.toLowerCase())) {
            possibleMatches.push(menu);
          }
          subs.forEach((sub) => {
            if (sub.toLowerCase().includes(searchQuery.toLowerCase())) {
              possibleMatches.push(sub);
            }
          });
        });
        if (possibleMatches.length > 0) {
          possibleMatches.sort((a, b) => a.length - b.length);
          matchedSubcategory = possibleMatches[0];
        }
      }

      if (matchedSubcategory) {
        fetchProductsBySubcategory(matchedSubcategory);
        setSearchQuery("");
      }
    }
  };

  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleDropdownHover = (menuItem) => {
    setActiveDropdown(menuItem)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  // Function to fetch products by subcategory from API
  const fetchProductsBySubcategory = async (subcategory) => {
    setLoading(true)
    setSelectedSubcategory(subcategory)
    setShowOnlyProducts(true) // Set to show only products

    try {
      if (subcategory === "All Products" || subcategory === "New Arrivals") {
        // ✅ Fetch all products (or New Arrivals if backend supports filtering)
        const response = await fetch("http://localhost:5003/api/products")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setSubcategoryProducts(data.products) // ✅ must use .products
          } else {
            console.error("API returned error:", data.message)
            setSubcategoryProducts([])
          }
        } else {
          console.error("Failed to fetch all products")
          setSubcategoryProducts(products)
        }
      } else {
        // Fetch by subcategory
        const response = await fetch(
          `http://localhost:5003/api/products/by-subcategory?subcategory=${encodeURIComponent(subcategory)}`
        )
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setSubcategoryProducts(data.products)
          } else {
            console.error("API returned error:", data.message)
            const filteredProducts = products.filter(product =>
              product.subcategory && Array.isArray(product.subcategory) &&
              product.subcategory.some(sub => sub.toLowerCase().includes(subcategory.toLowerCase()))
            )
            setSubcategoryProducts(filteredProducts)
          }
        } else {
          console.error("Failed to fetch products from API")
          const filteredProducts = products.filter(product =>
            product.subcategory && Array.isArray(product.subcategory) &&
            product.subcategory.some(sub => sub.toLowerCase().includes(subcategory.toLowerCase()))
          )
          setSubcategoryProducts(filteredProducts)
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      const filteredProducts = products.filter(product =>
        product.subcategory && Array.isArray(product.subcategory) &&
        product.subcategory.some(sub => sub.toLowerCase().includes(subcategory.toLowerCase()))
      )
      setSubcategoryProducts(filteredProducts)
    }

    setLoading(false)
  }


  // Function to get the first valid image URL from a product
  const getProductImage = (product) => {
    const { images } = product;
    if (!images || images.length === 0) return "/placeholder-image.jpg";

    // Case 1: If it's already a plain string URL
    if (typeof images[0] === "string") {
      try {
        // Try parsing it (in case it's a JSON stringified object)
        const parsed = JSON.parse(images[0]);
        const firstKey = Object.keys(parsed)[0]; // e.g. "Pink"
        return parsed[firstKey][0]; // first image inside that color
      } catch {
        return images[0]; // not JSON, just a URL string
      }
    }

    // Case 2: If it's an object with .url
    if (images[0]?.url) {
      return images[0].url;
    }

    return "/placeholder-image.jpg";
  };

  // Function to handle product click - FIXED THIS FUNCTION
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSelectedSubcategory("");
    setShowOnlyProducts(false);
  };

  // Helpers for discount and countdown
  const isWithinOfferWindow = (start, end) => {
    if (!end) return false
    const now = new Date()
    const startDate = start ? new Date(start) : null
    const endDate = new Date(end)
    return (startDate ? now >= startDate : true) && now < endDate
  }

  const getOfferCountdownLocal = (offerEndDate) => {
    if (!offerEndDate) return null
    const now = new Date()
    const end = new Date(offerEndDate)
    const diff = end - now
    if (diff <= 0) return null
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    if (days >= 1) {
      return `${days} day${days > 1 ? 's' : ''} left`
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const calcDiscountPercentLocal = (price, oldPrice, discountPercent) => {
    if (typeof discountPercent === 'number' && discountPercent > 0) return Math.round(discountPercent)
    if (oldPrice && oldPrice > price) {
      const pct = Math.round(((oldPrice - price) / oldPrice) * 100)
      return pct > 0 ? pct : 0
    }
    return 0
  }

  // Check if product has discount-only offer (no timeline)
  const hasDiscountOnly = (product) => {
    return product.discountPercent && product.discountPercent > 0 && !product.offerEndDate
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent || discountPercent <= 0) return originalPrice
    return Math.round(originalPrice - (originalPrice * discountPercent / 100))
  }

  // Get display prices for product
  const getDisplayPrices = (product) => {
    const discountOnly = hasDiscountOnly(product)
    const timeBasedOffer = isWithinOfferWindow(product.offerStartDate, product.offerEndDate)
    
    if (discountOnly) {
      const originalPrice = product.oldPrice || product.price
      const discountedPrice = calculateDiscountedPrice(originalPrice, product.discountPercent)
      return {
        currentPrice: discountedPrice,
        oldPrice: originalPrice,
        hasDiscount: true,
        discountPercent: product.discountPercent,
        isSpecialOffer: true
      }
    } else if (timeBasedOffer && product.oldPrice && product.oldPrice > product.price) {
      return {
        currentPrice: product.price,
        oldPrice: product.oldPrice,
        hasDiscount: true,
        discountPercent: Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100),
        isSpecialOffer: false
      }
    } else {
      return {
        currentPrice: product.price,
        oldPrice: product.oldPrice,
        hasDiscount: false,
        discountPercent: 0,
        isSpecialOffer: false
      }
    }
  }

  const isProfilePage = location.pathname === '/profile';

  if (isProfilePage) {
    return null; // Don't render navbar on profile page
  }

  return (

    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Main Header - Fixed at the top */}
      <div style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: "100%"
      }}>
        <div style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          height: "70px",
          gap: "20px"
        }}>

          {/* Logo and Brand Name - UPDATED WITH onClick */}
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Link
              to="/"
              style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
              onClick={handleLogoClick} // Add this onClick handler
            >
              <img
                src={logo}
                alt="SilkSew"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%"
                }}
              />
              <div style={{ marginLeft: "8px" }}>
                <h1 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#000",
                  margin: "0",
                  lineHeight: "1"
                }}>
                  SilkSew
                </h1>
                <p style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  margin: "0",
                  fontWeight: "400"
                }}>
                  Women's Fashion
                </p>
              </div>
            </Link>
          </div>


          {/* Navigation Menu - Desktop */}
          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", flex: 1 }}>
            {Object.keys(navigationMenu).map((menuItem) => (
              <div
                key={menuItem}
                style={{ position: "relative" }}
                onMouseEnter={() => handleDropdownHover(menuItem)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  to="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "0 16px",
                    height: "70px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    whiteSpace: "nowrap"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = "#d97706"
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = "#374151"
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    fetchProductsBySubcategory(menuItem);
                  }}
                >
                  <span>
                    {menuItem}
                  </span>
                  {navigationMenu[menuItem].length > 0 && (
                    <ChevronDown size={14} />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {activeDropdown === menuItem && navigationMenu[menuItem].length > 0 && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    backgroundColor: "#fff",
                    border: "1px solid ",
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    zIndex: 50,
                    minWidth: "200px",
                    padding: "8px 0"
                  }}>
                    {navigationMenu[menuItem].map((subItem) => (
                      <div
                        key={subItem}
                        style={{
                          display: "block",
                          padding: "12px 20px",
                          fontSize: "14px",
                          color: "#374151",
                          textDecoration: "none",
                          transition: "background-color 0.2s ease",
                          cursor: "pointer"
                        }}
                        onClick={() => fetchProductsBySubcategory(subItem)}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#f3f4f6"
                          e.target.style.color = "#d97706"
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "transparent"
                          e.target.style.color = "#374151"
                        }}
                      >
                        {subItem}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar and Icons + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>

            {/* Search Bar */}
            <div className="search-container-inline" style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                style={{
                  width: "250px",
                  padding: "10px 40px 10px 15px",
                  border: "1px solid #d1d5db",
                  borderRadius: "25px",
                  fontSize: "14px",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#d97706"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"
                }
              />
              <Search
                size={18}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280"
                }}
              />

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "45px",
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 50,
                  maxHeight: "300px",
                  overflowY: "auto"
                }}>
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      style={{
                        padding: "12px 15px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f3f4f6"
                      }}
                      onClick={() => handleSelectProduct(product._id)}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"
                      }
                    >
                      <div style={{ fontSize: "14px", color: "#374151" }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        ₹{product.price}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* User Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Link
                to={user ? "/profile" : "/login"}
                style={{ color: "#374151" }}
                onMouseOver={(e) => e.target.style.color = "#d97706"}
                onMouseOut={(e) => e.target.style.color = "#374151"}
              >
                <User size={22} />
              </Link>

              <Link
                to="/favorites"
                style={{ position: "relative", color: "#374151" }}
                onMouseOver={(e) => e.target.style.color = "#d97706"}
                onMouseOut={(e) => e.target.style.color = "#374151"}
              >
                <Heart size={22} />
                {favoritesCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "600",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {favoritesCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                style={{ position: "relative", color: "#374151" }}
                onMouseOver={(e) => e.target.style.color = "#d97706"}
                onMouseOut={(e) => e.target.style.color = "#374151"}
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "600",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Search icon (visible on mobile via CSS) */}
            <button
              aria-label="Open search"
              className="mobile-search-button"
              onClick={() => setShowMobileSearch(true)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer"
              }}
            >
              <Search className="hamburger-icon" />
            </button>

            {/* Hamburger button (visible on mobile via CSS) */}
            <button
              aria-label="Toggle navigation"
              className={`hamburger-menu ${showMobileMenu ? 'active' : ''}`}
              onClick={() => setShowMobileMenu((prev) => !prev)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer"
              }}
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? <X className="hamburger-icon" /> : <Menu className="hamburger-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Add padding to the top of the main content to account for fixed navbar */}
      <div style={{ paddingTop: "70px" }}>
        {/* Your main page content goes here */}
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            zIndex: 1100,
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            onKeyPress={(e) => {
              handleKeyPress(e)
              if (e.key === 'Enter') setShowMobileSearch(false)
            }}
            autoFocus
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#d97706"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
          <button
            aria-label="Close search"
            onClick={() => setShowMobileSearch(false)}
            style={{
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {showMobileMenu && (
        <div
          ref={mobileNavRef}
          className="nav-menu active"
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            zIndex: 1100,
            padding: "12px 16px",
            maxHeight: "calc(100vh - 70px)",
            overflowY: "auto"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {Object.keys(navigationMenu).map((menuItem) => (
              <div key={menuItem} style={{ borderBottom: "1px solid #f3f4f6", padding: "8px 0" }}>
                <button
                  onClick={() => {
                    fetchProductsBySubcategory(menuItem)
                    setShowMobileMenu(false)
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "transparent",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#111827",
                    padding: "8px 4px",
                    cursor: "pointer"
                  }}
                >
                  <span>{menuItem}</span>
                  {navigationMenu[menuItem].length > 0 && <ChevronDown size={16} />}
                </button>
                {navigationMenu[menuItem].length > 0 && (
                  <div style={{ paddingLeft: "8px", display: "grid", gap: "6px", paddingBottom: "8px" }}>
                    {navigationMenu[menuItem].map((subItem) => (
                      <button
                        key={subItem}
                        onClick={() => {
                          fetchProductsBySubcategory(subItem)
                          setShowMobileMenu(false)
                        }}
                        style={{
                          textAlign: "left",
                          background: "transparent",
                          border: "none",
                          color: "#374151",
                          fontSize: "14px",
                          padding: "6px 4px",
                          cursor: "pointer"
                        }}
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subcategory Products Display - Fixed overlay positioned higher */}
      {selectedSubcategory && showOnlyProducts &&
        !location.pathname.startsWith("/admin") && (
          <div style={{
            position: 'fixed',
            top: '70px', // Positioned right below the navbar
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(249, 250, 251, 0.98)",
            backdropFilter: "blur(5px)",
            padding: "30px 20px 0",
            overflowY: "auto",
            zIndex: 999,
            animation: "fadeIn 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{
              maxWidth: "1400px",
              margin: "0 auto",
              position: "relative",
              flex: "1"
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                padding: "0 10px"
              }}>
                <h2 style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#1f2937",
                  margin: 0,
                  textTransform: "capitalize"
                }}>
                  {selectedSubcategory} <span style={{ fontSize: "18px", color: "#6b7280", fontWeight: "500" }}>({subcategoryProducts.length} products)</span>
                </h2>
                <button
                  onClick={() => {
                    setSelectedSubcategory("");
                    setShowOnlyProducts(false);
                  }}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "500",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#b91c1c";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "#dc2626";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  <X size={18} />

                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "60px" }}>
                  <div style={{
                    display: "inline-block",
                    width: "40px",
                    height: "40px",
                    border: "3px solid #f3f3f3",
                    borderTop: "3px solid #d97706",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}></div>
                  <p style={{ marginTop: "20px", color: "#6b7280", fontSize: "16px" }}>Loading products...</p>
                </div>
              ) : subcategoryProducts.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "25px",
                  paddingBottom: "30px"
                }}>
                  {subcategoryProducts.map((product) => {
                    const priceInfo = getDisplayPrices(product)
                    const offerActive = isWithinOfferWindow(product.offerStartDate, product.offerEndDate)
                    const countdown = offerActive ? getOfferCountdownLocal(product.offerEndDate) : null
                    return (
                      <div key={product._id} style={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        padding: "16px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden"
                      }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "translateY(-6px)";
                          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                        }}
                        onClick={() => handleProductClick(product._id)}
                      >
                        {/* Removed top-left pill per request */}
                        <div style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          zIndex: 2
                        }}>
                          <FavoriteButton productId={product._id} size={20} />
                        </div>

                        <div style={{
                          width: "100%",
                          height: "220px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          marginBottom: "14px",
                          position: "relative"
                        }}>
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = "scale(1.05)";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = "scale(1)";
                            }}
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg"
                            }}
                          />
                          {/* Discount Badge */}
                          {priceInfo.hasDiscount && (
                            <div 
                              style={{
                                position: "absolute",
                                top: "8px",
                                left: "8px",
                                backgroundColor: priceInfo.isSpecialOffer ? "#16a34a" : "#dc2626",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                zIndex: 3,
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              {priceInfo.isSpecialOffer && <span>Special Offer</span>}
                              <span>{priceInfo.discountPercent}% OFF</span>
                            </div>
                          )}
                        </div>

                        <h3 style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          margin: "0 0 8px 0",
                          color: "#1f2937",
                          lineHeight: "1.4",
                          height: "44px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical"
                        }}>
                          {product.name}
                        </h3>

                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px"
                        }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <p style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#1f2937",
                              margin: "0"
                            }}>
                              ₹{priceInfo.currentPrice}
                            </p>
                            {priceInfo.hasDiscount && priceInfo.oldPrice && (
                              <span style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#6b7280",
                                textDecoration: 'line-through'
                              }}>₹{priceInfo.oldPrice}</span>
                            )}
                          </div>
                          
                          {/* Savings and countdown info */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {priceInfo.hasDiscount && (
                              <span style={{ 
                                fontSize: "11px", 
                                color: "#16a34a", 
                                fontWeight: "600" 
                              }}>
                                You save ₹{priceInfo.oldPrice - priceInfo.currentPrice}
                              </span>
                            )}
                            {offerActive && countdown && (
                              <span style={{
                                border: '1px solid #16a34a',
                                color: '#16a34a',
                                padding: '2px 6px',
                                borderRadius: 9999,
                                fontWeight: 600,
                                fontSize: '10px',
                                whiteSpace: 'nowrap'
                              }}>{countdown}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "60px" }}>
                  <div style={{
                    fontSize: "60px",
                    color: "#e5e7eb",
                    marginBottom: "20px",
                    animation: "bounce 2s infinite"
                  }}>🛍️</div>
                  <p style={{ color: "#6b7280", fontSize: "18px", marginBottom: "30px" }}>
                    No products found in "{selectedSubcategory}" category.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSubcategory("");
                      setShowOnlyProducts(false);
                    }}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#d97706",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "500",
                      fontSize: "16px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#b45309";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#d97706";
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer inside the product container */}
            <Footer />

          </div>
        )}

      {/* CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

    </div>
  )
}

export default Navbar
