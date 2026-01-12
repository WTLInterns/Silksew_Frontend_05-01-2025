
"use client";

import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
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
        setLoading(true);
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        
        if (!token) {
          toast.error("Please log in to view your orders");
          navigate("/login");
          return;
        }

        const response = await axios.get(BASEURL + "/api/orders/myorders", {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          setOrderData(Array.isArray(response.data) ? response.data : []);
        } else {
          setOrderData([]);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        if (error.response?.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          toast.error("Your session has expired. Please log in again.");
          navigate("/login");
        } else {
          setError("Failed to load orders. Please try again later.");
          toast.error("Failed to load orders. Please try again later.");
        }
      } finally {
        setLoading(false);
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
        orderProcess: order.orderProcess || "Order Placed",
        paymentMethod: order.paymentMethod,
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
                  orderProcess,
                  paymentMethod,
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
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Payment:</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            paymentMethod === "Razorpay" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {paymentMethod === "Razorpay" ? "Paid Online" : "Cash on Delivery"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Status:</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            orderProcess === "Delivered" 
                              ? "bg-green-100 text-green-800"
                              : orderProcess === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : orderProcess === "Packed"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {orderProcess}
                          </span>
                        </div>
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
