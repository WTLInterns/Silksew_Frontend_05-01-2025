
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

function UpdateRemoveOffer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [offer, setOffer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState(null);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(
        "https://api.silksew.com/api/offer/get-offer"
      );
      const fetchedOffer = response.data.offers;
      console.log("get offer", fetchedOffer);
      setOffer(Array.isArray(fetchedOffer) ? fetchedOffer : [fetchedOffer]);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleEdit = (item) => {
    setEditingOffer({ ...item });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingOffer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://api.silksew.com/api/offer/update-offer/${editingOffer._id}`,
        editingOffer
      );
      toast.success("Offer updated successfully");
      fetchOffers();
      setEditingOffer(null);
    } catch (error) {
      console.error("Error updating offer:", error);
      toast.error("Failed to update offer");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://api.silksew.com/api/offer/delete-offer/${id}`
      );
      toast.success("Offer deleted successfully");
      fetchOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    }
  };

  const filteredOffers = offer?.filter((item) =>
    item?.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="update-offer-container">
      <style jsx>{`
        .update-offer-container {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-title {
          font-size: 28px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 24px;
          text-align: left;
        }

        /* Search Bar */
        .search-container {
          margin-bottom: 24px;
        }

        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          justifyContent: "left"


        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Edit Form Styles */
        .edit-form-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 0 auto;
        }

        .edit-form-title {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          text-align: center;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-select {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          background: white;
          transition: all 0.3s ease;
        }

        .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #1d4ed8;
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

        .offers-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .table-header {
          background: #f8f9fa;
        }

        .table-head {
          padding: 16px;
          color: #000000; /* Black text color */
          font-weight: 600;
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid #e5e7eb;
          background: #f8f9fa;
        }

        .table-body {
          background: white;
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

        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .edit-btn {
          color: #2563eb;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .edit-btn:hover {
          color: #1d4ed8;
          background: #eff6ff;
        }

        .delete-btn {
          color: #dc2626;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .delete-btn:hover {
          color: #b91c1c;
          background: #fef2f2;
        }

        .no-offers {
          padding: 40px;
          text-align: center;
          color: #6b7280;
          font-size: 16px;
        }

        /* Mobile Card Styles */
        .mobile-card-view {
          display: none;
        }

        .offer-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .card-section {
          margin-bottom: 16px;
          padding-bottom: 16px;
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
          justify-content: space-between;
          align-items: center;
        }

        .card-label {
          font-weight: 600;
          color: #374151;
          font-size: 13px;
        }

        .card-value {
          color: #6b7280;
          font-size: 14px;
          text-align: right;
        }

        .mobile-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 16px;
        }

        .mobile-edit-btn {
          padding: 10px 20px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .mobile-edit-btn:hover {
          background: #1d4ed8;
        }

        .mobile-delete-btn {
          padding: 10px 20px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .mobile-delete-btn:hover {
          background: #b91c1c;
        }

        .no-offers-mobile {
          text-align: center;
          color: #6b7280;
          padding: 40px;
          font-size: 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
          .update-offer-container {
            padding: 20px;
          }
          
          .offers-table {
            min-width: 900px;
          }
        }

        @media (max-width: 768px) {
          .update-offer-container {
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

          .edit-form-container {
            padding: 20px;
            margin: 0 16px;
          }

          .edit-form-title {
            font-size: 20px;
          }

          .offer-card {
            padding: 16px;
            margin-bottom: 12px;
          }

          .card-section {
            margin-bottom: 12px;
            padding-bottom: 12px;
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
        }

        @media (max-width: 480px) {
          .update-offer-container {
            padding: 12px;
          }

          .page-title {
            font-size: 20px;
          }

          .edit-form-container {
            padding: 16px;
            margin: 0 8px;
          }

          .edit-form-title {
            font-size: 18px;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-input, .form-select {
            padding: 10px;
            font-size: 13px;
          }

          .submit-btn {
            padding: 10px;
            font-size: 14px;
          }

          .offer-card {
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 8px;
          }

          .card-section {
            margin-bottom: 10px;
            padding-bottom: 10px;
          }

          .mobile-actions {
            flex-direction: column;
            gap: 8px;
          }

          .mobile-edit-btn, .mobile-delete-btn {
            padding: 8px 16px;
            font-size: 13px;
          }
        }

        @media (max-width: 360px) {
          .update-offer-container {
            padding: 8px;
          }

          .page-title {
            font-size: 18px;
          }

          .search-input {
            padding: 10px 14px;
            font-size: 13px;
          }

          .offer-card {
            padding: 10px;
          }

          .card-label {
            font-size: 11px;
          }

          .card-value {
            font-size: 12px;
          }
        }

        /* Scrollbar for table on medium screens */
        .table-container {
          overflow-x: auto;
        }

        .offers-table {
          width: 100%;
        }
      `}</style>

      <h2 className="page-title">Offer Details</h2>

      <ToastContainer
        position="top-center"
        style={{ marginTop: 70, zIndex: 9999 }}
      />

      {editingOffer ? (
        <div className="edit-form-container">
          <h2 className="edit-form-title">Update Offer</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Code</label>
              <input
                type="text"
                name="code"
                value={editingOffer.code}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={editingOffer.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="indian_fusion">Indian Fusion</option>
                <option value="western">Western</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Value</label>
              <input
                type="number"
                name="value"
                value={editingOffer.value}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                value={editingOffer.description}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={new Date(editingOffer.startDate).toISOString().split("T")[0]}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={new Date(editingOffer.endDate).toISOString().split("T")[0]}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button type="submit" className="submit-btn">
              Update Offer
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Offer Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Desktop Table View */}
          <div className="desktop-table-view">
            <div className="table-container">
              <table className="offers-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Sr. No</th>
                    <th className="table-head">Offer Code</th>
                    <th className="table-head">Category</th>
                    <th className="table-head">Discount</th>
                    <th className="table-head">Description</th>
                    <th className="table-head">From Date</th>
                    <th className="table-head">To Date</th>
                    <th className="table-head">Action</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredOffers.length > 0 ? (
                    filteredOffers.map((item, index) => (
                      <tr key={item._id} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">{item.code}</td>
                        <td className="table-cell capitalize">{item.category}</td>
                        <td className="table-cell">{item.value} %</td>
                        <td className="table-cell">{item.description}</td>
                        <td className="table-cell">
                          {new Date(item.startDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="table-cell">
                          {new Date(item.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="table-cell">
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEdit(item)}
                              className="edit-btn"
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} size="lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="delete-btn"
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={faTrash} size="lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-offers">
                        No offers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((item, index) => (
                <div key={item._id} className="offer-card">
                  <div className="card-section">
                    <div className="card-title">Offer #{index + 1}</div>
                    <div className="card-content">
                      <span className="card-label">Code:</span>
                      <span className="card-value">{item.code}</span>
                    </div>
                  </div>

                  <div className="card-section">
                    <div className="card-content">
                      <span className="card-label">Category:</span>
                      <span className="card-value capitalize">{item.category}</span>
                    </div>
                    <div className="card-content">
                      <span className="card-label">Discount:</span>
                      <span className="card-value">{item.value}%</span>
                    </div>
                  </div>

                  <div className="card-section">
                    <div className="card-content">
                      <span className="card-label">Description:</span>
                      <span className="card-value">{item.description}</span>
                    </div>
                  </div>

                  <div className="card-section">
                    <div className="card-content">
                      <span className="card-label">From Date:</span>
                      <span className="card-value">
                        {new Date(item.startDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="card-content">
                      <span className="card-label">To Date:</span>
                      <span className="card-value">
                        {new Date(item.endDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mobile-actions">
                    <button
                      onClick={() => handleEdit(item)}
                      className="mobile-edit-btn"
                    >
                      <FontAwesomeIcon icon={faEdit} style={{marginRight: '8px'}} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="mobile-delete-btn"
                    >
                      <FontAwesomeIcon icon={faTrash} style={{marginRight: '8px'}} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-offers-mobile">
                No offers found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UpdateRemoveOffer;