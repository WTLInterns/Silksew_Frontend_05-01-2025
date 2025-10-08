

// "use client"

// import { useContext, useEffect, useState } from "react"
// import { ShopContext } from "../../context/ShopContext"
// import { useNavigate } from "react-router-dom"
// import { BASEURL } from "../../config"
// import axios from "axios"
// import OrderTracker from "../../pages/OrderTracker"

// const OrderItems = () => {
//   const { products } = useContext(ShopContext)
//   const navigate = useNavigate()
//   const [orderData, setOrderData] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [showPopup, setShowPopup] = useState(false)
//   const [selectedReason, setSelectedReason] = useState("")
//   const [currentOrder, setCurrentOrder] = useState(null)
//   const [currentProduct, setCurrentProduct] = useState(null)

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(4)

//   useEffect(() => {
//     const loadOrderData = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           navigate("/login")
//           return
//         }
//         const response = await axios.get(BASEURL + "/api/orders/myorders", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         setOrderData(response?.data || [])
//       } catch (error) {
//         console.error("Error fetching order data:", error)
//       }
//     }
//     loadOrderData()
//   }, [navigate])

//   const requestReturn = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     if (!currentOrder || !currentProduct || !selectedReason) {
//       setError("Please select a reason and ensure a valid order and product are selected.")
//       setLoading(false)
//       return
//     }

//     try {
//       const returnUrl = `${BASEURL}/api/orders/request-return/${currentOrder}/${currentProduct}`
//       await axios.post(
//         returnUrl,
//         { reason: selectedReason },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         },
//       )

//       const saveReasonUrl = `${BASEURL}/api/orders/save-reason`
//       await axios.post(
//         saveReasonUrl,
//         {
//           orderId: currentOrder,
//           productId: currentProduct,
//           reason: selectedReason,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         },
//       )

//       alert("Return request submitted and reason saved successfully!")
//       setShowPopup(false)

//       // Update local state
//       setOrderData((prevOrderData) =>
//         prevOrderData.map((order) =>
//           order._id === currentOrder
//             ? {
//                 ...order,
//                 items: order.items.map((item) =>
//                   item.productId === currentProduct
//                     ? {
//                         ...item,
//                         returnRequested: true,
//                         returnReason: selectedReason,
//                       }
//                     : item,
//                 ),
//               }
//             : order,
//         ),
//       )
//     } catch (err) {
//       setError(err.response ? `Error: ${err.response.status} - ${err.response.data.message}` : "Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const openPopup = (orderId, productId) => {
//     setCurrentOrder(orderId)
//     setCurrentProduct(productId)
//     setShowPopup(true)
//     setSelectedReason("")
//     setError("")
//   }

//   const isReturnEligible = (orderDate) => {
//     if (!orderDate) return true
//     const orderTime = new Date(orderDate).getTime()
//     const currentTime = new Date().getTime()
//     const threeDays = 3 * 24 * 60 * 60 * 1000
//     return currentTime - orderTime <= threeDays
//   }

//   const getImage = (images, color) => {
//     if (images && images.length > 0) {
//       try {
//         const parsedImages = JSON.parse(images[0])
//         if (parsedImages[color] && parsedImages[color].length > 0) {
//           return parsedImages[color][0]
//         }
//         const firstAvailableColor = Object.keys(parsedImages)[0]
//         return parsedImages[firstAvailableColor]?.[0]
//       } catch (error) {
//         console.error("Error parsing image JSON:", error)
//       }
//     }
//     return "/logo.png"
//   }

//   const flattenedItems = orderData.flatMap((order) =>
//     order.items
//       .map((item) => ({
//         ...item,
//         orderId: order._id,
//         createdAt: order.createdAt,
//         tentativeDeliveryDate: order.tentativeDeliveryDate,
//       }))
//       .filter((item) => products.find((p) => p._id === item.productId)),
//   )

