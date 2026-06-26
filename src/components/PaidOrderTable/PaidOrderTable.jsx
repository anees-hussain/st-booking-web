import "./PaidOrderTable.css";

const PaidOrderTable = ({ orders, loading, byProduct }) => {
  if (loading) {
    return <div className="table-loading">Loading...</div>;
  }

  if (orders.length === 0) {
    return <div className="empty-table">No records found.</div>;
  }

  // ============================
  // PRODUCT WISE REPORT
  // ============================

  if (byProduct) {
    return (
      <div className="table-wrapper">
        <table className="paid-table">
          <thead>
            <tr>
              <th>#</th>

              <th>Product</th>

              <th>Quantity</th>

              <th>Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((item, index) => (
              <tr key={item._id || index}>
                <td>{index + 1}</td>

                <td>{item.productName}</td>

                <td>{Number(item.totalQuantity || 0).toLocaleString()}</td>

                <td className="amount-column">
                  Rs. {Number(item.totalAmountPaid || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ============================
  // INDIVIDUAL ORDERS
  // ============================

  return (
    <div className="table-wrapper">
      <table className="paid-table">
        <thead>
          <tr>
            <th>#</th>

            <th>Customer</th>

            <th>Received By</th>

            <th>Received At</th>

            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((item, index) => (
            <tr key={item._id || index}>
              <td>{index + 1}</td>

              <td>{item.customerName || "-"}</td>

              <td>{item.acknowledgeBy || "-"}</td>

              <td>
                {item.acknowledgeAt
                  ? new Date(item.acknowledgeAt).toLocaleString()
                  : "-"}
              </td>

              <td className="amount-column">
                Rs. {Number(item.totalAmount || 0).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaidOrderTable;
