"use client"

import { useState, useContext, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip} from "recharts"
import "../pages/CSS/AdminPage.css"
import { AuthContext } from "../context/AuthContext"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AdminComplaints from "../pages/AdminComplaints"
import ConfirmedOrder from "./ShippedOrders"
import AdminAddProduct from "./AdminAddProduct"
import AdminProductlist from "./AdminProductlist"
import AdminNavbar from "../components/Navbar/AdminNavbar"
import CustomerReview from "../pages/CustomerReview"
import {
  faHome,
  faShoppingCart,
  faSignOutAlt,
  faPlus,
  faList,
  faComments,
  faTruck,
  faCheck,
  faUndo,
  faTags,
  faBox,
  faChartLine,
  faCheckCircle,
  faIndianRupeeSign,
  faClock,
  faBars,
  faMedal ,
  faListAlt,
  faBell,
  faTimes,
  faEye,
} from "@fortawesome/free-solid-svg-icons"
import AdminUser from "./AdminUser"
import ShippedOrders from "./ConfirmedOrders"
import ReturnOrderList from "../components/ReturnOrderList/ReturnOrderList"
import OfferForm from "../components/OfferForm/OfferForm"
import UPdateRemoveoffer from "../components/UpdateRemoveOffer/UpdateRemoveOffer"
import StockAlarm from "../components/StockAlarm"
import Subscription from "../components/Subscription"

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("Dashboard")
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [confirmedOrdersCount, setConfirmedOrdersCount] = useState(0)
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [totalSales, setTotalSales] = useState(() => {
    const storedTotalSales = localStorage.getItem("totalSales")
    return storedTotalSales ? Number.parseFloat(storedTotalSales) : 0
  })
  const [isMobile, setIsMobile] = useState(false)
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [detailedViewType, setDetailedViewType] = useState("")
  const [allProducts, setAllProducts] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [confirmedOrders, setConfirmedOrders] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile) {
        setSidebarOpen(true) // Open sidebar by default on desktop
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const handleMenuClick = (option) => {
    setSelectedOption(option)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const updateTotalProducts = (count) => {
    setTotalProducts(count)
  }

  const updateTotalOrders = (count) => {
    setTotalOrders(count)
  }

  const updateConfirmedOrdersCount = (count) => {
    setConfirmedOrdersCount(count)
  }

  const updatePendingOrdersCount = (count) => {
    setPendingOrdersCount(count)
  }

  const updateNewOrdersCount = (count) => {
    setNewOrdersCount(count)
  }

  const updateLowStockProducts = (products) => {
    setLowStockProducts(products)
  }

  const updateTotalSales = (amount) => {
    setTotalSales(amount)
    localStorage.setItem("totalSales", amount.toString())
  }

  const handleLogoutClick = () => {
    logout()
    navigate("/login")
  }

  const handleCardClick = async (type) => {
    setDetailedViewType(type)
    setShowDetailedView(true)
    
    try {
      if (type === "Products") {
        const response = await axios.get("http://localhost:5003/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAllProducts(Array.isArray(response.data) ? response.data : response.data.products || [])
      } else if (type === "Orders") {
        const response = await axios.get("http://localhost:5003/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const ordersData = Array.isArray(response.data) ? response.data : response.data.orders || []
        setAllOrders(ordersData)
      } else if (type === "Confirmed") {
        const response = await axios.get("http://localhost:5003/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const ordersData = Array.isArray(response.data) ? response.data : response.data.orders || []
        setConfirmedOrders(ordersData.filter(order => order.status === "Confirmed"))
      } else if (type === "Pending") {
        const response = await axios.get("http://localhost:5003/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const ordersData = Array.isArray(response.data) ? response.data : response.data.orders || []
        setPendingOrders(ordersData.filter(order => order.status === "Pending"))
      }
    } catch (error) {
      console.error("Error fetching detailed data:", error)
      toast.error("Failed to fetch data. Please try again.")
    }
  }

  const closeDetailedView = () => {
    setShowDetailedView(false)
    setDetailedViewType("")
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const closeOrderModal = () => {
    setShowOrderModal(false)
    setSelectedOrder(null)
  }

  const fetchInitialCounts = async () => {
    if (token) {
      try {
        // Fetch products
        let productsData = []
        try {
          const productsResponse = await axios.get("http://localhost:5003/api/products", {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000, // 10 seconds timeout
          })
          productsData = Array.isArray(productsResponse.data)
            ? productsResponse.data
            : productsResponse.data.products || []
          setTotalProducts(productsData.length)
          setLowStockProducts(productsData.filter((product) => product.availableStock <= 5))
        } catch (productError) {
          console.error("Error fetching products:", productError.message)
          toast.error("Failed to fetch products. Please check if the server is running.")
        }

        // Fetch orders
        let ordersData = []
        try {
          const ordersResponse = await axios.get("http://localhost:5003/api/orders", {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000, // 10 seconds timeout
          })
          ordersData = Array.isArray(ordersResponse.data) ? ordersResponse.data : ordersResponse.data.orders || []
          setTotalOrders(ordersData.length)

          let totalSales = 0
          let confirmedCount = 0
          let pendingCount = 0
          ordersData.forEach((order) => {
            if (order.status === "Confirmed") {
              totalSales += order.totalAmount || 0
              confirmedCount++
            } else {
              pendingCount++
            }
          })
          updateTotalSales(totalSales)
          setConfirmedOrdersCount(confirmedCount)
          setPendingOrdersCount(pendingCount)
          setNewOrdersCount(pendingCount) // New orders are the same as pending orders
        } catch (orderError) {
          console.error("Error fetching orders:", orderError.message)
          toast.error("Failed to fetch orders. Please check if the server is running.")
        }
      } catch (error) {
        console.error("Unexpected error in fetchInitialCounts:", error)
        toast.error("An unexpected error occurred. Please try again later.")
      }
    }
  }

  useEffect(() => {
    fetchInitialCounts()
  }, [token])

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, isSidebarOpen])

  const pieChartData = [
    { name: "Products", value: totalProducts, color: "#4F46E5", icon: faBox },
    { name: "Orders", value: totalOrders, color: "#059669", icon: faShoppingCart },
    { name: "Confirmed", value: confirmedOrdersCount, color: "#D97706", icon: faCheckCircle },
    { name: "Pending", value: pendingOrdersCount, color: "#8B5CF6", icon: faClock },
    { name: "Sales", value: Math.round(totalSales / 100), color: "#DC2626", icon: faIndianRupeeSign },
  ]

  const COLORS = ["#4F46E5", "#059669", "#D97706", "#8B5CF6", "#DC2626"]

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: "1px solid #e5e7eb",
            fontSize: "14px",
          }}
        >
          <p
            style={{
              fontWeight: "600",
              color: "#1f2937",
              margin: "0 0 4px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FontAwesomeIcon icon={data.icon} style={{ color: data.color }} />
            {data.name}
          </p>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: data.color,
              margin: "0",
            }}
          >
            {data.name === "Sales" ? `₹${(data.value * 100).toLocaleString()}` : data.value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #4F46E5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    )
  }

  return (
    <>
      <AdminNavbar />
      
      {/* Mobile Header with Menu Icon */}
      {isMobile && (
        <div style={{
          position: "fixed",
          top: "60px",
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          zIndex: 999,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <button 
            onClick={toggleSidebar}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#4F46E5",
              padding: "8px",
              borderRadius: "6px",
              marginRight: "15px"
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h2 style={{ 
            margin: 0, 
            fontSize: "18px", 
            fontWeight: "bold",
            color: "#1e293b"
          }}>
            {selectedOption === "Dashboard" ? "Dashboard Overview" : selectedOption}
          </h2>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          style={{
            position: "fixed",
            top: "120px",
            left: 0,
            width: "100%",
            height: "calc(100vh - 120px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
          onClick={toggleSidebar}
        />
      )}

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#bfdbfe",
          paddingTop: "60px", // Push content below navbar
        }}
      >
        {/* Enhanced Sidebar */}
        <div
          className={`sidebar ${isSidebarOpen ? "open" : ""}`}
          style={{
            width: isMobile ? "280px" : "250px",
            minWidth: isMobile ? "280px" : "250px",
            backgroundColor: "white",
            boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            position: isMobile ? "fixed" : "fixed",
            left: isMobile ? (isSidebarOpen ? "0" : "-280px") : "0",
            top: "60px", // Fixed below navbar for both mobile and desktop
            height: "calc(100vh - 60px)",
            transform: isMobile ? 
              (isSidebarOpen ? "translateX(0)" : "translateX(-100%)") : 
              "translateX(0)",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, paddingBottom: "8px", backgroundColor:"white"}}>
              {[
                {
                  key: "Dashboard",
                  icon: faHome,
                  label: "Dashboard",
                },
                { key: "AddProduct", icon: faPlus, label: "Add Product" },
                { key: "ListProducts", icon: faList, label: "Product List" },
                { key: "Orders", icon: faShoppingCart, label: "Orders", notification: newOrdersCount },
                // { key: "ReturnRequest", icon: faUndo, label: "Return Requests" },
                // { key: "ShippedOrders", icon: faCheck, label: "Confirmed Orders" },
                // { key: "ConfirmedOrder", icon: faTruck, label: "Shipped Orders" },
                { key: "Reviews", icon: faComments, label: "Reviews" },
                { key: "OfferForm", icon: faTags, label: "Add Offers" },
                { key: "update-remove-offer", icon: faListAlt, label: "Offers List" },
                { key: "StockAlarm", icon: faBell, label: "Stock Alarm", notification: lowStockProducts.length },
                { key: "Subscriptions", icon: faMedal, label: "Subscriptions" }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    backgroundColor: selectedOption === item.key ? "#f0f4ff" : "transparent",
                    borderRight: selectedOption === item.key ? "4px solid #4F46E5" : "4px solid transparent",
                    color: selectedOption === item.key ? "#4F46E5" : "#64748b",
                    fontWeight: selectedOption === item.key ? "600" : "500",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedOption !== item.key) {
                      e.currentTarget.style.backgroundColor = "#bfdbfe"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOption !== item.key) {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    style={{
                      marginRight: "10px",
                      width: "14px",
                      color: selectedOption === item.key ? "#4F46E5" : "#94a3b8",
                    }}
                  />
                  <span>{item.label}</span>
                  {item.notification > 0 && (
                    <span
                      style={{
                        marginLeft: "auto",
                        backgroundColor: "#dc2626",
                        color: "white",
                        borderRadius: "12px",
                        padding: "2px 8px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {item.notification}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Logout Button in Sidebar (for both mobile and desktop) */}
            <div
              onClick={handleLogoutClick}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 16px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                color: "#dc2626",
                fontWeight: "600",
                borderTop: "1px solid #e2e8f0",
                fontSize: "14px",
                flexShrink: 0,
                backgroundColor: "#fef2f2",
                margin: "10px",
                borderRadius: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626"
                e.currentTarget.style.color = "white"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fef2f2"
                e.currentTarget.style.color = "#dc2626"
              }}
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                style={{
                  marginRight: "10px",
                  width: "14px",
                }}
              />
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#f8fafc",
            minWidth: 0,
            marginLeft: isMobile ? "0" : "250px", // Proper margin for desktop sidebar
            padding: isMobile ? "80px 15px 20px 15px" : "25px",
            minHeight: "calc(100vh - 60px)",
          }}
        >
          {selectedOption === "Dashboard" && (
            <div
              style={{
                minHeight: "100%",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
              }}
            >
              <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ 
                  textAlign: "center", 
                  marginBottom: "30px",
                  padding: isMobile ? "10px 0" : "0"
                }}>
                  <h1
                    style={{
                      fontSize: isMobile ? "1.5rem" : "2rem",
                      fontWeight: "bold",
                      color: "#1e293b",
                      marginBottom: "8px",
                      background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                    }}
                  >
                    <FontAwesomeIcon icon={faChartLine} style={{ color: "#4F46E5" }} />
                    Dashboard Overview
                  </h1>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      fontWeight: "500",
                    }}
                  >
                    Real-time business insights and analytics
                  </p>
                </div>

                {/* Stats Cards - Smaller and in single row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
                    gap: "15px",
                    marginBottom: "30px",
                  }}
                >
                  {pieChartData.map((item, index) => (
                    <div
                      key={index}
                      onClick={item.name !== "Sales" ? () => handleCardClick(item.name) : undefined}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                        border: "1px solid #e2e8f0",
                        padding: "15px",
                        transition: "all 0.3s ease",
                        cursor: item.name !== "Sales" ? "pointer" : "default",
                        textAlign: "center",
                        minHeight: "100px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => {
                        if (!isMobile && item.name !== "Sales") {
                          e.currentTarget.style.transform = "translateY(-3px)"
                          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.12)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile && item.name !== "Sales") {
                          e.currentTarget.style.transform = "translateY(0)"
                          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)"
                        }
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.2rem",
                          padding: "10px",
                          borderRadius: "10px",
                          backgroundColor: `${item.color}15`,
                          color: item.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 8px auto",
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        <FontAwesomeIcon icon={item.icon} />
                      </div>
                      <h3
                        style={{
                          color: "#64748b",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "5px",
                          margin: "0",
                        }}
                      >
                        {item.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                          color: "#1e293b",
                          margin: "0",
                          lineHeight: "1.2",
                        }}
                      >
                        {item.name === "Sales"
                          ? `₹${totalSales.toLocaleString()}` // Changed this line
                          : item.value.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

            

                {/* Inline Table Section */}
                {showDetailedView && (
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "15px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                      border: "1px solid #e2e8f0",
                      padding: "25px",
                      marginBottom: "30px",
                    }}
                  >
                    {/* Table Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        paddingBottom: "15px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                          color: "#1e293b",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <FontAwesomeIcon 
                          icon={
                            detailedViewType === "Products" ? faBox :
                            detailedViewType === "Orders" ? faShoppingCart :
                            detailedViewType === "Confirmed" ? faCheckCircle :
                            faClock
                          } 
                          style={{ color: detailedViewType === "Products" ? "#4F46E5" : detailedViewType === "Orders" ? "#059669" : detailedViewType === "Confirmed" ? "#D97706" : "#8B5CF6" }} 
                        />
                        {detailedViewType} Details
                      </h2>
                      <button
                        onClick={closeDetailedView}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "1.2rem",
                          cursor: "pointer",
                          color: "#6b7280",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f3f4f6"
                          e.currentTarget.style.color = "#dc2626"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                          e.currentTarget.style.color = "#6b7280"
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>

                    {/* Table Content */}
                    <div style={{ overflowX: "auto" }}>
                      {detailedViewType === "Products" && (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>ID</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Name</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Category</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Price</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allProducts.map((product, index) => (
                              <tr key={product._id || index} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                                <td style={{ padding: "12px", color: "#374151" }}>{product._id?.slice(-6) || index}</td>
                                <td style={{ padding: "12px", color: "#374151", fontWeight: "500" }}>{product.name}</td>
                                <td style={{ padding: "12px", color: "#374151" }}>{product.category}</td>
                                <td style={{ padding: "12px", color: "#374151" }}>₹{product.new_price}</td>
                                <td style={{ padding: "12px", color: "#374151" }}>{product.availableStock}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {(detailedViewType === "Orders" || detailedViewType === "Confirmed" || detailedViewType === "Pending") && (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Order ID</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Customer</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Date</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Amount</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Status</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Payment</th>
                              <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(detailedViewType === "Orders" ? allOrders : detailedViewType === "Confirmed" ? confirmedOrders : pendingOrders).map((order, index) => (
                              <tr key={order._id || index} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                                <td style={{ padding: "12px", color: "#374151" }}>{order._id?.slice(-6) || index}</td>
                                <td style={{ padding: "12px", color: "#374151", fontWeight: "500" }}>
                                  {order.address?.firstName} {order.address?.lastName}
                                </td>
                                <td style={{ padding: "12px", color: "#374151" }}>
                                  {new Date(order.date || order.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: "12px", color: "#374151" }}>₹{order.totalAmount}</td>
                                <td style={{ padding: "12px" }}>
                                  <span
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      backgroundColor: order.status === "Confirmed" ? "#dcfce7" : "#fef3c7",
                                      color: order.status === "Confirmed" ? "#166534" : "#92400e",
                                    }}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td style={{ padding: "12px" }}>
                                  <span
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      backgroundColor: order.paymentMethod === "Razorpay" ? "#dcfce7" : "#e0f2fe",
                                      color: order.paymentMethod === "Razorpay" ? "#166534" : "#0c4a6e",
                                    }}
                                  >
                                    {order.paymentMethod === "Razorpay" ? "Online Paid" : "COD"}
                                  </span>
                                </td>
                                <td style={{ padding: "12px" }}>
                                  <button
                                    onClick={() => handleViewOrder(order)}
                                    style={{
                                      padding: "6px 12px",
                                      backgroundColor: "#4F46E5",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* Chart Section */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "15px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #e2e8f0",
                    padding: "25px",
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <h2
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: "#1e293b",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <FontAwesomeIcon icon={faChartLine} style={{ color: "#4F46E5" }} />
                      Data Visualization
                    </h2>
                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                      }}
                    >
                      Interactive distribution metrics
                    </p>
                  </div>

                  <div style={{ height: isMobile ? "250px" : "300px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          {COLORS.map((color, index) => (
                            <linearGradient key={index} id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={color} />
                              <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={isMobile ? 80 : 100}
                          innerRadius={isMobile ? 40 : 50}
                          dataKey="value"
                          stroke="rgba(255,255,255,0.8)"
                          strokeWidth={2}
                          paddingAngle={2}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#gradient${index})`} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          wrapperStyle={{
                            fontSize: "11px",
                            fontWeight: "500",
                            paddingTop: "15px",
                          }}
                          iconType="circle"
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}

          {selectedOption === "AddProduct" && <AdminAddProduct />}
          {selectedOption === "ListProducts" && (
            <AdminProductlist
              updateTotalProducts={updateTotalProducts}
              updateLowStockProducts={updateLowStockProducts}
            />
          )}
          {selectedOption === "Orders" && <AdminUser updateTotalOrders={updateTotalOrders} updateNewOrdersCount={updateNewOrdersCount} />}
          {selectedOption === "complaints" && <AdminComplaints updateTotalOrders={updateTotalOrders} />}
          {selectedOption === "ConfirmedOrder" && (
            <ConfirmedOrder
              updateTotalOrders={updateTotalOrders}
              updateTotalSales={updateTotalSales}
              updateConfirmedOrdersCount={updateConfirmedOrdersCount}
            />
          )}
          {selectedOption === "ShippedOrders" && <ShippedOrders updateTotalOrders={updateTotalOrders} />}
          {selectedOption === "Reviews" && <CustomerReview />}
          {selectedOption === "ReturnRequest" && <ReturnOrderList />}
          {selectedOption === "OfferForm" && (
            <div style={{ position: "relative", zIndex: 10 }}>
              <OfferForm />
            </div>
          )}
          {selectedOption === "update-remove-offer" && (
            <div style={{ position: "relative", zIndex: 10 }}>
              <UPdateRemoveoffer />
            </div>
          )}
          {selectedOption === "StockAlarm" && (
            <div style={{ position: "relative", zIndex: 10 }}>
              <StockAlarm lowStockProducts={lowStockProducts} />
            </div>
          )}
          {selectedOption === "Subscriptions" && (
            <div style={{ position: "relative", zIndex: 10 }}>
              <Subscription />
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeOrderModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                paddingBottom: "15px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#1e2937",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FontAwesomeIcon icon={faEye} style={{ color: "#4F46E5" }} />
                Order Details
              </h3>
              <button
                onClick={closeOrderModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "5px",
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#dc2626"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6b7280"
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Order Information */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#374151", fontWeight: "600" }}>Order Information</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
                <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Order ID:</span>
                  <p style={{ margin: "2px 0", color: "#374151", fontWeight: "600" }}>{selectedOrder._id?.slice(-8).toUpperCase() || "N/A"}</p>
                </div>
                <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Order Date:</span>
                  <p style={{ margin: "2px 0", color: "#374151" }}>{new Date(selectedOrder.date || selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Order Status:</span>
                  <p style={{ margin: "2px 0" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: selectedOrder.status === "Confirmed" ? "#dcfce7" : selectedOrder.status === "Pending" ? "#fef3c7" : "#fee2e2",
                        color: selectedOrder.status === "Confirmed" ? "#166534" : selectedOrder.status === "Pending" ? "#92400e" : "#991b1b",
                      }}
                    >
                      {selectedOrder.status || "Pending"}
                    </span>
                  </p>
                </div>
                <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Payment Method:</span>
                  <p style={{ margin: "2px 0" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: selectedOrder.paymentMethod === "Razorpay" ? "#dcfce7" : "#e0f2fe",
                        color: selectedOrder.paymentMethod === "Razorpay" ? "#166534" : "#0c4a6e",
                      }}
                    >
                      {selectedOrder.paymentMethod === "Razorpay" ? "Online Paid" : "COD"}
                    </span>
                  </p>
                </div>
                {/* <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Payment Status:</span>
                  <p style={{ margin: "2px 0" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: selectedOrder.paymentStatus === "Paid" ? "#dcfce7" : "#fef3c7",
                        color: selectedOrder.paymentStatus === "Paid" ? "#166534" : "#92400e",
                      }}
                    >
                      {selectedOrder.paymentStatus || "Pending"}
                    </span>
                  </p>
                </div> */}
              </div>
            </div>

            {/* Processing Stage */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#374151", fontWeight: "600" }}>Processing Stage</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {["Order Placed", "Confirmed", "Processing", "Shipped", "Delivered"].map((stage, index) => {
                  const isCompleted = selectedOrder.status === "Confirmed" && index <= 1 || 
                                     selectedOrder.status === "Processing" && index <= 2 ||
                                     selectedOrder.status === "Shipped" && index <= 3 ||
                                     selectedOrder.status === "Delivered" && index <= 4;
                  const isCurrent = selectedOrder.status === stage.replace(" ", "");
                  
                  return (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: isCompleted ? "#4F46E5" : "#e5e7eb",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "600",
                          border: isCurrent ? "2px solid #4F46E5" : "none",
                        }}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      {index < 4 && (
                        <div
                          style={{
                            width: "30px",
                            height: "2px",
                            backgroundColor: isCompleted ? "#4F46E5" : "#e5e7eb",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <p style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
                Current Stage: <span style={{ fontWeight: "600", color: "#374151" }}>
                  {selectedOrder.status === "Confirmed" ? "Order Confirmed" :
                   selectedOrder.status === "Processing" ? "Being Processed" :
                   selectedOrder.status === "Shipped" ? "Out for Delivery" :
                   selectedOrder.status === "Delivered" ? "Order Delivered" :
                   "Order Pending"}
                </span>
              </p>
            </div>

            {/* Customer Information */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#374151", fontWeight: "600" }}>Customer Information</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px" }}>
                <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Name:</span>
                  <p style={{ margin: "2px 0", color: "#374151" }}>
                    {selectedOrder.address?.firstName} {selectedOrder.address?.lastName}
                  </p>
                </div>
                <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Email:</span>
                  <p style={{ margin: "2px 0", color: "#374151" }}>{selectedOrder.email || "N/A"}</p>
                </div>
                <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Phone:</span>
                  <p style={{ margin: "2px 0", color: "#374151" }}>{selectedOrder.phone || selectedOrder.address?.phone || "N/A"}</p>
                </div>
                <div>
                  <span style={{ color: "#6b7280", fontWeight: "500" }}>Address:</span>
                  <p style={{ margin: "2px 0", color: "#374151" }}>
                    {selectedOrder.address?.street}, {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pinCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#374151", fontWeight: "600" }}>Order Items</h4>
              {selectedOrder.items && selectedOrder.items.map((item, index) => (
                <div key={index} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "12px", 
                  backgroundColor: "#f9fafb", 
                  borderRadius: "8px", 
                  marginBottom: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", color: "#374151", marginBottom: "4px" }}>{item.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      Size: {item.size || "N/A"} | Color: {item.color || "N/A"} | Category: {item.category || "N/A"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                      Price: ₹{item.price} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "600", color: "#374151" }}>₹{item.price * item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "15px", borderTop: "2px solid #e5e7eb" }}>
              <span style={{ fontWeight: "600", color: "#1f2937" }}>Total Amount:</span>
              <span style={{ fontWeight: "bold", color: "#1f2937", fontSize: "1.1rem" }}>₹{selectedOrder.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Mobile specific styles */
        @media (max-width: 768px) {
          .sidebar {
            transition: transform 0.3s ease;
          }
        }

        /* Tablet styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          .stats-cards {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* Small mobile styles */
        @media (max-width: 480px) {
          .stats-cards {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </>
  )
}

export default Dashboard