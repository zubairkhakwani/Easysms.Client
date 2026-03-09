import HeroSection from "./components/LandingPage/HeroSection/HeroSection";
import PopularServices from "./components/LandingPage/PopularServices/PopularServices";
import HowItWorks from "./components/LandingPage/HowItWorks/HowItWorks";
import WhyChooseUs from "./components/LandingPage/WhyChooseUs/WhyChooseUs";
import CTA from "./components/LandingPage/CTA/CTA";
import Footer from "./components/LandingPage/Footer/Footer";

import "./App.css";

function App() {
  return (
    <div className="parent-container">
      <HeroSection />
      <PopularServices />
      <HowItWorks />
      <WhyChooseUs />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
