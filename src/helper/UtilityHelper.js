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

  if (
    name?.includes("provider a") ||
    name?.includes("provider b") ||
    name?.includes("premium numbers")
  ) {
    return "You can cancel the number after 5 minutes";
  }

  return "You can cancel the number after 3 minutes";
};

export const CanMakeCancelRequest = (order) => {
  let provider = order.provider?.toLowerCase();

  let isProviderPremiumNumbers = provider?.includes("premium numbers");
  let time = 5;

  // if (isProviderPremiumNumbers) {
  //   time = 5;
  // }

  if (!order.activationStartTime) return false;

  const startTime = new Date(order.activationStartTime).getTime();
  if (isNaN(startTime)) return false;

  const now = Date.now();

  return now >= startTime + time * 60 * 1000;
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const VOLUME = 0.08;

// ✅ Code received — double beep + high confirm
export function playCodeReceivedSound() {
  const beeps = [
    { freq: 880, start: 0.0, duration: 0.12 },
    { freq: 880, start: 0.15, duration: 0.12 },
    { freq: 1320, start: 0.3, duration: 0.25 },
  ];
  playBeeps(beeps);
}

// 🛒 Number purchased — ascending happy chime
export function playNumberPurchasedSound() {
  const beeps = [
    { freq: 523, start: 0.0, duration: 0.12 }, // C
    { freq: 659, start: 0.13, duration: 0.12 }, // E
    { freq: 784, start: 0.26, duration: 0.12 }, // G
    { freq: 1046, start: 0.39, duration: 0.3 }, // C (high)
  ];
  playBeeps(beeps);
}

// ❌ Number cancelled — descending dull drop
export function playNumberCancelledSound() {
  const beeps = [
    { freq: 440, start: 0.0, duration: 0.15 },
    { freq: 349, start: 0.18, duration: 0.15 },
    { freq: 261, start: 0.36, duration: 0.3 },
  ];
  playBeeps(beeps);
}

// ✔️ Number completed — smooth success chime
export function playNumberCompletedSound() {
  const beeps = [
    { freq: 784, start: 0.0, duration: 0.12 }, // G
    { freq: 1046, start: 0.13, duration: 0.12 }, // C
    { freq: 1318, start: 0.26, duration: 0.35 }, // E (long hold)
  ];
  playBeeps(beeps);
}

// Shared player
function playBeeps(beeps) {
  beeps.forEach(({ freq, start, duration }) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + start);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + start);
    gainNode.gain.linearRampToValueAtTime(
      VOLUME,
      audioCtx.currentTime + start + 0.01,
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioCtx.currentTime + start + duration,
    );

    oscillator.start(audioCtx.currentTime + start);
    oscillator.stop(audioCtx.currentTime + start + duration);
  });
}
