//React
import { useState, useEffect, useContext } from "react";

//Toaster
import { successTaost, errorToast } from "../../../helper/Toaster";

//Skeltons
import ActiveOrdersSkelton from "../../Skeltons/ActiveOrdersSkelton";

//Services

import {
  cancelTempMail,
  completeTempMail,
} from "../../../services/TempMail/TempMailService";

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

export default function ActiveOrders({
  activeMailsLoading,
  activeMails,
  onCancelTempEmail,
  OnTempEmailCancelFailure,
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
      var response = await cancelTempMail(id);

      var responseMessage = response.message;
      var responseData = response.data;

      if (response.isSuccess) {
        successTaost(responseMessage);
      } else {
        errorToast(responseMessage);
      }

      if (responseData.isCancelled) {
        onCancelTempEmail(id);
        balanceCredit(responseData.refundAmount);
      }

      if (responseData.hasSms) {
        OnTempEmailCancelFailure(responseData);
      }
    } catch {
      errorToast("Failed to mark temp mail as cancelled, please try later.");
    } finally {
      setCancel((prev) => prev.filter((id) => id !== id));
    }
  }

  async function handleComplete(id) {
    setComplete((prev) => [...prev, id]);

    try {
      var response = await completeTempMail(id);

      var responseMessage = response.message;

      if (response.isSuccess) {
        successTaost(responseMessage);
        onCancelTempEmail(id);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to mark temp mail as completed, please try later.");
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
            <div className="card-sub">Mails that are currently active</div>
          </div>
        </div>
        {activeMails.length > 0 ? (
          <span className="orders-badge">{activeMails.length}</span>
        ) : (
          ""
        )}
      </div>
      {}

      {activeMailsLoading ? (
        <ActiveOrdersSkelton />
      ) : (
        <>
          <div className="orders-list">
            {activeMails.map((order) => (
              <div className="order-row" key={order.activationId}>
                <div className="order-row-top">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="order-service">{order.service}</span>
                    <span className="order-service">-</span>
                    <span className="order-service">{order.domain}</span>
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

                <div className="order-number">{order.email}</div>

                <div className="order-expiry">
                  Expires in {GetRemainingTime(order)}
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
                        onClick={() => CopyToClipboard("Code", order.code)}
                      >
                        📋
                      </button>
                    </div>
                  </div>
                )}

                <div className="order-actions">
                  <Tooltip
                    tooltip="Copy mail"
                    btn={
                      <button
                        className="btn-action"
                        onClick={() => CopyToClipboard("Mail", order.email)}
                      >
                        📋
                      </button>
                    }
                  />

                  <Tooltip
                    tooltip={"Mark this mail as complete"}
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
                    tooltip={GetCancelTooltip()}
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
