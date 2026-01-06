
// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { LeftOutlined, RightOutlined } from "@ant-design/icons"

// const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5003"
// const ITEMS_PER_PAGE = 9

// const ReturnOrderList = () => {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [selectedActions, setSelectedActions] = useState({})
//   const [searchTerm, setSearchTerm] = useState("")

//   useEffect(() => {
//     fetchReturnOrders()
//     const savedActions = localStorage.getItem("selectedActions")
//     if (savedActions) {
//       setSelectedActions(JSON.parse(savedActions))
//     }
//   }, [])

//   const fetchReturnOrders = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         setError("Unauthorized: No token found")
//         setLoading(false)
//         return
//       }

//       const response = await axios.get(`${BASEURL}/api/orders/return-orders`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       const sortedOrders = response.data.sort((a, b) => {
//         if (a.returnStatus && !b.returnStatus) return 1
//         if (!a.returnStatus && b.returnStatus) return -1
//         return 0
//       })

//       setOrders(sortedOrders)
//       setLoading(false)
//     } catch (err) {
//       console.error("Error details:", err)
//       setError(err.response?.data?.message || "Failed to fetch orders")
//       setLoading(false)
//     }
//   }

//   const handleReturnDecision = async (action, _id, productId) => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         setError("Unauthorized: No token found")
//         return
//       }
//       if (!action) {
//         setError("Action is required")
//         return
//       }
//       if (!productId) {
//         setError("Product ID is missing")
//         return
//       }

//       await axios.post(
//         `${BASEURL}/api/orders/update-return-status/${_id}/${productId}`,
//         { action },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       )

//       setSelectedActions((prev) => {
//         const newActions = { ...prev, [`${_id}-${productId}`]: action }
//         localStorage.setItem("selectedActions", JSON.stringify(newActions))
//         return newActions
//       })

//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === _id && order.productId === productId ? { ...order, returnStatus: action } : order,
//         ),
//       )
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update return status")
//     }
//   }

//   if (loading) return <div className="p-4 text-center text-gray-600">Loading...</div>
//   if (error) return <div className="p-4 text-red-600">{error}</div>

//   // 🔎 Search filter
//   const filteredOrders = orders.filter((order) => {
//     const search = searchTerm.toLowerCase()
//     return (
//       order.productId?.toLowerCase().includes(search) ||
//       order.email?.toLowerCase().includes(search) ||
//       order.phone?.toLowerCase().includes(search) ||
//       order.returnReason?.toLowerCase().includes(search)
//     )
//   })

//   const pageCount = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
//   const displayedOrders = filteredOrders.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   )

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">📦 Return Orders</h2>

//       {/* 🔍 Search Bar */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by Product ID, Email, Phone or Reason..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {orders.length === 0 ? (
//         <p className="text-gray-500">No return requests found.</p>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//             <table className="w-full text-sm text-left border-collapse ">
//               <thead className="bg-gray-900 text-gray-700 uppercase text-xs">
//                 <tr>
//                   <th className="px-4 py-2 bg-gray-900 text-white border">Product Name</th>
//                   <th className="px-4 py-2 bg-gray-900 text-white border">Address</th>
//                   <th className="px-4 py-2 bg-gray-900 text-white border">Contact</th>
//                   <th className="px-4 py-2 bg-gray-900 text-white border">Total Amount</th>
//                   <th className="px-4 py-2 bg-gray-900 text-white border">Payment Method</th>
//                   <th className="px-4 py-2 bg-gray-900 text-white border">Return Reason</th>
//                   <th className="px-4 py-2 bg-gray-900 text-white border">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayedOrders.map((order) => (
//                   <tr
//                     key={`${order._id}-${order.productId}`}
//                     className="hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-2 border font-medium text-gray-800">
//                       {order.productId}
//                     </td>
//                     <td className="px-4 py-2 border">
//                       {order.street}, {order.city}, {order.state},{" "}
//                       {order.zipcode}
//                     </td>
//                     <td className="px-4 py-2 border">
//                       <p>
//                         <strong>📞</strong> {order.phone}
//                       </p>
//                       <p>
//                         <strong>✉️</strong> {order.email}
//                       </p>
//                     </td>
//                     <td className="px-4 py-2 border font-semibold text-green-700">
//                       ₹ {order.totalAmount}
//                     </td>
//                     <td className="px-4 py-2 border">{order.paymentMethod}</td>
//                     <td className="px-4 py-2 border">
//                       {order.returnReason || "N/A"}
//                     </td>
//                     <td className="px-4 py-2 border">
//                       {selectedActions[`${order._id}-${order.productId}`] ||
//                       order.returnStatus ? (
//                         <span className="text-green-600 font-bold">
//                           {selectedActions[`${order._id}-${order.productId}`] ||
//                             order.returnStatus}
//                         </span>
//                       ) : order.productId ? (
//                         <select
//                           onChange={(event) =>
//                             handleReturnDecision(
//                               event.target.value,
//                               order._id,
//                               order.productId
//                             )
//                           }
//                           value=""
//                           className="border p-1 rounded-md"
//                         >
//                           <option value="">Select action</option>
//                           <option value="accepted">✅ Accept</option>
//                           <option value="rejected">❌ Reject</option>
//                         </select>
//                       ) : (
//                         <span className="text-red-600">
//                           No product ID available
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//         <div className="flex justify-end mt-4">
//   <div className="flex items-center space-x-4">
//     <button
//       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//       disabled={currentPage === 1}
//       className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
//     >
//       <LeftOutlined />
//     </button>

