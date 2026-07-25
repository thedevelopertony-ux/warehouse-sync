import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";



const handleEdit = (product) => {
  setEditingId(product._id);

  setFormData({
    name: product.name,
    sku: product.sku,
    category: product.category,
    quantity: product.quantity,
    price: product.price,
    supplier: product.supplier,
    location: product.location,
  });
};

function Dashboard() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
    location: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      supplier: product.supplier,
      location: product.location,
    });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      console.log("API Response:", data);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
// Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      // Update existing product
      await updateProduct(editingId, formData);

      alert("Product Updated Successfully!");
    } else {
      // Create new product
      await createProduct(formData);

      alert("Product Added Successfully!");
    }

    // Clear the form
    setFormData({
      name: "",
      sku: "",
      category: "",
      quantity: "",
      price: "",
      supplier: "",
      location: "",
    });

    // Exit edit mode
    setEditingId(null);

    // Refresh product list
    fetchProducts();

  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  }
};
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await deleteProduct(id);

    alert("Product Deleted Successfully!");

    fetchProducts();
  } catch (error) {
    alert(error.response?.data?.message || "Delete Failed");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>WarehouseSync Dashboard</h1>

      <h2>Total Products: {products.length}</h2>

      <hr />

      <h2>
        {editingId ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="supplier"
            placeholder="Supplier"
            value={formData.supplier}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <hr />

      <h2>Products</h2>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td>₹{product.price}</td>
              <td>{product.supplier}</td>
              <td>{product.location}</td>
              <td>
                <button onClick={() => handleEdit(product)}>
                  Edit
                </button>
                {" "}
                <button onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </td>
            </tr>    
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;