//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = flattenedItems.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(flattenedItems.length / itemsPerPage)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-3 sm:p-6">
//       <OrderTracker/>
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-4 sm:mb-6 text-center sm:text-left">
//           <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
//             <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-0">
//               <img src="https://img.icons8.com/fluency/32/shopping-bag.png" alt="Orders" className="w-8 h-8 sm:w-10 sm:h-10" />
//               <div>
//                 <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">My Orders</h1>
//                 <p className="text-gray-600 text-xs sm:text-sm lg:text-base">Manage your order history and returns</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Orders Card */}
//         <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
//           {/* Table Header - Hidden on mobile, shown on larger screens */}
//           <div className="hidden lg:grid grid-cols-7 gap-4 px-6 py-4 bg-gradient-to-r from-blue-50/80 to-sky-50/80 border-b border-blue-200/50">
//             <div className="font-semibold text-gray-700">Image</div>
//             <div className="font-semibold text-gray-700">Product</div>
//             <div className="font-semibold text-gray-700 text-center">Price</div>
//             <div className="font-semibold text-gray-700 text-center">Qty</div>
//             <div className="font-semibold text-gray-700 text-center">Size</div>
//             <div className="font-semibold text-gray-700 text-center">Total</div>
//             <div className="font-semibold text-gray-700 text-center">Actions</div>
//           </div>

//           {/* Orders List */}
//           <div className="divide-y divide-blue-100/50">
//             {currentItems.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 text-gray-500">
//                 <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                   <img src="https://img.icons8.com/fluency/48/empty-box.png" alt="No Orders" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
//                   <div className="text-3xl sm:text-4xl lg:text-6xl">📦</div>
//                   {/* <img src="https://img.icons8.com/fluency/48/sad.png" alt="Sad" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" /> */}
//                 </div>
//                 <p className="text-base sm:text-lg lg:text-xl font-medium mb-2">No orders found</p>
//                 <p className="text-gray-600 text-xs sm:text-sm lg:text-base text-center px-4">Your order history will appear here</p>
//               </div>
//             ) : (
//               currentItems.map((item, index) => {
//                 const { productId, quantity, size, returnRequested, returnApproved, orderId, createdAt } = item
//                 const product = products.find((p) => p._id === productId)
//                 if (!product) return null

//                 let requestStatus = ""
//                 if (item.action === "Select" && returnRequested && !returnApproved) requestStatus = "Return requested"
//                 if (item.action === "accepted" && returnRequested && returnApproved) requestStatus = "Return Approved"
//                 if (item.action === "rejected" && returnRequested && !returnApproved) requestStatus = "Return Rejected"

//                 const isEligible = isReturnEligible(createdAt)

//                 return (
//                   <div
//                     key={`${orderId}-${index}`}
//                     className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center px-4 sm:px-6 py-4 sm:py-6 hover:bg-blue-50/30 transition-colors duration-200 border-l-4 border-transparent hover:border-blue-300"
//                   >
//                     {/* Product Image & Info - Mobile Layout */}
//                     {/* <div className="lg:hidden flex items-center gap-3 mb-3">
//                       <div className="relative">
//                         <img
//                           src={getImage(product.images) || "/logo.png"}
//                           alt={product.name}
//                           className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm border border-blue-200/50"
//                         />
//                         <img src="https://img.icons8.com/fluency/16/verified-badge.png" alt="Verified" className="absolute -top-1 -right-1 w-4 h-4" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-gray-800 text-xs sm:text-sm mb-1 truncate">{product.name}</p>
//                         <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
//                           <span className="text-gray-700 font-semibold">₹{product.price}</span>
//                           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
//                             {quantity}
//                           </span>
//                           <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
//                             {size}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 mt-1">
//                           <p className="text-green-600 font-bold text-xs sm:text-sm">Total: ₹{quantity * product.price}</p>
//                           <img src="https://img.icons8.com/fluency/16/money.png" alt="Money" className="w-4 h-4" />
//                         </div>
//                       </div>
//                     </div> */}

//                     {/* Desktop Layout - Product Image */}
//                     <div className="hidden lg:flex items-center">
//                       <div className="relative">
//                         <img
//                           src={getImage(product.images) || "/logo.png"}
//                           alt={product.name}
//                           className="w-14 h-14 xl:w-16 xl:h-16 object-cover rounded-lg shadow-sm border border-blue-200/50"
//                         />
//                         <img src="https://img.icons8.com/fluency/12/verified-badge.png" alt="Verified" className="absolute -top-1 -right-1 w-3 h-3" />
//                       </div>
//                     </div>

