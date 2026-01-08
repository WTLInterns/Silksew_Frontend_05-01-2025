

import { useContext, useEffect, useState, useCallback } from "react"
import axios from "axios"
import { ShopContext } from "../context/ShopContext"
import { BASEURL } from "../config"
import moment from "moment"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const AdminUser = ({ updateTotalOrders }) => {
  const [addresses, setAddresses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const { token } = useContext(ShopContext)

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const statusHandler = async (event, _id) => {
    const newStatus = event.target.value
    try {
      await axios.post(BASEURL + "/api/updateOrderStatus/order-status", {
        _id,
        status: newStatus,
      })
      await fetchUserDetails()
      toast.success(`Order status has been updated to ${newStatus}!`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.log(error)
      toast.error("Failed to update order status. Please try again.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const paymentStatusHandler = async (event, _id) => {
    try {
      await axios.post(BASEURL + "/api/updatePayment/payment-status", {
        _id,
        payment: event.target.value,
      })
      await fetchUserDetails()
      toast.success("Payment status has been updated!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.log(error)
      toast.error("Failed to update payment status. Please try again.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const fetchUserDetails = useCallback(async () => {
    const localStorageToken = localStorage.getItem("token")

    if (!localStorageToken) {
      console.log("Admin token not found in localStorage. Please log in.")
      return
    }

    try {
      const response = await axios.get(BASEURL + "/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorageToken}`,
        },
      })
      console.log("order details get", response)
      setAddresses(response.data)
      updateTotalOrders(response.data.length)
    } catch (err) {
      console.error("Error fetching orders:", err)
      toast.error("Failed to fetch orders. Please try again.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }, [updateTotalOrders])

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token")
    if (localStorageToken) {
      fetchUserDetails()
    }
  }, [fetchUserDetails])

  const filteredOrders = addresses
    .filter(
      (order) =>
        order.address.firstName?.toLowerCase().includes(searchTerm?.toLowerCase()) && order.status !== "ConfirmedOrder",
    )
    .sort((a, b) => {
      if (a.status === "Confirmed" && b.status !== "Confirmed") return 1
      if (a.status !== "Confirmed" && b.status === "Confirmed") return -1
      return moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
    })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  const styles = {
    container: {
      padding: "16px",
      maxWidth: "1400px",
      margin: "0 auto",
      marginTop: "20px",
      width: "100%",
      boxSizing: "border-box"
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: "16px",
      marginBottom: "20px",
      width: "100%"
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      textAlign: "left",
      color: "#000",
      margin: 0
    },
    searchContainer: {
      display: "flex",
      justifyContent: "left"
    },
    searchInput: {
      width: "100%",
      maxWidth: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
      WebkitAppearance: "none",
      minHeight: "48px"
    },
    tableContainer: {
      width: "100%",
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      margin: "0 -16px",
      padding: "0 16px"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      padding: "12px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "600",
      color: "#6b7280",
      textTransform: "uppercase",
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb"
    },
    tr: {
      backgroundColor: "#ffffff",
      transition: "background-color 0.2s ease"
    },
    confirmedRow: {
      backgroundColor: "#f3f4f6"
    },
    td: {
      padding: "16px 12px",
      fontSize: "14px",
      color: "#374151",
      borderBottom: "1px solid #e5e7eb",
      verticalAlign: "top"
    },
    detailContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    },
    detailText: {
      margin: "0",
      lineHeight: "1.4"
    },
    smallText: {
      fontSize: "12px"
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.2s ease",
      backgroundColor: "white",
      minHeight: "44px",
      WebkitAppearance: "none"
    },
    confirmedBadge: {
      display: "inline-flex",
      padding: "4px 12px",
      fontSize: "12px",
      fontWeight: "600",
      borderRadius: "9999px",
      backgroundColor: "#dcfce7",
      color: "#166534"
    },
    noOrders: {
      padding: "32px 24px",
      textAlign: "center",
      fontSize: "14px",
      color: "#6b7280"
    },
    paginationContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "24px",
      width: "100%"
    },
    pagination: {
      display: "flex",
      alignItems: "center",
      gap: "16px"
    },
    paginationButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "44px",
      height: "44px",
      padding: "0 12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      backgroundColor: "#000",
      color: "#ffffff",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      outline: "none",
      WebkitTapHighlightColor: "transparent"
    },
    disabledButton: {
      opacity: "0.5",
      cursor: "not-allowed"
    },
    paginationIcon: {
      width: "16px",
      height: "16px"
    },
    pageText: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151"
    }
  }

  const mediaQueries = `
    @media (min-width: 768px) {
      .admin-orders {
        padding: 24px;
      }
      
      .admin-orders h2 {
        text-align: left;
        font-size: 28px;
        margin-bottom: 24px;
      }
      
      .admin-orders .header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      
      .admin-orders .search-input {
        max-width: 400px;
        margin: 0;
      }
      
      .admin-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .admin-table th,
      .admin-table td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .admin-table th {
        background-color: #f9fafb;
        font-weight: 600;
        font-size: 14px;
        color: #4b5563;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .admin-table tr:last-child td {
        border-bottom: none;
      }
    }
    
    @media (max-width: 767px) {
      .admin-orders {
        padding: 0;
        margin-top: 16px;
      }
      
      .admin-orders h2 {
        font-size: 22px;
        padding: 0 16px;
        margin-bottom: 16px;
      }
      
      .admin-orders .header {
        padding: 0 16px;
        margin-bottom: 16px;
      }
      
      .admin-table {
        display: block;
        width: 100%;
        border-collapse: collapse;
      }
      
      .admin-table thead {
        display: none;
      }
      
      .admin-table tbody {
        display: block;
        width: 100%;
      }
      
      .admin-table tr {
        display: block;
        margin: 0 16px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }
      
      .admin-table td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border: none;
        border-bottom: 1px solid #f3f4f6;
        font-size: 15px;
        position: relative;
      }
      
      .admin-table td:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      
      .admin-table td:first-child {
        padding-top: 0;
      }
      
      .admin-table td::before {
        content: attr(data-label);
        font-weight: 600;
        color: #4b5563;
        margin-right: 16px;
        flex: 1;
        max-width: 40%;
        word-break: break-word;
      }
      
      .admin-table td > * {
        flex: 1;
        text-align: right;
        max-width: 60%;
        word-break: break-word;
      }
      
      .pagination {
        justify-content: center;
        padding: 0 16px;
        margin: 24px 0;
      }
      
      .pagination button {
        min-width: 44px;
        height: 44px;
        margin: 0 4px;
      }
      
      .detailText {
        text-align: right;
        width: 100%;
      }
      
      .smallText {
        word-break: break-all;
      }
    }
    
    @media (max-width: 480px) {
      .admin-orders h2 {
        font-size: 20px;
      }
      
      .admin-table tr {
        padding: 12px;
        margin: 0 12px 12px;
      }
      
      .admin-table td {
        font-size: 14px;
        padding: 10px 0;
      }
      
      .admin-table td::before {
        font-size: 13px;
        margin-right: 12px;
      }
      
      .pagination button {
        min-width: 36px;
        height: 36px;
        font-size: 14px;
      }
    }
    
    @media (max-width: 360px) {
      .admin-orders h2 {
        font-size: 18px;
        padding: 0 12px;
      }
      
      .admin-orders .header {
        padding: 0 12px;
      }
      
      .admin-table tr {
        padding: 10px;
        margin: 0 8px 12px;
      }
      
      .admin-table td {
        font-size: 13px;
        padding: 8px 0;
      }
      
      .admin-table td::before {
        font-size: 12px;
        margin-right: 10px;
      }
    }
  `;

  return (
    <div className="admin-orders" style={styles.container}>
      <style>{mediaQueries}</style>
      <div style={styles.header}>
        <h2 style={styles.title}>Product Orders Details</h2>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>
      </div>
      
      <div style={styles.tableContainer}>
        <table className="admin-table" style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sr. No</th>
              <th style={styles.th}>Product Details</th>
              <th style={styles.th}>User Details</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Payment Method</th>
              <th style={styles.th}>Total Amount</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((order, index) => (
                <tr key={order._id} style={order.status === "Confirmed" ? {...styles.tr, ...styles.confirmedRow} : styles.tr}>
                  <td data-label="Sr. No" style={styles.td}>{index + 1}</td>
                  <td data-label="Product Details" style={styles.td}>
                    <div style={styles.detailContainer}>
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} style={{ marginBottom: '10px', padding: '8px', borderBottom: '1px solid #eee' }}>
                          <p style={styles.detailText}><strong>Product ID:</strong> {item.productId?._id || 'N/A'}</p>
                          {item.productId?.name && <p style={styles.detailText}><strong>Name:</strong> {item.productId.name}</p>}
                          <p style={styles.detailText}><strong>Size:</strong> {item.size || 'N/A'}</p>
                          <p style={styles.detailText}><strong>Qty:</strong> {item.quantity || '0'}</p>
                          <p style={styles.detailText}><strong>Price:</strong> ₹{item.price || '0'}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td data-label="User Details" style={styles.td}>
                    <div style={styles.detailContainer}>
                      <p style={styles.detailText}><strong>Name:</strong> {order.address.firstName} {order.address.lastName}</p>
                      <p style={styles.detailText}><strong>Email:</strong> <span style={styles.smallText}>{order.address.email}</span></p>
                      <p style={styles.detailText}><strong>Phone:</strong> {order.address.phone}</p>
                    </div>
                  </td>
                  <td data-label="Address" style={styles.td}>
                    <div style={styles.detailContainer}>
                      <p style={styles.detailText}><strong>Street:</strong> <span style={styles.smallText}>{order.address.street}</span></p>
                      <p style={styles.detailText}><strong>City:</strong> {order.address.city}</p>
                      <p style={styles.detailText}><strong>State:</strong> {order.address.state}</p>
                      <p style={styles.detailText}><strong>Landmark:</strong> <span style={styles.smallText}>{order.address.landMark}</span></p>
                    </div>
                  </td>
                  <td data-label="Payment" style={styles.td}>
                    <select
                      onChange={(event) => paymentStatusHandler(event, order._id)}
                      value={order.payment}
                      style={styles.select}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </td>
                  <td data-label="Payment Method" style={styles.td}>{order.paymentMethod}</td>
                  <td data-label="Total Amount" style={styles.td}>Rs.{order.totalAmount}</td>
                  <td data-label="Status" style={styles.td}>
                    {order.status === "Confirmed" ? (
                      <span style={styles.confirmedBadge}>Confirmed</span>
                    ) : (
                      <select
                        onChange={(event) => statusHandler(event, order._id)}
                        value={order.status}
                        style={styles.select}
                      >
                        <option value="pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={styles.noOrders}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.paginationContainer}>
        <div className="mobile-pagination" style={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={currentPage === 1 ? {...styles.paginationButton, ...styles.disabledButton} : styles.paginationButton}
          >
            <svg style={styles.paginationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={currentPage >= totalPages}
            style={currentPage >= totalPages ? {...styles.paginationButton, ...styles.disabledButton} : styles.paginationButton}
          >
            <svg style={styles.paginationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;