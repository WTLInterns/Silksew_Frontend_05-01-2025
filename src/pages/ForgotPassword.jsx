

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BASEURL } from "../config";

function ForgotPassword() {
  const { id, token } = useParams(); // get id + token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false); // track token validity
  const [loading, setLoading] = useState(false);

  // ✅ Verify token validity when page loads
  const verifyUser = async () => {
    try {
      const res = await axios.get(
        `${BASEURL}/api/forgot-password/forgotpassword/${id}/${token}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setIsValid(true);
      } else {
        toast.error("Token expired or invalid. Please request a new link.", {
          position: "top-center",
        });
        setTimeout(() => navigate("/forgot-password"), 1500);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("Invalid or expired reset link. Please request a new one.", {
        position: "top-center",
      });
      setTimeout(() => navigate("/forgot-password"), 1500);
    }
  };

  // ✅ Handle password update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter a new password", { position: "top-center" });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-center",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASEURL}/api/change-password/${id}/${token}`,
        {
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === 201) {
        toast.success("Password Updated Successfully!", {
          position: "top-center",
        });
        setPassword("");
        setConfirmPassword("");
        
        // Redirect to login after success
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(res.data.message || "Failed to update password", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update password. Try again.",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-white/90 text-sm">
            Enter your new password
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {isValid ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-lg font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:scale-100 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying reset link...</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
