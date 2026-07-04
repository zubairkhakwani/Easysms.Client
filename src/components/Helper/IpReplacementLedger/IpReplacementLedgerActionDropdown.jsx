import { useState, useCallback } from "react";
import { DropdownPortal } from "../../../portal/DropDownPortal";
import { FormatterHelper } from "../../../helper/FormatterHelper";

const SUPPORT_EMAIL = "support@proxy-seller.com";
const GMAIL_COMPOSE_BASE = "https://mail.google.com/mail/";
const MAX_EMAIL_URL_LENGTH = 1900;

function canSendSupportMail(status) {
  const normalized = (status ?? "").toLowerCase();
  return normalized === "pending" || normalized === "failed";
}

function buildEmailBody(row, commentOverride) {
  const comment = commentOverride ?? row.comment;

  return [
    "Hello,",
    "",
    "We submitted a request to change the IP for the following proxy:",
    "",
    `Request Date: ${FormatterHelper.formatDateToLocal(row.createdAt)}`,
    `Proxy ID: ${row.proxyId}`,
    `Order ID: ${row.providerOrderId}`,
    `Current IP: ${row.oldIp}`,
    `New IP: ${row.newIp || "Not changed yet"}`,
    `Proxy Type: ${row.proxyType}`,
    `Issue Type: ${row.issueType}`,
    `Elapsed Since Request: ${FormatterHelper.formatElapsedSince(row.createdAt)}`,
    comment ? `User Comment: ${comment}` : null,
    "",
    "Please help us investigate what the issue is and why our IP has not been changed.",
    "",
    "Thank you.",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildEmailContent(row) {
  const subject = `IP Replacement Request - Proxy #${row.proxyId}`;
  let body = buildEmailBody(row);

  const fits = (url) => url.length <= MAX_EMAIL_URL_LENGTH;

  if (fits(buildGmailComposeUrl(subject, body))) {
    return { subject, body };
  }

  if (row.comment) {
    const commentBudget = Math.max(
      40,
      MAX_EMAIL_URL_LENGTH - buildGmailComposeUrl(subject, buildEmailBody(row, "")).length - 20,
    );
    const truncatedComment =
      row.comment.length > commentBudget
        ? `${row.comment.slice(0, commentBudget)}... (truncated)`
        : row.comment;
    body = buildEmailBody(row, truncatedComment);

    if (fits(buildGmailComposeUrl(subject, body))) {
      return { subject, body };
    }
  }

  body = `${body.slice(0, Math.max(200, MAX_EMAIL_URL_LENGTH - 120))}\n\n... (truncated)`;
  return { subject, body };
}

function buildGmailComposeUrl(subject, body) {
  const params = [
    "view=cm",
    "fs=1",
    `to=${encodeURIComponent(SUPPORT_EMAIL)}`,
    `su=${encodeURIComponent(subject)}`,
    `body=${encodeURIComponent(body)}`,
  ];

  return `${GMAIL_COMPOSE_BASE}?${params.join("&")}`;
}

export function buildProxySellerSupportEmailUrl(row) {
  const { subject, body } = buildEmailContent(row);
  return buildGmailComposeUrl(subject, body);
}

export function IpReplacementLedgerActionDropdown({
  row,
  onViewJson,
  onViewAttachments,
  onToggleResolution,
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const showSendMail = canSendSupportMail(row.status);
  const showAttachments = (row.attachments?.length ?? 0) > 0;
  const isResolved = (row.resolutionStatus ?? "").toLowerCase() === "resolved";
  const gmailUrl = showSendMail ? buildProxySellerSupportEmailUrl(row) : "";

  const handleViewJson = () => {
    close();
    onViewJson(row);
  };

  const handleViewAttachments = () => {
    close();
    onViewAttachments(row);
  };

  const handleToggleResolution = () => {
    close();
    onToggleResolution(row);
  };

  return (
    <DropdownPortal
      open={open}
      onClose={close}
      trigger={
        <button type="button" className="um-action-btn" onClick={() => setOpen((v) => !v)}>
          Actions <span style={{ opacity: 0.5 }}>▾</span>
        </button>
      }
    >
      <div className="um-dropdown">
        <div
          className="um-drop-item cyan"
          onClick={handleViewJson}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleViewJson();
            }
          }}
        >
          <span>
            <i className="fa-solid fa-code" />
          </span>{" "}
          View JSON
        </div>

        {showAttachments && (
          <div
            className="um-drop-item cyan"
            onClick={handleViewAttachments}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleViewAttachments();
              }
            }}
          >
            <span>
              <i className="fa-solid fa-paperclip" />
            </span>{" "}
            View Attachments
          </div>
        )}

        {showSendMail && (
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="um-drop-item orange"
            onClick={close}
          >
            <span>
              <i className="fa-solid fa-envelope" />
            </span>{" "}
            Send Mail
          </a>
        )}

        <div
          className="um-drop-item cyan"
          onClick={handleToggleResolution}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggleResolution();
            }
          }}
        >
          <span>
            <i className={`fa-solid ${isResolved ? "fa-clock" : "fa-check"}`} />
          </span>{" "}
          Mark as {isResolved ? "Unresolved" : "Resolved"}
        </div>
      </div>
    </DropdownPortal>
  );
}
