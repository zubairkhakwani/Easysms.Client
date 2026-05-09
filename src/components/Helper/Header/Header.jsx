import "./Header.css";

export default function Header({ title, description }) {
  return (
    <div className="page-header">
      <h1>{title} </h1>
      <p>{description}</p>
    </div>
  );
}
