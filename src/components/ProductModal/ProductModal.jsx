import "./ProductModal.css";

const ProductModal = ({
  visible,
  onClose,
  productSearch,
  setProductSearch,
  filteredProducts,
  selectedProducts,
  setSelectedProducts,
  changeProductQuantity,
  getProductQuantity,
  totalItems,
  totalAmount,
}) => {
  if (!visible) return null;

  const handleQuantityChange = (product, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    setSelectedProducts((prev) => {
      const updated = [...prev];

      const existingIndex = updated.findIndex((p) => p.product === product._id);

      if (existingIndex === -1) {
        if (!numericValue || Number(numericValue) <= 0) {
          return prev;
        }

        return [
          ...prev,
          {
            product: product._id,
            productName: product.productName,
            quantity: numericValue,
            rate: product.rate,
            uom: product.uom,
          },
        ];
      }

      if (numericValue === "" || Number(numericValue) === 0) {
        updated.splice(existingIndex, 1);
        return updated;
      }

      updated[existingIndex].quantity = numericValue;

      return updated;
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Select Products</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Search */}

        <input
          className="search-input"
          placeholder="Search Product..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
        />

        {/* Products */}

        <div className="product-list">
          {filteredProducts.length === 0 && (
            <div className="empty">No Products Found</div>
          )}

          {filteredProducts.map((item) => {
            const qty = getProductQuantity(item._id);

            return (
              <div className="product-card" key={item._id}>
                <div className="product-details">
                  <h4>{item.productName}</h4>

                  <p>UOM : {item.uom}</p>

                  <p>Rate : Rs. {item.rate}</p>
                </div>

                <div className="qty-section">
                  <button
                    className="qty-btn"
                    onClick={() => changeProductQuantity(item, -1)}
                  >
                    -
                  </button>

                  <input
                    className="qty-input"
                    value={qty}
                    onChange={(e) => handleQuantityChange(item, e.target.value)}
                  />

                  <button
                    className="qty-btn"
                    onClick={() => changeProductQuantity(item, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}

        <div className="modal-footer">
          <div>
            <strong>Items</strong>

            <br />

            {totalItems}
          </div>

          <div>
            <strong>Total</strong>
            <br />
            Rs. {totalAmount.toLocaleString()}
          </div>
        </div>

        <button className="done-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
