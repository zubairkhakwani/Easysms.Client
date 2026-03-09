//React
import { Link } from "react-router-dom";

//Css
import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-box">
        <h2>Ready to Get Your First Number?</h2>
        <p>Join over 500,000 users who protect their privacy every day.</p>
        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/register">
            <button className="btn-primary">Create Free Account</button>
          </Link>

          {/* <button className="btn-secondary">Browse Services</button> */}
        </div>
      </div>
    </section>
  );
}
