import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Courses from "@/components/Courses";
import Pricing from "@/components/Pricing";
import FreeLesson from "@/components/FreeLesson";
import WhyItWorks from "@/components/WhyItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Problem />
      <Courses />
      <Pricing />
      <FreeLesson />
      <WhyItWorks />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
