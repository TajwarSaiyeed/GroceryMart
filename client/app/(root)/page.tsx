"use client";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Newsletter from "@/components/newsletter";
import TopRatedProducts from "@/components/top-rated-products";
import WeeklyDeals from "@/components/weekly-deals";

const Home = () => {
  return (
    <>
      <MaxWidthWrapper>
        <Hero />
        <TopRatedProducts />
        <WeeklyDeals />
        <Newsletter />
      </MaxWidthWrapper>
      <Footer />
    </>
  );
};

export default Home;
