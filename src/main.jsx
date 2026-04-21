//React
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Toaster
import { ToastContainer } from "react-toastify";

import { Permissions } from "./data/Admin/Static.js";

//Layouts
import UserLayout from "./components/Layout/UserLayout.jsx";
import AdminLayout from "./components/Layout/AdminLayout.jsx";

//Components
import App from "./App.jsx";
import RequestNumberContainer from "./components/RequestNumber/Container/RequestNumberContainer.jsx";
import RequestAccount from "./components/RequestAccount/RequestAccount.jsx";
import NumberHistory from "./components/Order/NumberHistory.jsx";
import AccountHistory from "./components/Order/AccountHistory.jsx";
import Register from "./components/Auth/Register/Register.jsx";
import Login from "./components/Auth/Login/Login.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPasword.jsx";
import VerifyOtp from "./components/Auth/VerifyOtp/VerifyOtp.jsx";
import ResetPassword from "./components/Auth/ResetPassword/ResetPassword.jsx";
import PrivateRoute from "./components/Route/PrivateRoute.jsx";
import TopUp from "./components/LandingPage/TopUp/TopUp.jsx";
import NotFound from "./components/Shared/NotFound.jsx";

//Admin Dashboard
import AdminDashobard from "./components/Dashboard/Admin/App/Dashboard.jsx";
import Overview from "./components/Dashboard/Admin/Overview/Overview.jsx";
import UserManagement from "./components/Dashboard/Admin/Management/User/UserManagement.jsx";
import AddPhysicalNumber from "./components/Dashboard/Admin/Management/Provider/AddPhysicalNumber.jsx";
import ProviderHistory from "./components/Dashboard/Admin/Provider/ProviderHistory.jsx";
import ActiveNumbers from "./components/Dashboard/Admin/Provider/ActiveNumbers.jsx";
import Deposits from "./components/Dashboard/Admin/Management/Deposit/Deposits.jsx";
import ContactUs from "./components/Dashboard/Admin/Management/ContactUs/ContactUs.jsx";
import Platforms from "./components/Dashboard/Admin/Account/Platform/Platforms.jsx";
import Categories from "./components/Dashboard/Admin/Account/Category/Categories.jsx";
import AccountGroups from "./components/Dashboard/Admin/Account/AccountGroup/AccountGroups.jsx";

//Context
import { AuthProvider } from "./context/AuthContext.jsx";
import { SmsProvider } from "./context/SmsContext.jsx";
import { NumberProvider } from "./context/NumberContext.jsx";

//Css
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SmsProvider>
        <NumberProvider>
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
                  {/* <Route path="/get-account" element={<RequestAccount />} /> */}
                  <Route path="/history/number" element={<NumberHistory />} />
                  <Route path="/history/account" element={<AccountHistory />} />
                </Route>

                <Route path="/topup" element={<TopUp />} />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/forgot-password/verify-otp"
                  element={<VerifyOtp />}
                />
                <Route
                  path="/forgot-password/reset-password"
                  element={<ResetPassword />}
                />
              </Route>

              {/* Admin Layout */}
              <Route element={<PrivateRoute requireAuthorized={true} />}>
                <Route element={<AdminLayout />}>
                  <Route path="admin-dashboard" element={<AdminDashobard />}>
                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.ViewOverview]}
                        />
                      }
                    >
                      <Route path="overview" element={<Overview />} />
                    </Route>

                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.ViewContactUs]}
                        />
                      }
                    >
                      <Route path="contact-us" element={<ContactUs />} />
                    </Route>

                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.ViewUserDeposits]}
                        />
                      }
                    >
                      <Route path="deposits" element={<Deposits />} />
                    </Route>

                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.AddPhysicalNumbers]}
                        />
                      }
                    >
                      <Route
                        path="physical-number"
                        element={<AddPhysicalNumber />}
                      />
                    </Route>
                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.ViewUsers]}
                        />
                      }
                    >
                      <Route path="manage-user" element={<UserManagement />} />
                    </Route>

                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.ViewActiveNumbers]}
                        />
                      }
                    >
                      <Route
                        path="active-numbers"
                        element={<ActiveNumbers />}
                      />
                    </Route>

                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.ViewPatforms]}
                        />
                      }
                    >
                      <Route path="platforms" element={<Platforms />} />
                    </Route>

                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.CreateCategory]}
                        />
                      }
                    >
                      <Route path="categories" element={<Categories />} />
                    </Route>

                    <Route
                      element={
                        <PrivateRoute
                          requiredPermissions={[Permissions.ViewAccountGroups]}
                        />
                      }
                    >
                      <Route
                        path="account-groups"
                        element={<AccountGroups />}
                      />
                    </Route>

                    <Route
                      element={
                        <PrivateRoute
                          requiredPermission={[Permissions.ViewProviderHistory]}
                        />
                      }
                    >
                      <Route
                        path="provider-history"
                        element={<ProviderHistory />}
                      />
                    </Route>
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </NumberProvider>
      </SmsProvider>
    </AuthProvider>
  </StrictMode>,
);
