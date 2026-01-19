"use client"

import { useState , useEffect } from "react"
import { Link } from "react-router-dom"
import "./Hero.css"
import NewCollections from "../NewCollections/NewCollections"
import bridal from "../Assets/bridal.jpg"
import background_img from "../Assets/kurtibanner1.webp"
import { X, Tag } from "lucide-react"

// Import Diwali images with correct paths
import diwali1 from "../Assets/diwali1.png";
import diwali2 from "../Assets/diwali2.png";


const Hero = () => {
  const [saleTexts, setSaleTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaleIndicator, setShowSaleIndicator] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  
  // Carousel state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Carousel slides data
  const carouselSlides = [
    {
      image: background_img,
      title: "Elegance Redefined for Every Woman",
      subtitle: "Women's Fashion Collection",
      description: "From traditional Indian wear to contemporary Western styles, discover fashion that celebrates your individuality and empowers your confidence."
    },
    {
      image: "/herosection6.jpg",
      title: "Discover Your Perfect Style",
      subtitle: "Exclusive Collection",
      description: "Explore our curated selection of premium fabrics and timeless designs that speak to your unique fashion sense."
    },
    {
      image: "/herosection1.jpg",
      title: "Traditional Meets Modern",
      subtitle: "Fusion Fashion",
      description: "Where heritage craftsmanship meets contemporary design, creating pieces that are both classic and current."
    },
    {
      image: "/herosection2.webp",
      title: "Unleash Your Inner Beauty",
      subtitle: "Premium Fashion",
      description: "Transform your wardrobe with our stunning collection that combines elegance, comfort, and sophistication."
    },
    {
      image: "/herosection3.jpg",
      title: "Timeless Elegance",
      subtitle: "Classic Collection",
      description: "Embrace the beauty of timeless designs that never go out of style, perfect for every occasion."
    },
    {
      image: "/herosection4.jpg",
      title: "Modern Sophistication",
      subtitle: "Contemporary Style",
      description: "Step into the world of modern fashion with cutting-edge designs that define today's trends."
    },
    {
      image: "/herosection5.jpg",
      title: "Luxury Redefined",
      subtitle: "Premium Collection",
      description: "Experience the pinnacle of fashion excellence with our exclusive luxury designs crafted for the discerning fashion enthusiast."
    }
  ];

  const festivalThemes = {
    diwali: {
      stickers: [
        { src: diwali1, size: "large", position: "top-left" },
        { src: diwali2, size: "large", position: "top-right" },
        { src: diwali1, size: "large", position: "bottom-left" },
        { src: diwali2, size: "large", position: "bottom-right" },
        { src: diwali1, size: "large", position: "center" },
      ],
    },
    "special sale": {
      stickers: [
        { src: diwali1, size: "large", position: "top-left" },
        { src: diwali2, size: "medium", position: "top-right" },
        { src: diwali1, size: "medium", position: "bottom-left" },
        { src: diwali2, size: "large", position: "bottom-right" },
        { src: diwali1, size: "medium", position: "center" },
      ],
    },
    navratri: {
      stickers: [
     
      ],
    },
    dusshera: {
      stickers: [],
    },
    generic: {
      stickers: [],
    }
  }

  useEffect(() => {
    const fetchMahasales = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.silksew.com/api/offer/mahasales/active');
        const data = await response.json();

        if (data.success && data.mahasales && data.mahasales.length > 0) {
          const mahasales = data.mahasales.map(sale => {
            // Extract festival name properly
            const festivalName = sale.mahasale?.festivalName || "Special Sale";
            const festivalKey = festivalName.toLowerCase();

            return {
              status: sale.mahasale?.status || "LIVE NOW",
              title: festivalName,
              collection: sale.description || "Festive Collection",
              discount: sale.offerType === "percentage"
                ? `Up to ${sale.value}% OFF`
                : `Flat ₹${sale.value} OFF`,
              description: sale.mahasale?.featuredText || "Special festival offer",
              color: sale.mahasale?.themeColor || "#ff3e6c",
              offerId: sale._id,
              festival: festivalKey // Use the lowercase key
            }
          });

          setSaleTexts(mahasales);
          const hasShownThisSession = sessionStorage.getItem('mahasale_modal_shown') === '1';
          if (!hasShownThisSession) {
            setShowSaleModal(true);
            sessionStorage.setItem('mahasale_modal_shown', '1');
          }
          setShowSaleIndicator(true);
        }
      } catch (error) {
        console.error("Error fetching mahasales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMahasales();
  }, []);

  useEffect(() => {
    if (saleTexts.length === 0) return;

    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % saleTexts.length);
    }, 3000);

    return () => {
      clearInterval(textInterval);
    };
  }, [saleTexts.length]);

  // Auto-rotate carousel
  useEffect(() => {
    const carouselInterval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 4000); // Change slide every 4 seconds

    return () => {
      clearInterval(carouselInterval);
    };
  }, [carouselSlides.length]);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const triggerNavbarNavigation = (category) => {
    const event = new CustomEvent('navigateToCategory', { detail: { category } });
    window.dispatchEvent(event);
    setShowSaleModal(false);
  }

  const closeModal = () => {
    setShowSaleModal(false);
  }

  const reopenModal = () => {
    setShowSaleModal(true);
  }

  if (isLoading) {
    return <div className="main-container">Loading...</div>;
  }

  const currentSale = saleTexts[currentTextIndex] || {};

  // Get the correct festival theme
  const getFestivalTheme = (festival) => {
    const theme = festivalThemes[festival] || festivalThemes.generic;
    console.log("Festival:", festival, "Theme found:", theme);
    console.log("Available themes:", Object.keys(festivalThemes));
    return theme;
  };

  const currentTheme = getFestivalTheme(currentSale.festival);

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        {/* Carousel Container */}
        <div className="carousel-container">
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlideIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: slide.image.includes('herosection1.jpg') || slide.image.includes('herosection4.jpg')
                  ? 'center 35%' 
                  : slide.image.includes('herosection3.jpg') || slide.image.includes('herosection4.jpg') || slide.image.includes('herosection5.jpg') ||slide.image.includes('herosection6.jpg') 
                    ? 'center 55%' 
                    : 'center 90%'
              }}
            >
              {/* Hero Content Overlay */}
              <div className="hero-content">
                <div className="hero-text-content">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <p className="hero-description">{slide.description}</p>
                  {/* <div className="hero-buttons">
                    <button 
                      onClick={() => triggerNavbarNavigation("women")}
                      className="hero-button primary"
                    >
                      Shop Women's Collection →
                    </button>
                    <button 
                      onClick={() => triggerNavbarNavigation("New Arrivals")}
                      className="hero-button secondary"
                    >
                      View New Arrivals
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="carousel-controls">
          <div className="carousel-dots">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlideIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="features-strip">
        <div className="features-strip-content">
          <div className="feature-item">
            <span className="feature-icon">@</span>
            <span className="feature-text">7 Days Easy Return</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">[)</span>
            <span className="feature-text">Cash on Delivery</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">@</span>
            <span className="feature-text">Lowest Prices</span>
          </div>
        </div>
      </div>

      {/* Sale Modal */}
      {showSaleModal && saleTexts.length > 0 && (
        <div className="sale-modal-overlay">
          <div className="sale-modal-container">
            <div
              className="sale-modal-content"
              style={{
                background: `linear-gradient(135deg, ${currentSale.color}99, ${currentSale.color}40)`,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <button
                onClick={closeModal}
                className="sale-modal-close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="sale-modal-grid">
                <div className="sale-modal-text">
                  <div className="sale-status">
                    {currentSale.status || "LIVE NOW"}
                  </div>
                  <h2 className="sale-title">
                    {currentSale.title || "Special Sale"}
                  </h2>
                  <h3 className="sale-collection">
                    {currentSale.collection || "Festive Collection"}
                  </h3>
                  <div className="sale-discount">
                    {currentSale.discount || "Up to 50% OFF"}
                  </div>
                  <p className="sale-description">
                    {currentSale.description || "Special festival offer"}
                  </p>
                  <div className="sale-buttons">
                    <button
                      onClick={() => triggerNavbarNavigation("All Products")}
                      className="sale-button primary"
                    >
                      Shop Now
                    </button>
                    <button
                      onClick={() => triggerNavbarNavigation("All Products")}
                      className="sale-button secondary"
                    >
                      View Collection
                    </button>
                  </div>
                </div>

                <div className="sale-modal-image">
                  <img
                    src={bridal}
                    alt="Wedding Collection"
                    className="sale-image"
                  />
                  <div className="sale-image-overlay"></div>
                </div>

                {/* Stickers Container - Fixed with better positioning */}
                <div className="stickers-container">
                  {currentTheme.stickers?.map((sticker, index) => (
                    <img
                      key={index}
                      src={sticker.src}
                      alt={`${currentSale.festival} sticker`}
                      className={`sticker-item sticker-${sticker.size} sticker-${sticker.position}`}
                      onError={(e) => {
                        console.error(`Error loading sticker ${index}:`, sticker.src);
                        e.target.style.display = 'none';
                      }}
                      onLoad={() => console.log(`Sticker ${index} loaded successfully:`, sticker.src)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <NewCollections />
    </>
  )
}

export default Hero