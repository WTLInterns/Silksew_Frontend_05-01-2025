
// "use client"

// import { useEffect, useState, useContext, useCallback } from "react";
// import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import OrderItems from "../components/OrderItems/OrderItems";
// import Navbar from "../components/Navbar/Navbar";

// const UserProfileButtons = () => {
//   const { token } = useContext(ShopContext);
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("info");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [userProducts, setUserProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);

//   const menuItems = [
//     { id: "info", title: "Personal Info", icon: "👤" },
//     { id: "orders", title: "My Orders", icon: "📦" },
//     { id: "logout", title: "Logout", icon: "🚪" },
//   ]

//   useEffect(() => {
//     fetchUserData()
//     fetchUserProducts()
//   }, [])

//   const handleChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value })
//   }

//   const fetchUserData = useCallback(async () => {
//     try {
//       const authToken = sessionStorage.getItem("token") || localStorage.getItem("token");
      
//       if (!authToken) {
//         console.log("No auth token found, redirecting to login");
//         navigate("/login");
//         return;
//       }

//       const response = await axios.get(
//         "http://localhost:5003/api/userProfileDetail/user-profile",
//         {
//           headers: {
//             'Authorization': `Bearer ${authToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log("Profile response:", response.data);
      
//       if (response.data) {
//         const userData = response.data.user || response.data;
//         if (userData) {
//           setUserData(prev => ({ ...prev, ...userData }));
//         } else {
//           throw new Error("Invalid user data format");
//         }
//       }
      
//       setLoading(false);
//     } catch (err) {
//       console.error("Error in fetchUserData:", err);
//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         sessionStorage.removeItem("token");
//         toast.error("Session expired. Please log in again.");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load profile");
//       }
//       setLoading(false);
//     }
//   }, [token, navigate])

//   const fetchUserProducts = useCallback(async () => {
//     try {
//       // Get token from both storage locations
//       const authToken = sessionStorage.getItem("token") || localStorage.getItem("token");
      
//       if (!authToken) {
//         toast.error("Please log in to view your orders");
//         navigate("/login");
//         return;
//       }
      
//       setLoadingProducts(true);
      
//       const response = await axios.get("http://localhost:5003/api/orders/myorders", {
//         headers: {
//           'Authorization': `Bearer ${authToken}`,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });
      
//       if (response.data) {
//         setUserProducts(Array.isArray(response.data) ? response.data : []);
//       } else {
//         throw new Error("No orders data received");
//       }
//     } catch (err) {
//       console.error("Error fetching user orders:", err);
      
//       if (err.response?.status === 401) {
//         // Token is invalid or expired
//         localStorage.removeItem("token");
//         sessionStorage.removeItem("token");
//         toast.error("Your session has expired. Please log in again.");
//         navigate("/login");
//       } else {
//         toast.error(err.response?.data?.message || "Failed to load your orders. Please try again later.");
//       }
//     } finally {
//       setLoadingProducts(false);
//     }
//   }, [navigate]);

//   const handleLogoutClick = () => {
//     logout()
//     navigate("/login")
//   }

//   const handleTabClick = async (tabId) => {
//     if (tabId === "logout") {
//       handleLogoutClick();
//     } else if (tabId === "orders") {
//       // Check for token before showing orders
//       const authToken = sessionStorage.getItem("token") || localStorage.getItem("token");
      
//       if (!authToken) {
//         toast.error("Please log in to view your orders");
//         navigate("/login");
//         return;
//       }
      
//       try {
//         setLoadingProducts(true);
//         setActiveTab(tabId);
//         setIsSidebarOpen(false);
//         setIsEditing(false);
        
//         // Fetch orders with the token
//         await fetchUserProducts();
//       } catch (error) {
//         console.error("Error handling orders tab:", error);
//         if (error.response?.status === 401) {
//           localStorage.removeItem("token");
//           sessionStorage.removeItem("token");
//           toast.error("Your session has expired. Please log in again.");
//           navigate("/login");
//         }
//       } finally {
//         setLoadingProducts(false);
//       }
//     } else {
//       setActiveTab(tabId);
//       setIsSidebarOpen(false);
//       setIsEditing(false);
//     }
//   }

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen)
//   }

//   const updateProfile = async (e) => {
//     e.preventDefault();
    
//     const token = sessionStorage.getItem("token") || localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please log in to update your profile");
//       navigate("/login");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.put(
//         "http://localhost:5003/api/updateUserProfileDetail/update-user-profile",
//         userData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log("Update response:", response.data);
      
//       if (response.data) {
//         // Update the user data with the response
//         const updatedUser = response.data.user || response.data;
//         setUserData(prev => ({
//           ...prev,
//           ...updatedUser,
//           // Ensure we don't lose any existing fields
//           name: updatedUser.name || prev.name,
//           email: updatedUser.email || prev.email,
//           phone: updatedUser.phone || prev.phone
//         }));
        
//         // Update token if a new one was provided
//         if (response.data.token) {
//           const newToken = response.data.token;
//           localStorage.setItem("token", newToken);
//           sessionStorage.setItem("token", newToken);
//         }
        
//         toast.success("Profile updated successfully!");
//         setIsEditing(false);
//       } else {
//         throw new Error("No data received from server");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         sessionStorage.removeItem("token");
//         toast.error("Session expired. Please log in again.");
//         navigate("/login");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleBackToShopping = () => {
//     navigate("/") // Navigate back to home page for shopping
//   }

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div style={styles.loadingContainer}>
//           <div style={styles.spinner}></div>
//           <p style={styles.loadingText}>Loading your profile...</p>
//         </div>
//       )
//     }

//     switch (activeTab) {
//       case "info":
//         return (
//           <div style={styles.tabContent}>
//             {isEditing ? renderUserForm() : renderUserCard()}
//           </div>
//         )
//       case "orders":
//         return (
//           <div style={styles.tabContent}>
//             {loadingProducts ? (
//               <div style={styles.loadingContainer}>
//                 <div style={styles.spinner}></div>
//                 <p style={styles.loadingText}>Loading your orders...</p>
//               </div>
//             ) : (
//               <div style={styles.ordersContainer}>
//                 <OrderItems />
//               </div>
//             )}
//           </div>
//         )
//       default:
//         return null
//     }
//   }

