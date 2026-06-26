import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/api";

import "./OrderSummary.css";

import OrderSummaryTable from "../../components/OrderSummaryTable/OrderSummaryTable";

const OrderSummary = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState([]);

  const [showFilters, setShowFilters] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");

  const [sellerFilter, setSellerFilter] = useState("");

  const [deliveryByFilter, setDeliveryByFilter] = useState("");

  const [startDate, setStartDate] = useState(today);

  const [endDate, setEndDate] = useState(today);

  const [statuses, setStatuses] = useState([]);

  const [sellers, setSellers] = useState([]);

  const [deliveryPersons, setDeliveryPersons] = useState([]);

  // ===========================
  // FETCH FILTER OPTIONS
  // ===========================

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await API.get("/orders/filters/options");

      setStatuses(response.data.statuses || []);

      setSellers(response.data.sellers || []);

      setDeliveryPersons(response.data.deliveryBy || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // FETCH SUMMARY
  // ===========================

  const fetchSummary = async () => {
    try {
      setLoading(true);

      let url = "/orders/summary?";

      if (statusFilter) {
        url += `status=${encodeURIComponent(statusFilter)}&`;
      }

      if (sellerFilter) {
        url += `seller=${encodeURIComponent(sellerFilter)}&`;
      }

      if (deliveryByFilter) {
        url += `deliveryBy=${encodeURIComponent(deliveryByFilter)}&`;
      }

      if (startDate) {
        url += `startDate=${startDate}&`;
      }

      if (endDate) {
        url += `endDate=${endDate}&`;
      }

      url = url.endsWith("&") ? url.slice(0, -1) : url;

      const response = await API.get(url);

      setSummary(response.data || []);
    } catch (error) {
      console.error(error);

      alert("Failed to fetch order summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-summary-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>

          <h1>Order Summary</h1>
        </div>
      </div>

      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && (
        <div className="filters">
          <div>
            <label>Status</label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>

              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Seller</label>

            <select
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
            >
              <option value="">All</option>

              {sellers.map((seller) => (
                <option key={seller} value={seller}>
                  {seller}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Delivery By</label>

            <select
              value={deliveryByFilter}
              onChange={(e) => setDeliveryByFilter(e.target.value)}
            >
              <option value="">All</option>

              {deliveryPersons.map((person) => (
                <option key={person} value={person}>
                  {person}
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

          <button className="apply-btn" onClick={fetchSummary}>
            Apply Filters
          </button>
        </div>
      )}

      <div className="summary-header">
        <h2>Product Summary</h2>

        <span>{summary.length} Products</span>
      </div>

      <OrderSummaryTable summary={summary} loading={loading} />
    </div>
  );
};

export default OrderSummary;
