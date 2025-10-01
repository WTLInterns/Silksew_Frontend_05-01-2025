
import { useState } from "react"
import "../CSS/LoginSignup.css"
import axios from "axios"
import { BASEURL } from "../config"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const LoginSignup = () => {
  const [signUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setSignUp({ ...signUp, [e.target.name]: e.target.value })
  }

  const handleLoginClick = () => {
    navigate("/login")
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    // ✅ Strong validation rules
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^[0-9]{10}$/ // 10 digit phone
    const zipRegex = /^[0-9]{5,6}$/ // 5 or 6 digit zip
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).{6,}$/ // min 6, must include upper, lower, number, special char

    if (!signUp.name.trim()) {
      toast.error("Name is required.")
      return
    }

    if (!emailRegex.test(signUp.email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    if (!passwordRegex.test(signUp.password)) {
      toast.error(
        "Password must be at least 6 characters, include uppercase, lowercase, number, and special character."
      )
      return
    }

    if (!phoneRegex.test(signUp.phone)) {
      toast.error("Phone number must be exactly 10 digits.")
      return
    }

    if (!signUp.street.trim()) {
      toast.error("Street/Address is required.")
      return
    }

    if (!signUp.city.trim()) {
      toast.error("City is required.")
      return
    }

    if (!signUp.state.trim()) {
      toast.error("State is required.")
      return
    }

    if (!zipRegex.test(signUp.zipcode)) {
      toast.error("Please enter a valid zipcode (5 or 6 digits).")
      return
    }

    // ✅ If all validations pass → API call
    try {
      const response = await axios.post(`${BASEURL}/api/users/register`, signUp)
      console.log(response)

      toast.success("Registration successful! You can now log in.")

      // Reset form fields
      setSignUp({
        name: "",
        email: "",
        password: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
      })

      // Redirect after success
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed. Please try again.")
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="loginsignup">
        <div className="loginsignup-container">
          <h1>Sign Up</h1>
          <div className="loginsignup-fields">
            <div className="input-row">
              <input
                name="name"
                value={signUp.name}
                onChange={handleChange}
                type="text"
                placeholder="Your Name"
                required
              />
              <input
                name="email"
                value={signUp.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Address"
                required
              />
            </div>
            <div className="input-row">
              <input
                name="password"
                value={signUp.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                required
              />
              <input
                name="phone"
                value={signUp.phone}
                onChange={handleChange}
                type="text"
                placeholder="Phone Number"
                required
              />
            </div>
            <input
              name="street"
              value={signUp.street}
              onChange={handleChange}
              type="text"
              placeholder="Address"
              required
            />
            <div className="input-row">
              <input
                name="city"
                value={signUp.city}
                onChange={handleChange}
                type="text"
                placeholder="City"
                required
              />
              <input
                name="state"
                value={signUp.state}
                onChange={handleChange}
                type="text"
                placeholder="State"
                required
              />
            </div>
            <input
              name="zipcode"
              value={signUp.zipcode}
              onChange={handleChange}
              type="text"
              placeholder="Zipcode"
              required
            />
          </div>
          <button type="submit">Continue</button>
          <p className="loginsignup-login">
            Already have an account?
            <span className="loginsignup-link" onClick={handleLoginClick}>
              {" "}
              Login here
            </span>
          </p>
          <div className="loginsignup-agree">
            <input type="checkbox" name="terms" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
      />
    </form>
  )
}

export default LoginSignup