//   const renderUserCard = () => (
//     <div style={styles.profileContainer}>
//       <div style={styles.profileCard}>
//         {/* Welcome Header */}
//         <div style={styles.welcomeSection}>
//           <div style={styles.welcomeContent}>
//             <div style={styles.shoppingIconsContainer}>
//               <img src="https://img.icons8.com/fluency/32/shopping-bag.png" alt="Shopping" style={styles.shoppingIcon} />
              
//             </div>
//             <h1 style={styles.welcomeTitle}>Welcome back, {userData?.name || "User"}! 👋</h1>
//             <p style={styles.welcomeSubtitle}>Here's your profile information</p>
//           </div>
//           <div style={styles.avatarLarge}>
//             <span style={styles.avatarText}>{userData?.name?.charAt(0) || "U"}</span>
//           </div>
//         </div>

//         {/* Profile Details Grid */}
//         <div style={styles.detailsGrid}>
//           <div style={styles.detailItem}>
//             <div style={styles.detailIconWrapper}>
//               <span style={styles.detailIcon}>📧</span>
//             </div>
//             <div style={styles.detailContent}>
//               <label style={styles.detailLabel}>Email Address</label>
//               <p style={styles.detailValue}>{userData?.email || "Not provided"}</p>
//             </div>
//           </div>

//           <div style={styles.detailItem}>
//             <div style={styles.detailIconWrapper}>
//               <span style={styles.detailIcon}>📱</span>
//             </div>
//             <div style={styles.detailContent}>
//               <label style={styles.detailLabel}>Phone Number</label>
//               <p style={styles.detailValue}>{userData?.phone || "Not provided"}</p>
//             </div>
//           </div>

//           <div style={styles.detailItem}>
//             <div style={styles.detailIconWrapper}>
//               <span style={styles.detailIcon}>⭐</span>
//             </div>
//             <div style={styles.detailContent}>
//               <label style={styles.detailLabel}>Member Status</label>
//               <p style={styles.detailValue}>Premium Member</p>
//             </div>
//           </div>

//           <div style={styles.detailItem}>
//             <div style={styles.detailIconWrapper}>
//               <span style={styles.detailIcon}>🛡️</span>
//             </div>
//             <div style={styles.detailContent}>
//               <label style={styles.detailLabel}>Account Type</label>
//               <p style={styles.detailValue}>Verified Account</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Section */}
//         <div style={styles.actionSection}>
//           <button 
//             onClick={() => setIsEditing(true)}
//             style={styles.editButton}
//             onMouseOver={(e) => {
//               e.target.style.transform = 'translateY(-2px)'
//               e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.25)'
//             }}
//             onMouseOut={(e) => {
//               e.target.style.transform = 'translateY(0)'
//               e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)'
//             }}
//           >
//             <span style={styles.editIcon}>✏️</span>
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   )

//   const renderUserForm = () => (
//     <div style={styles.formContainer}>
//       <div style={styles.formCard}>
//         {/* Form Header */}
//         <div style={styles.formHeader}>
//           <div style={styles.formHeaderContent}>
//             {/* <div style={styles.formShoppingIcons}>
//               <img src="https://img.icons8.com/fluency/24/edit-user.png" alt="Edit" style={styles.smallShoppingIcon} />
//               <img src="https://img.icons8.com/fluency/24/user-settings.png" alt="Settings" style={styles.smallShoppingIcon} />
//               <img src="https://img.icons8.com/fluency/24/security-checked.png" alt="Security" style={styles.smallShoppingIcon} />
//               <img src="https://img.icons8.com/fluency/24/save.png" alt="Save" style={styles.smallShoppingIcon} />
//             </div> */}
//             <h2 style={styles.formTitle}>Edit Profile Information</h2>
//             <p style={styles.formSubtitle}>Update your personal details below</p>
//           </div>
//           <div style={styles.formIcon}>📝</div>
//         </div>

//         <form onSubmit={updateProfile} style={styles.form}>
//           <div style={styles.formGrid}>
//             <div style={styles.formGroup}>
//               <label htmlFor="name" style={styles.formLabel}>
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 style={styles.formInput}
//                 id="name"
//                 name="name"
//                 value={userData?.name || ""}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//                 required
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#3b82f6'
//                   e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#e2e8f0'
//                   e.target.style.boxShadow = 'none'
//                 }}
//               />
//             </div>

//             <div style={styles.formGroup}>
//               <label htmlFor="phone" style={styles.formLabel}>
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 style={styles.formInput}
//                 id="phone"
//                 name="phone"
//                 value={userData?.phone || ""}
//                 onChange={(e) => {
//                   const numericValue = e.target.value.replace(/\D/g, "")
//                   if (numericValue.length <= 10) {
//                     handleChange({
//                       target: { name: "phone", value: numericValue },
//                     })
//                   }
//                 }}
//                 placeholder="Enter your phone number"
//                 maxLength={10}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#3b82f6'
//                   e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#e2e8f0'
//                   e.target.style.boxShadow = 'none'
//                 }}
//               />
//             </div>

//             <div style={styles.formGroup}>
//               <label htmlFor="email" style={styles.formLabel}>
//                 Email Address *
//               </label>
//               <input
//                 type="email"
//                 style={styles.formInput}
//                 id="email"
//                 name="email"
//                 value={userData?.email || ""}
//                 onChange={handleChange}
//                 placeholder="Enter your email address"
//                 required
//                 onFocus={(e) => {
//                   e.target.style.borderColor = '#3b82f6'
//                   e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = '#e2e8f0'
//                   e.target.style.boxShadow = 'none'
//                 }}
//               />
//             </div>
//           </div>

