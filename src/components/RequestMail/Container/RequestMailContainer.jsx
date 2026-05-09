//Components
import Header from "../../Helper/Header/Header";
import Guideline from "../../Helper/Guideline/Guideline";
import RequestMailForm from "../RequesMailForm/RequesttMailForm";
import ActiveOrders from "../ActiveOrder/ActiveOrder";



export default function RequestMailContainer() {
  return (
    <>
      <Header
        title="Get a Temporary Mail"
        description="Choose your options, get a mail, receive your SMS — all
        in one place."
      />

      <div className="grid">
        <Guideline
          title="Getting Started"
          subtitle="Follow these steps to receive your verification code"
          icon="fa-solid fa-list-check number-type-icon"
          steps={[
            {
              title: "Select Your Options",
              description:
                "Choose your SMS provider, service, country, and operator from the form on the right.",
            },
            {
              title: "Check Price & Availability",
              description:
                "Review the service information to see the price and available numbers.",
            },
            {
              title: 'Click "Get Number"',
              description:
                "Press the button to receive your temporary phone number instantly.",
            },
            {
              title: "Use the Number",
              description:
                " Enter the provided number in your app or service to receive the SMS code.",
            },
            {
              title: "Get Your Code",
              description:
                "Your verification code will appear on this page within a few minutes.",
            },
          ]}
          notes={[
            "Numbers are temporary and expire after 15–20 minutes",
            "Make sure you have sufficient balance before ordering",
            "Use the number immediately after receiving it",
            "Some services may take longer to deliver SMS codes",
          ]}
        />
        <RequestMailForm />
        <ActiveOrders incomingOrders={[]} />
      </div>
    </>
  );
}
