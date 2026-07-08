import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownPortal } from "../../../portal/DropDownPortal";
import { TaskStatus } from "../../../data/Admin/Task";

export function TaskActionDropdown({
  task,
  isAdmin,
  canUpdateTaskStatus = true,
  onStart,
  onComplete,
  onCancel,
  onReopen,
  onViewInstructions,
  isUpdating,
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const navigate = useNavigate();
  const status = task.status;
  const hasContactView = task.referenceType === "ContactUs";
  const hasIpLedgerView = task.referenceType === "ProxyIpReplacement";
  const hasUserView = task.referenceType === "UserRegistration";

  const items = [];

  if (onViewInstructions) {
    items.push({
      key: "view-instructions",
      label: "View instructions",
      color: "cyan",
      action: () => onViewInstructions(task),
    });
  }

  if (canUpdateTaskStatus) {
    if (status === "Pending") {
      items.push({
        key: "start",
        label: "Start",
        color: "cyan",
        action: () => onStart(task.id, TaskStatus.InProgress),
      });
      items.push({
        key: "cancel",
        label: "Cancel",
        color: "danger",
        action: () => onCancel(task.id, TaskStatus.Cancelled),
      });
    }

    if (status === "In Progress") {
      items.push({
        key: "complete",
        label: "Complete",
        color: "green",
        action: () => onComplete(task.id, TaskStatus.Completed),
      });
      items.push({
        key: "cancel",
        label: "Cancel",
        color: "danger",
        action: () => onCancel(task.id, TaskStatus.Cancelled),
      });
    }

    if (isAdmin && (status === "Completed" || status === "Cancelled")) {
      items.push({
        key: "reopen",
        label: "Reopen",
        color: "cyan",
        action: () => onReopen(task.id, TaskStatus.Pending),
      });
    }
  }

  if (hasContactView) {
    items.push({
      key: "view-contact",
      label: "View contact",
      color: "cyan",
      action: () => navigate("/admin-dashboard/contact-us"),
    });
  }

  if (hasIpLedgerView) {
    items.push({
      key: "view-ledger",
      label: "View IP ledger",
      color: "cyan",
      action: () => navigate("/admin-dashboard/ip-replacement-ledger"),
    });
  }

  if (hasUserView) {
    items.push({
      key: "view-customer",
      label: "View customer",
      color: "cyan",
      action: () => navigate("/admin-dashboard/manage-user"),
    });
  }

  if (items.length === 0) {
    return "—";
  }

  return (
    <DropdownPortal
      open={open}
      onClose={close}
      trigger={
        <button
          type="button"
          className="um-action-btn"
          disabled={isUpdating}
          onClick={() => setOpen((v) => !v)}
        >
          {isUpdating ? "Updating…" : "Actions"}{" "}
          <span className="um-action-down-arrow">▾</span>
        </button>
      }
    >
      <div className="um-dropdown">
        {items.map((item) => (
          <div
            key={item.key}
            className={`um-drop-item ${item.color}`}
            onClick={() => {
              if (isUpdating) return;
              close();
              item.action();
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </DropdownPortal>
  );
}
