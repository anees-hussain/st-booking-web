import "./OrderFiltersModal.css";

const OrderFiltersModal = ({
  visible,
  onClose,

  sellers,
  deliveryMen,

  selectedSeller,
  setSelectedSeller,

  selectedStatus,
  setSelectedStatus,

  selectedDeliveryBy,
  setSelectedDeliveryBy,

  selectedDate,
  setSelectedDate,
}) => {
  if (!visible) return null;

  const deliveryPersons = deliveryMen.map((man) => man.fullName);

  const clearFilters = () => {
    setSelectedSeller("");
    setSelectedStatus("");
    setSelectedDeliveryBy("");
    setSelectedDate("");
  };

  return (
    <div className="filter-overlay">
      <div className="filter-modal">
        <div className="filter-header">
          <h2>Filters</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* SELLER */}

        <div className="filter-group">
          <label>Seller</label>

          <select
            value={selectedSeller}
            onChange={(e) => setSelectedSeller(e.target.value)}
          >
            <option value="">All Sellers</option>

            {sellers.map((seller) => (
              <option key={seller._id} value={seller.fullName}>
                {seller.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}

        <div className="filter-group">
          <label>Status</label>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>

            <option value="submitted">Submitted</option>

            <option value="delivered">Delivered</option>

            <option value="paid">Paid</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* DELIVERY */}

        <div className="filter-group">
          <label>Delivery By</label>

          <select
            value={selectedDeliveryBy}
            onChange={(e) => setSelectedDeliveryBy(e.target.value)}
          >
            <option value="">All Delivery Persons</option>

            {deliveryPersons.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}

        <div className="filter-group">
          <label>Date</label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* ACTIONS */}

        <div className="filter-actions">
          <button className="clear-btn" onClick={clearFilters}>
            Clear
          </button>

          <button className="apply-btn" onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFiltersModal;
