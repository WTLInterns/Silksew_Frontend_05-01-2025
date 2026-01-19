
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../Offerbar/Offerbar.css"

// export default function SaleTimer() {
//   const [offer, setOffer] = useState(null);  // Initialize offer state
//   const [totalDays, setTotalDays] = useState(null);
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 24,
//     minutes: 30,
//     seconds: 45,
//   })

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const endDate = new Date("2025-02-28").getTime()
//       const now = new Date().getTime()
//       const difference = endDate - now

//       setTimeLeft({
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//         minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
//         seconds: Math.floor((difference % (1000 * 60)) / 1000),
//       })
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   const announcements = [
//     "Special Offer! 🎉",
//     "Limited Time Deal ⚡",
//     "Don't Miss Out! 🎯",
//     "Shop Now! 🛍️",
//     "Best Prices Ever! 💫",
//   ]


//   // Fetch the offer data from the backend
//   useEffect(() => {
//     const fetchOffer = async () => {
//       try {
//         const res = await axios.get("http://localhost:5003/api/offer/get-offer");
//         setOffer(res.data.formatOfferDates);
//         console.log("Offer response:", res.data.offers);
//       } catch (err) {
//         console.error("Error fetching offer:", err);
//       }
//     };

//     fetchOffer();
//   }, []);

//   useEffect(() => {
//     if (offer?.startDate && offer?.endDate) {
//       const start = new Date(offer.startDate);
//       const end = new Date(offer.endDate);
//       const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
//       setTotalDays(days);
//     }
//   }, [offer]);

//   const formatOfferDates = (start, end) => {
//     const startDate = new Date(start);
//     const endDate = new Date(end);

//     const options = { day: "numeric", month: "short" }; // 'short' => Jan, Feb, etc.

//     const formattedStart = startDate.toLocaleDateString("en-GB", options); // e.g., 12 May
//     const formattedEnd = endDate.toLocaleDateString("en-GB", options);     // e.g., 16 May

//     return `${formattedStart} to ${formattedEnd}`;
//   };

//   return (
//     <div className="sale-wrapper">
//       <div className="sale-container">
//         <div className="timer-section">
//           <div className="sale-text blink">Sale is Live !!!</div>

//           {offer?.startDate && offer?.endDate && (
//             <div className="offer-date-range">
//               🗓️ <strong>{formatOfferDates(offer.startDate, offer.endDate)}</strong>
//             </div>
//           )}

//           <div className="countdown">
//             <div className="time-unit">
//               <span className="number">{totalDays} days {offer?.value}% OFF </span>
//               {/* <span className="label">days</span> */}
//             </div>
//             {/* <div className="code-section">
//               <span className="number">{offer?.code}</span>
//               <span className="label">CODE</span>

            

//             </div> */}

//           </div>
//         </div>
//         <div className="marquee-section">
//           <div className="marquee-content">
//             {[...announcements, ...announcements, ...announcements].map((text, index) => (
//               <span key={index} className="marquee-item">
//                 {text}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Offerbar/Offerbar.css"

export default function SaleTimer() {
  const [offer, setOffer] = useState(null);  // Initialize offer state
  const [totalDays, setTotalDays] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 24,
    minutes: 30,
    seconds: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const endDate = new Date("2025-02-28").getTime()
      const now = new Date().getTime()
      const difference = endDate - now

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const announcements = [
    "Special Offer! 🎉",
    "Limited Time Deal ⚡",
    "Don't Miss Out! 🎯",
    "Shop Now! 🛍️",
    "Best Prices Ever! 💫",
  ]


  // Fetch the offer data from the backend
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get("http://localhost:5003/api/offer/get-offer");
        setOffer(res.data.formatOfferDates);
        console.log("Offer response:", res.data.offers);
      } catch (err) {
        console.error("Error fetching offer:", err);
      }
    };

    fetchOffer();
  }, []);

  useEffect(() => {
    if (offer?.startDate && offer?.endDate) {
      const start = new Date(offer.startDate);
      const end = new Date(offer.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalDays(days);
    }
  }, [offer]);

  const formatOfferDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const options = { day: "numeric", month: "short" }; // 'short' => Jan, Feb, etc.

    const formattedStart = startDate.toLocaleDateString("en-GB", options); // e.g., 12 May
    const formattedEnd = endDate.toLocaleDateString("en-GB", options);     // e.g., 16 May

    return `${formattedStart} to ${formattedEnd}`;
  };

  // Add this useEffect to prevent WhatsApp icon overlap
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Check if WhatsApp icon exists
        const whatsappIcon = document.querySelector('.whatsapp-icon, [class*="whatsapp"], [class*="WhatsApp"]');
        if (whatsappIcon) {
          // Add extra margin to sale wrapper
          const saleWrapper = document.querySelector('.sale-wrapper');
          if (saleWrapper) {
            saleWrapper.style.marginBottom = '80px';
          }
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="sale-wrapper">
      <div className="sale-container">
        <div className="timer-section">
          <div className="sale-text blink">Sale is Live !!!</div>

          {offer?.startDate && offer?.endDate && (
            <div className="offer-date-range">
              🗓️ <strong>{formatOfferDates(offer.startDate, offer.endDate)}</strong>
            </div>
          )}

          <div className="countdown">
            <div className="time-unit">
              <span className="number">{totalDays} days {offer?.value}% OFF </span>
              {/* <span className="label">days</span> */}
            </div>
            {/* <div className="code-section">
              <span className="number">{offer?.code}</span>
              <span className="label">CODE</span>

            

            </div> */}

          </div>
        </div>
        <div className="marquee-section">
          <div className="marquee-content">
            {[...announcements, ...announcements, ...announcements].map((text, index) => (
              <span key={index} className="marquee-item">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}