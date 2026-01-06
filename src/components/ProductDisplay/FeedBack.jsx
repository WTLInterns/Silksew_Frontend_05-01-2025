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

    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      const userId = user.id
      const name = user.name

      if (!productId || !userId || !rating || !review || !name) {
        alert("Missing fields")
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
        // console.log(res.data)

        // Call the callback function with the new review
        onNewFeedback({ productId, userId, rating, review, name, _id: res.data._id })

        // Reset form
        setRating(0)
        setReview("")
      } catch (error) {
        console.error("Error submitting feedback:", error)
        alert("Failed to submit feedback. Please try again.")
      }
    } else {
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

