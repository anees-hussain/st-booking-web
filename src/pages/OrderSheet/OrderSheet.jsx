import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/API";

import "./OrderSheet.css";

import OrderSheetTable from "../../components/OrderSheetTable/OrderSheetTable";

const today = new Date().toISOString().split("T")[0];

const OrderSheet = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedSeller, setSelectedSeller] = useState("");

  const [startDate, setStartDate] = useState(today);

  const [endDate, setEndDate] = useState(today);

  // ===========================
  // FETCH ORDERS
  // ===========================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      let url = `/orders/ordersheet?startDate=${startDate}&endDate=${endDate}`;

      if (selectedSeller) {
        url += `&seller=${selectedSeller}`;
      }

      const response = await API.get(url);

      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error(error);

      alert("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===========================
  // SELLERS
  // ===========================

  const sellers = useMemo(() => {
    const sellerSet = new Set();

    orders.forEach((order) => {
      if (order.seller) {
        sellerSet.add(order.seller);
      }
    });

    return [...sellerSet];
  }, [orders]);

  // ===========================
  // PRINT
  // ===========================

  const printSheet = () => {
    const originalTitle = document.title;

    document.title = "Shoaib Traders - Order Sheet";

    window.print();

    document.title = originalTitle;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="order-sheet-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>

          <h1>Order Sheet</h1>
        </div>
      </div>

      {/* FILTER */}

      <div className="filter-row">
        <div>
          <label>Seller</label>

          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
          >
            <option value="">All Sellers</option>

            {sellers.map((seller) => (
              <option key={seller} value={seller}>
                {seller}
              </option>
            ))}
          </select>
        </div>

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

        <button className="apply-btn" onClick={fetchOrders}>
          Apply
        </button>

        <div className="summary-card">
          Submitted Orders
          <span>{orders.length}</span>
        </div>

        <button className="print-btn" onClick={printSheet}>
          🖨 Print Order Sheet
        </button>
      </div>

      <OrderSheetTable orders={orders} />
    </div>
  );
};

export default OrderSheet;
