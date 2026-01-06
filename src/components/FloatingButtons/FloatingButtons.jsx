
// import React from "react";
// import "./FloatingButtons.css"; // Import CSS
// import { FaWhatsapp } from "react-icons/fa"; // Import icons

// const FloatingButtons = () => {
//   return (
//     <>
//       {/* WhatsApp Icon - Left Corner */}
//       <a href="https://wa.me/9226108039" target="_blank" rel="noopener noreferrer" className="floating-btn whatsapp">
//         <FaWhatsapp size={30} />
//       </a>
//     </>
//   );
// };

// export default FloatingButtons;



import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const FloatingButtons = () => {
  // Get modal state to adjust z-index
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Check if any modal is open
  React.useEffect(() => {
    const checkModals = () => {
      // Check for common modal classes or elements
      const hasModal = document.querySelector('.modal-open, .modal, [class*="modal"], [class*="Modal"]');
      setIsModalOpen(!!hasModal);
    };
    
    // Check initially
    checkModals();
    
    // Set up MutationObserver to detect modal changes
    const observer = new MutationObserver(checkModals);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'],
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  }, []);

  const buttonStyle = {
    position: 'fixed',
    width: '60px',
    height: '60px',
    bottom: '20px',
    left: '20px',  // CHANGED: from right to left
    backgroundColor: '#25d366',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    zIndex: isModalOpen ? '5' : '1000', // Lower z-index when modal is open
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    outline: 'none'
  };

  const hoverStyle = {
    backgroundColor: '#128c7e',
    transform: 'scale(1.1)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
  };

  const activeStyle = {
    transform: 'scale(0.95)'
  };

  // Handle hover state
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  // Combine styles based on state
  const combinedStyle = {
    ...buttonStyle,
    ...(isHovered && hoverStyle),
    ...(isActive && activeStyle)
  };

  // Media queries for responsive design
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust styles based on screen size
  if (windowWidth <= 768) {
    combinedStyle.width = '50px';
    combinedStyle.height = '50px';
    combinedStyle.bottom = '15px';
    combinedStyle.left = '15px';  // CHANGED: from right to left
  }

  if (windowWidth <= 320) {
    combinedStyle.width = '45px';
    combinedStyle.height = '45px';
    combinedStyle.bottom = '10px';
    combinedStyle.left = '10px';  // CHANGED: from right to left
  }

  if (windowWidth >= 769 && windowWidth <= 1024) {
    combinedStyle.width = '55px';
    combinedStyle.height = '55px';
    combinedStyle.bottom = '25px';
    combinedStyle.left = '25px';  // CHANGED: from right to left
  }

  if (windowWidth >= 1025) {
    combinedStyle.left = 'calc(20px + (100vw - 100%))';
  }

  return (
    <a 
      href="https://wa.me/9226108039" 
      target="_blank" 
      rel="noopener noreferrer"
      style={combinedStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={windowWidth <= 768 ? 24 : 30} />
    </a>
  );
};

export default FloatingButtons;