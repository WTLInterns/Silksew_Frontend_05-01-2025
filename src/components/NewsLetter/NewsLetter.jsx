"use client"

import { color } from "framer-motion"
import React, { useState } from "react"

// Custom Button Component
const Button = ({ children, size, onClick, ...props }) => {
  const sizeStyles = {
    default: {
      padding: "8px 16px",
      fontSize: "14px",
    },
    lg: {
      padding: "12px 24px",
      fontSize: "16px",
    },
  }

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#d97706", // amber-500
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ...sizeStyles[size || "default"],
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#d97706" // amber-600
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#f59e0b"
      }}
      {...props}
    >
      {children}
    </button>
  )
}

// Custom Input Component
const Input = ({ type, placeholder, value, onChange, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        backgroundColor: "#f8fafc", // Changed to a light gray background
        color: "#1f2937",
        border: "1px solid #d1d5db", // Added 1px border as requested
        borderRadius: "6px",
        padding: "12px 16px",
        fontSize: "16px",
        outline: "none",
        flex: "1",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
      {...props}
    />
  )
}

// Custom Card Components
const Card = ({ children, style }) => {
  return (
    <div
      style={{
        backgroundColor: "#fdf2f8", // Changed to a light pink background instead of red
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "8px",
        maxWidth: "896px",
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const CardContent = ({ children, style }) => {
  return (
    <div
      style={{
        padding: "48px",
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubscribe = async () => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    try {
      const response = await fetch("https://api.silksew.com/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // "Subscribed successfully & email sent!"
        setEmail(""); // clear input
      } else {
        alert(data.message || "Subscription failed!");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const sectionStyles = {
    padding: "80px 0",
    backgroundColor: "#fce7f3", // Changed to a light pink background instead of dark red
    color: "black",
  }

  const containerStyles = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 16px",
    color: "black",
  }

  const titleStyles = {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "16px",
    fontFamily: "serif",
    lineHeight: "1.2",
    color: "black",
  }

  const subtitleStyles = {
    fontSize: "18px",
    marginBottom: "32px",
    color: "black",
    maxWidth: "512px",
    margin: "0 auto 32px auto",
    lineHeight: "1.6",
  }

  const formStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "384px",
    margin: "0 auto",
    color: "black"
  }

  const disclaimerStyles = {
    fontSize: "14px",
    color: "black",
    marginTop: "16px",
  }

  // Responsive
  const [isMobile, setIsMobile] = useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const responsiveFormStyles = {
    ...formStyles,
    flexDirection: isMobile ? "column" : "row",
  }

  const responsiveTitleStyles = {
    ...titleStyles,
    fontSize: isMobile ? "32px" : "48px",
  }

  return (
    <>
      {/* Why Choose Us Section */}
      <div style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        marginTop: isMobile ? "70px" : "90px", // Responsive margin based on navbar height
        textAlign: "center",
        backgroundImage: "url('/banner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        padding: isMobile ? "40px 20px" : "60px 40px", // Responsive padding
        boxShadow: "0 8px 32px rgba(139, 69, 19, 0.4)",
        position: "relative",
        overflow: "hidden",
        minHeight: isMobile ? "auto" : "400px" // Responsive height
      }}>
        {/* Enhanced glass overlay effect */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(45deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6))",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          pointerEvents: "none"
        }} />
        
        <div style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <h2 style={{
            fontSize: isMobile ? "24px" : "32px", // Responsive font size
            fontWeight: "300",
            marginBottom: "16px",
            fontFamily: "serif",
            color: "#ffffff",
            letterSpacing: "0.5px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
            position: "relative",
            zIndex: 2
          }}>
            Why Choose SilkSew
          </h2>
          
          <p style={{
            fontSize: isMobile ? "14px" : "16px", // Responsive font size
            color: "rgba(255, 255, 255, 0.95)",
            marginBottom: isMobile ? "32px" : "48px", // Responsive margin
            maxWidth: isMobile ? "100%" : "600px", // Responsive max width
            margin: "0 auto " + (isMobile ? "32px" : "48px") + " auto",
            lineHeight: "1.6",
            textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
            position: "relative",
            zIndex: 2,
            padding: isMobile ? "0 10px" : "0" // Responsive padding
          }}>
            Discover exceptional quality and service that sets us apart in the world of fashion
          </p>
          
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            gap: isMobile ? "24px" : "48px", // Responsive gap
            maxWidth: isMobile ? "100%" : "1000px", // Responsive max width
            margin: "0 auto",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 2,
            padding: isMobile ? "0 10px" : "0" // Responsive padding
          }}>
            <div style={{
              textAlign: "center",
              flex: isMobile ? "none" : "1", // Don't use flex on mobile
              width: isMobile ? "100%" : "auto" // Full width on mobile
            }}>
              <h3 style={{
                fontSize: isMobile ? "18px" : "20px", // Responsive font size
                fontWeight: "600",
                color: "#ffffff",
                margin: "0 0 8px 0",
                fontFamily: "serif",
                textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)"
              }}>
                Premium Quality 
              </h3>
              <p style={{
                fontSize: isMobile ? "13px" : "14px", // Responsive font size
                color: "rgba(255, 255, 255, 0.85)",
                margin: "0",
                lineHeight: "1.6",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)"
              }}>
                Hand-selected materials that ensure comfort and durability in every stitch
              </p>
            </div>
            <div style={{
              textAlign: "center",
              flex: isMobile ? "none" : "1", // Don't use flex on mobile
              width: isMobile ? "100%" : "auto" // Full width on mobile
            }}>
              <h3 style={{
                fontSize: isMobile ? "18px" : "20px", // Responsive font size
                fontWeight: "600",
                color: "#ffffff",
                margin: "0 0 8px 0",
                fontFamily: "serif",
                textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)"
              }}>
                Expert Craftsmanship
              </h3>
              <p style={{
                fontSize: isMobile ? "13px" : "14px", // Responsive font size
                color: "rgba(255, 255, 255, 0.85)",
                margin: "0",
                lineHeight: "1.6",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)"
              }}>
                Meticulously crafted by skilled artisans who pay attention to every detail
              </p>
            </div>
            <div style={{
              textAlign: "center",
              flex: isMobile ? "none" : "1", // Don't use flex on mobile
              width: isMobile ? "100%" : "auto" // Full width on mobile
            }}>
              <h3 style={{
                fontSize: isMobile ? "18px" : "20px", // Responsive font size
                fontWeight: "600",
                color: "#ffffff",
                margin: "0 0 8px 0",
                fontFamily: "serif",
                textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)"
              }}>
                Fast & Free Shipping
              </h3>
              <p style={{
                fontSize: isMobile ? "13px" : "14px", // Responsive font size
                color: "rgba(255, 255, 255, 0.85)",
                margin: "0",
                lineHeight: "1.6",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)"
              }}>
                Quick delivery right to your doorstep with free shipping on orders above $50
              </p>
            </div>
            <div style={{
              textAlign: "center",
              flex: isMobile ? "none" : "1", // Don't use flex on mobile
              width: isMobile ? "100%" : "auto" // Full width on mobile
            }}>
              <h3 style={{
                fontSize: isMobile ? "18px" : "20px", // Responsive font size
                fontWeight: "600",
                color: "#ffffff",
                margin: "0 0 8px 0",
                fontFamily: "serif",
                textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)"
              }}>
                Exclusive Designs
              </h3>
              <p style={{
                fontSize: isMobile ? "13px" : "14px", // Responsive font size
                color: "rgba(255, 255, 255, 0.85)",
                margin: "0",
                lineHeight: "1.6",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)"
              }}>
                Unique patterns and styles that you won't find anywhere else
              </p>
          </div>
        </div>
      </div>
    </div>

    <div style={{
      ...containerStyles,
      paddingTop: isMobile ? "40px" : "80px", // Responsive padding
      paddingBottom: isMobile ? "40px" : "80px" // Responsive padding
    }}>
      <Card>
        <CardContent>
          <div style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "24px" : "32px", // Responsive gap
            marginBottom: "32px",
            justifyContent: "space-between",
            padding: isMobile ? "0 10px" : "0" // Responsive padding
          }}>
            <img 
              src="/images/shopping.png" 
              alt="Shopping"
              style={{
                width: isMobile ? "150px" : "350px", // Responsive width
                height: isMobile ? "150px" : "400px", // Responsive height
                objectFit: "contain",
                margin: isMobile ? "0 auto" : "0" // Center on mobile
              }}
            />
              <div style={{ 
                flex: "1",
                textAlign: isMobile ? "center" : "left" // Center text on mobile
              }}>
              <h2 style={{
                ...responsiveTitleStyles,
                textAlign: isMobile ? "center" : "left", // Center on mobile
                marginBottom: isMobile ? "16px" : "16px"
              }}>Stay in Style</h2>
              <p style={{
                ...subtitleStyles,
                textAlign: isMobile ? "center" : "left", // Center on mobile
                maxWidth: isMobile ? "100%" : "512px", // Full width on mobile
                margin: isMobile ? "0 auto 24px auto" : "0 auto 32px auto" // Responsive margin
              }}>
                Be the first to know about new collections, exclusive offers, and style inspiration. Join our community of
                fashion enthusiasts.
              </p>
              <div style={{
                ...responsiveFormStyles,
                maxWidth: isMobile ? "100%" : "384px", // Full width on mobile
                margin: isMobile ? "0 auto" : "0" // Center on mobile
              }}>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSubscribe()
                    }
                  }}
                />
                <Button
                  size="lg"
                  onClick={handleSubscribe}
                  style={{
                    paddingLeft: "32px",
                    paddingRight: "32px",
                  }}
                >
                  Subscribe
                </Button>
              </div>
              <p style={{
                ...disclaimerStyles,
                textAlign: isMobile ? "center" : "left", // Center on mobile
                fontSize: isMobile ? "12px" : "14px" // Smaller font on mobile
              }}>By subscribing, you agree to our Privacy Policy and Terms of Service.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
  )
}

export default Newsletter