import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import { BASEURL } from "../../config";

const OrderTracker = ({ orderId }) => {
  const steps = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const [currentStatus, setCurrentStatus] = useState("Order Placed");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASEURL}/api/orders/track/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const data = response.data.data;
          const orderTracking = Object.values(data[0])[0]?.tracking_data;
          const trackStatus = orderTracking?.shipment_status;

          // Map Shiprocket status codes to steps
          if (orderTracking?.shipment_track?.length > 0 && trackStatus === 0) {
            setCurrentStatus("Packed");
          } else {
            switch (trackStatus) {
              case 0:
                setCurrentStatus("Order Placed");
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
        } else {
          setCurrentStatus("Order Placed");
        }
      } catch (err) {
        console.error("Error fetching tracking info:", err);
        setCurrentStatus("Order Placed");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchTracking();
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
