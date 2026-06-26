import { useEffect, useState } from "react";

import "./DeliveryModal.css";

const DeliveryModal = ({
  visible,
  onClose,
  order,
  status,
  onConfirm,
  deliveryMen,
}) => {
  const [deliveryBy, setDeliveryBy] = useState("");

  useEffect(() => {
    if (visible) {
      setDeliveryBy(order?.deliveryBy || "");
    }
  }, [visible, order]);

  if (!visible) return null;

  const handleConfirm = () => {
    if (status === "delivered" && !deliveryBy.trim()) {
      alert("Please enter delivery person.");

      return;
    }

    onConfirm(deliveryBy);
  };

  return (
    <div className="delivery-overlay">
      <div className="delivery-modal">
        <div className="delivery-header">
          <h2>
            {status === "delivered" ? "Mark as Delivered" : "Update Status"}
          </h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {order && (
          <div className="order-summary">
            <p>
              <strong>Customer</strong>

              <br />

              {order.customerName}
            </p>

            <p>
              <strong>Phone</strong>

              <br />

              {order.phone}
            </p>

            <p>
              <strong>Amount</strong>
              <br />
              Rs. {Number(order.totalAmount || 0).toLocaleString()}
            </p>
          </div>
        )}

        {status === "delivered" && (
          <div className="form-group">
            <label>Delivery Person</label>

            <select
              value={deliveryBy}
              onChange={(e) => setDeliveryBy(e.target.value)}
            >
              <option value="">Select Delivery Person</option>

              {deliveryMen?.map((man) => (
                <option key={man._id} value={man.fullName}>
                  {man.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="delivery-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
