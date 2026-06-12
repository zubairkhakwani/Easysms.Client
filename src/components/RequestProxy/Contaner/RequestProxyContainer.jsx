//React
import { useState } from "react";

//Components
import Header from "../../Helper/Header/Header";
import Guideline from "../../Helper/Guideline/Guideline";
import RequestProxyForm from "../RequestProxyForm/RequestProxyForm";
import ProxyOrderSummary from "../ProxyOrderSummary/ProxyOrderSummary";

//Css
import "../../RequestNumber/Container/RequestNumberContainer.css";

export default function RequestProxyContainer() {
  const [orderSummary, setOrderSummary] = useState({
    priceData: null,
    isFetchingPrice: false,
    quantity: 1,
  });

  return (
    <>
      <Header
        title="Get Proxy"
        description="Select your preferred service, location, duration, and usage type to instantly purchase high-quality proxies."
      />

      <div className="grid">
        <Guideline
          title="Getting Started"
          subtitle="Follow these steps to purchase your proxy service"
          icon="fa-solid fa-network-wired number-type-icon"
          steps={[
            {
              title: "Select Proxy Type",
              description:
                "Currently, we provide IPv4 & Isp proxies only. Additional proxy services and types will be added in the future.",
            },
            {
              title: "Choose a Location",
              description:
                "Select the country or region where you want your proxy IP address to be located.",
            },
            {
              title: "Select Rental Period",
              description:
                "Choose how long you want to use the proxy, such as 1 week, 1 month, 3 months, or other available durations.",
            },
            {
              title: "Choose Usage Purpose",
              description:
                "Select the intended use for your proxy, such as social media platforms like Facebook, Instagram, or Telegram, gaming services like FIFA, or other supported activities.",
            },
            {
              title: "Select Quantity",
              description:
                "Choose how many proxy connections or IPs you want to purchase.",
            },
            {
              title: 'Click "Get Proxy"',
              description:
                "Press the button to instantly receive your proxy details and access credentials.",
            },
          ]}
          //   notes={[
          //     "Currently only IPv4 proxies are available",
          //     "More proxy types and services will be added in future updates",
          //     "Make sure you have sufficient balance before placing an order",
          //     "Proxy availability may vary depending on location and demand",
          //     "Use proxies according to the platform's terms and policies",
          //   ]}
        />
        <RequestProxyForm onSummaryChange={setOrderSummary} />
        <ProxyOrderSummary
          priceData={orderSummary.priceData}
          isFetchingPrice={orderSummary.isFetchingPrice}
          quantity={orderSummary.quantity}
        />
      </div>
    </>
  );
}
