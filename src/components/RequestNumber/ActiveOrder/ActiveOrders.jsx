//React
import { useState, useEffect, useContext } from "react";

//Toaster
import { successTaost, errorToast } from "../../../helper/Toaster";

//Skeltons
import ActiveOrdersSkelton from "../../Skeltons/ActiveOrdersSkelton";

//Services
import {
  cancelNumber,
  completeNumber,
} from "../../../services/Number/NumberService";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";

//Tooltip
import Tooltip from "../../../portal/Tooltip";

//Css
import "./ActiveOrders.css";

export default function ActiveOrders({
  ordersLoading,
  incomingOrders,
  onCancelNumber,
  OnNumberCancelFailure,
}) {
  const { balanceCredit } = useContext(AuthContext);
  const [now, setNow] = useState(Date.now());
  const [cancel, setCancel] = useState([]);
  const [complete, setComplete] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function handleCopy(text, type) {
    navigator.clipboard.writeText(text).catch(() => {});
    successTaost(`${type} copied successfully`);
  }

  async function handleCancel(id) {
    setCancel((prev) => [...prev, id]);

    var response = await cancelNumber(id);

    var responseMessage = response.message;
    var responseData = response.data;

    if (response.isSuccess) {
      successTaost(responseMessage);
    } else {
      errorToast(responseMessage);
    }

    if (responseData.isCancelled) {
      onCancelNumber(id);
      balanceCredit(responseData.refundAmount);
    }

    if (responseData.hasSms) {
      OnNumberCancelFailure(responseData);
    }

    setCancel((prev) => prev.filter((id) => id !== id));
  }

  async function handleComplete(id) {
    setComplete((prev) => [...prev, id]);

    var response = await completeNumber(id);

    var responseMessage = response.message;

    if (response.isSuccess) {
      successTaost(responseMessage);

      onCancelNumber(id);
    } else {
      errorToast(responseMessage);
    }

    setComplete((prev) => prev.filter((id) => id !== id));
  }

  function getRemainingTime(order) {
    if (!order.activationStartTime || !order.activationLimit) return "Invalid";

    const startTime = new Date(order.activationStartTime).getTime();
    if (isNaN(startTime)) return "Invalid date";

    const expiryTime = startTime + order.activationLimit * 60 * 1000;

    const remaining = expiryTime - Date.now();

    if (remaining <= 0) {
      return "Expired";
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function getCancelTooltip(provider) {
    const name = provider.toLowerCase();

    if (name.includes("provider b")) {
      return "You can cancel the number";
    }
    if (name.includes("provider a")) {
      return "You can cancel the number after 2 minutes";
    }

    return "You can cancel the number after 5 minutes";
  }

  function canMakeCancelRequest(order) {
    let isProviderB = order.provider?.toLowerCase().includes("provider b");

    if (isProviderB) {
      return true;
    }

    let time = order.provider?.toLowerCase().includes("provider a") ? 2 : 5;

    if (!order.activationStartTime) return false;

    const startTime = new Date(order.activationStartTime).getTime();
    if (isNaN(startTime)) return false;

    const now = Date.now();

    return now >= startTime + time * 60 * 1000;
  }

  return (
    <div className="recent-card">
      <div className="card-header">
        <div className="orders-top">
          <span className="card-icon">
            <i className="fa-solid fa-clock number-type-icon"></i>
          </span>
          <div>
            <div className="card-title">Active Orders</div>
            <div className="card-sub">Numbers that are currently active</div>
          </div>
        </div>
        {incomingOrders.length > 0 ? (
          <span className="orders-badge">{incomingOrders.length}</span>
        ) : (
          ""
        )}
      </div>
      {}

      {!ordersLoading ? (
        <ActiveOrdersSkelton />
      ) : (
        <>
          <div className="orders-list">
            {incomingOrders.map((order) => (
              <div className="order-row" key={order.activationId}>
                <div className="order-row-top">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="order-service">{order.provider}</span>
                    <span className="order-service">-</span>
                    <span className="order-service">{order.service}</span>
                    <span className="order-service">-</span>
                    <span className="order-country">{order.country}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="order-price">
                      {FormatterHelper.formatCurrency(order.activationCost)}
                    </span>
                  </div>
                </div>

                <div className="order-number">
                  {FormatterHelper.formatPhoneNumber(order.phoneNumber)}
                </div>

                <div className="order-expiry">
                  Expires in {getRemainingTime(order)}
                </div>

                {/* SMS Block ( hidden until sms arrives) */}
                {order.hasSms && (
                  <div className="sms-block">
                    <div className="sms-label">
                      <span className="sms-label-dot"></span>
                      SMS Received
                    </div>

                    <div className="sms-body">{order.text}</div>

                    <div className="sms-code">
                      <span className="sms-code-label">Code</span>
                      <span className="sms-code-value">{order.code}</span>

                      <button
                        style={{ cursor: "pointer" }}
                        title="Copy code"
                        onClick={() => handleCopy(order.code, "Code")}
                      >
                        📋
                      </button>
                    </div>
                  </div>
                )}

                <div className="order-actions">
                  <Tooltip
                    tooltip="Copy number"
                    btn={
                      <button
                        className="btn-action"
                        onClick={() => handleCopy(order.phoneNumber, "Number")}
                      >
                        📋
                      </button>
                    }
                  />

                  <Tooltip
                    tooltip={"Mark this number as complete"}
                    btn={
                      <button
                        disabled={complete.includes(order.id)}
                        className="btn-action"
                        onClick={() => handleComplete(order.id)}
                      >
                        ✓
                      </button>
                    }
                  />

                  <Tooltip
                    tooltip={getCancelTooltip(order.provider)}
                    btn={
                      <button
                        disabled={
                          !canMakeCancelRequest(order) ||
                          cancel.includes(order.id)
                        }
                        className="btn-action btn-cancel"
                        onClick={() => handleCancel(order.id)}
                      >
                        ✕
                      </button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
