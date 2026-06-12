import HeroSection from "./components/LandingPage/HeroSection/HeroSection";
import OurServices from "./components/LandingPage/OurServices/OurServices";
import HowItWorks from "./components/LandingPage/HowItWorks/HowItWorks";
import WhyChooseUs from "./components/LandingPage/WhyChooseUs/WhyChooseUs";
import CTA from "./components/LandingPage/CTA/CTA";
import Footer from "./components/LandingPage/Footer/Footer";
import ContactUs from "./components/LandingPage/ContactUs/ContactUs";

import "./components/LandingPage/LandingShared.css";
import "./App.css";

function App() {
  return (
    <>
      <div className="parent-container">
        <HeroSection />
        <OurServices />
        <HowItWorks />
        <WhyChooseUs />
        <CTA />
        <ContactUs />
        <Footer />
      </div>
    </>
  );
}

export default App;
