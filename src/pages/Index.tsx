import Hero from "@/components/sections/Hero";
import CopytradingEducation from "@/components/sections/CopytradingEducation";
import WhatYouWillLearn from "@/components/sections/WhatYouWillLearn";
import Differentials from "@/components/sections/Differentials";
import SocialProof from "@/components/sections/SocialProof";
import AffiliateLinks from "@/components/sections/AffiliateLinks";
import Guarantee from "@/components/sections/Guarantee";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import Header from "@/components/navigation/Header";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section id="inicio">
          <Hero />
        </section>
        
        <section id="copytrading">
          <CopytradingEducation />
        </section>
        
        <section id="conteudo">
          <WhatYouWillLearn />
        </section>
        
        <Differentials />
        
        <SocialProof />
        
        <AffiliateLinks />
        
        <section id="garantia">
          <Guarantee />
        </section>
        
        <FinalCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
