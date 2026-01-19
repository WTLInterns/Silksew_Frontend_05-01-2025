"use client"

import { useState } from "react"
import { FaStar } from "react-icons/fa"
import axios from "axios"
import "./FeedBack.css"

const FeedBack = ({ productId, onNewFeedback }) => {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  const handleStarClick = (index) => {
    setRating(index)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert("Please select a rating before submitting!")
      return
    }

    // Check both sessionStorage and localStorage for user data
    const sessionUser = sessionStorage.getItem("user")
    const localUser = localStorage.getItem("user")
    const userData = sessionUser || localUser
    
    console.log("SessionStorage user:", sessionUser) // Debug log
    console.log("LocalStorage user:", localUser) // Debug log
    console.log("Final userData:", userData) // Debug log
    
    if (userData) {
      try {
        const user = JSON.parse(userData)
        console.log("Parsed user:", user) // Debug log
        
        // Check for multiple possible user ID fields
        const userId = user.id || user._id || user.userId
        const name = user.name || user.username || user.firstName
        
        console.log("Extracted userId:", userId, "name:", name) // Debug log

        if (!productId || !userId || !rating || !review || !name) {
          console.log("Missing fields check:", {
            productId: !!productId,
            userId: !!userId,
            rating: !!rating,
            review: !!review,
            name: !!name
          })
          alert(`Missing fields: ${!productId ? 'productId ' : ''}${!userId ? 'userId ' : ''}${!rating ? 'rating ' : ''}${!review ? 'review ' : ''}${!name ? 'name ' : ''}`)
          return
        }

        try {
          const res = await axios.post("https://api.silksew.com/api/review/add", {
            productId,
            userId,
            rating,
            review,
            name,
          })
          console.log("Review submission response:", res.data) // Debug log

          // Call the callback function with the new review
          onNewFeedback({ productId, userId, rating, review, name, _id: res.data._id })

          // Reset form
          setRating(0)
          setReview("")
          alert("Feedback submitted successfully!")
        } catch (error) {
          console.error("Error submitting feedback:", error)
          alert("Failed to submit feedback. Please try again.")
        }
      } catch (parseError) {
        console.error("Error parsing user data:", parseError)
        alert("Invalid user data. Please log in again.")
      }
    } else {
      console.log("No user data found in either storage")
      alert("Please log in to submit feedback.")
    }
  }

  return (
    <div className="feedback-container">
      <h2 style={{ color: "black" }}>Give Your Feedback</h2>

      <div className="stars">
        {[1, 2, 3, 4, 5].map((star, index) => (
          <FaStar
            key={index}
            size={30}
            className={index < rating ? "star selected" : "star"}
            onClick={() => handleStarClick(index + 1)}
          />
        ))}
      </div>

      <textarea
        className="review-box"
        placeholder="Write your feedback..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      ></textarea>
      <br />

      <button className="submit-btn" onClick={handleSubmit} style={{backgroundColor:"#4d0000"}}>
        Submit Feedback
      </button>
    </div>
  )
}

export default FeedBack