//                     {/* Desktop Layout - Product Details */}
//                     <div className="hidden lg:flex items-center">
//                       <p className="font-medium text-gray-800 line-clamp-2">{product.name}</p>
//                     </div>

//                     <div className="hidden lg:flex items-center justify-center">
//                       <p className="text-gray-700 font-semibold">₹{product.price}</p>
//                     </div>

//                     <div className="hidden lg:flex items-center justify-center">
//                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                         {quantity}
//                       </span>
//                     </div>

//                     <div className="hidden lg:flex items-center justify-center">
//                       <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
//                         {size}
//                       </span>
//                     </div>

//                     <div className="hidden lg:flex items-center justify-center">
//                       <p className="text-green-600 font-bold">₹{quantity * product.price}</p>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center justify-center lg:justify-center">
//                       {!returnRequested && (isEligible || !createdAt) && (
//                         <button
//                           onClick={() => openPopup(orderId, productId)}
//                           disabled={loading}
//                           className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-semibold px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-md lg:rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm lg:text-base flex items-center gap-1"
//                         >
//                           {loading ? (
//                             <>
//                               <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
//                               <span className="hidden sm:inline">Requesting...</span>
//                             </>
//                           ) : (
//                             <>
//                               <img src="https://img.icons8.com/fluency/16/return.png" alt="Return" className="w-3 h-3 sm:w-4 sm:h-4" />
//                               Return
//                             </>
//                           )}
//                         </button>
//                       )}
//                       {!returnRequested && createdAt && !isEligible && (
//                         <span className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
//                           Return expired
//                         </span>
//                       )}
//                       {requestStatus && (
//                         <span className={`text-sm font-medium px-3 py-1 rounded-full ${
//                           requestStatus === "Return Approved" 
//                             ? "bg-green-100 text-green-800"
//                             : requestStatus === "Return Rejected"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}>
//                           {requestStatus}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })
//             )}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t border-blue-200/50 bg-blue-50/30 gap-4 sm:gap-0">
//               <div className="text-sm text-gray-600 text-center sm:text-left">
//                 Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, flattenedItems.length)} of{" "}
//                 {flattenedItems.length} items
//               </div>
//               <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
//                 >
//                   <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                   <span className="hidden sm:inline">Previous</span>
//                 </button>

//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors duration-200 text-sm ${
//                         currentPage === page
//                           ? "bg-blue-600 text-white"
//                           : "bg-white text-gray-700 hover:bg-blue-100 border border-blue-200"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                 </div>

//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
//                 >
//                   <span className="hidden sm:inline">Next</span>
//                   <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Return Request Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-2 sm:p-4">
//           <div className="bg-white/98 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl w-full max-w-xs sm:max-w-md border border-blue-100 mx-2">
//             {/* Popup Header */}
//             <div className="bg-gradient-to-r from-blue-500/90 to-sky-500/90 p-3 sm:p-4 lg:p-6 rounded-t-xl sm:rounded-t-2xl">
//               <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
//                 <img src="https://img.icons8.com/fluency/24/return.png" alt="Return" className="w-6 h-6 sm:w-8 sm:h-8" />
//                 <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">Request Return</h2>
//                 <img src="https://img.icons8.com/fluency/24/question-mark.png" alt="Question" className="w-5 h-5 sm:w-6 sm:h-6" />
//               </div>
//               <p className="text-blue-100 text-xs sm:text-sm lg:text-base">Please select the reason for return</p>
//             </div>

