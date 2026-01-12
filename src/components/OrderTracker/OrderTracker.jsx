import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import { BASEURL } from "../../config";

const OrderTracker = ({ orderId }) => {
  const steps = ["Order Placed", "Packed", "Shipped", "Delivered"];
  const [currentStatus, setCurrentStatus] = useState("Order Placed");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // First, get order details to check orderProcess
        const orderResponse = await axios.get(`${BASEURL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (orderResponse.data) {
          const order = orderResponse.data.find(o => o._id === orderId);
          
          if (order && order.orderProcess) {
            // Use orderProcess set by admin
            setCurrentStatus(order.orderProcess);
          } else {
            // Fallback to Shiprocket tracking for shipped orders
            try {
              const trackingResponse = await axios.get(`${BASEURL}/api/orders/track/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (trackingResponse.data.success) {
                const data = trackingResponse.data.data;
                const orderTracking = Object.values(data[0])[0]?.tracking_data;
                const trackStatus = orderTracking?.shipment_status;

                // Map Shiprocket status codes to steps
                switch (trackStatus) {
                  case 0:
                    setCurrentStatus("Packed");
                    break;
                  case 1:
                    setCurrentStatus("Shipped");
                    break;
                  case 2:
                    setCurrentStatus("Out for Delivery");
                    break;
                  case 3:
                    setCurrentStatus("Delivered");
                    break;
                  default:
                    setCurrentStatus("Order Placed");
                }
              }
            } catch (trackingError) {
              console.log("Tracking not available, using order status");
              // If no tracking available, use order status
              if (order && order.status) {
                switch (order.status) {
                  case "Confirmed":
                    setCurrentStatus("Packed");
                    break;
                  case "Shipped":
                    setCurrentStatus("Shipped");
                    break;
                  case "Delivered":
                    setCurrentStatus("Delivered");
                    break;
                  default:
                    setCurrentStatus("Order Placed");
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching order status:", err);
        setCurrentStatus("Order Placed");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  const currentStep = steps.indexOf(currentStatus) + 1;

  return (
    <div className="relative w-full max-w-3xl mx-auto py-6 px-3 sm:px-6">
      {loading && <p className="text-center text-gray-500">Fetching tracking info...</p>}
      {!loading && (
        <div className="flex justify-between items-center relative">
          {steps.map((step, index) => {
            const isCompleted = index + 1 < currentStep;
            const isActive = index + 1 === currentStep;

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "border-blue-500 text-blue-500 bg-blue-50"
                      : "border-gray-300 text-gray-400 bg-gray-100"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>

                <p
                  className={`mt-2 text-[11px] sm:text-sm font-medium text-center ${
                    isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step}
                </p>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-1/2 left-0 transform -translate-y-1/2 h-[2px] w-full z-[-1] ${
                      index < currentStep - 1 ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{
                      width: `${100 / (steps.length - 1)}%`,
                      left: `${(index * 100) / (steps.length - 1)}%`,
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
