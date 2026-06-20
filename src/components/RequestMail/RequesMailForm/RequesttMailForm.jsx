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

//Static Data
import { mailServices } from "../../../data/Static";

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
import SearchableSelect from "../../Shared/SearchableSelect/SearchableSelect.jsx";
import QuantityStepper from "../../Shared/QuantityStepper/QuantityStepper.jsx";

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
      console.log(services);
    } catch {
      errorToast("Failed to fetch services, please try later.");
    } finally {
      setServices(sercices);
    }
  };

  useEffect(() => {
    //fetchServices();
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
  const handleQuantityChange = (next) => {
    setQuantityState((prev) => ({
      ...prev,
      current: next,
    }));
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
          <div className="card-title">Rent Mail</div>
          <div className="card-sub">Configure your rental options below</div>
        </div>
      </div>
      <div className="fields">
        <div className="field">
          <label>
            <i className="fa-solid fa-gear number-type-icon"></i>
            Service
          </label>

          <SearchableSelect
            value={selectedService ?? ""}
            onChange={(val) => handleServiceChange({ target: { value: val } })}
            placeholder="Select service"
            options={mailServices.map((s) => ({
              value: s.name,
              label: s.name,
              sublabel: [
                s.price ? `From ${s.price}` : null,
                s.qty ? `${s.qty} available` : null,
              ]
                .filter(Boolean)
                .join(" · "),
            }))}
          />
        </div>

        <div className="field">
          <label>
            <i className="fa-solid fa-envelope number-type-icon"></i>
            Mail Type
          </label>
          {isEmailMetaDataLoading ? (
            <SearchableSelect isLoading placeholder="Select mail type" options={[]} />
          ) : (
            <SearchableSelect
              id="operator"
              className="operator-select"
              disabled={!selectedService}
              value={selectedEmailType ?? ""}
              onChange={(val) => handleEmailTypeChange({ target: { value: val } })}
              placeholder={
                !selectedService ? "First select service" : "Select mail type"
              }
              options={emailTypes.map((s) => ({ value: s, label: s }))}
            />
          )}
        </div>

        <div className="field">
          <label>
            <i className="fa-solid fa-dollar-sign number-type-icon"></i>
            Pricing
          </label>
          <SearchableSelect
            id="pricing"
            className="operator-select"
            disabled={!selectedEmailType}
            value={selecttedEmailCost ?? ""}
            onChange={(val) => handlePricingChange({ target: { value: val } })}
            placeholder={
              !selectedEmailType ? "First select mail type" : "Select pricing"
            }
            options={emailPricings.map((s) => ({
              value: s.cost,
              label: s.name?.trim() || FormatterHelper.formatCurrency(s.cost),
              sublabel: [
                s.name?.trim() ? FormatterHelper.formatCurrency(s.cost) : null,
                `${s.count} available`,
              ]
                .filter(Boolean)
                .join(" · "),
            }))}
          />
        </div>

        <div className="field">
          <div className="summary-col" bis_skin_checked="1">
            <label className="summary-label">Quantity</label>
            <QuantityStepper
              value={quantityState.current}
              onChange={handleQuantityChange}
              min={quantityState.min}
              max={quantityState.max}
            />
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
          "⚡ Rent Mail"
        )}
      </button>
    </div>
  );
}