//             {/* Popup Content */}
//             <div className="p-3 sm:p-4 lg:p-6">
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={requestReturn} className="space-y-3 sm:space-y-4">
//                 <div className="space-y-2 sm:space-y-3">
//                   {[
//                     { text: "Received wrong product", icon: "https://img.icons8.com/fluency/16/error.png" },
//                     { text: "Product is defective", icon: "https://img.icons8.com/fluency/16/broken.png" },
//                     { text: "Quality not as expected", icon: "https://img.icons8.com/fluency/16/thumbs-down.png" },
//                     { text: "Changed my mind", icon: "https://img.icons8.com/fluency/16/mind.png" }
//                   ].map((reason, idx) => (
//                     <label
//                       key={idx}
//                       className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-blue-50/50 cursor-pointer transition-colors duration-200"
//                     >
//                       <input
//                         type="radio"
//                         name="returnReason"
//                         value={reason.text}
//                         onChange={(e) => setSelectedReason(e.target.value)}
//                         className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 focus:ring-blue-500"
//                       />
//                       <img src={reason.icon} alt={reason.text} className="w-4 h-4 sm:w-5 sm:h-5" />
//                       <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">{reason.text}</span>
//                     </label>
//                   ))}
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowPopup(false)}
//                     className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200 text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1"
//                   >
//                     <img src="https://img.icons8.com/fluency/16/cancel.png" alt="Cancel" className="w-3 h-3 sm:w-4 sm:h-4" />
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={!selectedReason || loading}
//                     className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm lg:text-base flex items-center justify-center gap-1"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         <span className="hidden sm:inline">Submitting...</span>
//                       </>
//                     ) : (
//                       <>
//                         <img src="https://img.icons8.com/fluency/16/checkmark.png" alt="Submit" className="w-3 h-3 sm:w-4 sm:h-4" />
//                         Submit Request
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default OrderItems



"use client";

import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../../config";
import axios from "axios";
import OrderTracker from "../../components/OrderTracker/OrderTracker"

