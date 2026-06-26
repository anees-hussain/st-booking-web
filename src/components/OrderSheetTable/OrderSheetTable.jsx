import "./OrderSheetTable.css";

const OrderSheetTable = ({ orders }) => {
  const getProducts = (detail = []) => {
    return detail.map((item) => (
      <div
        key={`${item.productId || item.product}-${item.productName}`}
        className="product-item"
      >
        • {item.productName} ({item.quantity})
      </div>
    ));
  };

  const grandTotal = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0,
  );

  return (
    <div className="order-table-wrapper">
      <table className="order-table">
        <thead>
          <tr>
            <th>#</th>

            <th>Customer</th>

            <th>Phone</th>

            <th>Address</th>

            <th>Products</th>

            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="empty">
                No submitted orders found.
              </td>
            </tr>
          )}

          {orders.map((order, index) => (
            <tr key={order._id || index}>
              <td>{index + 1}</td>

              <td>
                <strong>{order.customerName}</strong>
              </td>

              <td>{order.phone}</td>

              <td>{order.address}</td>

              <td className="products-column">{getProducts(order.detail)}</td>

              <td className="amount-column">
                Rs. {Number(order.totalAmount || 0).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>

        {orders.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="5" className="grand-total-label">
                Grand Total
              </td>

              <td className="grand-total-value">
                Rs. {grandTotal.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default OrderSheetTable;