//           <div style={styles.formActions}>
//             <button
//               type="button"
//               onClick={() => setIsEditing(false)}
//               style={styles.cancelButton}
//               onMouseOver={(e) => {
//                 e.target.style.background = '#f8fafc'
//                 e.target.style.borderColor = '#3b82f6'
//                 e.target.style.color = '#3b82f6'
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.background = '#fff'
//                 e.target.style.borderColor = '#e2e8f0'
//                 e.target.style.color = '#64748b'
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               style={styles.submitButton}
//               onMouseOver={(e) => {
//                 e.target.style.transform = 'translateY(-2px)'
//                 e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)'
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.transform = 'translateY(0)'
//                 e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.2)'
//               }}
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )

//   return (
//     <>
//       <Navbar />
//       <div style={styles.container}>
//         {/* Mobile Header */}
//         <div style={styles.mobileHeader}>
//           <button 
//             style={styles.menuButton}
//             onClick={toggleSidebar}
//             onMouseOver={(e) => {
//               e.target.style.background = 'rgba(59, 130, 246, 0.1)'
//             }}
//             onMouseOut={(e) => {
//               e.target.style.background = 'transparent'
//             }}
//           >
//          <span style={styles.menuIcon}>☰</span>
//           </button>
          
//           {/* Back to Shopping Button */}
//           <button 
//             onClick={handleBackToShopping}
//             style={styles.backToShoppingButton}
//             onMouseOver={(e) => {
//               e.target.style.background = '#ffffffff'
//               e.target.style.transform = 'translateY(-1px)'
//             }}
//             onMouseOut={(e) => {
//               e.target.style.background = '#ffffffff'
//               e.target.style.transform = 'translateY(0)'
//             }}
//           >
//             <span style={styles.shoppingIcon}>🛍️</span>
//             Continue Shopping
//           </button>
          
//           {/* <h1 style={styles.mobileTitle}>My Account</h1> */}
//         </div>

//         <div style={styles.layout}>
//           {/* Sidebar */}
//           <div style={{
//             ...styles.sidebar,
//             transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
//           }}>
//             {/* Profile Section */}
//             <div style={styles.sidebarProfile}>
//               <div style={styles.sidebarAvatar}>
//                 <span style={styles.sidebarAvatarText}>{userData?.name?.charAt(0) || "U"}</span>
//               </div>
//               <div style={styles.sidebarProfileInfo}>
//                 <div style={styles.sidebarName}>{userData?.name || "User"}</div>
//                 <div style={styles.sidebarEmail}>{userData?.email || "user@example.com"}</div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav style={styles.sidebarNav}>
//               {menuItems.map((item) => (
//                 <button
//                   key={item.id}
//                   style={{
//                     ...styles.sidebarButton,
//                     ...(activeTab === item.id ? styles.sidebarButtonActive : {})
//                   }}
//                   onClick={() => handleTabClick(item.id)}
//                   onMouseOver={(e) => {
//                     if (activeTab !== item.id) {
//                       e.target.style.background = '#f8fafc'
//                       e.target.style.color = '#3b82f6'
//                     }
//                   }}
//                   onMouseOut={(e) => {
//                     if (activeTab !== item.id) {
//                       e.target.style.background = 'transparent'
//                       e.target.style.color = '#64748b'
//                     }
//                   }}
//                 >
//                   <span style={styles.sidebarButtonIcon}>{item.icon}</span>
//                   <span style={styles.sidebarButtonText}>{item.title}</span>
//                   {activeTab === item.id && (
//                     <div style={styles.activeIndicator}></div>
//                   )}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Overlay */}
//           {isSidebarOpen && (
//             <div 
//               style={styles.overlay}
//               onClick={() => setIsSidebarOpen(false)}
//             />
//           )}

//           {/* Main Content */}
//           <main style={{
//             ...styles.mainContent,
//             marginLeft: isSidebarOpen ? '320px' : '0',
//             transition: 'margin-left 0.3s ease'
//           }}>
//             {renderContent()}
//           </main>
//         </div>
//       </div>
      
//       <ToastContainer 
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         style={{ marginTop: "60px" }}
//         toastStyle={{
//           background: '#fff',
//           color: '#334155',
//           borderRadius: '12px',
//           boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
//         }}
//       />
//     </>
//   )
// }

// // Internal CSS Styles with Light Colors (No Purple)
// const styles = {
//   container: {
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 50%, #f1f5f9 100%)',
//     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//   },
//   layout: {
//     display: 'flex',
//     minHeight: 'calc(100vh - 80px)',
//     position: 'relative',
//   },
  
//   // Mobile Header
//   mobileHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '1rem 1.5rem',
//     background: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(10px)',
//     borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
//     position: 'sticky',
//     top: 0,
//     zIndex: 40,
//     gap: '1rem',
//   },
//   menuButton: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//     padding: '0.75rem 1rem',
//     background: 'transparent',
//     color: '#3b82f6',
//     border: '1px solid #e2e8f0',
//     borderRadius: '12px',
//     fontSize: '0.95rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     flexShrink: 0,
//   },
 
//   menuIcon: {
//     fontSize: '1.1rem',
//   },
//   backToShoppingButton: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.25rem',
//     padding: '0.5rem 1rem',
//     background: 'linear-gradient(135deg, #d0d9dfff 0%, #bae6fd 100%)',
//     color: '#000000ff',
//     border: '1px solid #0ea5e9',
//     borderRadius: '8px',
//     fontSize: '0.8rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     flexShrink: 0,
//     boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)',
//   },
//   shoppingIcon: {
//     fontSize: '0.9rem',
//   },
//   mobileTitle: {
//     fontSize: '1.3rem',
//     fontWeight: '700',
//     color: '#ffffffff',
//     margin: 0,
//     flex: 1,
//     textAlign: 'right',
//   },

