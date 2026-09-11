import AboutPreview from "../components/home/AboutPreview";
import FeaturedProducts from "../components/home/FeaturedProducts";
import FeaturedServices from "../components/home/FeaturedServices";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import CtaBanner from "../components/shared/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <WhyChooseUs />
      <FeaturedServices />
      <FeaturedProducts />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
