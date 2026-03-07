import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import RequestNumberContainer from "./components/RequestNumber/Container/RequestNumberContainer.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import UserManagement from "./components/User/UserManagement.jsx";
import PurchasedNumberHistory from "./components/Navbar/PurchasedNumberHistory.jsx";
import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import PrivateRoute from "./components/Route/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SmsProvider } from "./context/SmsContext.jsx";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SmsProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route element={<PrivateRoute />}>
              <Route path="/get-number" element={<RequestNumberContainer />} />
            </Route>
            <Route element={<PrivateRoute requireAdmin={true} />}>
              <Route path="/manage-users" element={<UserManagement />} />
            </Route>

            <Route path="/history" element={<PurchasedNumberHistory />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </SmsProvider>
    </AuthProvider>
  </StrictMode>,
);
