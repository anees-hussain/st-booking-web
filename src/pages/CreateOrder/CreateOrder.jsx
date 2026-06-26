import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/api";
import ProductModal from "../../components/ProductModal/ProductModal";

import "../Home/Home.css";

const CreateOrder = () => {
  const navigate = useNavigate();

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

  const [sellers, setSellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // ==========================================
  // PRODUCT MODAL
  // ==========================================

  const [productSearch, setProductSearch] = useState("");
  const [productModalVisible, setProductModalVisible] = useState(false);

  // ==========================================
  // SUBMIT
  // ==========================================

  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadUser();

    fetchSellers();

    fetchProducts();
  }, []);

  // ==========================================
  // LOAD USER
  // ==========================================

  const loadUser = () => {
    const stored = localStorage.getItem("user");

    if (!stored) return;

    const parsed = JSON.parse(stored);

    setUser(parsed);

    if (parsed.designation === "seller") {
      setSeller(parsed.fullName);
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

      alert("Failed to fetch products.");
    }
  };

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) =>
      product.productName?.toLowerCase().includes(productSearch.toLowerCase()),
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
          uom: product.uom,
          rate: product.rate,
          quantity: "1",
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
    setCustomerName("");
    setAddress("");
    setPhone("");
    setSelectedProducts([]);
    setProductSearch("");

    if (user?.designation === "seller") {
      setSeller(user.fullName);
    } else {
      setSeller("");
    }
  };

  // ==========================================
  // SUBMIT ORDER
  // ==========================================

  const submitOrder = async () => {
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
        status: "submitted",
        postedBy: user?.fullName || user?.username || "System",
      };

      await API.post("/orders", payload);

      alert("Order created successfully.");

      navigate("/orders");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create order.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="home">
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
            gap: 15,
          }}
        >
          <button
            className="reset"
            style={{ width: "auto", margin: 0 }}
            onClick={() => navigate("/orders")}
          >
            ← Back
          </button>

          <div>
            <h1 className="logo" style={{ marginBottom: 4 }}>
              Shoaib Traders
            </h1>

            <h2 style={{ margin: 0 }}>Create Order</h2>
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

        {user?.designation !== "seller" && (
          <select
            value={seller}
            disabled={submitting}
            onChange={(e) => setSeller(e.target.value)}
          >
            <option value="">Select Seller</option>

            {sellers.map((item) => (
              <option key={item._id} value={item.fullName}>
                {item.fullName}
              </option>
            ))}
          </select>
        )}

        <button
          className="primary"
          disabled={submitting}
          onClick={() => setProductModalVisible(true)}
        >
          + Add Products
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

        <button className="submit" disabled={submitting} onClick={submitOrder}>
          {submitting ? "Submitting..." : "Create Order"}
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

export default CreateOrder;