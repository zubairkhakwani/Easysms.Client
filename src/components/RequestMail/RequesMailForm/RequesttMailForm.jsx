//React
import { useEffect, useState, useContext } from "react";

//Context
import { AuthContext } from "../../../context/AuthContext";

//Providers
import { Providers } from "../../../data/Static";

//Toaster
import { successTaost, errorToast } from "../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../helper/FormatterHelper.js";

//Services
import {
  getEmailsMetaData,
  getServices,
  requestEmail,
} from "../../../services/Provider/ProviderService";

//Components
import { PhysicalNumberContainer } from "../../Helper/PhysicalNumberContainer";
import { PhysicalNumberOptions } from "../../Helper/PhysicalNumberOptions";

//Skeltons
import { PhysicalNumberSkelton } from "../../Skeltons/PhysicalNumberSkelton.jsx";
import { NineKOutlined } from "@mui/icons-material";

export default function RequestMailForm({ onNewTempMail }) {
  const { balanceDebit } = useContext(AuthContext);

  //Data
  const [services, setServices] = useState([]);
  const [emailsMetadata, setEmailsMetadata] = useState([]);
  const [emailTypes, setEmailTypes] = useState([]);
  const [emailPricings, setEmailPricings] = useState([]);

  //Selected Values
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmailType, setSelectedEmailType] = useState(null);
  const [selecttedEmailCost, setSelecedEmailCost] = useState(null);

  //Loading
  const [isEmailMetaDataLoading, setIsEmailMetaDataLoading] = useState(false);
  const [isRequestingNumber, setIsRequestingNumber] = useState(false);

  const [purchaseState, setPurchaseState] = useState(false);

  const [quantityState, setQuantityState] = useState({
    current: 1,
    min: 1,
    max: 10,
  });

  let heroSmsId = Providers[1].value;

  //Load Services from the API
  const fetchServices = async () => {
    let sercices = [];
    try {
      sercices = await getServices(heroSmsId);
    } catch {
      errorToast("Failed to fetch services, please try later.");
    } finally {
      setServices(sercices);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);


  //Hande Service Change
  const handleServiceChange = async (e) => {
    let serviceId = e.target.value;
    let emailsMetadata = [];
    let emailTypes = [];
    setSelectedService(serviceId);
    setIsEmailMetaDataLoading(true);

    // Default back
    setEmailPricings([]);
    setSelectedEmailType(null);
    setPurchaseState(false);
    setSelecedEmailCost(null);
    try {
      let response = await getEmailsMetaData(heroSmsId, serviceId);

      if (response.isSuccess) {
        emailsMetadata = response.data;
        emailTypes = emailsMetadata.map((em) => em.name);
        setEmailTypes(emailTypes);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to laod to emails meta data, please try later.");
    } finally {
      setEmailsMetadata(emailsMetadata);
      setEmailTypes(emailTypes);
      setIsEmailMetaDataLoading(false);
    }
  };

  //Hande Email Change
  const handleEmailTypeChange = async (e) => {
    let emailName = e.target.value;

    setSelectedEmailType(emailName);
    setSelecedEmailCost(null);
    setPurchaseState(false);

    let pricing = emailsMetadata.find((em) => em.name === emailName);

    setEmailPricings(pricing ? [pricing] : []);
  };

  //Hande Price Change
  const handlePricingChange = async (e) => {
    let cost = e.target.value;
    if (cost) {
      setSelecedEmailCost(cost);
      setPurchaseState(true);
    } else {
      setPurchaseState(false);
    }
  };

  //Handle Quanity Change
  const handleQuantity = (action) => {
    if (action === "plus" && quantityState.current < quantityState.max) {
      setQuantityState((prev) => ({
        ...prev,
        current: prev.current + 1,
      }));
    } else if (
      action === "minus" &&
      quantityState.current > quantityState.min
    ) {
      setQuantityState((prev) => ({
        ...prev,
        current: prev.current - 1,
      }));
    }
  };

  //Request Email
  const handleRequestEmail = async () => {
    setIsRequestingNumber(true);
    let responseData = [];
    let responseMessage = "";
    try {
      let response = await requestEmail(heroSmsId, {
        count: quantityState.current,
        domain: selectedEmailType,
        service: selectedService,
        cost: selecttedEmailCost,
      });

      responseMessage = response.message;

      if (response.isSuccess) {
        responseData = response.data;
        onNewTempMail(responseData.data ?? []);
        balanceDebit(responseData?.totalCost ?? 0);
        successTaost(responseMessage);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to request email, please try later.");
    } finally {
      setIsRequestingNumber(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">
          <i className="fa-solid fa-sim-card number-type-icon"></i>
        </span>
        <div>
          <div className="card-title">Get Mail</div>
          <div className="card-sub">Configure your options below</div>
        </div>
      </div>
      <div className="fields">
        <div className="field">
          <label>
            <i className="fa-solid fa-gear number-type-icon"></i>
            Service
          </label>

          <select defaultValue="" onChange={handleServiceChange}>
            <option value="" disabled>
              Select service
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} {s.price ? `— From ${s.price}` : ""}{" "}
                {s.qty ? `— Total ${s.qty} numbers` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>
            <i className="fa-solid fa-envelope number-type-icon"></i>
            Email Type
          </label>
          {isEmailMetaDataLoading ? (
            <div className="select-skeleton"></div>
          ) : (
            <select
              id="operator"
              className="operator-select"
              disabled={!selectedService}
              defaultValue=""
              onChange={handleEmailTypeChange}
            >
              <option value="" disabled>
                {!selectedService
                  ? "First select service"
                  : "Select email type"}
              </option>
              {emailTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="field">
          <label>
            <i className="fa-solid fa-dollar-sign number-type-icon"></i>
            Pricing
          </label>
          <select
            id="operator"
            className="operator-select"
            disabled={!selectedEmailType}
            value={selecttedEmailCost ?? ""}
            onChange={handlePricingChange}
          >
            <option value="">
              {!selectedEmailType
                ? "First select email type"
                : "Select pricing"}
            </option>

            {emailPricings.map((s, i) => (
              <option key={i + 1} value={s.cost}>
                {[
                  s.name?.trim(),
                  FormatterHelper.formatCurrency(s.cost),
                  `(${s.count} available)`,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <div className="summary-col" bis_skin_checked="1">
            <label className="summary-label">Quantity</label>
            <div className="qty-stepper" bis_skin_checked="1">
              <button
                className="num-qty-btn"
                onClick={() => handleQuantity("minus")}
              >
                −
              </button>
              <span className="qty-val">{quantityState.current}</span>
              <button
                className="num-qty-btn"
                onClick={() => handleQuantity("plus")}
              >
                +
              </button>
            </div>
            <p className="qty-helper qty-helper--available">
              You can purchase up to <b>{quantityState.max}</b> mails.
            </p>
          </div>
        </div>
      </div>

      <button
        className="get-btn"
        id="getBtn"
        disabled={!purchaseState}
        onClick={handleRequestEmail}
      >
        {isRequestingNumber ? (
          <div className="ph-spinner ph-spinner-thick ph-spinner--light" />
        ) : (
          "⚡ Get Mail"
        )}
      </button>
    </div>
  );
}
