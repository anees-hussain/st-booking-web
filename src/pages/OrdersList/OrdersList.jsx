import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/API";

import "./OrdersList.css";

import OrdersTable from "../../components/OrdersTable/OrdersTable";
import OrderFiltersModal from "../../components/OrderFiltersModal/OrderFiltersModal";
import DeliveryModal from "../../components/DeliveryModal/DeliveryModal";

import OrdersCardList from "../../components/OrdersCardList/OrdersCardList";
import OrderDetailsModal from "../../components/OrderDetailsModal/OrderDetailsModal";

const OrdersList = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [orders, setOrders] = useState([]);

  const [viewOrder, setViewOrder] = useState(null);

  const [viewOrderDetailsModal, setViewOrderDetailsModal] = useState(false);

  const [viewModalVisible, setViewModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [filtersVisible, setFiltersVisible] = useState(false);

  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [pendingStatus, setPendingStatus] = useState("");

  // Filters

  const [selectedSeller, setSelectedSeller] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedDeliveryBy, setSelectedDeliveryBy] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

  const [sellers, setSellers] = useState([]);

  const [deliveryMen, setDeliveryMen] = useState([]);

  // Pagination

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ====================================
  // INITIAL LOAD
  // ====================================

  useEffect(() => {
    setupLoggedInUser();

    fetchSellers();
    fetchDeliveryMen();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPage(1);

    fetchOrders(1, false);
  }, [
    selectedSeller,
    selectedStatus,
    selectedDeliveryBy,
    selectedDate,
    search,
  ]);

  // ====================================
  // USER
  // ====================================

  const setupLoggedInUser = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      setUser(parsed);

      if (parsed.designation === "seller") {
        setSelectedSeller(parsed.fullName);
      }
    }
  };

  // ====================================
  // SELLERS
  // ====================================

  const fetchSellers = async () => {
    try {
      const response = await API.get("/users/sellers");

      setSellers(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeliveryMen = async () => {
    try {
      const response = await API.get("/users/delivery-men");

      setDeliveryMen(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ====================================
  // FETCH ORDERS
  // ====================================

  const fetchOrders = async (pageNumber = 1, loadMore = false) => {
    try {
      if (loading || loadingMore || (loadMore && !hasMore)) {
        return;
      }

      loadMore ? setLoadingMore(true) : setLoading(true);

      const response = await API.get("/orders", {
        params: {
          page: pageNumber,
          limit: 20,
          seller: selectedSeller || undefined,
          status: selectedStatus || undefined,
          deliveryBy: selectedDeliveryBy || undefined,
          date: selectedDate || undefined,
          search: search || undefined,
        },
      });

      const newOrders = response.data.orders || [];

      const pagination = response.data.pagination;

      if (loadMore) {
        setOrders((prev) => [
          ...prev,
          ...newOrders.filter((item) => !prev.some((x) => x._id === item._id)),
        ]);
      } else {
        setOrders(newOrders);
      }

      setHasMore(pagination?.hasMore || false);

      setPage(pageNumber);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);

      setLoadingMore(false);
    }
  };

  // ====================================
  // UPDATE STATUS
  // ====================================

  const updateOrderStatus = async (order, status, deliveryBy = "") => {
    try {
      const body = {
        status,
      };

      if (status === "delivered") {
        body.deliveryBy = deliveryBy;
      }

      if (status === "paid") {
        body.acknowledgeBy = user?.fullName || "";
      }

      await API.put(`/orders/${order._id}/status`, body);

      fetchOrders();

      setDeliveryModalVisible(false);

      setSelectedOrder(null);
    } catch (error) {
      alert(error?.response?.data?.message || "Update failed.");
    }
  };

  const openOrder = (order) => {
    setViewOrderDetailsModal(true);

    setViewOrder(order);
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>

          <h1>Orders</h1>
        </div>

        <button className="add-btn" onClick={() => navigate("/create-order")}>
          + New Order
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search Orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="filter-btn" onClick={() => setFiltersVisible(true)}>
          Filters
        </button>
      </div>

      {isMobile ? (
        <OrdersCardList
          user={user}
          orders={orders}
          loading={loading}
          onView={openOrder}
          onEdit={(order) => navigate(`/orders/${order._id}`)}
          onDeliver={(order) => {
            setSelectedOrder(order);

            setPendingStatus("delivered");

            setDeliveryModalVisible(true);
          }}
          onCancel={(order) => updateOrderStatus(order, "cancelled")}
          onPayment={(order) => updateOrderStatus(order, "paid")}
        />
      ) : (
        <OrdersTable
          user={user}
          orders={orders}
          loading={loading}
          onView={openOrder}
          onEdit={(order) => navigate(`/orders/${order._id}`)}
          onDeliver={(order) => {
            setSelectedOrder(order);

            setPendingStatus("delivered");

            setDeliveryModalVisible(true);
          }}
          onCancel={(order) => updateOrderStatus(order, "cancelled")}
          onPayment={(order) => updateOrderStatus(order, "paid")}
        />
      )}

      <OrderDetailsModal
        visible={viewOrderDetailsModal}
        order={viewOrder}
        onClose={() => setViewOrderDetailsModal(false)}
      />

      {hasMore && (
        <button
          className="load-more-btn"
          onClick={() => fetchOrders(page + 1, true)}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading..." : "Load More"}
        </button>
      )}

      <OrderFiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        sellers={sellers}
        deliveryMen={deliveryMen}
        selectedSeller={selectedSeller}
        setSelectedSeller={setSelectedSeller}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedDeliveryBy={selectedDeliveryBy}
        setSelectedDeliveryBy={setSelectedDeliveryBy}
      />

      <DeliveryModal
        visible={deliveryModalVisible}
        deliveryMen={deliveryMen}
        onClose={() => setDeliveryModalVisible(false)}
        order={selectedOrder}
        status={pendingStatus}
        onConfirm={(deliveryBy) =>
          updateOrderStatus(selectedOrder, pendingStatus, deliveryBy)
        }
      />
    </div>
  );
};

export default OrdersList;
