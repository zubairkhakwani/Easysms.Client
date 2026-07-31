import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { successTaost, warnTaost } from "../helper/Toaster";

const OFFLINE_TOAST_ID = "network-offline";

const offlineOptions = {
  toastId: OFFLINE_TOAST_ID,
  position: "bottom-left",
  autoClose: false,
};

const onlineOptions = {
  toastId: "network-online",
  position: "bottom-left",
};

export function useNetworkStatus() {
  const isOffline = useRef(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      if (!isOffline.current) {
        isOffline.current = true;
        warnTaost("You are offline.", offlineOptions);
      }
    };

    const handleOnline = () => {
      if (isOffline.current) {
        isOffline.current = false;
        toast.dismiss(OFFLINE_TOAST_ID);
        successTaost("You are back online.", onlineOptions);
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
