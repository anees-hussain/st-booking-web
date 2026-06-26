import "./OrderDetailsModal.css";

const OrderDetailsModal = ({ visible, order, onClose }) => {
  if (!visible || !order) return null;

  const totalItems =
    order.detail?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ||
    0;

  return (
    <div className="order-details-overlay" onClick={onClose}>
      <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}

        <div className="details-header">
          <h2>Order Details</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CUSTOMER */}

        <div className="details-section">
          <div className="detail-row">
            <span>Customer</span>

            <strong>{order.customerName}</strong>
          </div>

          <div className="detail-row">
            <span>Address</span>

            <strong>{order.address || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Seller</span>

            <strong>{order.seller}</strong>
          </div>

          <div className="detail-row">
            <span>Status</span>

            <strong className={`status ${order.status}`}>{order.status}</strong>
          </div>

        </div>

        {/* PRODUCTS */}

        <div className="products-section">
          <h3>Products</h3>

          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>

                <th>Qty</th>

                <th>Rate</th>

                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.detail?.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>

                  <td>
                    {item.quantity} {item.uom}
                  </td>

                  <td>Rs. {Number(item.rate).toLocaleString()}</td>

                  <td>
                    Rs.{" "}
                    {(
                      Number(item.rate) * Number(item.quantity)
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}

        <div className="details-summary">
          <div className="summary-row">
            <span>Total Items</span>

            <strong>{totalItems}</strong>
          </div>

          <div className="summary-row">
            <span>Total Amount</span>

            <strong className="amount">
              Rs. {Number(order.totalAmount || 0).toLocaleString()}
            </strong>
          </div>
        </div>

        {/* FOOTER */}

        <div className="details-footer">
          <button className="close-modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
