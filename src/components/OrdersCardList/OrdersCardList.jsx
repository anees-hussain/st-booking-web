import OrderCard from "../OrderCard/OrderCard";

const OrdersCardList = ({
  user,
  orders,
  loading,
  onEdit,
  onView,
  onDeliver,
  onCancel,
  onPayment,
}) => {
  if (loading) {
    return <div className="orders-loading">Loading Orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="orders-empty">No Orders Found</div>;
  }

  return (
    <div className="orders-card-list">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          user={user}
          order={order}
          onEdit={onEdit}
          onView={onView}
          onDeliver={onDeliver}
          onCancel={onCancel}
          onPayment={onPayment}
        />
      ))}
    </div>
  );
};

export default OrdersCardList;
