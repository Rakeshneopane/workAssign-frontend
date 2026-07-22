import LandingNavbar from "../components/LandingNavbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import TechStack from "../components/TechStack";
import CTA from "../components/CTA";
import LandingFooter from "../components/LandingFooter";

export default function Landing() {
  return (
    <>
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TechStack />
      <CTA />
      <LandingFooter />
    </>
  );
}