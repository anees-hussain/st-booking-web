import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../../api/API";
import ProductModal from "../../components/ProductModal/ProductModal";

import "./OrderDetails.css";

const OrderDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // ==========================================
  // USER
  // ==========================================

  const [user, setUser] = useState(null);

  // ==========================================
  // CUSTOMER
  // ==========================================

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [seller, setSeller] = useState("");

  // ==========================================
  // DATA
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [sellers, setSellers] = useState([]);

  const [allProducts, setAllProducts] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);

  // ==========================================
  // PRODUCT MODAL
  // ==========================================

  const [productModalVisible, setProductModalVisible] = useState(false);

  const [productSearch, setProductSearch] = useState("");

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    fetchOrder();

    fetchSellers();

    fetchProducts();
  }, []);

  // ==========================================
  // FETCH ORDER
  // ==========================================

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/orders/${id}`);

      const order = response.data;

      setCustomerName(order.customerName || "");

      setAddress(order.address || "");

      setPhone(order.phone || "");

      setSeller(order.seller || "");

      setSelectedProducts(
        (order.detail || []).map((item) => ({
          product: item.productId?._id || item.productId || item.product,

          productName: item.productName,

          quantity: String(item.quantity),

          rate: item.rate,

          uom: item.uom,
        })),
      );
    } catch (error) {
      console.error(error);

      alert("Failed to load order.");

      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH SELLERS
  // ==========================================

  const fetchSellers = async () => {
    try {
      const response = await API.get("/users/sellers");

      setSellers(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products/active");

      setAllProducts(response.data || []);
    } catch (error) {
      console.error(error);

      alert("Failed to load products.");
    }
  };

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return allProducts.filter((item) =>
      item.productName?.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [allProducts, productSearch]);

  // ==========================================
  // PRODUCT QUANTITY
  // ==========================================

  const changeProductQuantity = (product, change) => {
    const index = selectedProducts.findIndex(
      (item) => item.product === product._id,
    );

    if (index === -1) {
      if (change <= 0) return;

      setSelectedProducts((prev) => [
        ...prev,
        {
          product: product._id,
          productName: product.productName,
          quantity: "1",
          rate: product.rate,
          uom: product.uom,
        },
      ]);

      return;
    }

    const updated = [...selectedProducts];

    const currentQty = Number(updated[index].quantity || 0);

    const newQty = currentQty + change;

    if (newQty <= 0) {
      updated.splice(index, 1);

      setSelectedProducts(updated);

      return;
    }

    updated[index].quantity = String(newQty);

    setSelectedProducts(updated);
  };

  const getProductQuantity = (productId) => {
    const item = selectedProducts.find((p) => p.product === productId);

    return Number(item?.quantity || 0);
  };

  // ==========================================
  // TOTALS
  // ==========================================

  const totalItems = selectedProducts.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + Number(item.rate) * Number(item.quantity),
    0,
  );

  // ==========================================
  // RESET
  // ==========================================

  const resetForm = () => {
    fetchOrder();
  };

  // ==========================================
  // UPDATE ORDER
  // ==========================================

  const updateOrder = async () => {
    try {
      if (!customerName.trim()) {
        return alert("Customer name is required.");
      }

      if (!seller) {
        return alert("Please select seller.");
      }

      if (!phone.trim()) {
        return alert("Please enter phone number.");
      }

      if (selectedProducts.length === 0) {
        return alert("Please select at least one product.");
      }

      setSubmitting(true);

      const payload = {
        customerName,
        address,
        phone,
        seller,

        detail: selectedProducts.map((item) => ({
          productId: item.product,
          productName: item.productName,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          uom: item.uom,
        })),

        totalAmount,
      };

      await API.put(`/orders/${id}`, payload);

      alert("Order updated successfully.");

      navigate("/orders");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update order.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-card">
          <h2>Loading Order...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="order-details-page">
      <div className="order-details-card">
        <div className="order-details-header">
          <button className="back-btn" onClick={() => navigate("/orders")}>
            ← Back
          </button>

          <div className="order-details-title">
            <h1>Edit Order</h1>
            <p>Update customer information and products.</p>
          </div>
        </div>

        <input
          placeholder="Customer Name"
          value={customerName}
          disabled={submitting}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          placeholder="Address"
          value={address}
          disabled={submitting}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={phone}
          disabled={submitting}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          value={seller}
          disabled={submitting || user?.designation === "seller"}
          onChange={(e) => setSeller(e.target.value)}
        >
          <option value="">Select Seller</option>

          {sellers.map((item) => (
            <option key={item._id} value={item.fullName}>
              {item.fullName}
            </option>
          ))}
        </select>

        <button
          className="primary"
          disabled={submitting}
          onClick={() => setProductModalVisible(true)}
        >
          + Add / Update Products
        </button>

        {selectedProducts.length > 0 && (
          <div className="summary">
            <h3>Products Selected : {totalItems}</h3>

            <h2>Rs. {totalAmount.toLocaleString()}</h2>

            <div className="selected-list">
              {selectedProducts.map((item) => (
                <div key={item.product} className="selected-item">
                  <span>{item.productName}</span>

                  <span>
                    {item.quantity} × Rs.
                    {Number(item.rate).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="submit" disabled={submitting} onClick={updateOrder}>
          {submitting ? "Updating..." : "Update Order"}
        </button>

        <button className="reset" disabled={submitting} onClick={resetForm}>
          Reset
        </button>
      </div>

      <ProductModal
        visible={productModalVisible}
        onClose={() => setProductModalVisible(false)}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        filteredProducts={filteredProducts}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        changeProductQuantity={changeProductQuantity}
        getProductQuantity={getProductQuantity}
        totalItems={totalItems}
        totalAmount={totalAmount}
      />
    </div>
  );
};

export default OrderDetails;
