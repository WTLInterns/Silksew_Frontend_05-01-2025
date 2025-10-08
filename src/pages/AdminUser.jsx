

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
  // eslint-disable-next-line no-unused-vars
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

  return (
    <div className="admin-orders" style={styles.container}>
      <ToastContainer />
      <style>{`
        @media screen and (max-width: 768px) {
          .admin-table thead {
            display: none;
          }
          
          .admin-table tr {
            display: block;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            padding: 20px 16px;
            margin-bottom: 16px;
            background: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .admin-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 0;
            border-bottom: 1px solid #f0f0f0;
            text-align: right;
            font-size: 15px;
            width: 100%;
          }
          
          .admin-table td:last-child {
            border-bottom: none;
          }
          
          .admin-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #333;
            text-align: left;
            flex: 1;
            font-size: 14px;
            margin-right: 16px;
            padding-right: 10px;
          }
          
          .admin-table td > * {
            flex: 1;
            text-align: right;
            font-size: 15px;
            padding-left: 10px;
          }
          
          .mobile-pagination {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            gap: 6px;
            padding: 12px 16px;
            margin: 20px -8px 0 -8px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 1px solid #e9ecef;
            overflow-x: auto;
            min-height: 55px;
            flex-wrap: nowrap;
          }
          
          .mobile-pagination button {
            min-width: 42px;
            height: 42px;
            font-size: 15px;
            font-weight: 600;
            flex-shrink: 0;
            margin: 0;
          }
        }
        
        @media screen and (max-width: 480px) {
          .admin-table tr {
            padding: 18px 14px;
            border-radius: 10px;
          }
          
          .admin-table td {
            font-size: 14px;
            padding: 12px 0;
          }
          
          .admin-table td::before {
            font-size: 13px;
            margin-right: 12px;
            padding-right: 8px;
          }
          
          .admin-table td > * {
            font-size: 14px;
            padding-left: 8px;
          }
        }
        
        @media screen and (max-width: 360px) {
          .admin-table tr {
            padding: 16px 12px;
            border-radius: 8px;
          }
          
          .admin-table td {
            font-size: 13px;
            padding: 10px 0;
          }
          
          .admin-table td::before {
            margin-right: 10px;
            padding-right: 6px;
          }
          
          .admin-table td > * {
            font-size: 13px;
            padding-left: 6px;
          }
        }
      `}</style>
      
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
                      <p style={styles.detailText}><strong>Product Id:</strong> <span style={styles.smallText}>{order.items[0].productId}</span></p>
                      <p style={styles.detailText}><strong>Size:</strong> {order.items[0].size}</p>
                      <p style={styles.detailText}><strong>Quantity:</strong> {order.items[0].quantity}</p>
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
  )
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    marginTop: "28px"
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "16px",
    marginBottom: "24px"
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
    maxWidth: "320px",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease"
  },
  tableContainer: {
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden"
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
    padding: "6px 8px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s ease"
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
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "24px"
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
    width: "40px",
    height: "40px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#000",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none"
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

// Add media queries for responsive design
const mediaQueries = `
  @media (min-width: 768px) {
    .admin-orders {
      padding: 32px;
    }
    
    .admin-orders h2 {
      text-align: left;
      font-size: 32px;
    }
    
    .admin-orders .header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    
    .admin-orders .search-input {
      max-width: 400px;
    }
    
    .admin-table th,
    .admin-table td {
      padding: 20px 16px;
    }
  }
  
  @media (max-width: 768px) {
    .admin-orders {
      padding: 16px;
    }
    
    .admin-table {
      display: block;
      overflow-x: auto;
    }
    
    .admin-table thead {
      display: none;
    }
    
    .admin-table tr {
      display: block;
      margin-bottom: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
    }
    
    .admin-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .admin-table td:last-child {
      border-bottom: none;
    }
    
    .admin-table td::before {
      content: attr(data-label);
      font-weight: 600;
      color: #374151;
      text-align: left;
      flex: 1;
    }
    
    .admin-table td > * {
      flex: 1;
      text-align: right;
    }
    
    .pagination {
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    .admin-orders {
      padding: 12px;
    }
    
    .admin-orders h2 {
      font-size: 24px;
    }
    
    .admin-table tr {
      padding: 12px;
    }
    
    .admin-table td {
      font-size: 14px;
      padding: 10px 0;
    }
  }
`

export default AdminUser