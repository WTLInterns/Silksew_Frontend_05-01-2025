// "use client";

// import React, { useState, useEffect } from "react";

// export default function Subscription() {
//   const [offer, setOffer] = useState("");
//   const [subscribers, setSubscribers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch all subscribers
//   const fetchSubscribers = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("http://localhost:5003/api/list");
//       const data = await res.json();
//       if (res.ok) setSubscribers(data);
//       else alert(data.message || "Failed to fetch subscribers");
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching subscribers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send offer to subscribers
//   const sendOffer = async () => {
//     if (!offer.trim()) return alert("Please enter an offer message");
//     try {
//       setLoading(true);
//       const res = await fetch("http://localhost:5003/api/send-offer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ offer }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         alert(data.message);
//         setOffer("");
//       } else {
//         alert(data.message || "Failed to send offer");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error sending offer");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubscribers();
//   }, []);

//   return (
//     <div className="subscription-container">
//       <div className="header-section">
//         <h2>Send Offer to Subscribers 🎉 </h2>
//         <p className="subtitle">Reach all your subscribed users with special offers</p>
//       </div>

//       <div className="offer-form">
//         <div className="input-group">
//           <input
//             type="text"
//             placeholder="Enter your special offer message..."
//             value={offer}
//             onChange={(e) => setOffer(e.target.value)}
//             className="offer-input"
//           />
//           <button 
//             onClick={sendOffer} 
//             disabled={loading}
//             className="send-button"
//           >
//             {loading ? "Sending..." : "Send Offer"}
//           </button>
//         </div>
//       </div>

//       <div className="subscriber-section">
//         <div className="section-header">
//           <h3>Subscribed Users</h3>
//           <span className="subscriber-count">{subscribers.length} subscriber</span>
//         </div>
        
//         {loading ? (
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading subscribers...</p>
//           </div>
//         ) : (
//           <div className="subscriber-list">
//             {subscribers.length > 0 ? (
//               <div className="table-container">
//                 <table className="subscriber-table">
//                   <thead>
//                     <tr>
//                       <th>Email Address</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subscribers.map((sub, idx) => (
//                       <tr key={idx} className="subscriber-row">
//                         <td className="email-cell">
//                           <span className="email-icon">✉️</span>
//                           {sub.email}
//                         </td>
//                         <td className="status-cell">
//                           <span className={`status-badge ${sub.status.toLowerCase()}`}>
//                             {sub.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="empty-state">
//                 <div className="empty-icon">📭</div>
//                 <p>No subscribers found</p>
//                 <span>Users who subscribe will appear here</span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .subscription-container {
//           padding: 24px;
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
//           color: #1f2937;
//           background: #f8fafc;
//           min-height: 100vh;
//         }

//         .header-section {
//           text-align: center;
//           margin-bottom: 32px;
//         }

//         h2 {
//           font-size: 32px;
//           font-weight: 700;
//           color: #111827;
//           margin-bottom: 8px;
//         }

//         .subtitle {
//           font-size: 16px;
//           color: #6b7280;
//           margin: 0;
//         }

//         .offer-form {
//           background: white;
//           padding: 24px;
//           border-radius: 12px;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//           margin-bottom: 32px;
//         }

//         .input-group {
//           display: flex;
//           gap: 12px;
//           align-items: stretch;
//         }

//         .offer-input {
//           flex: 1;
//           padding: 14px 16px;
//           font-size: 16px;
//           border: 2px solid #e5e7eb;
//           border-radius: 8px;
//           outline: none;
//           transition: all 0.2s ease;
//         }

//         .offer-input:focus {
//           border-color: #f59e0b;
//           box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
//         }

//         .send-button {
//           padding: 14px 28px;
//           background: linear-gradient(135deg, #f59e0b, #d97706);
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           white-space: nowrap;
//         }

//         .send-button:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
//         }

//         .send-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .subscriber-section {
//           background: white;
//           padding: 24px;
//           border-radius: 12px;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//         }

//         .section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//           flex-wrap: wrap;
//           gap: 12px;
//         }

//         h3 {
//           font-size: 24px;
//           font-weight: 600;
//           color: #111827;
//           margin: 0;
//         }

//         .subscriber-count {
//           background: #ecfdf5;
//           color: #065f46;
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 14px;
//           font-weight: 600;
//         }

//         .loading-state {
//           text-align: center;
//           padding: 40px;
//           color: #6b7280;
//         }

//         .spinner {
//           width: 40px;
//           height: 40px;
//           border: 4px solid #e5e7eb;
//           border-left: 4px solid #f59e0b;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin: 0 auto 16px;
//         }

//         .table-container {
//           overflow-x: auto;
//           border-radius: 8px;
//           border: 1px solid #e5e7eb;
//         }

//         .subscriber-table {
//           width: 100%;
//           border-collapse: collapse;
//           min-width: 500px;
//         }

//         .subscriber-table th {
//           background: #f9fafb;
//           padding: 16px 20px;
//           text-align: left;
//           font-weight: 600;
//           color: #374151;
//           border-bottom: 2px solid #e5e7eb;
//           font-size: 14px;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .subscriber-row {
//           transition: background-color 0.2s ease;
//           border-bottom: 1px solid #f3f4f6;
//         }

//         .subscriber-row:hover {
//           background: #f9fafb;
//         }

//         .subscriber-row:last-child {
//           border-bottom: none;
//         }

//         .email-cell, .status-cell {
//           padding: 16px 20px;
//           vertical-align: middle;
//         }

//         .email-cell {
//           font-weight: 500;
//           color: #1f2937;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .email-icon {
//           font-size: 18px;
//         }

//         .status-badge {
//           padding: 6px 12px;
//           border-radius: 20px;
//           font-size: 12px;
//           font-weight: 600;
//           text-transform: capitalize;
//         }

//         .status-badge.subscribed {
//           background: #dcfce7;
//           color: #166534;
//         }

//         .status-badge.active {
//           background: #dbeafe;
//           color: #1e40af;
//         }

//         .status-badge.pending {
//           background: #fef3c7;
//           color: #92400e;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 60px 20px;
//           color: #6b7280;
//         }

//         .empty-icon {
//           font-size: 48px;
//           margin-bottom: 16px;
//         }

//         .empty-state p {
//           font-size: 18px;
//           font-weight: 600;
//           margin: 0 0 8px 0;
//           color: #374151;
//         }

//         .empty-state span {
//           font-size: 14px;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         /* Mobile Responsive Styles */
//         @media (max-width: 768px) {
//           .subscription-container {
//             padding: 16px;
//           }

//           h2 {
//             font-size: 24px;
//           }

//           .offer-form {
//             padding: 20px;
//           }

//           .input-group {
//             flex-direction: column;
//             gap: 12px;
//           }

//           .send-button {
//             width: 100%;
//             padding: 16px;
//           }

//           .subscriber-section {
//             padding: 20px;
//           }

//           .section-header {
//             flex-direction: column;
//             align-items: flex-start;
//           }

//           h3 {
//             font-size: 20px;
//           }

//           .subscriber-table th,
//           .email-cell,
//           .status-cell {
//             padding: 12px 16px;
//           }

//           .email-cell {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 8px;
//           }

//           .table-container {
//             border: none;
//             border-radius: 0;
//           }

//           .subscriber-table {
//             min-width: 400px;
//           }
//         }

//         @media (max-width: 480px) {
//           .subscription-container {
//             padding: 12px;
//           }

//           h2 {
//             font-size: 20px;
//           }

//           .offer-form,
//           .subscriber-section {
//             padding: 16px;
//           }

//           .subscriber-table {
//             min-width: 300px;
//             font-size: 14px;
//           }

//           .subscriber-table th,
//           .email-cell,
//           .status-cell {
//             padding: 10px 12px;
//           }

//           .status-badge {
//             font-size: 11px;
//             padding: 4px 8px;
//           }
//         }

//         /* Card layout for very small screens */
//         @media (max-width: 360px) {
//           .subscriber-list {
//             display: grid;
//             gap: 12px;
//           }

//           .table-container {
//             display: none;
//           }

//           .subscriber-card {
//             background: #f9fafb;
//             padding: 16px;
//             border-radius: 8px;
//             border: 1px solid #e5e7eb;
//           }

//           .subscriber-card .email-cell {
//             margin-bottom: 8px;
//           }

//           /* Show card layout only for very small screens */
//           .subscriber-table {
//             display: none;
//           }

//           .subscriber-card-layout {
//             display: block;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";

export default function Subscription() {
  const [offer, setOffer] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5003/api/list");
      const data = await res.json();
      if (res.ok) setSubscribers(data);
      else alert(data.message || "Failed to fetch subscribers");
    } catch (err) {
      console.error(err);
      alert("Error fetching subscribers");
    } finally {
      setLoading(false);
    }
  };

  // Send offer to subscribers
  const sendOffer = async () => {
    if (!offer.trim()) return alert("Please enter an offer message");
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5003/api/send-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setOffer("");
      } else {
        alert(data.message || "Failed to send offer");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending offer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="subscription-container">
      <div className="header-section">
        <h2>Send Offer to Subscribers 🎉</h2>
        <p className="subtitle">Reach all your subscribed users with special offers</p>
      </div>

      <div className="offer-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your special offer message..."
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className="offer-input"
          />
          <button 
            onClick={sendOffer} 
            disabled={loading}
            className="send-button"
          >
            {loading ? "Sending..." : "Send Offer"}
          </button>
        </div>
      </div>

      <div className="subscriber-section">
        <div className="section-header">
          <h3>Subscribed Users</h3>
          <span className="subscriber-count">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</span>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading subscribers...</p>
          </div>
        ) : (
          <div className="subscriber-list">
            {subscribers.length > 0 ? (
              <div className="table-container">
                <table className="subscriber-table">
                  <thead>
                    <tr>
                      <th>Email Address</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr key={idx} className="subscriber-row">
                        <td className="email-cell">
                          <span className="email-icon">✉️</span>
                          {sub.email}
                        </td>
                        <td className="status-cell">
                          <span className={`status-badge ${sub.status ? sub.status.toLowerCase() : 'subscribed'}`}>
                            {sub.status || 'Subscribed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No subscribers found</p>
                <span>Users who subscribe will appear here</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .subscription-container {
          padding: 24px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1f2937;
          background: #f8fafc;
          min-height: 100vh;
        }

        .header-section {
          text-align: center;
          margin-bottom: 32px;
        }

        h2 {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .offer-form {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
        }

        .input-group {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }

        .offer-input {
          flex: 1;
          padding: 14px 16px;
          font-size: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s ease;
        }

        .offer-input:focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .send-button {
          padding: 14px 28px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .subscriber-section {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        h3 {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .subscriber-count {
          background: #ecfdf5;
          color: #065f46;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-left: 4px solid #f59e0b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .subscriber-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 0; /* CHANGED: Remove fixed min-width */
        }

        .subscriber-table th {
          background: #f9fafb;
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .subscriber-row {
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f3f4f6;
        }

        .subscriber-row:hover {
          background: #f9fafb;
        }

        .subscriber-row:last-child {
          border-bottom: none;
        }

        .email-cell, .status-cell {
          padding: 16px 20px;
          vertical-align: middle;
        }

        .email-cell {
          font-weight: 500;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .email-icon {
          font-size: 18px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .status-badge.subscribed {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.active {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state p {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #374151;
        }

        .empty-state span {
          font-size: 14px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .subscription-container {
            padding: 16px;
          }

          h2 {
            font-size: 24px;
          }

          .offer-form {
            padding: 20px;
          }

          .input-group {
            flex-direction: column;
            gap: 12px;
          }

          .send-button {
            width: 100%;
            padding: 16px;
          }

          .subscriber-section {
            padding: 20px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          h3 {
            font-size: 20px;
          }

          .subscriber-table th,
          .email-cell,
          .status-cell {
            padding: 12px 16px;
          }

          .email-cell {
            flex-direction: row; /* Keep row layout on mobile */
            align-items: center;
            gap: 8px;
          }

          .table-container {
            border: 1px solid #e5e7eb; /* Keep border on mobile */
            border-radius: 8px;
          }

          /* Better mobile table styling */
          .subscriber-table {
            width: 100%;
          }
          
          .subscriber-table th,
          .subscriber-table td {
            padding: 12px 8px;
          }
        }

        @media (max-width: 480px) {
          .subscription-container {
            padding: 12px;
          }

          h2 {
            font-size: 20px;
          }

          .offer-form,
          .subscriber-section {
            padding: 16px;
          }

          .subscriber-table {
            font-size: 14px;
          }

          .subscriber-table th,
          .email-cell,
          .status-cell {
            padding: 10px 8px;
          }

          .email-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .email-icon {
            font-size: 16px;
          }

          .status-badge {
            font-size: 11px;
            padding: 4px 8px;
          }
        }

        /* Extra small screens - card layout */
        @media (max-width: 360px) {
          .subscriber-table {
            display: none;
          }
          
          .mobile-cards {
            display: block;
          }
          
          .subscriber-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
          }
          
          .card-email {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          .card-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }

        /* Show card layout only on very small screens */
        .mobile-cards {
          display: none;
        }
        
        @media (max-width: 360px) {
          .table-container {
            display: none;
          }
          
          .mobile-cards {
            display: block;
          }
        }
      `}</style>

      {/* Mobile card layout for very small screens */}
      <div className="mobile-cards">
        {subscribers.length > 0 && !loading && (
          <div className="subscriber-cards">
            {subscribers.map((sub, idx) => (
              <div key={idx} className="subscriber-card">
                <div className="card-email">
                  <span className="email-icon">✉️</span>
                  {sub.email}
                </div>
                <div className="card-status">
                  {/* <span>Status:</span> */}
                  <span className={`status-badge ${sub.status ? sub.status.toLowerCase() : 'subscribed'}`}>
                    {sub.status || 'Subscribed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}