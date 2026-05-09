import { successTaost, errorToast } from "./Toaster";

export const CopyToClipboard = async (type, text) => {
  try {
    await navigator.clipboard.writeText(text);
    successTaost(`${type ? type : ""} copied successfully.`);
  } catch {
    errorToast(`Failed to copy ${type}`);
  }
};