//   // Sidebar
//   sidebar: {
//     position: 'fixed',
//     top: '80px',
//     left: 0,
//     width: '320px',
//     height: 'calc(100vh - 80px)',
//     background: 'rgba(255, 255, 255, 0.98)',
//     backdropFilter: 'blur(15px)',
//     borderRight: '1px solid rgba(226, 232, 240, 0.8)',
//     transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     zIndex: 50,
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   sidebarProfile: {
//     padding: '2rem 1.5rem',
//     background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(96, 165, 250, 0.05) 100%)',
//     borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '1rem',
//   },
//   sidebarAvatar: {
//     width: '64px',
//     height: '64px',
//     background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
//     borderRadius: '16px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '1.5rem',
//     fontWeight: 'bold',
//     color: 'white',
//     boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
//   },
//   sidebarAvatarText: {
//     fontSize: '1.5rem',
//     fontWeight: '700',
//   },
//   sidebarProfileInfo: {
//     flex: 1,
//   },
//   sidebarName: {
//     fontSize: '1.1rem',
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: '0.25rem',
//   },
//   sidebarEmail: {
//     fontSize: '0.9rem',
//     color: '#64748b',
//   },
//   sidebarNav: {
//     flex: 1,
//     padding: '1.5rem 0',
//   },
//   sidebarButton: {
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '1rem',
//     padding: '1rem 1.5rem',
//     background: 'transparent',
//     border: 'none',
//     color: '#64748b',
//     fontSize: '1rem',
//     fontWeight: '500',
//     cursor: 'pointer',
//     position: 'relative',
//     transition: 'all 0.3s ease',
//   },
//   sidebarButtonActive: {
//     background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)',
//     color: '#3b82f6',
//     borderRight: '3px solid #3b82f6',
//   },
//   sidebarButtonIcon: {
//     fontSize: '1.3rem',
//     width: '24px',
//     textAlign: 'center',
//   },
//   sidebarButtonText: {
//     flex: 1,
//     textAlign: 'left',
//     fontWeight: '600',
//   },
//   activeIndicator: {
//     position: 'absolute',
//     right: '1rem',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     width: '6px',
//     height: '6px',
//     background: '#3b82f6',
//     borderRadius: '50%',
//   },
//   overlay: {
//     position: 'fixed',
//     top: '80px',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'rgba(15, 23, 42, 0.1)',
//     zIndex: 45,
//   },

//   // Shopping Icons Styles
//   shoppingIconsContainer: {
//     display: 'flex',
//     gap: '1rem',
//     marginBottom: '1rem',
//     justifyContent: 'flex-start',
//     flexWrap: 'wrap',
//   },
//   shoppingIcon: {
//     width: '32px',
//     height: '32px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//   },
//   formShoppingIcons: {
//     display: 'flex',
//     gap: '0.5rem',
//     marginBottom: '0.5rem',
//   },
//   smallShoppingIcon: {
//     width: '24px',
//     height: '24px',
//     borderRadius: '6px',
//     boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
//     transition: 'transform 0.2s ease',
//   },

//   // Main Content
//   mainContent: {
//     flex: 1,
//     padding: '1rem',
//     marginLeft: '0',
//     transition: 'all 0.3s ease',
//   },

//   // Loading States
//   loadingContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '400px',
//     background: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: '20px',
//     backdropFilter: 'blur(10px)',
//     border: '1px solid rgba(226, 232, 240, 0.6)',
//   },
//   spinner: {
//     width: '48px',
//     height: '48px',
//     border: '3px solid #f1f5f9',
//     borderLeft: '3px solid #3b82f6',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite',
//   },
//   loadingText: {
//     marginTop: '1rem',
//     fontSize: '1.1rem',
//     color: '#64748b',
//     fontWeight: '500',
//   },

//   // Profile Card
//   profileContainer: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//   },
//   profileCard: {
//     background: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(15px)',
//     borderRadius: '24px',
//     boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
//     border: '1px solid rgba(255, 255, 255, 0.8)',
//     overflow: 'hidden',
//   },
//   welcomeSection: {
//     padding: '3rem 2rem',
//     background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(96, 165, 250, 0.03) 100%)',
//     borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   welcomeContent: {
//     flex: 1,
//   },
//   welcomeTitle: {
//     fontSize: '1.5rem',
//     fontWeight: '500',
//     color: '#1e293b',
//     marginBottom: '0.5rem',
//   },
//   welcomeSubtitle: {
//     fontSize: '1.1rem',
//     color: '#64748b',
//     fontWeight: '500',
//   },
//   avatarLarge: {
//     width: '100px',
//     height: '100px',
//     background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
//     borderRadius: '20px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '2.5rem',
//     fontWeight: 'bold',
//     color: 'white',
//     boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
//   },
//   avatarText: {
//     fontSize: '2.5rem',
//     fontWeight: '700',
//   },
//   detailsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
//     gap: '1.5rem',
//     padding: '3rem 2rem',
//   },
//   detailItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '1.5rem',
//     padding: '1.5rem',
//     background: 'rgba(255, 255, 255, 0.7)',
//     borderRadius: '16px',
//     border: '1px solid rgba(226, 232, 240, 0.6)',
//     transition: 'all 0.3s ease',
//   },
//   detailIconWrapper: {
//     width: '56px',
//     height: '56px',
//     background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)',
//     borderRadius: '12px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '1.5rem',
//   },
//   detailIcon: {
//     fontSize: '1.5rem',
//   },
//   detailContent: {
//     flex: 1,
//   },
//   detailLabel: {
//     display: 'block',
//     fontSize: '0.9rem',
//     fontWeight: '600',
//     color: '#64748b',
//     marginBottom: '0.5rem',
//     textTransform: 'uppercase',
//     letterSpacing: '0.5px',
//   },
//   detailValue: {
//     fontSize: '1.1rem',
//     fontWeight: '600',
//     color: '#1e293b',
//     margin: 0,
//   },
//   actionSection: {
//     padding: '0 2rem 3rem',
//     textAlign: 'center',
//   },
//   editButton: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     gap: '0.75rem',
//     padding: '1rem 2.5rem',
//     background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '14px',
//     fontSize: '1.1rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
//     transition: 'all 0.3s ease',
//   },
//   editIcon: {
//     fontSize: '1.3rem',
//   },

//   // Form Styles
//   formContainer: {
//     maxWidth: '800px',
//     margin: '0 auto',
//   },
//   formCard: {
//     background: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(15px)',
//     borderRadius: '24px',
//     boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
//     border: '1px solid rgba(255, 255, 255, 0.8)',
//     overflow: 'hidden',
//   },
//   formHeader: {
//     padding: '2.5rem 2rem',
//     background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(96, 165, 250, 0.03) 100%)',
//     borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   formHeaderContent: {
//     flex: 1,
//   },
//   formTitle: {
//     fontSize: '1.8rem',
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: '0.5rem',
//   },
//   formSubtitle: {
//     fontSize: '1rem',
//     color: '#64748b',
//     fontWeight: '500',
//   },
//   formIcon: {
//     fontSize: '3rem',
//     opacity: '0.1',
//     color: '#3b82f6',
//   },
//   form: {
//     padding: '2.5rem 2rem',
//   },
//   formGrid: {
//     display: 'grid',
//     gap: '2rem',
//   },
//   formGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   formLabel: {
//     fontSize: '0.85rem',
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: '0.5rem',
//   },
//   formInput: {
//     padding: '0.75rem 1rem',
//     border: '1px solid #e2e8f0',
//     borderRadius: '8px',
//     fontSize: '0.9rem',
//     background: 'rgba(255, 255, 255, 0.8)',
//     transition: 'all 0.3s ease',
//     outline: 'none',
//   },
//   formActions: {
//     display: 'flex',
//     gap: '1rem',
//     marginTop: '2.5rem',
//   },
//   cancelButton: {
//     flex: 1,
//     padding: '0.75rem 1.5rem',
//     background: '#fff',
//     color: '#64748b',
//     border: '1px solid #e2e8f0',
//     borderRadius: '8px',
//     fontSize: '0.9rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//   },
//   submitButton: {
//     flex: 1,
//     padding: '0.75rem 1.5rem',
//     background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     fontSize: '0.9rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
//     transition: 'all 0.3s ease',
//   },

//   // Responsive Design
//   '@media (max-width: 480px)': {
//     mobileHeader: {
//       padding: '0.5rem 0.75rem',
//       flexDirection: 'row',
//       gap: '0.5rem',
//       flexWrap: 'wrap',
//     },
//     backToShoppingButton: {
//       padding: '0.4rem 0.8rem',
//       fontSize: '0.7rem',
//       gap: '0.2rem',
//     },
//     mobileTitle: {
//       textAlign: 'center',
//       fontSize: '1rem',
//       order: 3,
//       width: '100%',
//     },
//     mainContent: {
//       padding: '0.5rem',
//       marginLeft: '0 !important',
//     },
//     sidebar: {
//       width: '280px',
//     },
//     welcomeTitle: {
//       fontSize: '1.3rem',
//     },
//     welcomeSection: {
//       padding: '1.5rem 1rem',
//       flexDirection: 'column',
//       gap: '1rem',
//     },
//     avatarLarge: {
//       width: '80px',
//       height: '80px',
//       fontSize: '2rem',
//     },
//     detailsGrid: {
//       gridTemplateColumns: '1fr',
//       gap: '1rem',
//       padding: '1rem',
//     },
//     detailItem: {
//       padding: '1rem',
//     },
//     formGrid: {
//       gap: '1rem',
//     },
//     formActions: {
//       flexDirection: 'column',
//       gap: '0.75rem',
//     },
//     shoppingIconsContainer: {
//       justifyContent: 'center',
//       gap: '0.5rem',
//     },
//     shoppingIcon: {
//       width: '28px',
//       height: '28px',
//     },
//   },
//   '@media (min-width: 768px)': {
//     mainContent: {
//       marginLeft: '0',
//       padding: '2rem',
//     },
//     sidebar: {
//       transform: 'translateX(0)',
//       position: 'fixed',
//     },
//     mobileHeader: {
//       display: 'none',
//     },
//   },
//   '@media (min-width: 1024px)': {
//     mainContent: {
//       padding: '3rem',
//       marginLeft: '320px',
//     },
//     detailsGrid: {
//       gridTemplateColumns: 'repeat(2, 1fr)',
//     },
//   },
//   '@media (max-width: 767px)': {
//     sidebar: {
//       width: '100%',
//       maxWidth: '320px',
//     },
//     overlay: {
//       display: 'block',
//     },
//   },

//   // Light Color Updates
//   container: {
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
//     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//   },
//   mobileHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '1rem 1.5rem',
//     background: 'rgba(255, 255, 255, 0.98)',
//     backdropFilter: 'blur(10px)',
//     borderBottom: '1px solid rgba(186, 230, 253, 0.3)',
//     position: 'sticky',
//     top: 0,
//     zIndex: 40,
//     gap: '1rem',
//     boxShadow: '0 2px 10px rgba(59, 130, 246, 0.1)',
//   },
//   sidebar: {
//     position: 'fixed',
//     top: '80px',
//     left: 0,
//     width: '320px',
//     height: 'calc(100vh - 80px)',
//     background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%)',
//     backdropFilter: 'blur(15px)',
//     borderRight: '1px solid rgba(186, 230, 253, 0.3)',
//     transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     zIndex: 50,
//     display: 'flex',
//     flexDirection: 'column',
//     boxShadow: '2px 0 15px rgba(59, 130, 246, 0.1)',
//   },
//   sidebarProfile: {
//     padding: '2rem 1.5rem',
//     background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 197, 253, 0.08) 100%)',
//     borderBottom: '1px solid rgba(186, 230, 253, 0.3)',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '1rem',
//   },

//   // Animations
//   '@keyframes spin': {
//     '0%': { transform: 'rotate(0deg)' },
//     '100%': { transform: 'rotate(360deg)' },
//   },
// }

// export default UserProfileButtons


"use client"

import { useEffect, useState, useContext, useCallback } from "react"
import axios from "axios"
import { ShopContext } from "../context/ShopContext"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import OrderItems from "../components/OrderItems/OrderItems"
import Navbar from "../components/Navbar/Navbar"

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
    {
      id: "info",
      title: "Personal Info",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="1" />
          <path d="M12 1v6m0 6v4" />
        </svg>
      ),
    },
    {
      id: "orders",
      title: "My Orders",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
        </svg>
      ),
    },
    {
      id: "logout",
      title: "Logout",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
    },
  ]

  useEffect(() => {
    fetchUserData()
    fetchUserProducts()
  }, [])

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const fetchUserData = useCallback(async () => {
    try {
      const authToken = sessionStorage.getItem("token") || localStorage.getItem("token")

      if (!authToken) {
        console.log("No auth token found, redirecting to login")
        navigate("/login")
        return
      }

      const response = await axios.get("http://localhost:5003/api/userProfileDetail/user-profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Profile response:", response.data)

      if (response.data) {
        const userData = response.data.user || response.data
        if (userData) {
          setUserData((prev) => ({ ...prev, ...userData }))
        } else {
          throw new Error("Invalid user data format")
        }
      }

      setLoading(false)
    } catch (err) {
      console.error("Error in fetchUserData:", err)
      if (err.response?.status === 401) {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
        toast.error("Session expired. Please log in again.")
        navigate("/login")
      } else {
        toast.error(err.response?.data?.message || "Failed to load profile")
      }
      setLoading(false)
    }
  }, [token, navigate])

  const fetchUserProducts = useCallback(async () => {
    try {
      const authToken = sessionStorage.getItem("token") || localStorage.getItem("token")

      if (!authToken) {
        toast.error("Please log in to view your orders")
        navigate("/login")
        return
      }

      setLoadingProducts(true)

      const response = await axios.get("http://localhost:5003/api/orders/myorders", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (response.data) {
        setUserProducts(Array.isArray(response.data) ? response.data : [])
      } else {
        throw new Error("No orders data received")
      }
    } catch (err) {
      console.error("Error fetching user orders:", err)

      if (err.response?.status === 401) {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
        toast.error("Your session has expired. Please log in again.")
        navigate("/login")
      } else {
        toast.error(err.response?.data?.message || "Failed to load your orders. Please try again later.")
      }
    } finally {
      setLoadingProducts(false)
    }
  }, [navigate])

  const handleLogoutClick = () => {
    logout()
    navigate("/login")
  }

  const handleTabClick = async (tabId) => {
    if (tabId === "logout") {
      handleLogoutClick()
    } else if (tabId === "orders") {
      const authToken = sessionStorage.getItem("token") || localStorage.getItem("token")

      if (!authToken) {
        toast.error("Please log in to view your orders")
        navigate("/login")
        return
      }

      try {
        setLoadingProducts(true)
        setActiveTab(tabId)
        setIsSidebarOpen(false)
        setIsEditing(false)

        await fetchUserProducts()
      } catch (error) {
        console.error("Error handling orders tab:", error)
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          sessionStorage.removeItem("token")
          toast.error("Your session has expired. Please log in again.")
          navigate("/login")
        }
      } finally {
        setLoadingProducts(false)
      }
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
    e.preventDefault()

    const token = sessionStorage.getItem("token") || localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to update your profile")
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      const response = await axios.put(
        "http://localhost:5003/api/updateUserProfileDetail/update-user-profile",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Update response:", response.data)

      if (response.data) {
        const updatedUser = response.data.user || response.data
        setUserData((prev) => ({
          ...prev,
          ...updatedUser,
          name: updatedUser.name || prev.name,
          email: updatedUser.email || prev.email,
          phone: updatedUser.phone || prev.phone,
        }))

        if (response.data.token) {
          const newToken = response.data.token
          localStorage.setItem("token", newToken)
          sessionStorage.setItem("token", newToken)
        }

        toast.success("Profile updated successfully!")
        setIsEditing(false)
      } else {
        throw new Error("No data received from server")
      }
    } catch (error) {
      console.error("Update error:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
        toast.error("Session expired. Please log in again.")
        navigate("/login")
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBackToShopping = () => {
    navigate("/")
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your profile...</p>
        </div>
      )
    }

    switch (activeTab) {
      case "info":
        return <div style={styles.tabContent}>{isEditing ? renderUserForm() : renderUserCard()}</div>
      case "orders":
        return (
          <div style={styles.tabContent}>
            {loadingProducts ? (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading your orders...</p>
              </div>
            ) : (
              <div style={styles.ordersContainer}>
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
    <div style={styles.profileContainer}>
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>Your Profile</h1>
            <p style={styles.headerSubtitle}>Welcome back, {userData?.name || "User"}</p>
          </div>
          <div style={styles.avatarLarge}>
            <span style={styles.avatarText}>{userData?.name?.charAt(0) || "U"}</span>
          </div>
        </div>

        <div style={styles.detailsGrid}>
          <div
            style={styles.detailCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.08)"
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.1)"
            }}
          >
            <div style={styles.detailIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 6l10 7 10-7" />
              </svg>
            </div>
            <div style={styles.detailInfo}>
              <label style={styles.detailLabel}>Email</label>
              <p style={styles.detailValue}>{userData?.email || "Not provided"}</p>
            </div>
          </div>

          <div
            style={styles.detailCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.08)"
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.1)"
            }}
          >
            <div style={styles.detailIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div style={styles.detailInfo}>
              <label style={styles.detailLabel}>Phone</label>
              <p style={styles.detailValue}>{userData?.phone || "Not provided"}</p>
            </div>
          </div>

          <div
            style={styles.detailCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.08)"
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.1)"
            }}
          >
            <div style={styles.detailIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 1z" />
              </svg>
            </div>
            <div style={styles.detailInfo}>
              <label style={styles.detailLabel}>Status</label>
              <p style={styles.detailValue}>Active Member</p>
            </div>
          </div>

          <div
            style={styles.detailCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.08)"
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.1)"
            }}
          >
            <div style={styles.detailIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div style={styles.detailInfo}>
              <label style={styles.detailLabel}>Type</label>
              <p style={styles.detailValue}>Verified</p>
            </div>
          </div>
        </div>

        <div style={styles.actionSection}>
          <button
            onClick={() => setIsEditing(true)}
            style={styles.editButton}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.2)"
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.15)"
            }}
          >
            <span style={styles.editIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z" />
              </svg>
            </span>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )

  const renderUserForm = () => (
    <div style={styles.formContainer}>
      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <div style={styles.formHeaderContent}>
            <h2 style={styles.formTitle}>Update Your Information</h2>
            <p style={styles.formSubtitle}>Make changes to your profile details</p>
          </div>
          <div style={styles.formIcon}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.15"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19H4v-3L16.5 3.5z" />
            </svg>
          </div>
        </div>

        <form onSubmit={updateProfile} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.formLabel}>
                Full Name
              </label>
              <input
                type="text"
                style={styles.formInput}
                id="name"
                name="name"
                value={userData?.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6"
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.06)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="phone" style={styles.formLabel}>
                Phone Number
              </label>
              <input
                type="tel"
                style={styles.formInput}
                id="phone"
                name="phone"
                value={userData?.phone || ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, "")
                  if (numericValue.length <= 10) {
                    handleChange({
                      target: { name: "phone", value: numericValue },
                    })
                  }
                }}
                placeholder="Enter your phone number"
                maxLength={10}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6"
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.06)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.formLabel}>
                Email Address
              </label>
              <input
                type="email"
                style={styles.formInput}
                id="email"
                name="email"
                value={userData?.email || ""}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6"
                  e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.06)"
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={styles.cancelButton}
              onMouseOver={(e) => {
                e.target.style.background = "#f8fafc"
                e.target.style.borderColor = "#3b82f6"
                e.target.style.color = "#3b82f6"
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#fff"
                e.target.style.borderColor = "#e2e8f0"
                e.target.style.color = "#64748b"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.2)"
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.15)"
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.mobileHeader}>
          <button
            style={styles.menuButton}
            onClick={toggleSidebar}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(59, 130, 246, 0.08)"
              e.target.style.transform = "scale(1.02)"
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent"
              e.target.style.transform = "scale(1)"
            }}
          >
            <span style={styles.menuIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </span>
          </button>

          <button
            onClick={handleBackToShopping}
            style={styles.backToShoppingButton}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.2)"
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.15)"
            }}
          >
            <span style={styles.shoppingIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </span>
            Shopping
          </button>
        </div>

        <div style={styles.layout}>
          <div
            style={{
              ...styles.sidebar,
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <div style={styles.sidebarProfile}>
              <div style={styles.sidebarAvatar}>
                <span style={styles.sidebarAvatarText}>{userData?.name?.charAt(0) || "U"}</span>
              </div>
              <div style={styles.sidebarProfileInfo}>
                <div style={styles.sidebarName}>{userData?.name || "User"}</div>
                <div style={styles.sidebarEmail}>{userData?.email || "user@example.com"}</div>
              </div>
            </div>

            <nav style={styles.sidebarNav}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  style={{
                    ...styles.sidebarButton,
                    ...(activeTab === item.id ? styles.sidebarButtonActive : {}),
                  }}
                  onClick={() => handleTabClick(item.id)}
                  onMouseOver={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.background = "rgba(59, 130, 246, 0.06)"
                      e.currentTarget.style.color = "#3b82f6"
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.15)"
                    }
                  }}
                  onMouseOut={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.background = "transparent"
                      e.currentTarget.style.color = "#64748b"
                      e.currentTarget.style.borderColor = "transparent"
                    }
                  }}
                >
                  <span style={styles.sidebarButtonIcon}>{item.icon}</span>
                  <span style={styles.sidebarButtonText}>{item.title}</span>
                  {activeTab === item.id && <div style={styles.activeIndicator}></div>}
                </button>
              ))}
            </nav>
          </div>

          {isSidebarOpen && <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

          <main
            style={{
              ...styles.mainContent,
              marginLeft: isSidebarOpen ? "320px" : "0",
              transition: "margin-left 0.3s ease",
            }}
          >
            {renderContent()}
          </main>
        </div>
      </div>

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
        style={{ marginTop: "60px" }}
        toastStyle={{
          background: "#fff",
          color: "#334155",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.12)",
        }}
      />
    </>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e8f2fe 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  layout: {
    display: "flex",
    minHeight: "calc(100vh - 80px)",
    position: "relative",
  },

  mobileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.25rem",
    background: "#ffffff",
    backdropFilter: "blur(15px)",
    borderBottom: "1px solid rgba(59, 130, 246, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 40,
    gap: "1rem",
    boxShadow: "0 1px 6px rgba(59, 130, 246, 0.06)",
  },
  menuButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.625rem 0.875rem",
    background: "transparent",
    color: "#3b82f6",
    border: "1.5px solid #3b82f6",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "400",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },

  menuIcon: {
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
  },
  backToShoppingButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1rem",
    background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: "400",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
  },
  shoppingIcon: {
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
  },

  sidebar: {
    position: "fixed",
    top: "80px",
    left: 0,
    width: "280px",
    height: "calc(100vh - 80px)",
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(59, 130, 246, 0.12)",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 12px rgba(59, 130, 246, 0.06)",
  },
  sidebarProfile: {
    padding: "1.75rem 1.5rem",
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(59, 130, 246, 0.01) 100%)",
    borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  sidebarAvatar: {
    width: "56px",
    height: "56px",
    background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    fontWeight: "500",
    color: "white",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
  },
  sidebarAvatarText: {
    fontSize: "1.4rem",
    fontWeight: "500",
  },
  sidebarProfileInfo: {
    flex: 1,
  },
  sidebarName: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: "0.25rem",
  },
  sidebarEmail: {
    fontSize: "0.8rem",
    color: "#64748b",
    fontWeight: "400",
  },
  sidebarNav: {
    flex: 1,
    padding: "1.25rem 0.5rem",
    overflowY: "auto",
  },
  sidebarButton: {
    width: "calc(100% - 1rem)",
    display: "flex",
    alignItems: "center",
    gap: "0.875rem",
    padding: "0.75rem 0.875rem",
    background: "transparent",
    border: "1.5px solid transparent",
    color: "#64748b",
    fontSize: "0.85rem",
    fontWeight: "400",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s ease",
    margin: "0.25rem auto",
    borderRadius: "8px",
  },
  sidebarButtonActive: {
    background: "rgba(59, 130, 246, 0.08)",
    color: "#3b82f6",
    borderColor: "rgba(59, 130, 246, 0.25)",
    boxShadow: "inset 0 0 6px rgba(59, 130, 246, 0.04)",
  },
  sidebarButtonIcon: {
    fontSize: "1.1rem",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "inherit",
  },
  sidebarButtonText: {
    flex: 1,
    textAlign: "left",
    fontWeight: "400",
  },
  activeIndicator: {
    position: "absolute",
    right: "0.875rem",
    top: "50%",
    transform: "translateY(-50%)",
    width: "5px",
    height: "5px",
    background: "#3b82f6",
    borderRadius: "50%",
    boxShadow: "0 0 4px rgba(59, 130, 246, 0.3)",
  },
  overlay: {
    position: "fixed",
    top: "80px",
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(30, 41, 59, 0.15)",
    zIndex: 45,
  },

  mainContent: {
    flex: 1,
    padding: "2rem",
    marginLeft: "0",
    transition: "all 0.3s ease",
    width: "100%",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "14px",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(59, 130, 246, 0.12)",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.06)",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "2.5px solid #f1f5f9",
    borderLeft: "2.5px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#64748b",
    fontWeight: "400",
  },

  profileContainer: {
    maxWidth: "100%",
    margin: "0 auto",
    width: "100%",
  },
  profileCard: {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(15px)",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08)",
    border: "1px solid rgba(59, 130, 246, 0.1)",
    overflow: "hidden",
  },
  profileHeader: {
    padding: "2.5rem 2rem",
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(59, 130, 246, 0.01) 100%)",
    borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: "1.5rem",
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: "0.5rem",
    letterSpacing: "-0.4px",
  },
  headerSubtitle: {
    fontSize: "0.95rem",
    color: "#64748b",
    fontWeight: "400",
  },
  avatarLarge: {
    width: "90px",
    height: "90px",
    background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "500",
    color: "white",
    boxShadow: "0 6px 16px rgba(59, 130, 246, 0.15)",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: "2rem",
    fontWeight: "500",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.25rem",
    padding: "2.25rem 2rem",
  },
  detailCard: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
    padding: "1.25rem",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid rgba(59, 130, 246, 0.1)",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    cursor: "pointer",
  },
  detailIcon: {
    fontSize: "1.5rem",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%)",
    borderRadius: "10px",
    flexShrink: 0,
    color: "#3b82f6",
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: "500",
    color: "#64748b",
    marginBottom: "0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  detailValue: {
    fontSize: "1rem",
    fontWeight: "400",
    color: "#1e293b",
    margin: 0,
  },
  actionSection: {
    padding: "0 2rem 2.25rem",
    textAlign: "center",
  },
  editButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.875rem 2rem",
    background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "400",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
    transition: "all 0.2s ease",
  },
  editIcon: {
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
  },

  formContainer: {
    maxWidth: "100%",
    margin: "0 auto",
    width: "100%",
  },
  formCard: {
    background: "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(15px)",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08)",
    border: "1px solid rgba(59, 130, 246, 0.1)",
    overflow: "hidden",
  },
  formHeader: {
    padding: "2.25rem 2rem",
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(59, 130, 246, 0.01) 100%)",
    borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
  },
  formHeaderContent: {
    flex: 1,
  },
  formTitle: {
    fontSize: "1.5rem",
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: "0.5rem",
    letterSpacing: "-0.4px",
  },
  formSubtitle: {
    fontSize: "0.95rem",
    color: "#64748b",
    fontWeight: "400",
  },
  formIcon: {
    fontSize: "2.5rem",
    opacity: "0.1",
    color: "#3b82f6",
    display: "flex",
    alignItems: "center",
  },
  form: {
    padding: "2.25rem 2rem",
  },
  formGrid: {
    display: "grid",
    gap: "1.75rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  formLabel: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: "0.625rem",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  formInput: {
    padding: "0.75rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.9rem",
    background: "#ffffff",
    transition: "all 0.2s ease",
    outline: "none",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#1e293b",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    fontWeight: "400",
  },
  formActions: {
    display: "flex",
    gap: "1.25rem",
    marginTop: "2.25rem",
  },
  cancelButton: {
    flex: 1,
    padding: "0.875rem 1.25rem",
    background: "#ffffff",
    color: "#64748b",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "400",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  submitButton: {
    flex: 1,
    padding: "0.875rem 1.25rem",
    background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "400",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
    transition: "all 0.2s ease",
  },

  tabContent: {
    animation: "fadeIn 0.3s ease",
  },
  ordersContainer: {
    width: "100%",
  },

  "@media (max-width: 768px)": {
    mainContent: {
      padding: "1rem",
    },
    profileHeader: {
      padding: "1.5rem 1.25rem",
      flexDirection: "column",
      gap: "1.25rem",
      textAlign: "center",
    },
    formHeader: {
      padding: "1.5rem 1.25rem",
      flexDirection: "column",
      gap: "1rem",
      textAlign: "center",
    },
    detailsGrid: {
      gridTemplateColumns: "1fr",
      padding: "1.5rem 1.25rem",
      gap: "1rem",
    },
    formGrid: {
      gap: "1.25rem",
    },
    formActions: {
      flexDirection: "column",
      gap: "0.875rem",
    },
    form: {
      padding: "1.5rem 1.25rem",
    },
    headerTitle: {
      fontSize: "1.25rem",
    },
    formTitle: {
      fontSize: "1.25rem",
    },
    avatarLarge: {
      width: "70px",
      height: "70px",
      fontSize: "1.6rem",
    },
    detailCard: {
      gap: "1rem",
      padding: "1rem",
    },
    detailIcon: {
      width: "45px",
      height: "45px",
      fontSize: "1.25rem",
    },
  },
  "@media (min-width: 1024px)": {
    mainContent: {
      padding: "3rem",
      marginLeft: "320px",
    },
    detailsGrid: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
}

if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(style)
}

export default UserProfileButtons
