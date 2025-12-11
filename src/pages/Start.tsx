import Hero2 from "@/components/Hero2";
import Problem from "@/components/Problem";
import CoursesShort from "@/components/CoursesShort";
import Pricing from "@/components/Pricing";
import FreeLesson from "@/components/FreeLesson";
import WhyItWorks from "@/components/WhyItWorks";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import CommunityBlock from "@/components/CommunityBlock";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { sectionId?: string } | null;
    if (state?.sectionId) {
      const sectionId = state.sectionId;
      requestAnimationFrame(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen">
      <Hero2 />
      <Reviews />
      
      {/* <Problem /> */}
      <div id="courses">
        <CoursesShort />
      </div>
      <CommunityBlock />
     
      <div id="pricing">
        <Pricing />
      </div>

      {/* <WhyItWorks /> */}
      <div id="faq">
        <FAQ />
      </div>
      {/* <CTA /> */}
      <Footer />
    </div>
  );
};

export default Index;
