//React
import { useState, useContext } from "react";

//Toaster
import { toast, Slide } from "react-toastify";

//Services
import { cancel, complete } from "../../../services/Number/NumberService";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper";

//Css
import "./ActiveOrders.css";

export default function ActiveOrders({ incomingOrders, onCancelNumber }) {
  const { balanceCredit } = useContext(AuthContext);
  const [copied, setCopied] = useState(null);

  function handleCopy(activationId, number) {
    navigator.clipboard.writeText(number).catch(() => {});
    setCopied(activationId);
    setTimeout(() => setCopied(null), 500);
  }

  async function handleCancel(activationId) {
    var response = await cancel(activationId);

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
  }

  async function handleComplete(activationId) {
    var response = await complete(activationId);

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
  }

  function startTimer(){
    
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
              Expires in ~{order.activationTime} min
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
              <button
                className="btn-action"
                onClick={() =>
                  handleCopy(order.activationId, order.phoneNumber)
                }
              >
                {copied != order.activationId ? "📋 Copy" : "Copying"}
              </button>

              <button
                className="btn-action"
                onClick={() => handleComplete(order.activationId)}
              >
                ✓ Complete
              </button>

              <button
                className="btn-action btn-cancel"
                onClick={() => handleCancel(order.activationId)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
