import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSync } from "@fortawesome/free-solid-svg-icons"
import "./CSS/AdminComplaints.css"

// Define the base URL for your API
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.silksew.com"

const AdminComments = () => {
  const [issues, setIssues] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchIssues = useCallback(async (page) => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found. Please log in again.")
      }

      const response = await axios.get(`${API_BASE_URL}/api/issues?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // Increased timeout to 10 seconds
      })

      const { issues, page: responsePage, pages, total } = response.data

      if (!Array.isArray(issues)) {
        throw new Error("Invalid response format from server")
      }

      setIssues(issues)
      setCurrentPage(responsePage)
      setTotalPages(pages)
      setTotalEntries(total)
    } catch (err) {
      console.error("Error fetching issues:", err)
      if (err.message === "Network Error") {
        setError(
          `Unable to connect to the server at ${API_BASE_URL}. Please check your internet connection and server status.`,
        )
      } else if (err.response) {
        setError(`Server error: ${err.response.data.message || err.response.statusText}`)
      } else if (err.request) {
        setError(`No response received from server at ${API_BASE_URL}. Please check if the server is running.`)
      } else {
        setError(`An unexpected error occurred: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIssues(currentPage)
  }, [currentPage, fetchIssues])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleRetry = () => {
    fetchIssues(currentPage)
  }

  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found. Please log in again.")
      }

      await axios.put(
        `${API_BASE_URL}/api/issues/${issueId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        },
      )

      fetchIssues(currentPage)
    } catch (err) {
      console.error("Error updating issue status:", err)
      setError(`Failed to update issue status: ${err.message}`)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={handleRetry} className="retry-button">
          <FontAwesomeIcon icon={faSync} /> Retry
        </button>
        <p>Debug Info:</p>
        <ul>
          <li>API URL: {API_BASE_URL}</li>
          <li>Token exists: {localStorage.getItem("token") ? "Yes" : "No"}</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="table-container">
      {/* <h2>Issues Management</h2> */}
      <br />
      {issues.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        <>
          <table>
            <caption>List of Issues</caption>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Recipient's ID</th>
                <th>Recipient's Name</th>
                <th>Issue</th>
                <th>Related</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={issue._id}>
                  <td data-label="Sr. No.">{(currentPage - 1) * 5 + index + 1}</td>
                  <td data-label="Recipient's ID">{issue.recipientId}</td>
                  <td data-label="Recipient's Name">{issue.recipientName}</td>
                  <td data-label="Issue">{issue.issue}</td>
                  <td data-label="Related">{issue.related}</td>
                  <td data-label="Status">
                    <span className={`status ${issue.status.toLowerCase()}`}>{issue.status}</span>
                  </td>
                  <td data-label="Action">
                    <select
                      value={issue.status}
                      onChange={(e) => handleUpdateStatus(issue._id, e.target.value)}
                      className="status-dropdown"
                    >
                      <option value="Unresolved">Unresolved</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="7">
                  <div className="pagination">
                    <div className="entries-info">
                      Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, totalEntries)} of {totalEntries}{" "}
                      entries
                    </div>
                    <div className="page-numbers">
                      <button
                        className="page-button"
                        disabled={currentPage === 1}
                        style={{backgroundColor:'black'}}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className="page-button"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        style={{backgroundColor:'black'}}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  )
}

export default AdminComments

