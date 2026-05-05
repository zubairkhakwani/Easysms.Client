//React
import { useState } from "react";

//Static Data
import { modalKeys } from "../../../../data/Static";

export default function UpsertPlatformModal({
  unSavedData,
  onClose,
  onConfigure,
  onUpsertPlatform,
  isUpserting,
}) {
  const [name, setName] = useState(unSavedData.name);
  const [logoUrl, setLogoUrl] = useState(unSavedData.logoUrl);
  const [description, setDescription] = useState(unSavedData.description);
  return (
    <div className="um-overlay">
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="um-close-btn"
          onClick={() => onClose(modalKeys.upsertPlatform)}
        >
          ✕
        </button>
        <div className="um-modal-title">
          {unSavedData?.id ? "Edit" : "Add New"} Platform
        </div>

        <div className="um-form-group">
          <label className="um-label">
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="um-input"
            type="text"
            placeholder="e.g. Facebook, Instagram..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="um-form-group">
          <label className="um-label">
            Logo Url <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="um-input"
            type="text"
            placeholder="e.g. https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        <div className="um-form-group">
          <label className="um-label">
            Description{" "}
            <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            className="um-input"
            placeholder="Short description of this platform..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>

        <div className="um-modal-actions">
          <button
            className="um-btn ghost"
            onClick={() => onClose(modalKeys.upsertPlatform)}
          >
            Cancel
          </button>
          <button
            className={`um-btn primary`}
            disabled={!name.trim() || !logoUrl.trim()}
            onClick={() =>
              onUpsertPlatform(null, {
                id: unSavedData.id,
                name: name.trim(),
                description: description.trim(),
                logoUrl: logoUrl.trim(),
                configuration: "",
              })
            }
          >
            {isUpserting ? (
              <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
            ) : (
              <span>{unSavedData.id ? "Update" : "Save"}</span>
            )}
          </button>

          <button
            className={`um-btn primary`}
            disabled={!name.trim() || !logoUrl.trim()}
            onClick={() =>
              onConfigure(
                {
                  id: unSavedData.id,
                  name: name.trim(),
                  description: description.trim(),
                  logoUrl: logoUrl.trim(),
                  configuration: unSavedData.configuration,
                },
                modalKeys.platformConfiguration,
              )
            }
          >
            <span>Configure</span>
          </button>
        </div>
      </div>
    </div>
  );
}
