import { useEffect, useRef, useState } from "react";
import { proxyIssueTypes } from "../../../../data/Static";
import SearchableSelect from "../../../Shared/SearchableSelect/SearchableSelect";
import "./ProxyIpConfirm.css";

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"];
const ATTACHMENT_CALLOUT_MS = 4000;
const MIN_COMMENT_LENGTH = 15;

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name) {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx).toLowerCase() : "";
}

function isImageFile(file) {
  return (file.type ?? "").startsWith("image/");
}

export function ProxyIpConfirm({
  onClose,
  onConfirm,
  isSubmitting,
  attachmentGuideSignal = 0,
}) {
  const [issueType, setIssueType] = useState("");
  const [comment, setComment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [showAttachmentCallout, setShowAttachmentCallout] = useState(false);
  const [pulseDropzone, setPulseDropzone] = useState(false);
  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);
  const calloutTimerRef = useRef(null);
  const lastGuideSignalRef = useRef(0);

  const isCustom = issueType === "5";
  const canAddMore = attachments.length < MAX_FILES && !isSubmitting;

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (
      attachmentGuideSignal <= 0 ||
      attachmentGuideSignal === lastGuideSignalRef.current
    ) {
      return;
    }

    lastGuideSignalRef.current = attachmentGuideSignal;

    setShowAttachmentCallout(true);
    setPulseDropzone(true);

    requestAnimationFrame(() => {
      dropzoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      dropzoneRef.current?.focus();
    });

    if (calloutTimerRef.current) clearTimeout(calloutTimerRef.current);
    calloutTimerRef.current = setTimeout(() => {
      setShowAttachmentCallout(false);
    }, ATTACHMENT_CALLOUT_MS);

    return () => {
      if (calloutTimerRef.current) clearTimeout(calloutTimerRef.current);
    };
  }, [attachmentGuideSignal]);

  useEffect(() => {
    if (attachments.length > 0) {
      setShowAttachmentCallout(false);
      setPulseDropzone(false);
    }
  }, [attachments.length]);

  function dismissAttachmentGuide() {
    setShowAttachmentCallout(false);
    setPulseDropzone(false);
  }

  function validateFiles(files) {
    if (files.length > MAX_FILES) {
      return `You can attach up to ${MAX_FILES} files.`;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return "Each file must be 20 MB or smaller.";
      }

      const ext = getFileExtension(file.name);
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return "Only image and video files are allowed.";
      }

      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) {
        return "Only image and video files are allowed.";
      }
    }

    return null;
  }

  function addFiles(selected) {
    if (selected.length === 0) return;

    const merged = [...attachments, ...selected];
    const fileError = validateFiles(merged);

    if (fileError) {
      setErrors((prev) => ({ ...prev, attachments: fileError }));
      return;
    }

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setAttachments(merged);
    setPreviewUrls(merged.map((f) => URL.createObjectURL(f)));
    setErrors((prev) => ({ ...prev, attachments: undefined }));
    dismissAttachmentGuide();
  }

  function handleFilesSelected(e) {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    addFiles(selected);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (canAddMore) setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (!canAddMore) return;
    addFiles(Array.from(e.dataTransfer.files ?? []));
  }

  function openFilePicker() {
    if (canAddMore) {
      dismissAttachmentGuide();
      fileInputRef.current?.click();
    }
  }

  function removeFile(index) {
    URL.revokeObjectURL(previewUrls[index]);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({ ...prev, attachments: undefined }));
  }

  function validate() {
    const e = {};
    if (!issueType) e.issueType = "Please select an issue type.";

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      e.comment = "Please describe the issue.";
    } else if (trimmedComment.length < MIN_COMMENT_LENGTH) {
      e.comment = `Comment must be at least ${MIN_COMMENT_LENGTH} characters.`;
    }

    const fileError = validateFiles(attachments);
    if (fileError) e.attachments = fileError;

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirm() {
    if (!validate()) return;
    onConfirm?.({
      issueType,
      comment: comment.trim(),
      attachments,
    });
  }

  return (
    <div className="pim-overlay">
      <div className="pim-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pim-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="pim-header">
          <div className="pim-icon-wrap">🛠️</div>
          <div className="pim-title">Report an Issue</div>
          <div className="pim-sub">
            Select the issue you are facing with your proxy.
          </div>
        </div>

        <div className="pim-form">
          <div className="pim-field">
            <label className="pim-label">
              Issue Type <span className="required">*</span>
            </label>
            <div
              className={`pim-select-wrap ${errors.issueType ? "pim-input-error" : ""}`}
            >
              <SearchableSelect
                className="pim-select"
                value={issueType}
                onChange={(val) => {
                  setIssueType(val);
                  setErrors((prev) => ({ ...prev, issueType: undefined }));
                }}
                placeholder="Select an issue..."
                options={proxyIssueTypes.map((type) => ({
                  value: type.value,
                  label: type.label,
                }))}
              />
            </div>
            {errors.issueType && (
              <span className="pim-field-error">{errors.issueType}</span>
            )}
          </div>

          <div className="pim-field">
            <label className="pim-label">
              Comment <span className="required">*</span>
            </label>
            <div
              className={`pim-input-wrap ${errors.comment ? "pim-input-error" : ""}`}
            >
              <textarea
                className="pim-textarea"
                placeholder={
                  isCustom
                    ? "Please describe your custom issue..."
                    : "Please describe the issue in detail..."
                }
                value={comment}
                rows={3}
                onChange={(e) => {
                  setComment(e.target.value);
                  setErrors((prev) => ({ ...prev, comment: undefined }));
                }}
              />
            </div>
            {errors.comment && (
              <span className="pim-field-error">{errors.comment}</span>
            )}
          </div>

          <div className="pim-field pim-attachments-field">
            <div className="pim-attachments-header">
              <label className="pim-label">
                Attachments{" "}
                <span className="pim-label-optional">(optional)</span>
              </label>
              {attachments.length > 0 && (
                <span className="pim-attachments-count">
                  {attachments.length}/{MAX_FILES}
                </span>
              )}
            </div>

            {showAttachmentCallout && (
              <div className="pim-attachment-callout" role="status">
                <i className="fa-solid fa-circle-arrow-down pim-attachment-callout-icon" />
                <span>Add your proof here — drop files or click below</span>
              </div>
            )}

            <div
              ref={dropzoneRef}
              role="button"
              tabIndex={canAddMore ? 0 : -1}
              className={[
                "pim-dropzone",
                pulseDropzone && "pim-dropzone--nudge",
                isDragging && "pim-dropzone--drag",
                !canAddMore && "pim-dropzone--full",
                attachments.length >= MAX_FILES && "pim-dropzone--compact",
                errors.attachments && "pim-dropzone--error",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={openFilePicker}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && canAddMore) {
                  e.preventDefault();
                  openFilePicker();
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="pim-file-input-hidden"
                onChange={handleFilesSelected}
                disabled={!canAddMore}
                tabIndex={-1}
              />

              <div className="pim-dropzone-icon-wrap">
                <i className="fa-solid fa-cloud-arrow-up pim-dropzone-icon" />
              </div>
              <p className="pim-dropzone-title">
                {canAddMore
                  ? "Drop files here or click to browse"
                  : "Maximum files attached"}
              </p>
              <p className="pim-dropzone-hint">
                Screenshots & screen recordings help us fix issues faster
              </p>
              <div className="pim-dropzone-tags">
                <span>PNG</span>
                <span>JPG</span>
                <span>WEBP</span>
                <span>MP4</span>
                <span>· max 20 MB</span>
              </div>
            </div>

            {attachments.length > 0 && (
              <ul className="pim-file-list">
                {attachments.map((file, idx) => (
                  <li key={`${file.name}-${idx}`} className="pim-file-item">
                    <div className="pim-file-preview">
                      {isImageFile(file) ? (
                        <img src={previewUrls[idx]} alt="" />
                      ) : (
                        <>
                          <video src={previewUrls[idx]} muted preload="metadata" />
                          <span className="pim-file-play">
                            <i className="fa-solid fa-play" />
                          </span>
                        </>
                      )}
                    </div>
                    <div className="pim-file-info">
                      <span className="pim-file-name" title={file.name}>
                        {file.name}
                      </span>
                      <span className="pim-file-size">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="pim-file-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      disabled={isSubmitting}
                      aria-label={`Remove ${file.name}`}
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {errors.attachments && (
              <span className="pim-field-error">{errors.attachments}</span>
            )}
          </div>
        </div>

        <div className="pim-actions">
          <button className="pac-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="pac-btn-primary" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : (
              "Submit Issue →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
