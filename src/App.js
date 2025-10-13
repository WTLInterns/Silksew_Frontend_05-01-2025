// src/App.js
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Shop from "./pages/Shop"
import Mens from "./pages/Mens"
import Women from "./pages/Women"
import Kids from "./pages/Kids"
import Cart from "./pages/Cart"
import LoginSignup from "./pages/LoginSignup"
import Login from "./pages/Login"
import Product from "./pages/Product"
import Checkout from "./components/Checkout/Checkout"
import AdminPage from "./pages/AdminPage"
import Footer from "./components/Footer/Footer"
import FavoritesPage from "./pages/FavoritesPage"
import { AuthContextProvider } from "./context/AuthContext"
import { CategoryProvider } from "./context/CategoryContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ProtectedRoute from "./pages/ProtectedRoute"
import PasswordReset from "./pages/PasswordReset"
import ForgotPassword from "./pages/ForgotPassword"
import UserProfileButtons from "./pages/UserProfileButtons"
import UserProfileForm from "./pages/UserProfileForm"
import YourOrder from "./pages/YourOrder"
import FilterProduct from "./components/Navbar/FilterProduct"
import FloatingButtons from "./components/FloatingButtons/FloatingButtons"
import OrderItems from "./components/OrderItems/OrderItems"
import PrivacyPolicy from "./components/Footer/PrivacyPolicy"
import TermsServices from "./components/Footer/TermsServices"
import { setupAxios } from "./services/config"

// Setup axios defaults
setupAxios()

const ConditionalNavbar = () => {
  const location = useLocation()
  // ✅ Navbar hidden only on admin and profile
  const excludeNavbarRoutes = ["/admin", "/profile", "/login", "/signup", "/forgot-password", "/reset-password"]
  return !excludeNavbarRoutes.includes(location.pathname) ? <Navbar /> : null
}

const ConditionalFloatingButtons = () => {
  const location = useLocation()
  const excludeFloatingButtonsRoutes = ["/admin"]
  return !excludeFloatingButtonsRoutes.includes(location.pathname) ? <FloatingButtons /> : null
}

const ConditionalFooter = () => {
  const location = useLocation()
  // Removed "/cart" from excludeFooterRoutes so footer appears on cart page
  const excludeFooterRoutes = ["/admin", "/user-profile-buttons", "/your-order", "/profile"]
  return !excludeFooterRoutes.includes(location.pathname) ? <Footer /> : null
}

function App() {
  return (
    <AuthContextProvider>
      <CategoryProvider>
        <BrowserRouter>
          <ConditionalNavbar />
          <main>
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/mens" element={<Mens />} />
              <Route path="/womens" element={<Women />} />
              <Route path="/kids" element={<Kids />} />
              <Route path="/product" element={<Product />}>
                <Route path=":productId" element={<Product />} />
              </Route>
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<LoginSignup />} />
              <Route path="/forgotPassword/:id/:token" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/filter" element={<FilterProduct />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsServices />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/profile" element={<UserProfileButtons />} />

              {/* 🔒 Protected Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute role="user">
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute role="user">
                    <UserProfileForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute role="user">
                    <YourOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute role="user">
                    <OrderItems />
                  </ProtectedRoute>
                }
              />

              {/* 🔒 Admin-only route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <ConditionalFloatingButtons />
          <ConditionalFooter />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      </CategoryProvider>
    </AuthContextProvider>
  )
}

export default App
