import axios from 'axios';
import { getConfig } from './config';

// Favorites API base (axios.defaults.baseURL should be https://api.silksew.com)
const API_URL = '/api/favorites';

// Add product to favorites
// Returns: favorite object { _id, productId, notes, customName, createdAt }
export const addToFavorites = async (productId, notes = '', customName = '') => {
  try {
    const res = await axios.post(
      API_URL,
      { productId, notes, customName },
      getConfig()
    );
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.response?.data || error.message || 'Error adding to favorites';
    throw new Error(message);
  }
};

// Get user's favorites
// Returns: array of favorite entries [{ _id, productId, notes, customName, createdAt }, ...]
export const getFavorites = async () => {
  try {
    const res = await axios.get(API_URL, getConfig());
    return Array.isArray(res.data) ? res.data : (res.data?.favorites || []);
  } catch (error) {
    const message = error?.response?.data?.message || error?.response?.data || error.message || 'Error fetching favorites';
    throw new Error(message);
  }
};

// Remove favorite by favorite id
export const removeFromFavorites = async (favoriteId) => {
  try {
    const res = await axios.delete(`${API_URL}/${favoriteId}`, getConfig());
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.response?.data || error.message || 'Error removing from favorites';
    throw new Error(message);
  }
};

// Remove by product id: locate favorite entry then delete by _id
export const removeFromFavoritesByProduct = async (productId) => {
  try {
    const list = await getFavorites();
    const match = list.find((f) => String(f.productId) === String(productId));
    if (!match?._id) return { message: 'Not in favorites' };
    return await removeFromFavorites(match._id);
  } catch (error) {
    const message = error?.response?.data?.message || error?.response?.data || error.message || 'Error removing from favorites';
    throw new Error(message);
  }
};

// Check if a product is favorited
export const isProductInFavorites = async (productId) => {
  try {
    const list = await getFavorites();
    return list.some((f) => String(f.productId) === String(productId));
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};
