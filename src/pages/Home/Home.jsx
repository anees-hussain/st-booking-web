import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import API from "../../api/api";
import ProductModal from "../../components/ProductModal/ProductModal";

const SALESMAN_PHONE = "+923006838039";

const Home = () => {
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [seller, setSeller] = useState("");

  const [sellers, setSellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [productSearch, setProductSearch] = useState("");
  const [productModalVisible, setProductModalVisible] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSellers();
    fetchProducts();
  }, []);

  // ================= FETCH SELLERS =================

  const fetchSellers = async () => {
    try {
      const response = await API.get("/users/sellers");
      setSellers(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= FETCH PRODUCTS =================

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products/active");
      setAllProducts(response.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch products");
    }
  };

  // ================= FILTER PRODUCTS =================

  const filteredProducts = useMemo(() => {
    return allProducts.filter((item) =>
      item.productName?.toLowerCase().includes(productSearch.toLowerCase()),
    );
  }, [allProducts, productSearch]);

  // ================= PRODUCT QTY =================

  const changeProductQuantity = (product, change) => {
    const existingIndex = selectedProducts.findIndex(
      (item) => item.product === product._id,
    );

    if (existingIndex === -1) {
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

    const currentQty = Number(updated[existingIndex].quantity || 0);

    const newQty = currentQty + change;

    if (newQty <= 0) {
      updated.splice(existingIndex, 1);
      setSelectedProducts(updated);
      return;
    }

    updated[existingIndex].quantity = String(newQty);

    setSelectedProducts(updated);
  };

  const getProductQuantity = (productId) => {
    const item = selectedProducts.find((p) => p.product === productId);
    return Number(item?.quantity || 0);
  };

  // ================= TOTALS =================

  const totalItems = selectedProducts.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const totalAmount = selectedProducts.reduce((sum, item) => {
    return sum + Number(item.rate) * Number(item.quantity);
  }, 0);

  // ================= RESET =================

  const resetForm = () => {
    setCustomerName("");
    setAddress("");
    setPhone("");
    setSeller("");
    setSelectedProducts([]);
    setProductSearch("");
  };

  // ================= SUBMIT =================

  const submitOrder = async () => {
    try {
      if (!customerName) return alert("Customer name is required");
      if (!seller) return alert("Please select seller");
      if (!phone) return alert("Please enter phone number");
      if (selectedProducts.length === 0) return alert("Please select products");

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
        postedBy: "guest",
      };

      await API.post("/orders", payload);

      alert("Order submitted successfully");

      resetForm();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit order",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactUs = async () => {
    try {
      await navigator.clipboard.writeText(SALESMAN_PHONE);

      alert(
        "Salesman number copied to clipboard.\nYou can now paste it in your Phone app.",
      );

      window.location.href = `tel:${SALESMAN_PHONE}`;
    } catch (error) {
      window.location.href = `tel:${SALESMAN_PHONE}`;
    }
  };

  // ================= UI =================

  return (
    <div className="home">
      <div className="card">
        <h1 className="logo">Shoaib Traders</h1>

        <h2>Book Order</h2>

        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select value={seller} onChange={(e) => setSeller(e.target.value)}>
          <option value="">Select Seller</option>

          {sellers.map((item) => (
            <option key={item._id} value={item.fullName}>
              {item.fullName}
            </option>
          ))}
        </select>

        <button
          className="primary"
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
                    {item.quantity} × Rs.{item.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="submit" disabled={submitting} onClick={submitOrder}>
          {submitting ? "Submitting..." : "Submit Order"}
        </button>

        <button className="reset" onClick={resetForm}>
          Reset
        </button>

        <button className="contact-btn" onClick={handleContactUs}>
          📞 Call Salesman ({SALESMAN_PHONE})
        </button>

        <button className="login-link" onClick={() => navigate("/login")}>
          Registered User? Login
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

export default Home;