//     <span className="text-gray-700">
//       Page {currentPage} of {pageCount}
//     </span>

//     <button
//       onClick={() =>
//         setCurrentPage((prev) => Math.min(prev + 1, pageCount))
//       }
//       disabled={currentPage === pageCount}
//       className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
//     >
//       <RightOutlined />
//     </button>
//   </div>
// </div>

//         </>
//       )}
//     </div>
//   )
// }

// export default ReturnOrderList



"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5003"
const ITEMS_PER_PAGE = 9

const ReturnOrderList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedActions, setSelectedActions] = useState({})
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReturnOrders()
    const savedActions = localStorage.getItem("selectedActions")
    if (savedActions) {
      setSelectedActions(JSON.parse(savedActions))
    }
  }, [])

  const fetchReturnOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Unauthorized: No token found")
        setLoading(false)
        return
      }

      const response = await axios.get(`${BASEURL}/api/orders/return-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const sortedOrders = response.data.sort((a, b) => {
        if (a.returnStatus && !b.returnStatus) return 1
        if (!a.returnStatus && b.returnStatus) return -1
        return 0
      })

      setOrders(sortedOrders)
      setLoading(false)
    } catch (err) {
      console.error("Error details:", err)
      setError(err.response?.data?.message || "Failed to fetch orders")
      setLoading(false)
    }
  }

  const handleReturnDecision = async (action, _id, productId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Unauthorized: No token found")
        return
      }
      if (!action) {
        setError("Action is required")
        return
      }
      if (!productId) {
        setError("Product ID is missing")
        return
      }

      await axios.post(
        `${BASEURL}/api/orders/update-return-status/${_id}/${productId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      setSelectedActions((prev) => {
        const newActions = { ...prev, [`${_id}-${productId}`]: action }
        localStorage.setItem("selectedActions", JSON.stringify(newActions))
        return newActions
      })

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === _id && order.productId === productId ? { ...order, returnStatus: action } : order,
        ),
      )
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update return status")
    }
  }

  if (loading) return <div className="p-4 text-center text-gray-600">Loading...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  // 🔎 Search filter
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase()
    return (
      order.productId?.toLowerCase().includes(search) ||
      order.email?.toLowerCase().includes(search) ||
      order.phone?.toLowerCase().includes(search) ||
      order.returnReason?.toLowerCase().includes(search)
    )
  })

  const pageCount = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="return-orders-container">
      <style jsx>{`
        .return-orders-container {
          padding: 24px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-title {
          font-size: 28px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 24px;
        }

        .search-container {
          margin-bottom: 24px;
        }

        .search-input {
          width: 100%;
          max-width: 500px;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          display: block;
          margin: 0 auto;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Desktop Table Styles */
        .desktop-table-view {
          display: block;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 24px;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .table-header {
          background: #1f2937;
        }

        .table-head {
          padding: 16px;
          color: black;
          font-weight: 600;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid #374151;
        }

        .table-row {
          transition: background-color 0.2s ease;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .table-cell {
          padding: 16px;
          border: 1px solid #e5e7eb;
          vertical-align: top;
          font-size: 14px;
          color: #374151;
        }

        .product-name {
          font-weight: 600;
          color: #1f2937;
        }

        .contact-info {
          line-height: 1.5;
        }

        .contact-info p {
          margin: 4px 0;
        }

        .amount {
          font-weight: 600;
          color: #059669;
        }

        .action-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .action-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .status-approved {
          color: #059669;
          font-weight: 600;
        }

        .status-rejected {
          color: #dc2626;
          font-weight: 600;
        }

        .error-text {
          color: #dc2626;
        }

        .no-orders {
          text-align: center;
          color: #6b7280;
          padding: 40px;
          font-size: 16px;
        }

        /* Mobile Card Styles */
        .mobile-card-view {
          display: none;
        }

        .order-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .card-section {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }

        .card-section:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 8px 0;
        }

        .card-label {
          font-weight: 600;
          color: #374151;
          font-size: 13px;
          flex: 1;
        }

        .card-value {
          color: #6b7280;
          font-size: 14px;
          text-align: right;
          flex: 1;
        }

        .contact-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-action-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          margin-top: 8px;
        }

        .no-orders-mobile {
          text-align: center;
          color: #6b7280;
          padding: 40px;
          font-size: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        /* Pagination Styles */
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .pagination-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #374151;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-button:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
          .return-orders-container {
            padding: 20px;
          }
          
          .orders-table {
            min-width: 900px;
          }
        }

        @media (max-width: 768px) {
          .return-orders-container {
            padding: 16px;
          }

          .page-title {
            font-size: 24px;
            margin-bottom: 20px;
          }

          .search-input {
            max-width: 100%;
          }

          /* Hide desktop table on mobile */
          .desktop-table-view {
            display: none;
          }

          /* Show mobile cards on mobile */
          .mobile-card-view {
            display: block;
          }

          .order-card {
            padding: 16px;
            margin-bottom: 12px;
          }

          .card-section {
            margin-bottom: 16px;
            padding-bottom: 16px;
          }

          .card-title {
            font-size: 15px;
          }

          .card-label {
            font-size: 12px;
          }

          .card-value {
            font-size: 13px;
          }

          .pagination-container {
            flex-direction: row;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .return-orders-container {
            padding: 12px;
          }

          .page-title {
            font-size: 20px;
          }

          .order-card {
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 8px;
          }

          .card-section {
            margin-bottom: 12px;
            padding-bottom: 12px;
          }

          .card-title {
            font-size: 14px;
            margin-bottom: 6px;
          }

          .card-row {
            flex-direction: column;
            gap: 4px;
            align-items: flex-start;
          }

          .card-label {
            font-size: 11px;
          }

          .card-value {
            font-size: 12px;
            text-align: left;
          }

          .page-info {
            font-size: 13px;
          }

          .pagination-button {
            width: 36px;
            height: 36px;
          }
        }

        @media (max-width: 360px) {
          .return-orders-container {
            padding: 8px;
          }

          .page-title {
            font-size: 18px;
          }

          .search-input {
            padding: 10px 14px;
            font-size: 13px;
          }

          .order-card {
            padding: 10px;
          }

          .card-section {
            margin-bottom: 10px;
            padding-bottom: 10px;
          }

          .card-label {
            font-size: 10px;
          }

          .card-value {
            font-size: 11px;
          }

          .pagination-button {
            width: 32px;
            height: 32px;
          }
        }

        /* Scrollbar for table on medium screens */
        .table-container {
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
        }
      `}</style>

      <h2 className="page-title">📦 Return Orders</h2>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Product ID, Email, Phone or Reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">No return requests found.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="desktop-table-view">
            <div className="table-container">
              <table className="orders-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Product Name</th>
                    <th className="table-head">Address</th>
                    <th className="table-head">Contact</th>
                    <th className="table-head">Total Amount</th>
                    <th className="table-head">Payment Method</th>
                    <th className="table-head">Return Reason</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map((order) => (
                    <tr
                      key={`${order._id}-${order.productId}`}
                      className="table-row"
                    >
                      <td className="table-cell product-name">
                        {order.productId}
                      </td>
                      <td className="table-cell">
                        {order.street}, {order.city}, {order.state},{" "}
                        {order.zipcode}
                      </td>
                      <td className="table-cell">
                        <div className="contact-info">
                          <p><strong>📞</strong> {order.phone}</p>
                          <p><strong>✉️</strong> {order.email}</p>
                        </div>
                      </td>
                      <td className="table-cell amount">
                        ₹ {order.totalAmount}
                      </td>
                      <td className="table-cell">{order.paymentMethod}</td>
                      <td className="table-cell">
                        {order.returnReason || "N/A"}
                      </td>
                      <td className="table-cell">
                        {selectedActions[`${order._id}-${order.productId}`] ||
                        order.returnStatus ? (
                          <span className={selectedActions[`${order._id}-${order.productId}`] === 'accepted' ? 'status-approved' : 'status-rejected'}>
                            {selectedActions[`${order._id}-${order.productId}`] ||
                              order.returnStatus}
                          </span>
                        ) : order.productId ? (
                          <select
                            onChange={(event) =>
                              handleReturnDecision(
                                event.target.value,
                                order._id,
                                order.productId
                              )
                            }
                            value=""
                            className="action-select"
                          >
                            <option value="">Select action</option>
                            <option value="accepted">✅ Accept</option>
                            <option value="rejected">❌ Reject</option>
                          </select>
                        ) : (
                          <span className="error-text">
                            No product ID available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {displayedOrders.map((order) => (
              <div key={`${order._id}-${order.productId}`} className="order-card">
                <div className="card-section">
                  <div className="card-title">Product Information</div>
                  <div className="card-row">
                    <span className="card-label">Product Name:</span>
                    <span className="card-value product-name">{order.productId}</span>
                  </div>
                </div>

                <div className="card-section">
                  <div className="card-title">Address</div>
                  <div className="card-content">
                    <span className="card-value">
                      {order.street}, {order.city}, {order.state}, {order.zipcode}
                    </span>
                  </div>
                </div>

                <div className="card-section">
                  <div className="card-title">Contact Information</div>
                  <div className="contact-card">
                    <div className="card-row">
                      <span className="card-label">Phone:</span>
                      <span className="card-value">{order.phone}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Email:</span>
                      <span className="card-value">{order.email}</span>
                    </div>
                  </div>
                </div>

                <div className="card-section">
                  <div className="card-row">
                    <span className="card-label">Total Amount:</span>
                    <span className="card-value amount">₹ {order.totalAmount}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Payment Method:</span>
                    <span className="card-value">{order.paymentMethod}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Return Reason:</span>
                    <span className="card-value">{order.returnReason || "N/A"}</span>
                  </div>
                </div>

                <div className="card-section">
                  <div className="card-title">Action Required</div>
                  <div className="card-content">
                    {selectedActions[`${order._id}-${order.productId}`] ||
                    order.returnStatus ? (
                      <span className={selectedActions[`${order._id}-${order.productId}`] === 'accepted' ? 'status-approved' : 'status-rejected'}>
                        {selectedActions[`${order._id}-${order.productId}`] ||
                          order.returnStatus}
                      </span>
                    ) : order.productId ? (
                      <select
                        onChange={(event) =>
                          handleReturnDecision(
                            event.target.value,
                            order._id,
                            order.productId
                          )
                        }
                        value=""
                        className="mobile-action-select"
                      >
                        <option value="">Select action</option>
                        <option value="accepted">✅ Accept Return</option>
                        <option value="rejected">❌ Reject Return</option>
                      </select>
                    ) : (
                      <span className="error-text">
                        No product ID available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <LeftOutlined />
            </button>

            <span className="page-info">
              Page {currentPage} of {pageCount}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="pagination-button"
            >
              <RightOutlined />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ReturnOrderList