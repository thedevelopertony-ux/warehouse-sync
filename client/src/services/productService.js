import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

// Get JWT Token
const getToken = () => {
  return localStorage.getItem("token");
};

// Get All Products
export const getProducts = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return response.data;
};