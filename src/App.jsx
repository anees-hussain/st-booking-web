import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserManagement from "./pages/UserManagement/UserManagement";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import OrderSheet from "./pages/OrderSheet/OrderSheet";
import OrderSummary from "./pages/OrderSummary/OrderSummary";
import PaidOrderDetails from "./pages/PaidOrderDetails/PaidOrderDetails";
import OrdersList from "./pages/OrdersList/OrdersList";
import CreateOrder from "./pages/CreateOrder/CreateOrder";
import OrderDetails from "./pages/OrderDetails/OrderDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/orders/ordersheet" element={<OrderSheet />} />
      <Route path="/orders/summary" element={<OrderSummary />} />
      <Route path="/orders/paidSummary" element={<PaidOrderDetails />} />
      <Route path="/orders" element={<OrdersList />} />
      <Route path="/create-order" element={<CreateOrder />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
    </Routes>
  );
}

export default App;
