
"use client"

import { useState, useEffect, useContext, useCallback, useMemo } from "react"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import { setupAxios } from "../services/config"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../pages/CSS/AdminProductlist.css"
import { Form, Input, Select, InputNumber, Button, Upload, Modal } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import React from "react"

const { TextArea } = Input
const { Option } = Select

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }

  // Offer window helper (top-level)
  const isWithinOfferWindow = (start, end) => {
    if (!end) return false
    const now = new Date()
    const startDate = start ? new Date(start) : null
    const endDate = new Date(end)
    return (startDate ? now >= startDate : true) && now < endDate
  }
  }, [value, delay])

  return debouncedValue
}

// Memoized ProductImage component to prevent unnecessary re-renders
const ProductImage = React.memo(({ src, alt, width = 50, height = 50 }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true)
      setImgSrc("https://via.placeholder.com/150x150/cccccc/666666?text=No+Image")
    }
  }, [hasError])

  return (
    <img
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      style={{
        objectFit: "cover",
        border: "1px solid #d9d9d9",
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
      }}
      onError={handleError}
    />
  )
})

function AdminProductlist({ updateTotalProducts, updateLowStockProducts }) {
  const { token } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(3)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form] = Form.useForm()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [colorImages, setColorImages] = useState({})
  const [sizeData, setSizeData] = useState({})
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [previousSizes, setPreviousSizes] = useState([])
  const [countdowns, setCountdowns] = useState({})


  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    setupAxios()
  }, [])

  const categories = ["women"]

  const subcategories = {
    women: [
      "Traditional Wear",
      "Casual Wear",
      "Formal Wear",
      "Ethnic Wear",
      "Street Style",
      "Smart Casuals",
      "Athleisure",
      "Summer Wear",
      "Winter Wear",
      "Party Wear",
      "Wedding Wear",
      "Indo-Western",
      "Loungewear",
      "Vacation Wear",
      "Festive Wear",
    ]
  }

  const colorOptions = [
    { name: "AliceBlue" },
    { name: "AntiqueWhite" },
    { name: "Aqua" },
    { name: "Aquamarine" },
    { name: "Azure" },
    { name: "Beige" },
    { name: "Bisque" },
    { name: "BlanchedAlmond" },
    { name: "Blue" },
    { name: "BlueViolet" },
    { name: "Brown" },
    { name: "Burlywood" },
    { name: "CadetBlue" },
    { name: "Chartreuse" },
    { name: "Chocolate" },
    { name: "Angel" },
    { name: "CornflowerBlue" },
    { name: "Cornsilk" },
    { name: "Crimson" },
    { name: "Cyan" },
    { name: "DarkBlue" },
    { name: "DarkCyan" },
    { name: "DarkGoldenrod" },
    { name: "DarkGray" },
    { name: "DarkGreen" },
    { name: "DarkKhaki" },
    { name: "DarkMagenta" },
    { name: "DarkOliveGreen" },
    { name: "DarkOrange" },
    { name: "DarkOrchid" },
    { name: "DarkRed" },
    { name: "DarkSalmon" },
    { name: "DarkSeagreen" },
    { name: "DarkSlateBlue" },
    { name: "DarkSlateGray" },
    { name: "DarkTurquoise" },
    { name: "DarkViolet" },
    { name: "DeepPink" },
    { name: "DeepSkyBlue" },
    { name: "DimGray" },
    { name: "DodgerBlue" },
    { name: "Firebrick" },
    { name: "FloralWhite" },
    { name: "ForestGreen" },
    { name: "Fuchsia" },
    { name: "Gainsboro" },
    { name: "GhostWhite" },
    { name: "Gold" },
    { name: "Goldenrod" },
    { name: "Gray" },
    { name: "Green" },
    { name: "GreenYellow" },
    { name: "Honeydew" },
    { name: "HotPink" },
    { name: "IndianRed" },
    { name: "Indigo" },
    { name: "Ivory" },
    { name: "Khaki" },
    { name: "Lavender" },
    { name: "LavenderBlush" },
    { name: "LawnGreen" },
    { name: "LemonChiffon" },
    { name: "LightBlue" },
    { name: "LightCoral" },
    { name: "LightCyan" },
    { name: "LightGoldenrodYellow" },
    { name: "LightGreen" },
    { name: "LightGrey" },
    { name: "LightPink" },
    { name: "LightSalmon" },
    { name: "LightSeaGreen" },
    { name: "LightSkyBlue" },
    { name: "LightSlateGray" },
    { name: "LightSteelBlue" },
    { name: "LightYellow" },
    { name: "Lime" },
    { name: "LimeGreen" },
    { name: "Linen" },
    { name: "Magenta" },
    { name: "Maroon" },
    { name: "MediumAquamarine" },
    { name: "MediumBlue" },
    { name: "MediumOrchid" },
    { name: "MediumPurple" },
    { name: "MediumSeaGreen" },
    { name: "MediumSlateBlue" },
    { name: "MediumSpringGreen" },
    { name: "MediumTurquoise" },
    { name: "MediumVioletRed" },
    { name: "MidnightBlue" },
    { name: "MintCream" },
    { name: "MistyRose" },
    { name: "Moccasin" },
    { name: "NavajoWhite" },
    { name: "Navy" },
    { name: "OldLace" },
    { name: "OliveDrab" },
    { name: "Orange" },
    { name: "OrangeRed" },
    { name: "Orchid" },
    { name: "PaleGoldenrod" },
    { name: "PaleGreen" },
    { name: "PaleTurquoise" },
    { name: "PaleVioletRed" },
    { name: "PapayaWhip" },
    { name: "PeachPuff" },
    { name: "Peru" },
    { name: "Pink" },
    { name: "Plum" },
    { name: "PowderBlue" },
    { name: "Purple" },
    { name: "Red" },
    { name: "RosyBrown" },
    { name: "RoyalBlue" },
    { name: "SaddleBrown" },
    { name: "Salmon" },
    { name: "SandyBrown" },
    { name: "SeaGreen" },
    { name: "SeaShell" },
    { name: "Sienna" },
    { name: "Silver" },
    { name: "SkyBlue" },
    { name: "SlateBlue" },
    { name: "Snow" },
    { name: "SpringGreen" },
    { name: "SteelBlue" },
    { name: "Tan" },
    { name: "Thistle" },
    { name: "Teal" },
    { name: "Tomato" },
    { name: "Turquoise" },
    { name: "Violet" },
    { name: "Wheat" },
    { name: "White" },
    { name: "Whitesmoke" },
    { name: "Yellow" },
    { name: "YellowGreen" },
  ]


  const getOfferCountdown = (offerEndDate) => {
    const now = new Date()
    const end = new Date(offerEndDate)
    const diff = end - now

    if (diff <= 0) return null // offer expired

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)

    if (days >= 1) {
      return `${days} day${days > 1 ? 's' : ''} left`
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }

  // Determine if an offer is currently active
  const isWithinOfferWindow = (start, end) => {
    if (!end) return false
    const now = new Date()
    const startDate = start ? new Date(start) : null
    const endDate = new Date(end)
    return (startDate ? now >= startDate : true) && now < endDate
  }

  // Check if product has discount-only offer (no timeline)
  const hasDiscountOnly = (product) => {
    return product.discountPercent && product.discountPercent > 0 && !product.offerEndDate
  }

  // Check if offer is expired
  const isOfferExpired = (product) => {
    if (!product.offerEndDate) return false
    return new Date(product.offerEndDate) < new Date()
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent || discountPercent <= 0) return originalPrice
    return Math.round(originalPrice - (originalPrice * discountPercent / 100))
  }

  // Enhanced function to process sizes and ensure plain text format
  const processSizes = useCallback((availableSizes) => {
    if (!availableSizes) return []

    let sizes = []

    // If it's already an array
    if (Array.isArray(availableSizes)) {
      sizes = availableSizes
    }
    // If it's a string
    else if (typeof availableSizes === "string") {
      // Try to parse as JSON first (handles ["S","M"] format)
      try {
        const parsed = JSON.parse(availableSizes)
        if (Array.isArray(parsed)) {
          sizes = parsed
        } else {
          sizes = [parsed]
        }
      } catch {
        // If JSON parsing fails, treat as comma-separated string
        sizes = availableSizes
          .split(",")
          .map((size) => size.trim())
          .filter((size) => size)
      }
    }

    // Clean up the sizes array - remove any brackets, quotes, or escape characters
    return sizes
      .map((size) => {
        if (typeof size === "string") {
          // Remove any brackets, quotes, backslashes, and extra whitespace
          return size.replace(/[[\]"'\\]/g, "").trim()
        }
        return String(size).trim()
      })
      .filter((size) => size && size.length > 0) // Remove empty strings
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const authToken = token || localStorage.getItem("token") || sessionStorage.getItem("token")
      const response = await axios.get("/api/products", {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      })
      const data = Array.isArray(response.data) ? response.data : response.data.products || []
      setProducts(data)
      updateTotalProducts?.(data.length)
      const lowStockProducts = data.filter((product) => product.availableStock <= 5)
      updateLowStockProducts?.(lowStockProducts)
    } catch (error) {
      console.error("Error fetching products:", error.message)
      toast.error("Failed to fetch products.")
    }
  }, [token, updateTotalProducts, updateLowStockProducts])

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCountdowns = {}
      products.forEach((product) => {
        if (product.offerEndDate && isWithinOfferWindow(product.offerStartDate, product.offerEndDate)) {
          updatedCountdowns[product._id] = getOfferCountdown(product.offerEndDate)
        }
      })
      setCountdowns(updatedCountdowns)
    }, 1000)
    return () => clearInterval(interval)
  }, [products])


  useEffect(() => {
    let mounted = true
    fetchProducts().then(() => {
      if (!mounted) return
    })
    return () => {
      mounted = false
    }
  }, [fetchProducts])

  const handleDeleteProduct = useCallback(
    async (id) => {
      try {
        const authToken = token || localStorage.getItem("token") || sessionStorage.getItem("token")
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        toast.success("Product deleted successfully!")
        fetchProducts()
      } catch (error) {
        const status = error?.response?.status
        const data = error?.response?.data
        console.error("Error deleting product:", status, data || error.message)
        toast.error(data?.message || "Failed to delete product.")
      }
    },
    [token, fetchProducts],
  )

  const getImage = useCallback((images, availableColors) => {
    const defaultImage = "https://via.placeholder.com/150x150/cccccc/666666?text=No+Image"
    if (!images || !Array.isArray(images) || images.length === 0) {
      return defaultImage
    }

    try {
      let imageData = images[0]
      if (typeof imageData === "string") {
        imageData = JSON.parse(imageData)
      }
      if (!imageData || typeof imageData !== "object") {
        return defaultImage
      }

      if (availableColors && Array.isArray(availableColors)) {
        for (const color of availableColors) {
          const colorName = typeof color === "string" ? color : color?.name || ""
          if (
            colorName &&
            imageData[colorName] &&
            Array.isArray(imageData[colorName]) &&
            imageData[colorName].length > 0
          ) {
            const imageUrl = imageData[colorName][0]
            if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
              return imageUrl
            }
          }
        }
      }

      const colorKeys = Object.keys(imageData)
      for (const colorKey of colorKeys) {
        if (imageData[colorKey] && Array.isArray(imageData[colorKey]) && imageData[colorKey].length > 0) {
          const imageUrl = imageData[colorKey][0]
          if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
            return imageUrl
          }
        }
      }
      return defaultImage
    } catch (error) {
      console.warn("Error processing image data:", error.message)
      return defaultImage
    }
  }, [])

  const handleEditProduct = useCallback(
    (product) => {
      setEditingProduct(product)
      setIsAdding(false)
      setSelectedCategory(product.category[0])

      // Parse sizes using the enhanced processSizes function
      const sizes = processSizes(product.availableSizes)
      setPreviousSizes([...sizes])

      // Parse colors
      let colors = []
      if (Array.isArray(product.availableColors)) {
        colors = product.availableColors.flatMap((color) => {
          if (typeof color === "string") {
            if (!color.startsWith("{") && !color.startsWith("[")) return [color]
            try {
              const parsed = JSON.parse(color)
              return Array.isArray(parsed) ? parsed.map((c) => c.name || c) : [parsed.name || parsed]
            } catch {
              return [color]
            }
          } else if (color && color.name) {
            return [color.name]
          }
          return []
        })
      } else if (typeof product.availableColors === "string") {
        try {
          const parsed = JSON.parse(product.availableColors)
          colors = Array.isArray(parsed)
            ? parsed.flatMap((color) => (typeof color === "string" ? [color] : color.name ? [color.name] : []))
            : []
        } catch {
          colors = [product.availableColors]
        }
      }

      // Set form fields - allow reapplying offers on expired products
      const isExpired = isOfferExpired(product)
      form.setFieldsValue({
        ...product,
        category: product.category?.[0],
        subcategory: product.subcategory?.[0],
        colors,
        stock: product.availableStock,
        sizes,
        // Clear expired offer data to allow reapplying
        discountPercent: isExpired ? 0 : product.discountPercent,
        offerStartDate: isExpired ? "" : product.offerStartDate,
        offerEndDate: isExpired ? "" : product.offerEndDate,
      })

      // Images grouped by color
      const initialColorImages = {}
      if (product.images?.length > 0) {
        try {
          const parsedImages = JSON.parse(product.images[0])
          Object.entries(parsedImages).forEach(([color, urls]) => {
            initialColorImages[color] = urls.map((url, index) => ({
              uid: `${color}-${index}`,
              name: `${color}-image-${index}`,
              status: "done",
              url,
            }))
          })
        } catch (error) {
          console.warn("Error parsing product images:", error.message)
        }
      }

      setColorImages(initialColorImages)
    },
    [form, processSizes],
  )

  const handleAddProduct = useCallback(() => {
    setEditingProduct(null)
    setIsAdding(true)
    setSelectedCategory(null)
    form.resetFields()
    setColorImages({})
    setSizeData({})
    setPreviousSizes([])
  }, [form])

  const handleCategoryChange = useCallback(
    (value) => {
      setSelectedCategory(value)
      form.setFieldsValue({
        subcategory: undefined,
        sizes: undefined,
      })
    },
    [form],
  )

  const handleColorChange = useCallback((selectedColors) => {
    setColorImages((prev) => {
      const newColorImages = { ...prev }
      selectedColors.forEach((color) => {
        if (!newColorImages[color]) {
          newColorImages[color] = []
        }
      })
      Object.keys(newColorImages).forEach((color) => {
        if (!selectedColors.includes(color)) {
          delete newColorImages[color]
        }
      })
      return newColorImages
    })
  }, [])

  const handleSizeChange = useCallback(
    (selectedSizes) => {
      setSizeData((prev) => {
        const newSizeData = { ...prev }
        selectedSizes.forEach((size) => {
          if (!newSizeData[size]) {
            newSizeData[size] = { stock: 0 }
          }
        })
        Object.keys(newSizeData).forEach((size) => {
          if (!selectedSizes.includes(size)) {
            delete newSizeData[size]
          }
        })
        return newSizeData
      })
      setPreviousSizes(selectedSizes)
      form.setFieldsValue({ sizes: selectedSizes })
    },
    [form],
  )

  const handleImageChange = useCallback((color, { fileList }) => {
    setColorImages((prev) => ({
      ...prev,
      [color]: fileList,
    }))
  }, [])

  const handlePreview = useCallback(async (file) => {
    if (!file.url && !file.preview) {
      try {
        file.preview = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file.originFileObj)
          reader.onload = () => resolve(reader.result)
          reader.onerror = (error) => reject(error)
        })
      } catch (error) {
        console.warn("Error generating image preview:", error.message)
        return
      }
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1))
  }, [])

  const handleSubmitProduct = useCallback(
    async (values) => {
      await submitProductData({ ...values, sizes: values.sizes || previousSizes })
    },
    [previousSizes],
  )

  const handleWarningConfirm = useCallback(() => {
    setShowWarningModal(false)
    const formValues = form.getFieldsValue()
    submitProductData(formValues)
  }, [form])

  const submitProductData = useCallback(
    async (values) => {
      try {
        const productData = new FormData()
        productData.append("name", values.name)
        productData.append("description", values.description)
        productData.append("price", Math.round(values.price));
        productData.append("oldPrice", values.oldPrice ? Math.round(values.oldPrice) : "");
        productData.append("discountPercent", values.discountPercent || 0);
        const startISO = values.offerStartDate ? new Date(values.offerStartDate).toISOString() : ""
        const endISO = values.offerEndDate ? new Date(values.offerEndDate).toISOString() : ""
        productData.append("offerStartDate", startISO);
        productData.append("offerEndDate", endISO);
        productData.append("category", values.category)
        productData.append("subcategory", values.subcategory)
        productData.append("availableStock", values.stock)

        // Process sizes to ensure they are stored as plain text array
        const sizes = values.sizes || previousSizes
        const cleanSizes = sizes
          .map((size) =>
            String(size)
              .replace(/[[\]"'\\]/g, "")
              .trim(),
          )
          .filter((size) => size)

        // Send sizes as individual form data entries instead of JSON string
        cleanSizes.forEach((size) => {
          productData.append("availableSizes[]", size)
        })

        const colors = values.colors || []
        colors.forEach((color) => {
          productData.append("availableColors[]", color)
        })

        const uploadedImagesByColor = {}
        for (const color of colors) {
          if (colorImages[color]) {
            const uploadedImages = await Promise.all(
              colorImages[color].map(async (file) => {
                if (file.url) {
                  return file.url
                }
                const data = new FormData()
                data.append("file", file.originFileObj)
                data.append("upload_preset", "Silksew")
                data.append("cloud_name", "dejdni8vi")
                data.append("folder", "products")

                const res = await fetch("https://api.cloudinary.com/v1_1/dejdni8vi/image/upload", {
                  method: "POST",
                  body: data,
                })

                if (!res.ok) {
                  throw new Error("Image upload failed")
                }

                const uploadedImage = await res.json()
                return uploadedImage.secure_url
              }),
            )
            uploadedImagesByColor[color] = uploadedImages
          }
        }

        productData.append("images", JSON.stringify(uploadedImagesByColor))

        const authToken = token || localStorage.getItem("token") || sessionStorage.getItem("token")
        const response = isAdding
          ? await axios.post("/api/products", productData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          })
          : await axios.put(`/api/products/${editingProduct._id}`, productData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          })

        if (response.data) {
          toast.success(isAdding ? "Product added successfully!" : "Product updated successfully!")
          setEditingProduct(null)
          setIsAdding(false)
          setColorImages({})
          setSizeData({})
          setPreviousSizes([])
          form.resetFields()
          fetchProducts()
        }
      } catch (error) {
        console.error("Error submitting product:", error.message)
        toast.error(`Failed to ${isAdding ? "add" : "update"} product. ${error.response?.data?.message || ""}`)
      }
    },
    [isAdding, editingProduct, token, fetchProducts, form, colorImages, previousSizes],
  )

  const handleCancelEdit = useCallback(() => {
    setEditingProduct(null)
    setIsAdding(false)
    setColorImages({})
    setSizeData({})
    setPreviousSizes([])
    form.resetFields()
  }, [form])

  const getFilteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchRegex = new RegExp(debouncedSearchTerm, "i")
      return (
        searchRegex.test(product.name) ||
        searchRegex.test(product.category.join(", ")) ||
        searchRegex.test(product.subcategory.join(", ")) ||
        searchRegex.test(product.availableColors.map((c) => c.name || c).join(", ")) ||
        searchRegex.test(product.availableSizes.join(", ")) ||
        searchRegex.test(product.price.toString()) ||
        searchRegex.test(product.oldPrice ? product.oldPrice.toString() : "") ||
        searchRegex.test(product.availableStock.toString())
      )
    })
  }, [products, debouncedSearchTerm])

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = useMemo(
    () => getFilteredProducts.slice(indexOfFirstProduct, indexOfLastProduct),
    [getFilteredProducts, indexOfFirstProduct, indexOfLastProduct],
  )
  const totalPages = Math.ceil(getFilteredProducts.length / productsPerPage)

  const paginate = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber)
      }
    },
    [totalPages],
  )

  const renderSearchSection = useCallback(
    () => (
     
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Product List</h2>
        <div className="search-section">
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: '300px', padding: "10px" }}
          />
        </div>
      </div>
    ),
    [searchTerm],
  )

  const renderProductTable = useCallback(
    () => (
      <>
        {/* <h2>Admin Product List</h2> */}
        {renderSearchSection()}
        <table className="product-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Colors</th>
              <th>Sizes</th>
              <th>Price</th>
              <th>Old Price</th>
              <th>Stock</th>
              <th>Actions</th>
              <th>Offer Countdown</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts?.map((product, index) => {
              let displayColors = []
              if (typeof product.availableColors === "string") {
                try {
                  displayColors = JSON.parse(product.availableColors).map((color) =>
                    typeof color === "string" ? color : color.name,
                  )
                } catch {
                  displayColors = [product.availableColors]
                }
              } else if (Array.isArray(product.availableColors)) {
                displayColors = product.availableColors.map((color) => (typeof color === "string" ? color : color.name))
              }

              // Use the enhanced processSizes function for consistent size display
              const displaySizes = processSizes(product.availableSizes)

              const productImageUrl = getImage(product.images, product.availableColors)

              return (
                <tr key={product._id}>
                  <td data-label="Sr. No">{(currentPage - 1) * productsPerPage + index + 1}</td>
                  <td data-label="Image">
                    <ProductImage src={productImageUrl} alt={product.name || "Product image"} width={50} height={50} />
                  </td>
                  <td data-label="Name">{product.name}</td>
                  <td data-label="Category">{product.category.join(", ")}</td>
                  <td data-label="Sub Category">{product.subcategory.join(", ")}</td>
                  <td data-label="Colors">{displayColors.join(", ") || "N/A"}</td>
                  <td data-label="Sizes">{displaySizes.join(", ") || "N/A"}</td>
                  <td data-label="Price">
                    {(() => {
                      const discountOnly = hasDiscountOnly(product)
                      if (discountOnly) {
                        const originalPrice = product.oldPrice || product.price
                        const discountedPrice = calculateDiscountedPrice(originalPrice, product.discountPercent)
                        return `Rs.${discountedPrice}`
                      }
                      return `Rs.${Math.round(product.price)}`
                    })()} 
                  </td>
                  <td data-label="Old Price">
                    {(() => {
                      const discountOnly = hasDiscountOnly(product)
                      if (discountOnly) {
                        const originalPrice = product.oldPrice || product.price
                        return `Rs.${Math.round(originalPrice)}`
                      }
                      return product.oldPrice ? `Rs.${Math.round(product.oldPrice)}` : "N/A"
                    })()} 
                  </td>
                  <td data-label="Stock">{product.availableStock}</td>
                  <td data-label="Actions">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEditProduct(product)}
                      className="edit-btn"
                    />
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteProduct(product._id)}
                      className="delete-btn"
                    />
                  </td>
                  <td data-label="Offer Countdown">
                    {(() => {
                      const discountOnly = hasDiscountOnly(product)
                      const timeBasedOffer = isWithinOfferWindow(product.offerStartDate, product.offerEndDate)
                      const expired = isOfferExpired(product)
                      
                      if (discountOnly) {
                        // Show discount percentage for discount-only products
                        return (
                          <span
                            style={{
                              color: "green",
                              border: "1px solid green",
                              borderRadius: "9999px",
                              padding: "4px 10px",
                              backgroundColor: "white",
                              display: "inline-block",
                              fontWeight: "bold",
                              textAlign: "center",
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {product.discountPercent}% OFF
                          </span>
                        )
                      } else if (timeBasedOffer) {
                        // Show countdown for time-based offers
                        return countdowns[product._id] ? (
                          <span
                            style={{
                              color: "green",
                              border: "1px solid green",
                              borderRadius: "9999px",
                              padding: "4px 10px",
                              backgroundColor: "white",
                              display: "inline-block",
                              fontWeight: "bold",
                              textAlign: "center",
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {countdowns[product._id]}
                          </span>
                        ) : (
                          "--:--:--"
                        )
                      } else if (expired) {
                        // Show expired status with reapply option
                        return (
                          <span
                            style={{
                              color: "#dc2626",
                              border: "1px solid #dc2626",
                              borderRadius: "9999px",
                              padding: "4px 10px",
                              backgroundColor: "white",
                              display: "inline-block",
                              fontWeight: "bold",
                              textAlign: "center",
                              whiteSpace: 'nowrap',
                              fontSize: "11px"
                            }}
                          >
                            Expired - Can Reapply
                          </span>
                        )
                      } else if (product.offerEndDate) {
                        // Show status for scheduled offers
                        return (
                          <span
                            style={{
                              color: "#f59e0b",
                              border: "1px solid #f59e0b",
                              borderRadius: "9999px",
                              padding: "4px 10px",
                              backgroundColor: "white",
                              display: "inline-block",
                              fontWeight: "bold",
                              textAlign: "center",
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Scheduled
                          </span>
                        )
                      } else {
                        // No offer
                        return "-"
                      }
                    })()} 
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    ),
    [
      currentProducts,
      currentPage,
      productsPerPage,
      getImage,
      handleEditProduct,
      handleDeleteProduct,
      renderSearchSection,
      processSizes,
    ],
  )

  const renderPagination = useCallback(() => {
    const pageNumbers = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (

      <div className="pagination flex items-center justify-center space-x-2 mt-6">
        {/* Left Arrow Button */}
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>

        {/* First page indicator */}
        {startPage > 1 && (
          <>
            <Button onClick={() => paginate(1)} type="default">1</Button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {/* Page number buttons */}
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            type={currentPage === pageNumber ? "primary" : "default"}
            className="min-w-10 h-10"
          >
            {pageNumber}
          </Button>
        ))}

        {/* Last page indicator */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-black-500">...</span>}
            <Button onClick={() => paginate(totalPages)} type="default">{totalPages}</Button>
          </>
        )}

        {/* Right Arrow Button */}
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    )
  }, [currentPage, totalPages, paginate])

  return (
    <div className="product-list" style={{ padding: "24px 32px" }}>
      {editingProduct || isAdding ? (
        <div className="product-form" style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <h2>{isAdding ? "Add New Product" : "Edit Product"}</h2>
          {editingProduct && isOfferExpired(editingProduct) && (
            <div style={{ 
              backgroundColor: "#fef3c7", 
              border: "1px solid #f59e0b", 
              borderRadius: "8px", 
              padding: "12px", 
              marginBottom: "16px" 
            }}>
              <p style={{ margin: 0, color: "#92400e", fontWeight: "600" }}>
                ⚠️ This product's offer has expired. You can now apply a new discount or set up a new time-based offer.
              </p>
            </div>
          )}
          <Form form={form} layout="vertical" onFinish={handleSubmitProduct}>
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select placeholder="Select category" onChange={handleCategoryChange}>
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedCategory && (
              <Form.Item name="subcategory" label="Subcategory" rules={[{ required: true }]}>
                <Select placeholder="Select subcategory">
                  {subcategories[selectedCategory]?.map((sub) => (
                    <Option key={sub} value={sub}>
                      {sub}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder="Enter product description" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: "Please enter price" },
                {
                  validator: (_, value) =>
                    value > 0 ? Promise.resolve() : Promise.reject(new Error("Price must be greater than 0")),
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0.01} step={0.01} placeholder="Enter price" />
            </Form.Item>



             // Add these inside Form in your edit/add product section

            <Form.Item
              name="discountPercent"
              label="Discount (%)"
              rules={[
                {
                  type: "number",
                  min: 0,
                  max: 100,
                  message: "Discount must be between 0 and 100",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} max={100} placeholder="Enter discount percent" />
            </Form.Item>

            <Form.Item
              name="offerStartDate"
              label="Offer Start Date/Time"
            >
              <Input type="datetime-local" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="offerEndDate"
              label="Offer End Date/Time"
            >
              <Input type="datetime-local" style={{ width: "100%" }} />
            </Form.Item>






            <Form.Item name="oldPrice" label="Old Price (Required for discount calculation)">
              <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter old price" />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Available Stock"
              rules={[{ required: true, message: "Please enter available stock" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter available stock" />
            </Form.Item>

            <Form.Item
              name="sizes"
              label="Available Sizes"
              rules={[{ required: true, message: "Please select at least one size" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select available sizes"
                style={{ width: "100%" }}
                onChange={handleSizeChange}
                value={previousSizes}
              >
                {["XS", "S", "M", "L", "XL", "XXL", "2T", "3T", "4T", "5", "6", "7", "8"].map((size) => (
                  <Option key={size} value={size}>
                    {size}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="colors"
              label="Colors"
              rules={[{ required: true, message: "Please select at least one color" }]}
            >
              <Select mode="multiple" placeholder="Select colors" onChange={handleColorChange}>
                {colorOptions.map(({ name }) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {form.getFieldValue("colors")?.map((color) => (
              <Form.Item key={color} label={`Images for ${color}`}>
                <Upload
                  listType="picture-card"
                  fileList={colorImages[color] || []}
                  onPreview={handlePreview}
                  onChange={(info) => handleImageChange(color, info)}
                  beforeUpload={() => false}
                  multiple={true}
                >
                  {(colorImages[color]?.length || 0) < 5 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            ))}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isAdding ? "Add Product" : "Update Product"}
              </Button>
              <Button onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div>
          
          {renderProductTable()}
          {renderPagination()}
        </div>
      )}

      <Modal
        visible={showWarningModal}
        title="Warning"
        onOk={handleWarningConfirm}
        onCancel={() => setShowWarningModal(false)}
      >
        <p>You haven't made any changes to the sizes or colors. Are you sure you want to update the product?</p>
      </Modal>

      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img
          alt="example"
          style={{ width: "100%" }}
          src={previewImage || "https://via.placeholder.com/400x400/cccccc/666666?text=No+Image"}
        />
      </Modal>

      <ToastContainer />
    </div>
  )
}

export default React.memo(AdminProductlist)