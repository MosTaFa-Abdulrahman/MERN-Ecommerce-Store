import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// PrivateRoute
import PrivateRoute from "./components/PrivateRoute";
// Admin Routes
import AdminRoute from "./pages/admin/AdminRoute";
import UserList from "./pages/admin/UserList";
import CategoryList from "./pages/admin/CategoryList";
import ProductList from "./pages/admin/ProductList";
import ProductFunc from "./pages/admin/ProductFunc";
import AllProducts from "./pages/admin/AllProducts";
import OrderList from "./pages/admin/OrderList";
import AdminDashboard from "./pages/admin/AdminDashboard";
// Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/user/Profile";
import ProductDetails from "./pages/products/ProductDetails";
import Favorites from "./pages/products/Favorites";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Shipping from "./pages/orders/Shipping";
import PlaceOrder from "./pages/orders/PlaceOrder";
import Order from "./pages/orders/Order";
import UserOrder from "./pages/orders/UserOrder";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/user-orders" element={<UserOrder />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categoryList" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductFunc />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="orderList" element={<OrderList />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PayPalScriptProvider>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
  // </React.StrictMode>
);
