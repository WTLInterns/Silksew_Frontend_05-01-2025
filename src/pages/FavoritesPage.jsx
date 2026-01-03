import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";

const FavoritesPage = () => {
  const { favorites, loading, toggleFavorite } =
    useFavorites();

  const { user } = useContext(AuthContext); // check if user is logged in
  const navigate = useNavigate();

  const handleRemoveFavorite = async (productId) => {
    try {
      await toggleFavorite(productId);
      toast.info("Removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const handleClearFavorites = async () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      try {
        await Promise.all(favorites.map((p) => toggleFavorite(p._id)));
        toast.success("All favorites cleared");
      } catch (error) {
        console.error("Error clearing favorites:", error);
        toast.error("Failed to clear favorites");
      }
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-lg font-semibold">
            Please Login First
          </div>
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // If still loading favorites
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // If user has no favorites
  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your Favorites is Empty
          </h2>
          <p className="text-gray-500 mb-6">
            You haven't added any items to your favorites yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // User is logged in and has favorites
  return (
    <div className="container">
      {/* Header Section with left arrow, centered title, and right clear button */}
      <div className="flex gap-8 flex-row flex-nowrap content-start justify-between items-start">
        <div className="flex">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-4 flex justify-between"
          >
            <ArrowLeft className="w-5 h-5 mb-5" />
          </button>
          <h1 className="text-2xl font-bold">My Favorites</h1>
        </div>

        <button
          onClick={handleClearFavorites}
          className="text-red-500 hover:text-red-700 flex text-sm transition-colors p-2"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear All
        </button>
      </div>

      {/* Products Grid */}
      <div className="flex justify-between mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {favorites.map((item) => (
            <div key={item._id} className="flex justify-center">
              <ProductCard
                product={item}
                onToggleFavorite={handleRemoveFavorite}
                isFavorite={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;