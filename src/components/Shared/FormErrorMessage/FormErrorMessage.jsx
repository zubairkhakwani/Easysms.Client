/** Same validation message pattern as Login / Register — red text + icon. */
export default function FormErrorMessage({ children }) {
  return (
    <span className="error-msg">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <circle
          cx="6"
          cy="6"
          r="5.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6 3.5v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="6" cy="8.25" r="0.6" fill="currentColor" />
      </svg>
      {children}
    </span>
  );
}