const OrderItems = () => {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    const loadOrderData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(BASEURL + "/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderData(response?.data || []);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    loadOrderData();
  }, [navigate]);

  const requestReturn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!currentOrder || !currentProduct || !selectedReason) {
      setError(
        "Please select a reason and ensure a valid order and product are selected."
      );
      setLoading(false);
      return;
    }

    try {
      const returnUrl = `${BASEURL}/api/orders/request-return/${currentOrder}/${currentProduct}`;
      await axios.post(
        returnUrl,
        { reason: selectedReason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const saveReasonUrl = `${BASEURL}/api/orders/save-reason`;
      await axios.post(
        saveReasonUrl,
        {
          orderId: currentOrder,
          productId: currentProduct,
          reason: selectedReason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Return request submitted and reason saved successfully!");
      setShowPopup(false);

      // Update local state
      setOrderData((prevOrderData) =>
        prevOrderData.map((order) =>
          order._id === currentOrder
            ? {
              ...order,
              items: order.items.map((item) =>
                item.productId === currentProduct
                  ? {
                    ...item,
                    returnRequested: true,
                    returnReason: selectedReason,
                  }
                  : item
              ),
            }
            : order
        )
      );
    } catch (err) {
      setError(
        err.response
          ? `Error: ${err.response.status} - ${err.response.data.message}`
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const openPopup = (orderId, productId) => {
    setCurrentOrder(orderId);
    setCurrentProduct(productId);
    setShowPopup(true);
    setSelectedReason("");
    setError("");
  };

  const isReturnEligible = (orderDate) => {
    if (!orderDate) return true;
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    return currentTime - orderTime <= threeDays;
  };

  const getImage = (images, color) => {
    if (images && images.length > 0) {
      try {
        const parsedImages = JSON.parse(images[0]);
        if (parsedImages[color] && parsedImages[color].length > 0) {
          return parsedImages[color][0];
        }
        const firstAvailableColor = Object.keys(parsedImages)[0];
        return parsedImages[firstAvailableColor]?.[0];
      } catch (error) {
        console.error("Error parsing image JSON:", error);
      }
    }
    return "/logo.png";
  };

  const flattenedItems = orderData.flatMap((order) =>
    order.items
      .map((item) => ({
        ...item,
        orderId: order._id,
        createdAt: order.createdAt,
        tentativeDeliveryDate: order.tentativeDeliveryDate,
        status: order.status || "Order Placed",
      }))
      .filter((item) => products.find((p) => p._id === item.productId))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = flattenedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flattenedItems.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-0">
              <img
                src="https://img.icons8.com/fluency/32/shopping-bag.png"
                alt="Orders"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                  My Orders
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                  Manage your order history and returns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden">
          <div className="divide-y divide-blue-100/50">
            {currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <img
                  src="https://img.icons8.com/fluency/48/empty-box.png"
                  alt="No Orders"
                  className="w-12 h-12 mb-3"
                />
                <p className="text-lg font-medium mb-2">No orders found</p>
                <p className="text-gray-600 text-sm text-center">
                  Your order history will appear here
                </p>
              </div>
            ) : (
              currentItems.map((item, index) => {
                const {
                  productId,
                  quantity,
                  size,
                  returnRequested,
                  returnApproved,
                  orderId,
                  createdAt,
                  status,
                } = item;

                const product = products.find((p) => p._id === productId);
                if (!product) return null;

                let requestStatus = "";
                if (item.action === "Select" && returnRequested && !returnApproved)
                  requestStatus = "Return requested";
                if (item.action === "accepted" && returnRequested && returnApproved)
                  requestStatus = "Return Approved";
                if (item.action === "rejected" && returnRequested && !returnApproved)
                  requestStatus = "Return Rejected";

                const isEligible = isReturnEligible(createdAt);

                return (
                  <div
                    key={`${orderId}-${index}`}
                    className="px-4 sm:px-6 py-4 sm:py-6 hover:bg-blue-50/30 transition-colors duration-200 border-b border-blue-100"
                  >
                    {/* Product Details */}
                    <div className="flex items-start gap-4 mb-3">
                      <img
                        src={getImage(product.images) || "/logo.png"}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-lg border border-blue-100 shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Qty: {quantity} | Size: {size}
                        </p>
                        <p className="text-green-600 font-semibold">
                          ₹{quantity * product.price}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Ordered on: {new Date(createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Order Tracker */}
                    <OrderTracker orderId={orderId} />

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-4">
                      {!returnRequested && (isEligible || !createdAt) && (
                        <button
                          onClick={() => openPopup(orderId, productId)}
                          disabled={loading}
                          className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {loading ? "Requesting..." : "Request Return"}
                        </button>
                      )}

                      {!returnRequested && createdAt && !isEligible && (
                        <span className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
                          Return expired
                        </span>
                      )}

                      {requestStatus && (
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${requestStatus === "Return Approved"
                              ? "bg-green-100 text-green-800"
                              : requestStatus === "Return Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {requestStatus}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Return Request Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md border border-blue-200/70 mx-2 transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-4 sm:p-6 rounded-t-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <img
                    src="https://img.icons8.com/fluency/24/return.png"
                    alt="Return"
                    className="w-6 h-6 sm:w-7 sm:h-7"
                  />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Request Return
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Please select the reason for return
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={requestReturn} className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      text: "Received wrong product",
                      icon: "https://img.icons8.com/fluency/24/error.png",
                    },
                    {
                      text: "Product is defective",
                      icon: "https://img.icons8.com/fluency/24/broken.png",
                    },
                    {
                      text: "Quality not as expected",
                      icon: "https://img.icons8.com/fluency/24/thumbs-down.png",
                    },
                    {
                      text: "Changed my mind",
                      icon: "https://img.icons8.com/fluency/24/mind.png",
                    },
                  ].map((reason, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedReason === reason.text
                          ? "border-blue-500 bg-blue-50/80 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="returnReason"
                        value={reason.text}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <img
                        src={reason.icon}
                        alt={reason.text}
                        className="w-5 h-5"
                      />
                      <span className="text-gray-700 font-medium text-sm flex-1">
                        {reason.text}
                      </span>
                      {selectedReason === reason.text && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </label>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <img
                      src="https://img.icons8.com/fluency/20/cancel.png"
                      alt="Cancel"
                      className="w-4 h-4"
                    />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedReason || loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <img
                          src="https://img.icons8.com/fluency/20/checkmark.png"
                          alt="Submit"
                          className="w-4 h-4"
                        />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItems;
