import "./PhysicalNumberSkelton.css";

export const PhysicalNumberSkelton = () => (
  <div className="purchase-summary">
    <div className="summary-top">
      <div className="summary-service">
        <div className="skel skel--icon" />
        <div className="skel skel--text" style={{ width: 80 }} />
      </div>
      <div className="summary-country">
        <div className="skel skel--icon" />
        <div className="skel skel--text" style={{ width: 100 }} />
      </div>
    </div>

    <div className="summary-divider" />

    <div className="summary-mid">
      <div className="skel skel--text" style={{ width: 90 }} />
      <div className="summary-price-block">
        <div className="skel skel--text" style={{ width: 60 }} />
        <div className="skel skel--text" style={{ width: 50, height: 22 }} />
      </div>
    </div>

    <div className="summary-divider" />

    <div className="summary-bottom">
      <div className="summary-col">
        <div className="skel skel--text" style={{ width: 55 }} />
        <div className="skel skel--stepper" />
        <div className="skel skel--text" style={{ width: 180, marginTop: 6 }} />
      </div>
    </div>
  </div>
);
