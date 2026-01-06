import  React from "react"
import { Link } from "react-router-dom"
import "./Footer.css"
// import footer_logo from "../Assets/logo_big.png"
import instagram_icon from "../Assets/instagram_icon.png"
// import pintester_icon from "../Assets/pintester_icon.png"
import whatsapp_icon from "../Assets/whatsapp_icon.png"
import logo from "../Assets/siksewmodified.png"; 

const Footer = () => {
  const mapStyles = {
    height: "100%",
    width: "100%",
  }

  return (
    <footer className="footer" role="contentinfo">
        <div className="footer-container">
        <div className="footer-section footer-left">
          <Link to="/" className="footer-brand">
            <img src={logo || "/placeholder.svg"} alt="SILKSEW logo" className="footer-logo" />
            <h2 className="footer-title">SILKSEW</h2>
          </Link>
          <nav className="footer-nav" aria-label="Footer Navigation">
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/womens" className="footer-link">
                  Women
                </Link>
              </li>
            </ul>
          </nav>


          <p className="footer-copyright">
            &copy; {new Date().getFullYear()}{" "}
            <a href="https://webutsav.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Webutsav
            </a>
            . All rights reserved.
          </p>
        </div>
        <br/>

        <div className="footer-section footer-center">
   
   
          <h3 className="footer-heading" style={{marginTop:"10px"}}>Contact Us</h3>
          <address className="footer-address">
            <div className="footer-info">
              <div className="footer-icon" aria-hidden="true">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <p className="footer-text">Pune</p>
            </div>
            <div className="footer-info">
              <div className="footer-icon" aria-hidden="true">
                <i className="fas fa-phone-alt"></i>
              </div>
              <p className="footer-text">
                <a href="tel:+919226108039 " className="footer-link">
                  +91 9226108039 
                </a>
              </p>
            </div>
            <div className="footer-info">
              <div className="footer-icon" aria-hidden="true">
                <i className="fas fa-envelope"></i>
              </div>
              <p className="footer-text">
                <a href="mailto:info@cobazTech.com" className="footer-link">
                  silksew30@gmail.com
                </a>
              </p>
            </div>
          </address>
        </div>

        <div className="footer-section footer-right">
          <h3 className="footer-heading">About Us</h3>
          <p className="footer-about">
            At SILKSEW, we're passionate about creating stunning fashion that empowers you to express your unique style.
            Join us in redefining elegance and comfort.
          </p>
          <div className="footer-socials-wrapper">
            <div className="footer-socials">
              <a
                href="https://wa.me/9226108039 "
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp"
              >
                <img src={whatsapp_icon || "/placeholder.svg"} alt="" className="footer-social-icon" />
              </a>
              {/* <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Pinterest"
              >
                <img src={pintester_icon || "/placeholder.svg"} alt="" className="footer-social-icon" />
              </a> */}
              <a
                href="https://www.instagram.com/silks_sew?igsh=dXp5MDdveDdrMGRj"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <img src={instagram_icon || "/placeholder.svg"} alt="" className="footer-social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-legal">
          <Link to="/privacy-policy" className="footer-link">
            Privacy Policy
          </Link>{" "}
          |
          <Link to="/terms-conditions" className="footer-link">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer