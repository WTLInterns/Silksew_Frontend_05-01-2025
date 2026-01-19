
// "use client"

// import { useState, useEffect, useContext } from "react"
// import axios from "axios"
// import { AuthContext } from "../context/AuthContext"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faStar, faUser, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
// import { ToastContainer, toast } from "react-toastify"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import "react-toastify/dist/ReactToastify.css"

// const CustomerReview = () => {
//   const { token } = useContext(AuthContext)
//   const [reviews, setReviews] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [searchQuery, setSearchQuery] = useState("")
//   const itemsPerPage = 5

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const res = await axios.get("http://localhost:5003/api/review/", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         setReviews(res.data.data || [])
//       } catch (err) {
//         console.error("Error fetching reviews:", err)
//         toast.error("Failed to fetch reviews")
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (token) fetchReviews()
//   }, [token])

//   if (loading) {
//     return (
//       <div style={{ padding: "20px", textAlign: "center" }}>
//         <div
//           style={{
//             width: "50px",
//             height: "50px",
//             border: "4px solid #e5e7eb",
//             borderTop: "4px solid #4F46E5",
//             borderRadius: "50%",
//             margin: "0 auto",
//             animation: "spin 1s linear infinite",
//           }}
//         ></div>
//       </div>
//     )
//   }

//   // Filter reviews based on search query
//   const filteredReviews = reviews.filter((review) =>
//     (review.name || "Anonymous").toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)

//   return (
//     <div style={{ padding: "20px" }}>
//       {/* Header */}
//       <h2
//         style={{
//           fontSize: "1.5rem",
//           fontWeight: "bold",
//           marginBottom: "20px",
//           color: "#1e293b",
//           display: "flex",
//           alignItems: "center",
//           gap: "10px",
//         }}
//       >
//         <FontAwesomeIcon icon={faUser} style={{ color: "#4F46E5" }} />
//         Customer Reviews
//       </h2>

//       {/* Search Bar */}
//       <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
//         {/* <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#4F46E5" }} /> */}
//         <input
//           type="text"
//           placeholder="Search by customer name..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value)
//             setCurrentPage(1) // Reset to first page when searching
//           }}
//           style={{
//             padding: "8px 12px",
//             borderRadius: "6px",
//             border: "1px solid #d1d5db",
//             flex: 1,
//             fontSize: "0.9rem",
//           }}
//         />
//       </div>

//       {/* Table */}
//       {filteredReviews.length === 0 ? (
//         <p style={{ textAlign: "center", color: "#64748b" }}>No reviews found</p>
//       ) : (
//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               backgroundColor: "white",
//               borderRadius: "8px",
//               overflow: "hidden",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//             }}
//           >
//             <thead style={{ backgroundColor: "#111", color: "white" }}>
//               <tr>
//                 <th style={thStyle} className="px-4 py-2 bg-gray-900 text-white border">Customer</th>
//                 <th style={thStyle} className="px-4 py-2 bg-gray-900 text-white border">Rating</th>
//                 <th style={thStyle} className="px-4 py-2 bg-gray-900 text-white border">Feedback</th>
//                 <th style={thStyle} className="px-4 py-2 bg-gray-900 text-white border">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((review, index) => (
//                 <tr
//                   key={index}
//                   style={{
//                     borderBottom: "1px solid #e5e7eb",
//                     backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
//                   }}
//                 >
//                   <td style={tdStyle}>{review.name || "Anonymous"}</td>
//                   <td style={tdStyle}>
//                     {[...Array(5)].map((_, i) => (
//                       <FontAwesomeIcon
//                         key={i}
//                         icon={faStar}
//                         style={{
//                           color: i < review.rating ? "#fbbf24" : "#d1d5db",
//                           marginRight: "2px",
//                         }}
//                       />
//                     ))}
//                   </td>
//                   <td style={tdStyle}>{review.review || "-"}</td>
//                   <td style={tdStyle}>
//                     {review.createdAt
//                       ? new Date(review.createdAt).toLocaleDateString()
//                       : "-"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       {filteredReviews.length > itemsPerPage && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             alignItems: "center",
//             marginTop: "15px",
//             gap: "12px",
//           }}
//         >
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             style={{
//               backgroundColor: "#111",
//               color: "white",
//               border: "none",
//               padding: "8px 10px",
//               borderRadius: "6px",
//               cursor: currentPage === 1 ? "not-allowed" : "pointer",
//               opacity: currentPage === 1 ? 0.5 : 1,
//             }}
//           >
//             <ChevronLeft size={18} />
//           </button>

//           <span style={{ fontSize: "0.9rem", color: "#374151" }}>
//             Page {currentPage} of {totalPages}
//           </span>

//           <button
//             onClick={() =>
//               setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
//             }
//             disabled={currentPage >= totalPages}
//             style={{
//               backgroundColor: "#111",
//               color: "white",
//               border: "none",
//               padding: "8px 10px",
//               borderRadius: "6px",
//               cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
//               opacity: currentPage >= totalPages ? 0.5 : 1,
//             }}
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
//       )}

//       <ToastContainer />
//       <style jsx>{`
//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// const thStyle = {
//   textAlign: "left",
//   padding: "12px",
//   fontSize: "0.9rem",
//   fontWeight: "600",
//   color: "white",
// }

// const tdStyle = {
//   padding: "12px",
//   fontSize: "0.9rem",
//   color: "#374151",
// }

// export default CustomerReview



"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faUser, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { ToastContainer, toast } from "react-toastify"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"

const CustomerReview = () => {
  const { token } = useContext(AuthContext)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPage = 5

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5003/api/review/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setReviews(res.data.data || [])
      } catch (err) {
        console.error("Error fetching reviews:", err)
        toast.error("Failed to fetch reviews")
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchReviews()
  }, [token])

  if (loading) {
    return (
      <div className="loading-container">
        <style jsx>{`
          .loading-container {
            padding: 20px;
            text-align: center;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #4F46E5;
            border-radius: 50%;
            margin: 0 auto;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="spinner"></div>
      </div>
    )
  }

  // Filter reviews based on search query
  const filteredReviews = reviews.filter((review) =>
    (review.name || "Anonymous").toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)

  return (
    <div className="customer-reviews-container">
      <style jsx>{`
        .customer-reviews-container {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 28px;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
        }

        .search-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .search-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: #4F46E5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        /* Desktop Table Styles */
        .desktop-table {
          display: block;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .reviews-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background: #111;
        }

        .table-head {
          padding: 16px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: black;
          border: 1px solid #333;
        }

        .table-row {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s ease;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .table-row:nth-child(even) {
          background: #f9fafb;
        }

        .table-row:nth-child(even):hover {
          background: #f3f4f6;
        }

        .table-cell {
          padding: 16px;
          font-size: 14px;
          color: #374151;
          vertical-align: top;
        }

        .customer-name {
          font-weight: 500;
          color: #1f2937;
        }

        .rating-stars {
          display: flex;
          gap: 2px;
        }

        .feedback-text {
          line-height: 1.4;
          max-width: 300px;
          word-wrap: break-word;
        }

        /* Mobile Card Styles */
        .mobile-cards {
          display: none;
        }

        .review-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .customer-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .customer-name-mobile {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .review-date {
          font-size: 12px;
          color: #6b7280;
        }

        .rating-mobile {
          display: flex;
          gap: 2px;
        }

        .feedback-section {
          margin-bottom: 16px;
        }

        .feedback-label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .feedback-content {
          font-size: 14px;
          line-height: 1.5;
          color: #4b5563;
        }

        .no-reviews {
          text-align: center;
          color: #64748b;
          padding: 40px;
          background: white;
          border-radius: 8px;
          font-size: 16px;
        }

        /* Pagination Styles */
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #111;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #374151;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .customer-reviews-container {
            padding: 16px;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .search-container {
            width: 100%;
            margin-bottom: 16px;
          }

          /* Hide desktop table on mobile */
          .desktop-table {
            display: none;
          }

          /* Show mobile cards on mobile */
          .mobile-cards {
            display: block;
          }

          .review-card {
            padding: 16px;
            margin-bottom: 12px;
          }

          .card-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .customer-name-mobile {
            font-size: 15px;
          }

          .pagination-container {
            flex-direction: column;
            gap: 12px;
          }

          .pagination-btn {
            width: 100%;
            max-width: 200px;
          }
        }

        @media (max-width: 480px) {
          .customer-reviews-container {
            padding: 12px;
          }

          .page-title {
            font-size: 20px;
          }

          .search-input {
            padding: 8px 12px;
            font-size: 13px;
          }

          .review-card {
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 8px;
          }

          .customer-name-mobile {
            font-size: 14px;
          }

          .feedback-content {
            font-size: 13px;
          }

          .page-info {
            font-size: 13px;
          }

          .pagination-btn {
            height: 36px;
          }
        }

        @media (max-width: 360px) {
          .customer-reviews-container {
            padding: 8px;
          }

          .page-title {
            font-size: 18px;
          }

          .search-container {
            padding: 8px;
          }

          .review-card {
            padding: 10px;
          }

          .customer-name-mobile {
            font-size: 13px;
          }

          .feedback-content {
            font-size: 12px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">
          <FontAwesomeIcon icon={faUser} style={{ color: "#4F46E5", marginRight: "10px" }} />
          Customer Reviews
        </h2>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#4F46E5" }} />
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="search-input"
        />
      </div>

      {/* Desktop Table View */}
      <div className="desktop-table">
        <table className="reviews-table">
          <thead className="table-header">
            <tr>
              <th className="table-head">Customer</th>
              <th className="table-head">Rating</th>
              <th className="table-head">Feedback</th>
              <th className="table-head">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((review, index) => (
              <tr key={index} className="table-row">
                <td className="table-cell customer-name">
                  {review.name || "Anonymous"}
                </td>
                <td className="table-cell">
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        style={{
                          color: i < review.rating ? "#fbbf24" : "#d1d5db",
                          fontSize: "14px"
                        }}
                      />
                    ))}
                  </div>
                </td>
                <td className="table-cell feedback-text">
                  {review.review || "-"}
                </td>
                <td className="table-cell">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards">
        {currentItems.length === 0 ? (
          <div className="no-reviews">No reviews found</div>
        ) : (
          currentItems.map((review, index) => (
            <div key={index} className="review-card">
              <div className="card-header">
                <div className="customer-info">
                  <div className="customer-name-mobile">
                    {review.name || "Anonymous"}
                  </div>
                  <div className="review-date">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
                <div className="rating-mobile">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      style={{
                        color: i < review.rating ? "#fbbf24" : "#d1d5db",
                        fontSize: "12px"
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="feedback-section">
                <div className="feedback-label">Feedback</div>
                <div className="feedback-content">
                  {review.review || "No feedback provided"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredReviews.length > itemsPerPage && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={currentPage >= totalPages}
            className="pagination-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default CustomerReview