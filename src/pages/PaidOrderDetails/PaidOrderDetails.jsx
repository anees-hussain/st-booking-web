import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

import "./PaidOrderDetails.css";

import PaidOrderTable from "../../components/PaidOrderTable/PaidOrderTable";

const PaidOrderDetails = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]);

  const [startDate, setStartDate] = useState(today);

  const [endDate, setEndDate] = useState(today);

  const [byProduct, setByProduct] = useState(false);

  // ======================================
  // FETCH REPORT
  // ======================================

  const fetchReport = async () => {
    try {
      setLoading(true);

      const response = await API.get("/orders/reports/paid", {
        params: {
          startDate,
          endDate,
          byProduct,
        },
      });

      setOrders(response.data || []);
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // TOTAL AMOUNT
  // ======================================

  const totalAmount = orders.reduce((sum, item) => {
    if (byProduct) {
      return sum + Number(item.totalAmountPaid || 0);
    }

    return sum + Number(item.totalAmount || 0);
  }, 0);

  return (
    <div className="paid-order-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>

          <h1>Paid Orders Report</h1>
        </div>
      </div>

      {/* FILTERS */}

      <div className="filters">
        <div>
          <label>Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label>End Date</label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={byProduct}
              onChange={(e) => setByProduct(e.target.checked)}
            />
            By Product
          </label>
        </div>

        <button className="apply-btn" onClick={fetchReport} disabled={loading}>
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* SUMMARY */}

      {orders.length > 0 && (
        <div className="summary-container">
          <div className="summary-card">
            <h3>Total Amount</h3>

            <p>Rs. {totalAmount.toLocaleString()}</p>
          </div>

          <div className="summary-card">
            <h3>Total Records</h3>

            <p>{orders.length}</p>
          </div>
        </div>
      )}

      {/* TABLE */}

      <PaidOrderTable orders={orders} loading={loading} byProduct={byProduct} />
    </div>
  );
};

export default PaidOrderDetails;
