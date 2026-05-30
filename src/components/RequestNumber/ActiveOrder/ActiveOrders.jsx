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

import {
  CopyToClipboard,
  GetRemainingTime,
  CanMakeCancelRequest,
  GetCancelTooltip,
} from "../../../helper/UtilityHelper";

//Tooltip
import Tooltip from "../../../portal/Tooltip";

//Css
import "./ActiveOrders.css";

export default function ActiveOrders({
  ordersLoading,
  incomingOrders,
  onCancelNumber,
  OnNumberCancelFailure,
  OnTempNumberExpiration,
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

  async function handleCancel(id) {
    setCancel((prev) => [...prev, id]);

    try {
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
    } catch {
      errorToast("Failed to cancel the number, please try later.");
    } finally {
      setCancel((prev) => prev.filter((id) => id !== id));
    }
  }

  async function handleComplete(id) {
    setComplete((prev) => [...prev, id]);

    try {
      var response = await completeNumber(id);

      var responseMessage = response.message;

      if (response.isSuccess) {
        successTaost(responseMessage);

        onCancelNumber(id);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to complete number, please try later.");
    } finally {
      setComplete((prev) => prev.filter((id) => id !== id));
    }
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

      {ordersLoading ? (
        <ActiveOrdersSkelton />
      ) : (
        <>
          <div className="orders-list">
            {incomingOrders.length > 0 && (
              <div className="orders-list-notice">
                <span className="orders-list-notice-dot"></span>
                Please wait at least 5 minutes as some services take time to
                deliver the OTP.
              </div>
            )}
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
                  Expires in {GetRemainingTime(order, OnTempNumberExpiration)}
                </div>

                {/* SMS Block ( hidden until sms arrives) */}
                {order.hasSms ? (
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
                        onClick={() => CopyToClipboard("Code", order.code)}
                      >
                        📋
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="sms-waiting">
                    <span className="sms-waiting-dot"></span>
                    Your OTP will appear here once received
                  </div>
                )}

                <div className="order-actions">
                  <Tooltip
                    tooltip="Copy number"
                    btn={
                      <button
                        className="btn-action"
                        onClick={() =>
                          CopyToClipboard("Number", order.phoneNumber)
                        }
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
                    tooltip={GetCancelTooltip(order.provider)}
                    btn={
                      <button
                        disabled={
                          !CanMakeCancelRequest(order) ||
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
