const SECTION_HEADERS = new Set([
  "CUSTOMER DETAILS",
  "INQUIRY DETAILS",
  "REQUEST DETAILS",
  "CUSTOMER MESSAGE",
  "WHAT YOU SHOULD DO",
]);

const DETAILS_LABELS = {
  "CUSTOMER DETAILS": "Customer details",
  "INQUIRY DETAILS": "Inquiry details",
  "REQUEST DETAILS": "Request details",
};

function parseKeyValue(line) {
  const idx = line.indexOf(":");
  if (idx === -1) return { label: line, value: "" };
  return {
    label: line.slice(0, idx).trim(),
    value: line.slice(idx + 1).trim(),
  };
}

export function parseTaskDescription(description = "") {
  const lines = description.split("\n").map((l) => l.trim());

  const summary = [];
  const steps = [];
  let currentSection = null;
  const sectionLines = {};

  for (const line of lines) {
    if (!line) continue;

    if (SECTION_HEADERS.has(line)) {
      currentSection = line;
      sectionLines[currentSection] = [];
      continue;
    }

    if (!currentSection) {
      summary.push(line);
      continue;
    }

    if (currentSection === "WHAT YOU SHOULD DO") {
      const stepMatch = line.match(/^(\d+)\.\s*(.+)$/);
      if (stepMatch) {
        steps.push(stepMatch[2]);
      } else if (steps.length > 0) {
        steps[steps.length - 1] += ` ${line}`;
      }
    } else {
      sectionLines[currentSection].push(line);
    }
  }

  const detailsKey =
    sectionLines["CUSTOMER DETAILS"]
      ? "CUSTOMER DETAILS"
      : sectionLines["INQUIRY DETAILS"]
        ? "INQUIRY DETAILS"
        : sectionLines["REQUEST DETAILS"]
          ? "REQUEST DETAILS"
          : null;

  const details = detailsKey
    ? sectionLines[detailsKey].map(parseKeyValue)
    : [];
  const message = (sectionLines["CUSTOMER MESSAGE"] || []).join("\n");

  const isStructured =
    summary.length > 0 || details.length > 0 || message || steps.length > 0;

  return {
    isStructured,
    summary: summary.join(" "),
    detailsLabel: detailsKey ? DETAILS_LABELS[detailsKey] : "",
    details,
    message,
    steps,
  };
}
