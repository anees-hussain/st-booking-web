import "./OrderCard.css";

const OrderCard = ({
  user,
  order,
  onEdit,
  onDeliver,
  onCancel,
  onPayment,
  onView,
}) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "submitted":
        return "submitted";

      case "delivered":
        return "delivered";

      case "paid":
        return "paid";

      case "cancelled":
        return "cancelled";

      default:
        return "";
    }
  };

  const canEdit = () =>
    order.status === "submitted" && user?.designation !== "deliveryman";

  const canDeliver = () =>
    order.status === "submitted" && user?.designation !== "seller";

  const canCancel = () =>
    order.status === "submitted" && user?.designation !== "deliveryman";

  const canReceivePayment = () =>
    order.status === "delivered" && user?.designation !== "seller";

  const totalItems =
    order.detail?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ||
    0;

  return (
    <div className="order-card">
      {/* HEADER */}

      <div className="order-card-header">
        <div>
          <h3>{order.customerName}</h3>

          <p className="seller">{order.seller}</p>
        </div>

        <span className={`status-badge ${getStatusClass(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* BODY */}

      <div className="order-card-body">
        <div className="info-row">
          <span>📞</span>

          <a href={`tel:${order.phone}`}>{order.phone}</a>
        </div>

        <div className="info-row">
          <span>📍</span>

          <span>{order.address}</span>
        </div>

        <div className="info-row">
          <span>🚚</span>

          <span>{order.deliveryBy || "-"}</span>
        </div>

        <div className="info-row">
          <span>📦</span>

          <span>{totalItems} Items</span>
        </div>
      </div>

      {/* TOTAL */}

      <div className="order-total">
        <span>Total Amount</span>

        <strong>Rs. {Number(order.totalAmount || 0).toLocaleString()}</strong>
      </div>

      {/* ACTIONS */}

      <div className="order-actions">
        <div className="view-order-card" onClick={() => onView(order)}>
          View Details
        </div>

        {canEdit() && (
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(order);
            }}
          >
            Edit
          </button>
        )}

        {canDeliver() && (
          <button className="deliver-btn" onClick={() => onDeliver(order)}>
            Deliver
          </button>
        )}

        {canReceivePayment() && (
          <button className="paid-btn" onClick={() => onPayment(order)}>
            Paid
          </button>
        )}

        {canCancel() && (
          <button className="cancel-btn" onClick={() => onCancel(order)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
