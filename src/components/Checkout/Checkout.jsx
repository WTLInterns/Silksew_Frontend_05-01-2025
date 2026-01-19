import { useContext, useState, useEffect } from "react"
import { ShopContext } from "../../context/ShopContext"
import razorpay from "../Assets/razorpay_logo.png"
import CashonDelivery from "../Assets/cod.png"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { BASEURL } from "../../config"
import { useNavigate, useLocation } from "react-router-dom"
import "./Checkout.css"

const OrderSuccessPopup = () => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Order Placed Successfully!</h2>
      </div>
    </div>
  )
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { offerCode = "", buyNowProduct, fromBuyNow } = location.state || {};
  const [method, setMethod] = useState("") // no default
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { cartItems, delivery_fee, setCartItems, getTotalCartAmount, products, cleanInvalidCartItems, addToCart } = useContext(ShopContext)
  // Handle form input changes
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    landMark: "",
    city: "",
    zipcode: "",
    country: "",
    state: "",
    phone: "",
    email: "",
  })

  // Calculate subtotal based on whether we're in buy now mode or not
  const calculateSubtotal = () => {
    if (fromBuyNow && buyNowProduct) {
      // For Buy Now, only use the buy now product price
      const price = buyNowProduct.productDetails?.price || 0;
      const quantity = buyNowProduct.quantity || 1;
      return price * quantity;
    }
    // For regular checkout, use the cart total
    return getTotalCartAmount();
  };

  const subtotal = calculateSubtotal();
  // Only add delivery fee if there's a subtotal
  const totalAmount = subtotal > 0 ? subtotal + delivery_fee : 0;

  // No need to modify cart for Buy Now flow - we'll handle it separately

  // ---------- Razorpay helpers ----------
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const openRazorpayPopup = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Validate form before proceeding
      if (!validateForm()) {
        setIsLoading(false);
        return false;
      }

      // Get Razorpay key from environment variables
      const key = process.env.REACT_APP_RAZORPAY_KEY_ID || import.meta?.env?.VITE_RAZORPAY_KEY_ID;
      if (!key) {
        toast.error("Missing Razorpay key. Please contact support.");
        setIsLoading(false);
        return;
      }

      // Create order data
      const orderData = {
        amount: totalAmount * 100, // Convert to paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
        payment_capture: 1
      };

      // Create Razorpay order
      const orderResponse = await axios.post(
        `${BASEURL}/api/orders/create-razorpay-order`,
        orderData,
        { headers }
      );

      const { order } = orderResponse.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: "SilkSew",
        description: `Payment for your ${fromBuyNow ? 'product' : 'order'}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${BASEURL}/api/orders/verify-razorpay-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
                amount: totalAmount,
                items: fromBuyNow && buyNowProduct 
                  ? [{
                      productId: buyNowProduct.productId,
                      size: buyNowProduct.size,
                      color: buyNowProduct.color,
                      quantity: buyNowProduct.quantity,
                      price: buyNowProduct.productDetails?.price || 0,
                      productName: buyNowProduct.productDetails?.name || "Product"
                    }]
                  : cartItems.map(cartItem => {
                      const product = products.find(p => p._id === cartItem.productId);
                      return {
                        productId: cartItem.productId,
                        size: cartItem.size,
                        color: cartItem.color,
                        quantity: cartItem.quantity,
                        price: product?.price || 0,
                        productName: product?.name || "Product"
                      };
                    }),
                fromBuyNow: !!fromBuyNow
              },
              { headers }
            );

            if (verifyRes.data.success) {
              // Clear cart only if this was a regular checkout
              if (!fromBuyNow) {
                setCartItems([]);
                localStorage.removeItem("cartItems");
              }
              
              // Show success message
              setShowSuccessPopup(true);
              setTimeout(() => navigate("/"), 2000);
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Error verifying payment. Please check your orders.");
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#3399cc'
        }
      };

      // Initialize Razorpay and open payment modal
      const rzp = new window.Razorpay(options);
      rzp.open();

      // Handle payment failure
      rzp.on('payment.failed', function(response) {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error in Razorpay payment:', error);
      toast.error('An error occurred while processing your payment. Please try again.');
      setIsLoading(false);
    }
  };

  // ---------- End Razorpay helpers ----------

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^[0-9]{10}$/
    const zipRegex = /^[0-9]{5,6}$/

    if (!formData.firstName.trim()) {
      toast.error("First name is required.")
      return false
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required.")
      return false
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.")
      return false
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be 10 digits.")
      return false
    }
    if (!formData.street.trim()) {
      toast.error("Street address is required.")
      return false
    }
    if (!formData.city.trim()) {
      toast.error("City is required.")
      return false
    }
    if (!formData.state.trim()) {
      toast.error("State is required.")
      return false
    }
    if (!zipRegex.test(formData.zipcode)) {
      toast.error("Zipcode must be 5 or 6 digits.")
      return false
    }
    if (!formData.country.trim()) {
      toast.error("Country is required.")
      return false
    }
    return true
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    if (!method) {
      toast.error("Please select payment option.")
      setIsLoading(false)
      return
    }

    if (!validateForm()) {
      toast.error("Please fill all details.")  
      setIsLoading(false)
      return
    }

    if (method !== "Cash on Delivery") {
      toast.error("Please select Cash on Delivery to place order.")
      setIsLoading(false)
      return
    }

    try {
      // Check both sessionStorage and localStorage for token
      const token = sessionStorage.getItem("token") || localStorage.getItem("token")
      if (!token) {
        toast.error("Your session has expired. Please log in again.")
        navigate("/login", { state: { from: "/checkout" } })
        return
      }

      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        console.error("Cart is empty or invalid.")
        toast.error("Your cart is empty!")
        setIsLoading(false)
        return
      }

      // Wait for products to be loaded if not already
      if (!products || products.length === 0) {
        toast.error("Products are still loading. Please wait a moment and try again.")
        setIsLoading(false)
        return
      }

      const orderItems = cartItems
        .map((cartItem) => {
          const product = products.find((p) => p._id === cartItem.productId)
          if (!product) {
            console.warn(`Product not found for productId: ${cartItem.productId}`)
            toast.error(`Product not found in cart. Please remove and add again.`)
            return null
          }
          return {
            productId: cartItem.productId,
            size: cartItem.size,
            productName: product.name,
            quantity: cartItem.quantity,
            price: product.price,
          }
        })
        .filter((item) => item !== null)

      if (orderItems.length === 0) {
        toast.error("No valid products found in cart. Please refresh and try again.")
        setIsLoading(false)
        return
      }

      // Show success popup only after validation passes
      setShowSuccessPopup(true)

      const totalAmount = getTotalCartAmount() + delivery_fee

      // Corrected: map zipcode → pincode for backend/Shiprocket
      const orderData = {
        address: {
          ...formData,
          pincode: formData.zipcode,
        },
        items: orderItems,
        totalAmount,
        paymentMethod: method,
        offerCode: offerCode || undefined,
      }

      const response = await axios.post(`${BASEURL}/api/orders/place`, orderData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      if (response.data.success) {
        setCartItems([])
        setTimeout(() => {
          setShowSuccessPopup(false)
          setIsLoading(false)
          navigate("/")
        }, 2000)
      } else {
        setShowSuccessPopup(false)
        setIsLoading(false)
        toast.error(response.data.message || "Failed to place order.")
      }
    } catch (error) {
      console.error(error)
      setShowSuccessPopup(false)
      setIsLoading(false)
      toast.error(error.response?.data?.message || "An error occurred while placing your order.")
    }
  }

  return (
    <form className="form-container" onSubmit={onSubmitHandler}>
      <div className="form-left">
        <fieldset className="payment-method">
          <legend>Payment Options</legend>
          <div className="payment-options">
            <div
              className={`payment-option ${method === "Razorpay" ? "selected" : ""}`}
              onClick={() => setMethod("Razorpay")}
            >
              <img src={razorpay} alt="Razorpay" className="payment-logo" />
            </div>
            <div
              className={`payment-option ${method === "Cash on Delivery" ? "selected" : ""}`}
              onClick={() => setMethod("Cash on Delivery")}
            >
              <img src={CashonDelivery} alt="CashonDelivery" className="payment-logo" />
            </div>
          </div>
        </fieldset>

        <div className="form-title">
          <h2>Shipping Address</h2>
        </div>
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            className="form-input"
            placeholder="First Name"
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            className="form-input"
            placeholder="Last Name"
            onChange={onChangeHandler}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          className="form-input"
          placeholder="Email Address"
          onChange={onChangeHandler}
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          className="form-input"
          placeholder="Phone Number"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              onChangeHandler(e);
            }
          }}
          required
        />

        <input
          type="text"
          name="street"
          value={formData.street}
          className="form-input"
          placeholder="Street Address"
          onChange={onChangeHandler}
          required
        />
        <input
          type="text"
          name="landMark"
          value={formData.landMark}
          className="form-input"
          placeholder="Landmark"
          onChange={onChangeHandler}
        />
        <div className="form-row">
          <input
            type="text"
            name="city"
            value={formData.city}
            className="form-input"
            placeholder="City"
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            className="form-input"
            placeholder="State"
            onChange={onChangeHandler}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            className="form-input"
            placeholder="Zipcode"
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,6}$/.test(value)) {
                onChangeHandler(e);
              }
            }}
            required
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            className="form-input"
            placeholder="Country"
            onChange={onChangeHandler}
            required
          />
        </div>
      </div>

      <div className="form-right">
        <div className="cart-total">
          <h3>Cart Totals</h3>
          <div className="cart-total-item">
            <span>Subtotal: </span>
            <span> Rs {subtotal} </span>
          </div>
          <div className="cart-total-item">
            <span>Shipping Fee: </span>
            <span> Rs {delivery_fee} </span>
          </div>
          <div className="cart-total-item">
            <span>Total: </span>
            <span> Rs {totalAmount} </span>
          </div>
        </div>

        <button
          type={method === "Razorpay" ? "button" : "submit"}
          className="submit-button"
          disabled={isLoading}
          onClick={method === "Razorpay" ? openRazorpayPopup : undefined}
          style={{ backgroundColor: "black" }}
        >
          {isLoading ? "Processing..." : "PLACE ORDER"}
        </button>
      </div>

      {showSuccessPopup && <OrderSuccessPopup />}
    </form>
  )
}

export default Checkout