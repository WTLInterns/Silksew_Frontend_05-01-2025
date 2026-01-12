

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { BASEURL } from "../config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../CSS/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: false
      });
      
      // Render the Google Sign-In button
      setTimeout(() => {
        const buttonContainer = document.getElementById("google-signin-button");
        if (buttonContainer && window.google?.accounts?.id) {
          window.google.accounts.id.renderButton(
            buttonContainer,
            {
              theme: "filled_blue",
              size: "large",
              text: "continue_with",
              shape: "rectangular",
              logo_alignment: "left",
              width: "100%"
            }
          );
        }
      }, 1000);
      
      // Also display One Tap for better UX
      window.google.accounts.id.prompt();
    };
  }, []);

  const handleGoogleSignIn = async (response) => {
    try {
      const { credential } = response;
      console.log("Google credential received:", credential);
      
      const res = await axios.post(BASEURL + "/api/users/google", {
        token: credential
      });

      if (res.data.token) {
        const { user, token } = res.data;
        console.log("Google logged in user:", user);
        login(user, token);
        toast.success("Login successful with Google!", { autoClose: 1500 });

        setTimeout(() => {
          if (user.role?.toLowerCase() === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 1500);
      } else {
        toast.error(res.data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed");
    }
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handlePasswordReset = () => {
    navigate("/reset-password");
  };

  // ✅ Simple validation function
  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    // Email regex check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");

    // ✅ Run validation before API call
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.post(BASEURL + "/api/users/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { user, token } = response.data;
        console.log("Logged in user:", user);
        login(user, token);
        setEmail("");
        setPassword("");

        // ✅ Toast with delay before navigation
        toast.success("Login successful!", { autoClose: 1500 });

        setTimeout(() => {
          if (user.role?.toLowerCase() === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Login Error:", error);
      const message =
        error.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto flex flex-col md:flex-row login-container h-[600px] md:h-[700px]">
        {/* Image Section - Full Height */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 relative login-image-container h-full">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <img
            src="https://img.freepik.com/premium-photo/smiling-character-holding-glowing-shopping-icon-surrounded-by-products-solid-background_720722-34520.jpg?w=740"
            alt="Login Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white">
            <h3 className="text-3xl font-bold mb-4 drop-shadow-lg">Welcome Back</h3>
            <p className="text-lg font-medium max-w-sm text-center">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-white login-form-container h-full">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-2">
              Sign In
            </h2>
            <p className="text-gray-600">
              Please sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center mb-4">
              {error}
            </div>
          )}

          <form onSubmit={onSubmitHandler} className="space-y-4 mb-4">
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 block mb-1">
                Email Address
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block mb-1">
                Password
              </label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="text-right mb-2">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-gray-500 text-sm">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In Button - Tight spacing */}
          <div id="google-signin-button" className="w-full mb-4"></div>

          {/* Sign Up - Right below Google button */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                onClick={handleSignupClick}
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
