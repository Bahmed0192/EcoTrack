import { HeroSection } from "../components/HeroSection";
import { ImpactEngine } from "../components/ImpactEngine";
import { GlobalDataViz } from "../components/GlobalDataViz";
import { CommunityHub } from "../components/CommunityHub";
import { EcoFacts } from "../components/EcoFacts";

export function Home() {
  return (
    <>
      <HeroSection />
      <ImpactEngine />
      <EcoFacts />
      <GlobalDataViz />
      <CommunityHub />
    </>
  );
}
