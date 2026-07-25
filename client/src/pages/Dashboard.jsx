import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from "../services/productService";

function Dashboard() {

const [stats, setStats] = useState({
  totalProducts: 0,
  totalQuantity: 0,
  lowStock: 0,
  inventoryValue: 0,
  categories: 0,
});  

const fetchStats = async () => {
  try {
    const data = await getProductStats();
    setStats(data);
  } catch (error) {
    console.error(error);
  }
};

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

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Edit
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateProduct(editingId, formData);

        alert("Product Updated Successfully!");
      } else {
        await createProduct(formData);

        alert("Product Added Successfully!");
      }

      // Reset Form
      setFormData({
        name: "",
        sku: "",
        category: "",
        quantity: "",
        price: "",
        supplier: "",
        location: "",
      });

      setEditingId(null);

      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // Handle Delete
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

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
  <div>
    <h3>Total Products</h3>
    <p>{stats.totalProducts}</p>
  </div>

  <div>
    <h3>Total Quantity</h3>
    <p>{stats.totalQuantity}</p>
  </div>

  <div>
    <h3>Low Stock</h3>
    <p>{stats.lowStock}</p>
  </div>

  <div>
    <h3>Inventory Value</h3>
    <p>₹{stats.inventoryValue}</p>
  </div>

  <div>
    <h3>Categories</h3>
    <p>{stats.categories}</p>
  </div>
</div>

      <hr />

      <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="supplier"
            placeholder="Supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              setEditingId(null);

              setFormData({
                name: "",
                sku: "",
                category: "",
                quantity: "",
                price: "",
                supplier: "",
                location: "",
              });
            }}
          >
            Cancel
          </button>
        )}
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No Products Found
              </td>
            </tr>
          ) : (
            products.map((product) => (
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

                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;