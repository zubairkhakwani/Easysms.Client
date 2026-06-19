import Tooltip from "../../../portal/Tooltip";
import { CopyToClipboard } from "../../../helper/UtilityHelper";

export function CopyableCell({ label, value, mono = false, secret = false }) {
  const text = value != null && value !== "" ? String(value) : "";

  if (!text) {
    return <span className="map__empty">—</span>;
  }

  return (
    <span className="map__cell-copy">
      <span
        className={[
          mono && "map__cell-copy-val--mono",
          secret && "map__cell-copy-val--secret",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {text}
      </span>
      <Tooltip
        tooltip={`Copy ${label}`}
        btn={
          <button
            type="button"
            className="map__copy-btn"
            onClick={(e) => {
              e.stopPropagation();
              CopyToClipboard(label, text);
            }}
          >
            📋
          </button>
        }
      />
    </span>
  );
}
