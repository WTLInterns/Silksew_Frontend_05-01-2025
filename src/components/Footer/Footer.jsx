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
      <div className="banner-content">
        <div className="banner-left">
          <Link to="/" className="footer-brand">
            <img src={logo || "/placeholder.svg"} alt="SILKSEW logo" className="footer-logo" />
            <h4 className="footer-title">SILKSEW</h4>
          </Link>
          <nav className="footer-nav" aria-label="Footer Navigation">
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    // Trigger navbar navigation like Hero component
                    const event = new CustomEvent('navigateToCategory', { detail: { category: 'Women' } });
                    window.dispatchEvent(event);
                  }}
                  className="footer-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e67e22',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    padding: '0.4rem 0.8rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderRadius: '4px',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#d35400';
                    e.target.style.backgroundColor = 'rgba(230, 126, 34, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#e67e22';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Women
                </button>
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
        <div className="banner-right">
          <div className="footer-contact-section">
            <h3 className="footer-heading">Contact Us</h3>
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
                    +91 9325578091
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
          <div className="footer-about-section">
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
      </div>
      <div className="banner-pattern">
        <div className="pattern-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
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