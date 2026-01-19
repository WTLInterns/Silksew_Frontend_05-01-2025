import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <div className="policy-header">
        <h1 className="policy-title">Privacy Policy</h1>
        <p className="effective-date"><strong>Effective Date:</strong> 13/02/2025</p>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h2 className="section-title">1. Introduction</h2>
          <p className="section-text">
            Welcome to Silksew! Your privacy is important to us. This Privacy Policy outlines how we collect,
            use, and protect your personal information when you visit our website,{" "}
            <a href="https://www.silksew.com" className="policy-link">www.silksew.com</a>.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">2. Information We Collect</h2>
          <p className="section-text">We collect various types of information, including:</p>
          <ul className="policy-list">
            <li className="list-item"><strong>Personal Information:</strong> Name, email, phone number, etc.</li>
            <li className="list-item"><strong>Payment Information:</strong> Credit/debit card details, UPI, etc.</li>
            <li className="list-item"><strong>Browsing Information:</strong> IP address, browser type, etc.</li>
            <li className="list-item"><strong>Cookies and Tracking:</strong> Used for analytics.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2 className="section-title">3. How We Use Your Information</h2>
          <p className="section-text">We use your information for the following purposes:</p>
          <ul className="policy-list">
            <li className="list-item">To process and fulfill your orders.</li>
            <li className="list-item">To provide customer support.</li>
            <li className="list-item">To improve our website and services.</li>
            <li className="list-item">To send promotional emails (you can opt out anytime).</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2 className="section-title">4. Sharing Your Information</h2>
          <p className="section-text">We do not sell your information but may share it with:</p>
          <ul className="policy-list">
            <li className="list-item">Payment processors for secure transactions.</li>
            <li className="list-item">Shipping partners for deliveries.</li>
            <li className="list-item">Legal authorities if required by law.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2 className="section-title">5. Data Security</h2>
          <p className="section-text">
            We implement security measures to protect your data. However, no method is 100% secure.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">6. Your Rights</h2>
          <p className="section-text">You have the right to:</p>
          <ul className="policy-list">
            <li className="list-item">Access, update, or delete your information.</li>
            <li className="list-item">Opt out of marketing communications.</li>
            <li className="list-item">Disable cookies via browser settings.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2 className="section-title">7. Third-Party Links</h2>
          <p className="section-text">
            Our website may contain links to third-party sites. We are not responsible for their privacy policies.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">8. Updates to This Policy</h2>
          <p className="section-text">
            We may update this Privacy Policy periodically. Changes will be posted with an updated effective date.
          </p>
        </section>

        <section className="policy-section">
          <h2 className="section-title">9. Contact Us</h2>
          <p className="section-text">For questions regarding this policy, contact us:</p>
          <ul className="policy-list">
            <li className="list-item">
              <strong>Email:</strong>{" "}
              <a href="mailto:silksew30@gmail.com" className="policy-link">
                silksew30@gmail.com
              </a>
            </li>
            <li className="list-item"><strong>Phone:</strong> +91 9325578091</li>
          </ul>
        </section>
      </div>

      <style jsx>{`
        .privacy-policy-container {
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

        .policy-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #e67e22;
        }

        .policy-title {
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

        .policy-content {
          display: grid;
          gap: 30px;
        }

        .policy-section {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          border-left: 4px solid #e67e22;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .policy-section:hover {
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

        .policy-list {
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

        .policy-link {
          color: #e67e22;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease, text-decoration 0.3s ease;
        }

        .policy-link:hover {
          color: #d35400;
          text-decoration: underline;
        }

        /* Mobile Responsive Design */
        @media (max-width: 768px) {
          .privacy-policy-container {
            padding: 15px;
            margin: 10px;
            border-radius: 8px;
            min-height: auto;
          }

          .policy-header {
            margin-bottom: 30px;
            padding-bottom: 15px;
          }

          .policy-section {
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
          .privacy-policy-container {
            padding: 12px;
            margin: 5px;
          }

          .policy-header {
            margin-bottom: 20px;
            padding-bottom: 12px;
          }

          .policy-section {
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

          .policy-list {
            padding-left: 15px;
          }
        }

        @media (max-width: 320px) {
          .privacy-policy-container {
            padding: 10px;
            margin: 2px;
          }

          .policy-section {
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

export default PrivacyPolicy;