"use client"

import { createContext, useEffect, useState, useCallback } from "react"
import all_product from "../components/Assets/all_product"
import axios from "axios"
import { BASEURL } from "../config"
import { jwtDecode } from "jwt-decode"

const delivery_fee = 0

export const ShopContext = createContext(null)

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem("cartItems")
    return savedCart ? JSON.parse(savedCart) : []
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true) // products + token साठी
  const [cartLoading, setCartLoading] = useState(true) // ✅ cart fetch साठी

  const validateToken = useCallback(() => {
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      try {
        const decodedToken = jwtDecode(savedToken)
        const currentTime = Date.now() / 1000
        if (decodedToken.exp > currentTime) {
          setToken(savedToken)
        } else {
          console.error("Token has expired.")
          localStorage.removeItem("token")
          setToken("")
          // Don't clear cart items when token expires, keep local cart
        }
      } catch (error) {
        console.error("Failed to decode token:", error)
        localStorage.removeItem("token")
        setToken("")
        // Don't clear cart items when token is invalid, keep local cart
      }
    } else {
      setToken("")
      // Don't clear cart items when no token, keep local cart
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    validateToken()
  }, [validateToken])

  const getProducts = useCallback(async () => {
    try {
      const response = await axios.get(BASEURL + "/api/products")
      if (response.status === 200) {
        setProducts(response.data.products || [])
        localStorage.setItem("products", JSON.stringify(response.data.products))
      } else {
        console.error("Failed to fetch products. Status:", response.status)
      }
    } catch (error) {
      console.error("Error fetching products:", error.message)
    }
  }, [])

  const getTotalCartItems = useCallback(async () => {
    setCartLoading(true)
    if (token) {
      try {
        const response = await axios.get(BASEURL + "/api/cart/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const serverCartItems = Array.isArray(response.data.items) ? response.data.items : []
        
        // Get local cart items
        const localCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
        
        // Merge server and local cart items (server takes precedence for duplicates)
        const mergedCart = [...localCartItems]
        serverCartItems.forEach(serverItem => {
          const existingIndex = mergedCart.findIndex(
            localItem => localItem.productId === serverItem.productId && 
                       localItem.size === serverItem.size && 
                       localItem.color === serverItem.color
          )
          if (existingIndex > -1) {
            // Update quantity from server
            mergedCart[existingIndex].quantity = serverItem.quantity
          } else {
            // Add server item to local cart
            mergedCart.push(serverItem)
          }
        })
        
        setCartItems(mergedCart)
      } catch (error) {
        console.error("Failed to fetch cart items:", error.message)
        // Keep local cart items if server fetch fails
        const localCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
        setCartItems(localCartItems)
      }
    } else {
      // No token, use local cart items
      const localCartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
      setCartItems(localCartItems)
    }
    setCartLoading(false)
  }, [token])

  const addToCart = useCallback(
    async (productId, size, color, quantity = 1) => {
      const newItem = { productId, size, color, quantity }
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.productId === productId && item.size === size && item.color === color,
        )
        let newItems
        if (existingItemIndex > -1) {
          newItems = [...prevItems]
          newItems[existingItemIndex].quantity += quantity
        } else {
          newItems = [...prevItems, newItem]
        }
        return newItems
      })

      if (token) {
        try {
          await axios.post(BASEURL + "/api/cart/add", newItem, {
            headers: { Authorization: `Bearer ${token}` },
          })
        } catch (error) {
          console.error("Failed to add item to cart on server:", error.message)
        }
      }
    },
    [token],
  )

  const removeFromCart = useCallback(
    async (productId, size, color) => {
      setCartItems((prevItems) => {
        const itemIndex = prevItems.findIndex(
          (item) => item.productId === productId && item.size === size && item.color === color,
        )

        const newItems = [...prevItems]
        if (itemIndex > -1) {
          if (newItems[itemIndex].quantity > 1) {
            newItems[itemIndex].quantity -= 1
          } else {
            newItems.splice(itemIndex, 1)
          }
        }
        return newItems
      })

      if (token) {
        try {
          await axios.post(
            BASEURL + "/api/cart/remove",
            { productId, size, color },
            { headers: { Authorization: `Bearer ${token}` } },
          )
        } catch (error) {
          console.error("Failed to remove item from cart on server:", error.message)
        }
      }
    },
    [token],
  )

  const getTotalCartAmount = useCallback(() => {
    return cartItems.reduce((total, cartItem) => {
      const product = products.find((p) => p._id === cartItem?.productId)
      if (product) {
        total += product.price * cartItem.quantity
      } else {
        console.warn(`Product not found for cart item: ${cartItem?.productId}`)
      }
      return total
    }, 0)
  }, [cartItems, products])

  const calculateTotalCartItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const clearCart = useCallback(() => {
    setCartItems([])
    localStorage.removeItem("cartItems")
  }, [])

  const cleanInvalidCartItems = useCallback(() => {
    if (!products || products.length === 0) return
    
    setCartItems(prevItems => {
      const validItems = prevItems.filter(cartItem => {
        const product = products.find(p => p._id === cartItem.productId)
        if (!product) {
          console.warn(`Removing invalid cart item: ${cartItem.productId}`)
          return false
        }
        return true
      })
      
      // Update localStorage with cleaned cart
      localStorage.setItem("cartItems", JSON.stringify(validItems))
      return validItems
    })
  }, [products])

  useEffect(() => {
    if (products.length === 0) {
      getProducts()
    } else {
      // Clean invalid cart items when products are loaded
      cleanInvalidCartItems()
    }
  }, [getProducts, products.length, cleanInvalidCartItems])

  useEffect(() => {
    getTotalCartItems()
  }, [token, getTotalCartItems])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const contextValue = {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    calculateTotalCartItems,
    all_product,
    searchTerm,
    setSearchTerm,
    setToken,
    delivery_fee,
    setCartItems,
    getTotalCartItems,
    clearCart,
    cleanInvalidCartItems,
    token,
    loading,
    cartLoading,
  }

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>
}

export default ShopContextProvider
