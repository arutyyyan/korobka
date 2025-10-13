import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Courses from "@/components/Courses";
import Pricing from "@/components/Pricing";
import FreeLesson from "@/components/FreeLesson";
import WhyItWorks from "@/components/WhyItWorks";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Reviews />
      <Problem />
      <div id="courses">
        <Courses />
      </div>
      <div id="pricing">
        <Pricing />
      </div>

      {/* <WhyItWorks /> */}
      <div id="faq">
        <FAQ />
      </div>
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
