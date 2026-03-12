//React
import { useState, useEffect, useContext } from "react";

//Toaster
import { toast, Slide } from "react-toastify";

//Services
import {
  cancelNumber,
  completeNumber,
} from "../../../services/Number/NumberService";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";

//Css
import "./ActiveOrders.css";

const InfoIcon = ({ tooltip, btn }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="info-icon-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {btn ? (
        btn
      ) : (
        <svg
          className="info-icon"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10 9v5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      )}

      {visible && (
        <span className="tooltip">
          <span className="tooltip-arrow" />
          {tooltip}
        </span>
      )}
    </span>
  );
};
export default function ActiveOrders({ incomingOrders, onCancelNumber }) {
  const { balanceCredit } = useContext(AuthContext);
  const [copied, setCopied] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [cancel, setCancel] = useState([]);
  const [complete, setComplete] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function handleCopy(activationId, number) {
    navigator.clipboard.writeText(number).catch(() => {});
    setCopied(activationId);
    setTimeout(() => setCopied(null), 500);
  }

  async function handleCancel(activationId) {
    setCancel((prev) => [...prev, activationId]);

    var response = await cancelNumber(activationId);

    var responseMessage = response.message;

    if (response.isSuccess) {
      toast(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      onCancelNumber(activationId);
      balanceCredit(response.data.refundAmount);
    } else {
      toast.error(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }

    setCancel((prev) => prev.filter((id) => id !== activationId));
  }

  async function handleComplete(activationId) {
    setComplete((prev) => [...prev, activationId]);

    var response = await completeNumber(activationId);

    var responseMessage = response.message;

    if (response.isSuccess) {
      toast(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      onCancelNumber(activationId);
    } else {
      toast.error(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }

    setComplete((prev) => prev.filter((id) => id !== activationId));
  }

  function getRemainingTime(order) {
    if (!order.activationStartTime || !order.activationLimit) return "Invalid";

    const startTime = new Date(order.activationStartTime).getTime();
    if (isNaN(startTime)) return "Invalid date";

    const expiryTime = startTime + order.activationLimit * 60 * 1000;
    const remaining = expiryTime - Date.now();

    if (remaining <= 0) return "Expired";

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function canMakeCancelRequest(order) {
    if (!order.activationStartTime) return false;

    const startTime = new Date(order.activationStartTime).getTime();
    if (isNaN(startTime)) return false;

    const now = Date.now();

    return now >= startTime + 2 * 60 * 1000;
  }

  return (
    <div className="recent-card">
      <div className="card-header">
        <div className="orders-top">
          <span className="card-icon">🕐</span>
          <div>
            <div className="card-title">Active Orders</div>
            <div className="card-sub">
              Numbers that are currently active — excluding completed and
              cancelled orders.
            </div>
          </div>
        </div>
        {incomingOrders.length > 0 ? (
          <span className="orders-badge">{incomingOrders.length}</span>
        ) : (
          ""
        )}
      </div>

      <div className="orders-list">
        {incomingOrders.map((order) => (
          <div className="order-row" key={order.activationId}>
            <div className="order-row-top">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span className="order-service">{order.provider}</span>
                <span className="order-service">-</span>
                <span className="order-service">{order.service}</span>
                <span className="order-service">-</span>
                <span className="order-country">{order.country}</span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
                    className="sms-copy-btn"
                    title="Copy code"
                    onClick={() =>
                      navigator.clipboard.writeText(order.sms.code)
                    }
                  >
                    📋
                  </button>
                </div>
              </div>
            )}

            <div className="order-actions">
              <InfoIcon
                tooltip={"Copy number"}
                btn={
                  <button
                    className="btn-action"
                    onClick={() =>
                      handleCopy(order.activationId, order.phoneNumber)
                    }
                  >
                    {copied == order.activationId ? "Copying" : "📋"}
                  </button>
                }
              />

              <InfoIcon
                tooltip={"Mark this number as complete"}
                btn={
                  <button
                    disabled={complete.includes(order.activationId)}
                    className="btn-action"
                    onClick={() => handleComplete(order.activationId)}
                  >
                    ✓
                  </button>
                }
              />
              <InfoIcon
                tooltip={"You can cancel the number after 2 minutes"}
                btn={
                  <button
                    disabled={
                      !canMakeCancelRequest(order) ||
                      cancel.includes(order.activationId)
                    }
                    className="btn-action btn-cancel"
                    onClick={() => handleCancel(order.activationId)}
                  >
                    ✕
                  </button>
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
