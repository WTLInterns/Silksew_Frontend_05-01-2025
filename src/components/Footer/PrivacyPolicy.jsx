import React from "react";

const PrivacyPolicy = () => {
  const styles = {
    container: {
      width: "100%",
      maxWidth: "100%",
      margin: "50px",
      padding: "30px",
      backgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.0",
      color: "#333",
    },
    heading1: {
      textAlign: "left",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    heading2: {
      fontSize: "18px",
      fontWeight: "bold",
      marginTop: "15px",
      borderBottom: "1px solid #ddd",
      paddingBottom: "3px",
    },
    paragraph: {
      fontSize: "16px",
      marginBottom: "10px",
    },
    list: {
      paddingLeft: "20px",
    },
    listItem: {
      fontSize: "16px",
      listStyleType: "disc",
      marginBottom: "10px",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
    },
    linkHover: {
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading1}>Privacy Policy</h1>
      <p style={styles.paragraph}><strong>Effective Date:</strong> 13/02/2025</p>

      <h2 style={styles.heading2}>1. Introduction</h2>
      <p style={styles.paragraph}>
        Welcome to Silksew! Your privacy is important to us. This Privacy Policy outlines how we collect,
        use, and protect your personal information when you visit our website,{" "}
        <a href="https://www.silksew.com" style={styles.link}>www.silksew.com</a>.
      </p>

      <h2 style={styles.heading2}>2. Information We Collect</h2>
      <p style={styles.paragraph}>We collect various types of information, including:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}><strong>Personal Information:</strong> Name, email, phone number, etc.</li>
        <li style={styles.listItem}><strong>Payment Information:</strong> Credit/debit card details, UPI, etc.</li>
        <li style={styles.listItem}><strong>Browsing Information:</strong> IP address, browser type, etc.</li>
        <li style={styles.listItem}><strong>Cookies and Tracking:</strong> Used for analytics.</li>
      </ul>

      <h2 style={styles.heading2}>3. How We Use Your Information</h2>
      <p style={styles.paragraph}>We use your information for the following purposes:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>To process and fulfill your orders.</li>
        <li style={styles.listItem}>To provide customer support.</li>
        <li style={styles.listItem}>To improve our website and services.</li>
        <li style={styles.listItem}>To send promotional emails (you can opt out anytime).</li>
      </ul>

      <h2 style={styles.heading2}>4. Sharing Your Information</h2>
      <p style={styles.paragraph}>We do not sell your information but may share it with:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Payment processors for secure transactions.</li>
        <li style={styles.listItem}>Shipping partners for deliveries.</li>
        <li style={styles.listItem}>Legal authorities if required by law.</li>
      </ul>

      <h2 style={styles.heading2}>5. Data Security</h2>
      <p style={styles.paragraph}>We implement security measures to protect your data. However, no method is 100% secure.</p>

      <h2 style={styles.heading2}>6. Your Rights</h2>
      <p style={styles.paragraph}>You have the right to:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Access, update, or delete your information.</li>
        <li style={styles.listItem}>Opt out of marketing communications.</li>
        <li style={styles.listItem}>Disable cookies via browser settings.</li>
      </ul>

      <h2 style={styles.heading2}>7. Third-Party Links</h2>
      <p style={styles.paragraph}>Our website may contain links to third-party sites. We are not responsible for their privacy policies.</p>

      <h2 style={styles.heading2}>8. Updates to This Policy</h2>
      <p style={styles.paragraph}>We may update this Privacy Policy periodically. Changes will be posted with an updated effective date.</p>

      <h2 style={styles.heading2}>9. Contact Us</h2>
      <p style={styles.paragraph}>For questions regarding this policy, contact us:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}><strong>Email:</strong> <a href="mailto:
silksew30@gmail.com" style={styles.link}>
          silksew30@gmail.com</a></li>
        <li style={styles.listItem}><strong>Phone:</strong> +91 9226108039 </li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;