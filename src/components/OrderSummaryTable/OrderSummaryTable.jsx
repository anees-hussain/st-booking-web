import "./OrderSummaryTable.css";

const OrderSummaryTable = ({ summary, loading }) => {
  const grandTotalQty = summary.reduce(
    (sum, item) => sum + Number(item.totalQuantity || 0),
    0,
  );

  const grandTotalAmount = summary.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0,
  );

  if (loading) {
    return <div className="table-loading">Loading...</div>;
  }

  return (
    <div className="summary-table-wrapper">
      <table className="summary-table">
        <thead>
          <tr>
            <th>#</th>

            <th>Product</th>

            <th>UOM</th>

            <th>Total Qty</th>

            <th>Total Amount</th>
          </tr>
        </thead>

        <tbody>
          {summary.length === 0 && (
            <tr>
              <td colSpan="5" className="empty">
                No records found.
              </td>
            </tr>
          )}

          {summary.map((item, index) => (
            <tr key={item._id || index}>
              <td>{index + 1}</td>

              <td>
                <strong>{item.productName}</strong>
              </td>

              <td>{item.uom}</td>

              <td className="qty-column">
                {Number(item.totalQuantity || 0).toLocaleString()}
              </td>

              <td className="amount-column">
                Rs. {Number(item.totalAmount || 0).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>

        {summary.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="3" className="footer-title">
                Grand Total
              </td>

              <td className="footer-qty">{grandTotalQty.toLocaleString()}</td>

              <td className="footer-amount">
                Rs. {grandTotalAmount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default OrderSummaryTable;
