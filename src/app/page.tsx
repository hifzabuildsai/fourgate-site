import { BackgroundMesh } from "@/components/BackgroundMesh";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Ledger } from "@/components/Ledger";
import { Gates } from "@/components/Gates";
import { Compare } from "@/components/Compare";
import { WhySection, CtaSection, Footer } from "@/components/WhyCtaFooter";

export default function Home() {
  return (
    <>
      <BackgroundMesh />
      <Nav />
      <div className="mx-auto max-w-[1040px] px-6">
        <Hero />
        <Ledger />
        <Gates />
        <Compare />
        <WhySection />
        <CtaSection />
        <Footer />
      </div>
    </>
  );
}
