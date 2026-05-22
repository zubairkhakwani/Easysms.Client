import { successTaost, errorToast } from "./Toaster";

export const CopyToClipboard = async (type, text) => {
  try {
    await navigator.clipboard.writeText(text);
    successTaost(`${type ? type : ""} copied successfully.`);
  } catch {
    errorToast(`Failed to copy ${type}`);
  }
};

export const copyAndDownloadTextFile = async (fileName, text, type = "") => {
  try {
    // 1. Copy to clipboard
    await navigator.clipboard.writeText(text);

    // 2. Create downloadable file
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName || "file"}.txt`;

    document.body.appendChild(link);
    link.click();

    // cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    successTaost(`${type ? type : "Text"} copied & downloaded successfully.`);
  } catch (error) {
    console.error(error);
    errorToast(`Failed to copy/download ${type || "text"}`);
  }
};

export const GetRemainingTime = (order, onExpired) => {
  if (!order.activationStartTime || !order.activationLimit) return "Invalid";
  const startTime = new Date(order.activationStartTime).getTime();
  if (isNaN(startTime)) return "Invalid date";

  const expiryTime = startTime + order.activationLimit * 60 * 1000;

  const remaining = expiryTime - Date.now();

  if (remaining <= 0) {
    if (onExpired) {
      onExpired(order.id);
    }
    return "Expired";
  }

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const GetCancelTooltip = (provider) => {
  const name = provider?.toLowerCase();

  if (name?.includes("provider a")) {
    return "You can cancel the number after 3 minutes";
  } else if (name?.includes("provider b")) {
    return "You can cancel the number";
  } else if (name?.includes("premium numbers"))
    return "You can cancel the number after 5 minutes";

  return "You can cancel the number after 3 minutes";
};

export const CanMakeCancelRequest = (order) => {
  let provider = order.provider?.toLowerCase();
  let isProviderB = provider?.includes("provider b");

  if (isProviderB) {
    return true;
  }

  let isProviderPremiumNumbers = provider?.includes("premium numbers");
  let time = 3;

  if (isProviderPremiumNumbers) {
    time = 5;
  }

  if (!order.activationStartTime) return false;

  const startTime = new Date(order.activationStartTime).getTime();
  if (isNaN(startTime)) return false;

  const now = Date.now();

  return now >= startTime + time * 60 * 1000;
};
