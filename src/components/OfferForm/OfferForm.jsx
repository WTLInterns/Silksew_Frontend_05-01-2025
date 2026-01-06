import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OfferForm = () => {


  const categories = [
    { label: "Indian & Fusion Wear", value: "indian_fusion" },
    { label: "Western Wear", value: "western" },
    { label: "Formal Wear", value: "formal" },
    { label: "New Arrivals", value: "new_arrivals" },
  ];

  const subcategories = {
    indian_fusion: ["Traditional Wear", "Ethnic Wear", "Kurtis", "Tops & Tunics", "Wedding Wear", "Sarees", "Lehengas", "Salwar Suits", "Indo Western"],
    western: ["Casual Wear", "Office Wear", "Business Casual", "Blazers", "Formal Dresses", "Work Wear", "Street Style", "Athleisure", "Summer Wear", "Winter Wear", "Party Wear"],
    formal: ["Formal Wear", "Office Wear", "Business Casual", "Blazers", "Formal Dresses", "Work Wear"],
    new_arrivals: ["Kurtis"]
  };
  const [formData, setFormData] = useState({
    code: "",
    offerScope: "category",
    offerType: "percentage",
    value: "",
    description: "",
    startDate: "",
    endDate: "",
    eligibleProducts: "",
    eligibleUsers: "",
    category: "",
    price: "",
    active: true,
    mahasale: {
      festivalName: "",
      bannerImage: "",
      status: "COMING SOON",
      themeColor: "#ff3e6c",
      featuredText: ""
    }
  });

  const [submissionError, setSubmissionError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("mahasale.")) {
      const mahasaleField = name.split(".")[1];
      setFormData({
        ...formData,
        mahasale: {
          ...formData.mahasale,
          [mahasaleField]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(false);

    try {
      const submitData = {
        code: formData.code,
        offerScope: formData.offerScope,
        offerType: formData.offerType,
        value: Number(formData.value),
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        price: Number(formData.price) || 0,
        active: formData.active,
      };

      if (formData.offerScope === "category") {
        submitData.category = formData.category;
         submitData.subcategory = formData.subcategory;
      } else if (formData.offerScope === "product") {
        submitData.eligibleProducts = formData.eligibleProducts
          .split(",")
          .map(id => id.trim())
          .filter(id => id.length > 0);
      } else if (formData.offerScope === "user") {
        submitData.eligibleUsers = formData.eligibleUsers
          .split(",")
          .map(id => id.trim())
          .filter(id => id.length > 0);
      } else if (formData.offerScope === "mahasale") {
        submitData.mahasale = formData.mahasale;
      }

      const response = await axios.post(
        "https://api.silksew.com/api/offer/create-offer",
        submitData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.data.success) {
        toast.success("Offer Created Successfully!");
        setFormData({
          code: "",
          offerScope: "category",
          offerType: "percentage",
          value: "",
          description: "",
          startDate: "",
          endDate: "",
          eligibleProducts: "",
          eligibleUsers: "",
          category: "",
          price: "",
          active: true,
          mahasale: {
            festivalName: "",
            bannerImage: "",
            status: "COMING SOON",
            themeColor: "#ff3e6c",
            featuredText: ""
          }
        });
      } else {
        throw new Error(response.data.message || "Failed to create offer");
      }
    } catch (error) {
      console.error("Error creating offer", error);
      setSubmissionError(true);
      toast.error(error.response?.data?.message || "Failed to create offer. Please try again.");
      setTimeout(() => setSubmissionError(false), 500);
    }
  };

  return (
    <>
      <div className="mt-5 flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-6 py-12 font-sans">
        <div
          className={`bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl transition-all duration-300 ${submissionError ? "animate-shake" : ""}`}
        >
          <h2 className="text-center text-black mb-6 text-2xl font-semibold">Create Offer</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="font-semibold mb-4 text-indigo-600">Basic Information</div>

              <label className="block mb-2 font-medium">Offer Code:</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                placeholder="e.g. SUMMER25"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />

              <label className="block mb-2 font-medium">Offer Scope:</label>
              <select
                name="offerScope"
                value={formData.offerScope}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              >
                <option value="category">Category-wise</option>
                <option value="product">Product-wise</option>
                <option value="user">User-wise</option>
                <option value="mahasale">Mahasale (Festival Offer)</option>
              </select>

              {formData.offerScope === "category" && (
                <div>
                  {/* Category */}
                  <div>
                    <label className="block mb-2 font-medium">Category:</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData((prev) => ({ ...prev, subcategory: "" })); // reset subcategory when category changes
                      }}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} {/* 👈 use label for display */}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory */}
                  {formData.category && (
                    <div>
                      <label className="block mb-2 font-medium">Subcategory:</label>
                      <select
                        name="subcategory"
                        value={formData.subcategory || ""}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                      >
                        <option value="">-- Select Subcategory --</option>
                        {subcategories[formData.category]?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub} {/* 👈 subcategory string */}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}



              {formData.offerScope === "product" && (
                <div>
                  <label className="block mb-2 font-medium">Eligible Products (comma-separated IDs):</label>
                  <input
                    type="text"
                    name="eligibleProducts"
                    value={formData.eligibleProducts}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 650abc1234abcd5678ef9012"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                  />
                  <small className="text-gray-500 italic">Enter valid MongoDB ObjectIDs separated by commas</small>
                </div>
              )}

              {formData.offerScope === "user" && (
                <div>
                  <label className="block mb-2 font-medium">Eligible Users (comma-separated IDs):</label>
                  <input
                    type="text"
                    name="eligibleUsers"
                    value={formData.eligibleUsers}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 650abc1234abcd5678ef9012"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-2"
                  />
                  <small className="text-gray-500 italic">Enter valid MongoDB ObjectIDs separated by commas</small>
                </div>
              )}

              {formData.offerScope === "mahasale" && (
                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="text-orange-600 mb-4 text-lg">🎉 Mahasale (Festival Offer) Details</h3>

                  <label className="block mb-2 font-medium">Festival Name:</label>
                  <input
                    type="text"
                    name="mahasale.festivalName"
                    value={formData.mahasale.festivalName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Diwali Sale"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  />

                  <label className="block mb-2 font-medium">Banner Image URL:</label>
                  <input
                    type="url"
                    name="mahasale.bannerImage"
                    value={formData.mahasale.bannerImage}
                    onChange={handleChange}
                    placeholder="https://example.com/banner.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-2 font-medium">Status:</label>
                      <select
                        name="mahasale.status"
                        value={formData.mahasale.status}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      >
                        <option value="COMING SOON">COMING SOON</option>
                        <option value="LIVE NOW">LIVE NOW</option>
                        <option value="ENDED">ENDED</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">Theme Color:</label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          name="mahasale.themeColor"
                          value={formData.mahasale.themeColor}
                          onChange={handleChange}
                          className="w-14 h-10 mr-2 border rounded"
                        />
                        <input
                          type="text"
                          name="mahasale.themeColor"
                          value={formData.mahasale.themeColor}
                          onChange={handleChange}
                          placeholder="#ff3e6c"
                          className="flex-1 p-2 border border-gray-300 rounded-lg"
                        />
                        <span
                          className="ml-2 w-8 h-8 rounded border"
                          style={{ backgroundColor: formData.mahasale.themeColor }}
                        ></span>
                      </div>
                    </div>
                  </div>

                  <label className="block mb-2 font-medium">Featured Text:</label>
                  <textarea
                    name="mahasale.featuredText"
                    value={formData.mahasale.featuredText}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Special festival offer description"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Discount Details */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="font-semibold mb-4 text-indigo-600">Discount Details</div>

              <label className="block mb-2 font-medium">Offer Type:</label>
              <select
                name="offerType"
                value={formData.offerType}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>

              <label className="block mb-2 font-medium">Value:</label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
                min="0"
                step={formData.offerType === "percentage" ? "1" : "0.01"}
                placeholder={formData.offerType === "percentage" ? "e.g. 25 for 25%" : "e.g. 100 for ₹100 off"}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />

              <label className="block mb-2 font-medium">Price (Optional):</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="e.g. 2000"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />

              <label className="block mb-2 font-medium">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Offer description for customers"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Validity */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="font-semibold mb-4 text-indigo-600">Validity Period</div>

              <label className="block mb-2 font-medium">Start Date:</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />

              <label className="block mb-2 font-medium">End Date:</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={() => setFormData({ ...formData, active: !formData.active })}
                  className="w-4 h-4"
                />
                <label className="font-medium">Active</label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Create Offer
            </button>
          </form>
        </div>
      </div>

      <ToastContainer className="mt-12" />
    </>
  );
};

export default OfferForm;