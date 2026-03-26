//React
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Toaster
import { ToastContainer } from "react-toastify";

//Layouts
import UserLayout from "./components/Layout/UserLayout.jsx";
import AdminLayout from "./components/Layout/AdminLayout.jsx";

//Components
import App from "./App.jsx";
import RequestNumberContainer from "./components/RequestNumber/Container/RequestNumberContainer.jsx";
import OrderHistory from "./components/User/OrderHistory.jsx";
import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import PrivateRoute from "./components/Route/PrivateRoute.jsx";
import TopUp from "./components/LandingPage/TopUp/TopUp.jsx";

//Admin Dashboard
import AdminDashobard from "./components/DashboardN/Admin/App/Dashboard.jsx";
import Overview from "./components/DashboardN/Admin/Overview/Overview.jsx";
import UserManagement from "./components/DashboardN/Admin/Management/User/UserManagement.jsx";
import AddPhysicalNumber from "./components/DashboardN/Admin/Management/Provider/AddPhysicalNumber.jsx";
import ProviderHistory from "./components/DashboardN/Admin/Provider/ProviderHistory.jsx";
import ActiveNumbers from "./components/DashboardN/Admin/Provider/ActiveNumbers.jsx";

//Context
import { AuthProvider } from "./context/AuthContext.jsx";
import { SmsProvider } from "./context/SmsContext.jsx";

//Css
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SmsProvider>
        <BrowserRouter>
          <Routes>
            {/* User Layout */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<App />} />

              <Route element={<PrivateRoute />}>
                <Route
                  path="/get-number"
                  element={<RequestNumberContainer />}
                />
                <Route path="/history" element={<OrderHistory />} />
              </Route>

              <Route path="/topup" element={<TopUp />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Admin Layout */}
            <Route element={<AdminLayout />}>
              <Route element={<PrivateRoute requireAdmin={true} />}>
                <Route path="admin-dashboard" element={<AdminDashobard />}>
                  <Route index element={<Overview />} />
                  <Route path="overview" element={<Overview />} />
                  <Route path="manage-user" element={<UserManagement />} />
                  <Route
                    path="physical-number"
                    element={<AddPhysicalNumber />}
                  />
                  <Route
                    path="provider-history"
                    element={<ProviderHistory />}
                  />
                  <Route path="active-numbers" element={<ActiveNumbers />} />
                </Route>
              </Route>
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </SmsProvider>
    </AuthProvider>
  </StrictMode>,
);
