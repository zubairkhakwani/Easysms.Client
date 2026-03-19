import "./CounterSkelton.css";

export default function CounterSkeleton({ type = "number" }) {
  return (
    <span
      className={`counter-skeleton ${type === "string" ? "counter-skeleton--string" : "counter-skeleton--number"}`}
    />
  );
}
