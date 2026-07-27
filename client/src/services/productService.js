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
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Create Product
export const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Update Product
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getProductStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const exportInventory = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/export",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      responseType: "blob",
    }
  );

  return response.data;
};

export const uploadInventory = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:5000/api/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};