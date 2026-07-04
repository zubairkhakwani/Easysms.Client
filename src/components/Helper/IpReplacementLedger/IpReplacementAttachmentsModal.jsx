import { useEffect, useState } from "react";

import { getIpReplacementAttachment } from "../../../services/Proxy/ProxyService";
import "./IpReplacementAttachmentsModal.css";

function isVideo(contentType) {
  return (contentType ?? "").startsWith("video/");
}

export function IpReplacementAttachmentsModal({ row, onClose }) {
  const attachments = row?.attachments ?? [];
  const [items, setItems] = useState({});

  useEffect(() => {
    let cancelled = false;
    const createdUrls = [];
    const files = row?.attachments ?? [];

    files.forEach(async (file, idx) => {
      setItems((prev) => ({ ...prev, [idx]: { status: "loading", objectUrl: null } }));
      try {
        const blob = await getIpReplacementAttachment(file.url);
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(blob);
        createdUrls.push(objectUrl);
        setItems((prev) => ({ ...prev, [idx]: { status: "ready", objectUrl } }));
      } catch {
        if (cancelled) return;
        setItems((prev) => ({ ...prev, [idx]: { status: "error", objectUrl: null } }));
      }
    });

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [row]);

  return (
    <div className="ira-overlay" onClick={onClose}>
      <div className="ira-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ira-header">
          <span>
            Attachments — Proxy #{row.proxyId}
            <span className="ira-count">({attachments.length})</span>
          </span>
          <button
            type="button"
            className="ira-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="ira-grid">
          {attachments.map((file, idx) => {
            const state = items[idx] ?? { status: "loading", objectUrl: null };
            const ready = state.status === "ready";

            return (
              <div key={`${file.url}-${idx}`} className="ira-item">
                <div className="ira-preview-link">
                  {ready ? (
                    isVideo(file.contentType) ? (
                      <video
                        src={state.objectUrl}
                        className="ira-preview"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={state.objectUrl}
                        alt={file.fileName}
                        className="ira-preview"
                      />
                    )
                  ) : (
                    <div
                      className={`ira-placeholder${
                        state.status === "error" ? " ira-placeholder--error" : ""
                      }`}
                    >
                      {state.status === "error" ? "Failed to load" : "Loading…"}
                    </div>
                  )}
                </div>
                <div className="ira-meta">
                  <span className="ira-filename" title={file.fileName}>
                    {file.fileName}
                  </span>
                  {ready ? (
                    <a
                      href={state.objectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ira-open"
                    >
                      Open ↗
                    </a>
                  ) : (
                    <span className="ira-open ira-open--disabled">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
