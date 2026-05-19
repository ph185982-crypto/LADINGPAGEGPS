import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { PainSection } from "@/components/PainSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { FitSection } from "@/components/FitSection";
import { TransparencyBlock } from "@/components/TransparencyBlock";
import { Comparison } from "@/components/Comparison";
import { OfferKits } from "@/components/OfferKits";
import { TrustSection } from "@/components/TrustSection";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustBar />
      <PainSection />
      <HowItWorks />
      <Benefits />
      <FitSection />
      <TransparencyBlock />
      <Comparison />
      <OfferKits />
      <TrustSection />
      <FAQ />
      <FinalCTA />
      <Footer />
      <MobileStickyCTA />
    </main>
  );
}
