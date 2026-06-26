import "./OrdersTable.css";

const OrdersTable = ({
  user,
  orders,
  loading,
  onEdit,
  onDeliver,
  onView,
  onCancel,
  onPayment,
}) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "submitted":
        return "status submitted";

      case "delivered":
        return "status delivered";

      case "paid":
        return "status paid";

      case "cancelled":
        return "status cancelled";

      default:
        return "status";
    }
  };

  const canEdit = (order) => {
    return order.status === "submitted" && user?.designation !== "deliveryman";
  };

  const canDeliver = (order) => {
    return order.status === "submitted" && user?.designation !== "seller";
  };

  const canReceivePayment = (order) => {
    return order.status === "delivered" && user?.designation !== "seller";
  };

  const canCancel = (order) => {
    return order.status === "submitted" && user?.designation !== "deliveryman";
  };

  if (loading) {
    return <div className="orders-loading">Loading Orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="orders-empty">No Orders Found</div>;
  }

  return (
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>

            <th>Customer</th>

            <th>Seller</th>

            <th>Phone</th>

            <th>Amount</th>

            <th>Status</th>

            <th>Delivery By</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>

              <td>
                <strong>{order.customerName}</strong>

                <br />

                <small>{order.address}</small>
              </td>

              <td>{order.seller}</td>

              <td>{order.phone}</td>

              <td className="amount">
                Rs. {Number(order.totalAmount || 0).toLocaleString()}
              </td>

              <td>
                <span className={getStatusClass(order.status)}>
                  {order.status}
                </span>
              </td>

              <td>{order.deliveryBy || "-"}</td>

              <td>
                <div className="action-buttons">
                  <button className="view-btn" onClick={() => onView(order)}>
                    View
                  </button>

                  {canEdit(order) && (
                    <button className="edit-btn" onClick={() => onEdit(order)}>
                      Edit
                    </button>
                  )}

                  {canDeliver(order) && (
                    <button
                      className="deliver-btn"
                      onClick={() => onDeliver(order)}
                    >
                      Deliver
                    </button>
                  )}

                  {canReceivePayment(order) && (
                    <button
                      className="paid-btn"
                      onClick={() => onPayment(order)}
                    >
                      Paid
                    </button>
                  )}

                  {canCancel(order) && (
                    <button
                      className="cancel-btn"
                      onClick={() => onCancel(order)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
