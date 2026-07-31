import { toast, Slide } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "dark",
  transition: Slide,
};

export function successTaost(message, options = {}) {
  toast.success(message, { ...defaultOptions, ...options });
}

export function errorToast(message, options = {}) {
  toast.error(message, { ...defaultOptions, ...options });
}

export function warnTaost(message, options = {}) {
  toast.warn(message, { ...defaultOptions, ...options });
}
