import { successTaost, errorToast } from "./Toaster";

/** Admin UI label for provider id 3 (users see "Premium Numbers" from the API). */
export const getAdminProviderLabel = (provider) =>
  provider?.id === 3 ? "Physical Numbers" : provider?.name;

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


// Formats server-provided remainingSeconds (ticks down in the container each second).
export const FormatRemainingTime = (remainingSeconds) => {
  const remaining = Math.max(0, remainingSeconds ?? 0);

  if (remaining <= 0) {
    return "Expired";
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const GetCancelTooltip = (provider, isTempMail = false) => {
  if (isTempMail) {
    return "You can cancel the temp mail after 3 minutes";
  }

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

// Cancel eligibility from the same server-synced countdown (not Date.now()).
export const CanMakeCancelRequest = (order, isTempMail = false) => {
  const activationLimit = order?.activationLimit;
  const remainingSeconds = order?.remainingSeconds;

  if (activationLimit == null || remainingSeconds == null) {
    return false;
  }

  const cancelWaitMinutes = isTempMail
    ? 3
    : getNumberCancelWaitMinutes(order.provider);

  const totalSeconds = activationLimit * 60;
  const elapsedSeconds = totalSeconds - Math.max(0, remainingSeconds);

  return elapsedSeconds >= cancelWaitMinutes * 60;
};

function getNumberCancelWaitMinutes(provider) {
  const name = provider?.toLowerCase();

  if (
    name?.includes("provider a") ||
    name?.includes("provider b") ||
    name?.includes("premium numbers")
  ) {
    return 5;
  }

  return 3;
}



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
