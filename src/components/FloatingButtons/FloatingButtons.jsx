
import React from "react";
import "./FloatingButtons.css"; // Import CSS
import { FaWhatsapp } from "react-icons/fa"; // Import icons

const FloatingButtons = () => {
  return (
    <>
      {/* WhatsApp Icon - Left Corner */}
      <a href="https://wa.me/9325578091" target="_blank" rel="noopener noreferrer" className="floating-btn whatsapp">
        <FaWhatsapp size={30} />
      </a>
    </>
  );
};

export default FloatingButtons;


