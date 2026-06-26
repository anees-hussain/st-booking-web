import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error(err);

      localStorage.clear();

      navigate("/login");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const renderModules = () => {
    if (!user) return null;

    switch (user.designation?.toLowerCase()) {
      case "controller":
        return (
          <>
            <MenuButton
              title="📦 View Orders"
              onClick={() => navigate("/orders")}
            />

            <MenuButton
              title="💰 Paid Orders Details"
              onClick={() => navigate("/orders/paidSummary")}
            />

            <MenuButton
              title="📊 Orders Summary"
              onClick={() => navigate("/orders/summary")}
            />

            <MenuButton
              title="📝 Order Sheet"
              onClick={() => navigate("/orders/ordersheet")}
            />

            <MenuButton
              title="📦 Product Management"
              onClick={() => navigate("/products")}
            />

            <MenuButton
              title="👥 User Management"
              onClick={() => navigate("/users")}
            />
          </>
        );

      case "manager":
        return (
          <>
            <MenuButton
              title="📦 View Orders"
              onClick={() => navigate("/orders")}
            />

            <MenuButton
              title="💰 Paid Orders Details"
              onClick={() => navigate("/orders/paidSummary")}
            />

            <MenuButton
              title="📊 Orders Summary"
              onClick={() => navigate("/orders/summary")}
            />

            <MenuButton
              title="📝 Order Sheet"
              onClick={() => navigate("/orders/ordersheet")}
            />

            <MenuButton
              title="📦 Product Management"
              onClick={() => navigate("/products")}
            />
          </>
        );

      case "seller":
        return (
          <>
            <MenuButton
              title="📦 View Orders"
              onClick={() => navigate("/orders")}
            />

            <MenuButton
              title="📊 Orders Summary"
              onClick={() => navigate("/orders/summary")}
            />

            <MenuButton
              title="📝 Order Sheet"
              onClick={() => navigate("/orders/ordersheet")}
            />
          </>
        );

      case "producer":
        return (
          <>
            <MenuButton
              title="📦 View Orders"
              onClick={() => navigate("/orders")}
            />

            <MenuButton
              title="📊 Orders Summary"
              onClick={() => navigate("/orders/summary")}
            />

            <MenuButton
              title="📝 Order Sheet"
              onClick={() => navigate("/orders/ordersheet")}
            />

            <MenuButton
              title="📦 Product Management"
              onClick={() => navigate("/products")}
            />
          </>
        );

      default:
        return <div className="no-permission">No permissions assigned.</div>;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h1>
          Welcome,
          <br />
          {user?.fullName}
        </h1>

        <p className="designation">{user?.designation}</p>

        <div className="menu-container">{renderModules()}</div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

function MenuButton({ title, onClick }) {
  return (
    <button className="menu-btn" onClick={onClick}>
      {title}
    </button>
  );
}

export default Dashboard;
