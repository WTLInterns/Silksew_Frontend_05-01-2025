import React from "react";

const TermsServices = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1 className="terms-title">Terms of Service</h1>
        <p className="effective-date"><strong>Effective Date:</strong> 13/02/2025</p>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h2 className="section-title">1. Introduction</h2>
          <p className="section-text">
            Welcome to Silksew! These Terms of Service govern your use of our website,{" "}
            <a href="https://www.silksew.com" className="terms-link">www.silksew.com</a>.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">2. Use of Our Website</h2>
          <ul className="terms-list">
            <li className="list-item">You must be at least 15 years old to use our services.</li>
            <li className="list-item">You agree not to use our website for any unlawful activities.</li>
            <li className="list-item">We reserve the right to refuse service to anyone for any reason.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">3. Account Registration</h2>
          <ul className="terms-list">
            <li className="list-item">Creating an account may be required for purchases.</li>
            <li className="list-item">You are responsible for your account security.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">4. Product Information & Pricing</h2>
          <ul className="terms-list">
            <li className="list-item">We strive for accurate product descriptions and pricing.</li>
            <li className="list-item">Prices and availability may change without notice.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">5. Orders & Payments</h2>
          <ul className="terms-list">
            <li className="list-item">Orders are subject to acceptance and availability.</li>
            <li className="list-item">Payments are securely processed via third-party gateways.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">6. Shipping & Delivery</h2>
          <ul className="terms-list">
            <li className="list-item">We aim to ship orders promptly.</li>
            <li className="list-item">Delivery times depend on location and carrier.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">7. Returns & Refunds</h2>
          <ul className="terms-list">
            <li className="list-item">Returns and exchanges follow our Return Policy.</li>
            <li className="list-item">Refunds are processed via the original payment method.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">8. Intellectual Property</h2>
          <ul className="terms-list">
            <li className="list-item">All website content is our property or licensed to us.</li>
            <li className="list-item">Copying or using content without permission is prohibited.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">9. Limitation of Liability</h2>
          <ul className="terms-list">
            <li className="list-item">We are not responsible for indirect or incidental damages.</li>
            <li className="list-item">Our liability is limited to the amount paid for a product.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">10. Governing Law</h2>
          <p className="section-text">
            These terms are governed by the laws of India. Disputes will be handled in Maharashtra courts.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">11. Changes to These Terms</h2>
          <p className="section-text">
            We may update these terms at any time. Continued use of our site means you accept the changes.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">12. Contact Us</h2>
          <p className="section-text">For any questions, contact us:</p>
          <ul className="terms-list">
            <li className="list-item"><strong>Email:</strong> Info@Silksew.com</li>
            <li className="list-item"><strong>Phone:</strong> +91 91457300054</li>
            <li className="list-item"><strong>Address:</strong> ----</li>
          </ul>
        </section>
      </div>

      <style jsx>{`
        .terms-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          min-height: 100vh;
        }

        .terms-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #e67e22;
        }

        .terms-title {
          font-size: clamp(28px, 5vw, 36px);
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 15px 0;
          line-height: 1.2;
        }

        .effective-date {
          font-size: clamp(14px, 3vw, 16px);
          color: #7f8c8d;
          margin: 0;
        }

        .terms-content {
          display: grid;
          gap: 30px;
        }

        .terms-section {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          border-left: 4px solid #e67e22;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .terms-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: clamp(20px, 4vw, 24px);
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 15px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e67e22;
        }

        .section-text {
          font-size: clamp(15px, 3vw, 16px);
          margin: 0 0 15px 0;
          line-height: 1.7;
        }

        .terms-list {
          margin: 0;
          padding-left: 20px;
          list-style: none;
        }

        .list-item {
          font-size: clamp(14px, 3vw, 16px);
          margin-bottom: 12px;
          padding-left: 10px;
          position: relative;
          line-height: 1.6;
        }

        .list-item::before {
          content: "•";
          color: #e67e22;
          font-weight: bold;
          position: absolute;
          left: -15px;
        }

        .terms-link {
          color: #e67e22;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease, text-decoration 0.3s ease;
        }

        .terms-link:hover {
          color: #d35400;
          text-decoration: underline;
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .terms-container {
            padding: 15px;
            margin: 10px;
            border-radius: 8px;
            min-height: auto;
          }

          .terms-header {
            margin-bottom: 30px;
            padding-bottom: 15px;
          }

          .terms-section {
            padding: 20px;
            border-radius: 6px;
          }

          .section-title {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .section-text {
            font-size: 15px;
            margin-bottom: 12px;
          }

          .list-item {
            font-size: 14px;
            margin-bottom: 10px;
            padding-left: 8px;
          }

          .list-item::before {
            left: -12px;
          }
        }

        @media (max-width: 480px) {
          .terms-container {
            padding: 12px;
            margin: 5px;
          }

          .terms-header {
            margin-bottom: 20px;
            padding-bottom: 12px;
          }

          .terms-section {
            padding: 15px;
          }

          .section-title {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .section-text {
            font-size: 14px;
            margin-bottom: 10px;
          }

          .list-item {
            font-size: 13px;
            margin-bottom: 8px;
            line-height: 1.5;
          }

          .terms-list {
            padding-left: 15px;
          }
        }

        @media (max-width: 320px) {
          .terms-container {
            padding: 10px;
            margin: 2px;
          }

          .terms-section {
            padding: 12px;
          }

          .section-title {
            font-size: 16px;
          }

          .section-text {
            font-size: 13px;
          }

          .list-item {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsServices;
