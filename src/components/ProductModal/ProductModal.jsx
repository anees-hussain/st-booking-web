import "./ProductModal.css";

const user = JSON.parse(localStorage.getItem("user"));

const canEditRate =
  user?.designation === "controller" || user?.designation === "producer";

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

  const updateProductRate = (productId, rate) => {
    setSelectedProducts((prev) => {
      const index = prev.findIndex((p) => p.product === productId);

      if (index === -1) return prev;

      const updated = [...prev];

      if (rate === "") {
        return prev;
      } else {
        updated[index].rate = Number(rate);
      }

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
            const selected = selectedProducts.find(
              (p) => p.product === item._id,
            );

            const rate = selected?.rate ?? item.rate;

            const qty = getProductQuantity(item._id);

            return (
              <div className="product-card" key={item._id}>
                <div className="product-details">
                  <h4>{item.productName}</h4>

                  <p>UOM : {item.uom}</p>

                  {canEditRate && qty > 0 ? (
                    <input
                      className="rate-input"
                      type="number"
                      min="0"
                      step="1"
                      value={rate}
                      onChange={(e) =>
                        updateProductRate(item._id, e.target.value)
                      }
                    />
                  ) : (
                    <span>Rs. {rate}</span>
                  )}

                  <p>
                    Subtotal : Rs.
                    {(qty * rate).toLocaleString()}
                  </p>
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
