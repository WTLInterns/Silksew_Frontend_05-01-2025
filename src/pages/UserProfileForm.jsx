/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import "./UserProfileForm.css";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { ToastContainer, toast } from "react-toastify";
import profileImage from '../components/Assets/profile_icon.png'; 


const UserProfileForm = () => {
  const { token } = useContext(ShopContext);
  const [profile, setProfile] = useState({});

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const fetchUserDetails = async (authToken) => {
    try {
      const response = await axios.get("https://api.silksew.com/api/userProfileDetail/user-profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setProfile(response.data); // Fix: Update state with user profile
      console.log("User Profile Data:", response);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      fetchUserDetails(authToken);
    } else {
      console.log("Admin token not found in localStorage. Please log in.");
    }
  }, [token]); // Dependency on `token`


  const updateProfile = async (e) => {
    // Prevent form submission from reloading the page
    e.preventDefault();
    
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("No token found. Please log in.");
      return;
    }
  
    try {
      const response = await axios.put(
        "https://api.silksew.com/api/updateUserProfileDetail/update-user-profile",
        profile, // Send the updated state dynamically
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Toast will now show after a successful update
      toast.success("Profile Successfully Updated.");
      
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed. Please try again.");
    }
  };
  
  
  

  return (
    <div className="profile-wrapper">
    <h2 className="profile-title">User Information</h2>
    <div className="profile-card">
      <img src={profileImage} alt="User" className="profile-avatar" />
      <p><strong>User Name :</strong> {profile.name}</p>
      <p><strong>Phone :</strong> {profile.phone}</p>
      <p><strong>Email :</strong> {profile.email}</p>
      <button className="edit-btn">EDIT PROFILE</button>
    </div>

    <form className="profile-form" onSubmit={updateProfile}>
      {/* Your existing form fields */}
      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" value={profile.name} onChange={handleChange} required />
      </div>
      {/* Add remaining fields as-is */}
      <button type="submit" className="submit-btn">Save</button>
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} />
    </form>
  </div>
  );
};

export default UserProfileForm;    