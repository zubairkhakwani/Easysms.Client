//React

import { useEffect, useState, useContext } from "react";



//Context

import { SmsContext } from "../../../context/SmsContext";

import { NumberContext } from "../../../context/NumberContext";



//Components

import ActiveOrders from "../ActiveOrder/ActiveOrders";

import RequestNumberForm from "../RequestNumberForm/RequestNumberForm";



//Services

import { getMyTempNumbers } from "../../../services/Number/NumberService";

import Guideline from "../../Helper/Guideline/Guideline";

import { connectSignalR } from "../../../services/SignalR/SignalRService";

import Header from "../../Helper/Header/Header";



//Sound

import { playCodeReceivedSound } from "../../../helper/UtilityHelper";



//Css

import "./RequestNumberContainer.css";



export default function RequestNumberContainer() {

  //Contexts

  const { latestSms, addSms, isReconnected, setReconnected } =

    useContext(SmsContext);



  const { OnNewNumbers, OnRemoveNumber } = useContext(NumberContext);



  //Data

  const [activeOrders, setActiveOrders] = useState([]);



  //Lodaing

  const [isActiveOrdersLoading, setActiveOrdersLoading] = useState(false);



  const addNewNumber = (newNumber) => {

    setActiveOrders((prev) => [newNumber, ...prev]);

  };



  //When number is successfully cancelled

  const handleCancelNumber = (id) => {

    setActiveOrders((prev) => prev.filter((order) => order.id !== id));

  };



  //When number is not able to cancel so we update the otp if coming

  const handleCancelNumberFailure = (data) => {

    setActiveOrders((prev) =>

      prev.map((order) => {

        if (order.id === data.id) {

          return {

            ...order,

            hasSms: true,

            code: data.code,

            text: data.text,

          };

        }

        return order;

      }),

    );

  };



  //Connect to signalR

  useEffect(() => {

    try {

      connectSignalR({ addSms, setReconnected, OnNewNumbers, OnRemoveNumber });

    } catch (error) {

      console.error("Failed to connect and register user:", error);

    }

  }, []);



  const fetchMyActiveNumbers = async () => {

    setActiveOrdersLoading(true);

    try {

      const res = await getMyTempNumbers(true);

      setActiveOrders(res.data);

    } catch (error) {

      console.error("Failed to fetch recent numbers:", error);

    } finally {

      setActiveOrdersLoading(false);

    }

  };



  useEffect(() => {

    fetchMyActiveNumbers();

  }, [isReconnected]);



  // Server sends remainingSeconds; tick down each second and remove expired orders in the container.
  useEffect(() => {
    if (!activeOrders.length) return;

    const interval = setInterval(() => {
      setActiveOrders((prev) =>
        prev
          .map((order) => ({
            ...order,
            remainingSeconds: Math.max(
              0,
              (order.remainingSeconds ?? order.activationLimit * 60) - 1,
            ),
          }))
          .filter((order) => order.remainingSeconds > 0),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrders.length]);



  //Update the UI when sms code receives

  useEffect(() => {

    if (!latestSms) return;



    playCodeReceivedSound();



    setActiveOrders((prevOrders) =>

      prevOrders.map((order) => {

        if (order.id === latestSms.id) {

          return {

            ...order,

            hasSms: true,

            code: latestSms.code,

            text: latestSms.text,

          };

        }

        return order;

      }),

    );

  }, [latestSms]);



  return (

    <>

      <Header

        title="Get a Temporary Number"

        description="Choose your options, get a number, receive your SMS — all

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

            "Numbers are temporary and expire after 20–25 minutes",

            "Make sure you have sufficient balance before ordering",

            "We also recommend using an IP VPN or Proxy from the country you are trying to purchase from.",

          ]}

        />



        <RequestNumberForm onNewNumber={addNewNumber} />



        <ActiveOrders
          ordersLoading={isActiveOrdersLoading}
          incomingOrders={activeOrders}
          onCancelNumber={handleCancelNumber}
          OnNumberCancelFailure={handleCancelNumberFailure}
        />

      </div>

    </>

  );

}


