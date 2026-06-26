import { useEffect, useState } from "react";
import API from "../../api/api";

import "./ProductModal.css";

const ProductModal = ({
  visible,
  onClose,
  selectedProduct,
  refreshProducts,
}) => {
  const [productName, setProductName] = useState("");
  const [uom, setUom] = useState("");
  const [rate, setRate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (selectedProduct) {
        setProductName(selectedProduct.productName || "");
        setUom(selectedProduct.uom || "");
        setRate(String(selectedProduct.rate || ""));
      } else {
        resetForm();
      }
    }
  }, [visible, selectedProduct]);

  const resetForm = () => {
    setProductName("");
    setUom("");
    setRate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      return alert("Please enter product name.");
    }

    if (!uom.trim()) {
      return alert("Please enter UOM.");
    }

    if (!rate || Number(rate) <= 0) {
      return alert("Please enter a valid rate.");
    }

    try {
      setSaving(true);

      const payload = {
        productName,
        uom,
        rate: Number(rate),
      };

      if (selectedProduct) {
        await API.put(`/products/${selectedProduct._id}`, payload);

        alert("Product updated successfully.");
      } else {
        await API.post("/products", payload);

        alert("Product created successfully.");
      }

      refreshProducts();

      onClose();

      resetForm();
    } catch (error) {
      alert(
        error?.response?.data?.message || error?.message || "Operation failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="product-modal">
        <h2>{selectedProduct ? "Update Product" : "Create Product"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>

            <input
              type="text"
              placeholder="Enter Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>UOM</label>

            <input
              type="text"
              placeholder="e.g. Carton, Dozen, Kg"
              value={uom}
              onChange={(e) => setUom(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Rate</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter Rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving
                ? "Saving..."
                : selectedProduct
                  ? "Update Product"
                  : "Create Product"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
