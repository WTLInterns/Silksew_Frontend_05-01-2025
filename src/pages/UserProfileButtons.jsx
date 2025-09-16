

"use client"

import { useEffect, useState, useContext, useCallback } from "react"
import axios from "axios"
import { ShopContext } from "../context/ShopContext"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import profile_icon from "../components/Assets/profile_icon.png"
import "../pages/CSS/UserProfile.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import OrderItems from "../components/OrderItems/OrderItems"
import CartItems from "../components/CartItems/CartItems"

const UserProfileButtons = () => {
  const { token } = useContext(ShopContext)
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userProducts, setUserProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  const menuItems = [
    { id: "info", title: "Personal Info" },
    { id: "orders", title: "My Orders" },
    { id: "logout", title: "Logout" },
  ]

  useEffect(() => {
    fetchUserData()
    fetchUserProducts()
  }, [])

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const fetchUserData = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("token")
      if (!authToken) {
        toast.error("No authentication token found. Please log in.")
        return
      }
      const response = await axios.get("https://api.silksew.com/api/userProfileDetail/user-profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      setUserData(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching user data:", err)
      toast.error("Failed to fetch user data. Please try again later.")
      setLoading(false)
    }
  }, [])

  const fetchUserProducts = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("token")
      if (!authToken) {
        toast.error("No authentication token found. Please log in.")
        return
      }
      setLoadingProducts(true)
      const response = await axios.get("https://api.silksew.com/api/orders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      setUserProducts(response.data)
      setLoadingProducts(false)
    } catch (err) {
      console.error("Error fetching user products:", err)
      toast.error("Failed to fetch user products. Please try again later.")
      setLoadingProducts(false)
    }
  }, [])

  const handleLogoutClick = () => {
    logout()
    navigate("/login")
  }

  const handleTabClick = (tabId) => {
    if (tabId === "logout") {
      handleLogoutClick()
    } else {
      setActiveTab(tabId)
      setIsSidebarOpen(false)
      setIsEditing(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const updateProfile = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }
  
    try {
      const response = await axios.put(
        "https://api.silksew.com/api/updateUserProfileDetail/update-user-profile",
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      toast.success("Profile Successfully Updated.");
      setIsEditing(false);
      
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed. Please try again.");
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading user data...</div>;
    }

    switch (activeTab) {
      case "info":
        return (
          <div className="tab-content">
            {isEditing ? renderUserForm() : renderUserCard()}
          </div>
        )
      case "orders":
        return (
          <div className="tab-content order-content">
            {loadingProducts ? (
              <div className="loading">Loading orders...</div>
            ) : (
              <div className="orders-container">
                <OrderItems />
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const renderUserCard = () => (
    <section className="profile-container">
      <div className="profile-info-card">
        <div className="profile-header">
          <h3 className="user-name-bold">{userData?.name || "John Doe"}</h3>
        </div>
        
        <div className="profile-details-grid">
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value email-value">{userData?.email || "john.doe@example.com"}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{userData?.phone || "+1 (556) 123-4567"}</span>
          </div>
        </div>
        
        <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      </div>
    </section>
  )

  const renderUserForm = () => (
    <section className="edit-profile-container">
      <div className="edit-profile-card">
        <h2 className="edit-profile-title">Edit Profile</h2>

        <form onSubmit={updateProfile} className="profile-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-input"
              id="name"
              name="name"
              value={userData?.name || ""}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              className="form-input"
              id="phone"
              name="phone"
              value={userData?.phone || ""}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-input"
              id="email"
              name="email"
              value={userData?.email || ""}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );

  return (
    <div className="user-profile-container">
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        <span className="toggle-icon">☰</span>
        <span className="toggle-text">Menu</span>
      </button>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="profile-sidebar">
            <img src={profile_icon} className="sidebar-profile-icon" alt="Profile" />
            <div className="sidebar-profile-info">
              <div className="sidebar-name">{userData?.name || "John Doe"}</div>
            </div>
          </div>
        </div>
        <div className="sidebar-title-section">
          <h2 className="sidebar-title">My Account</h2>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-menu-item">
              <button
                className={`sidebar-menu-button ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleTabClick(item.id)}
              >
                <span className="sidebar-menu-text">{item.title}</span>
                {activeTab === item.id && <span className="active-indicator"></span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <main className="main-content">
        {renderContent()}
      </main>
      <ToastContainer style={{marginTop: "10px"}} />
    </div>
  )
}

export default UserProfileButtons