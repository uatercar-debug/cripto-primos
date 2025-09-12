import traderImage from "@/assets/trader-computer.jpg";

const CopytradingEducation = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            O que é <span className="text-primary">Copytrading?</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src={traderImage}
                  alt="Trader copiando sinais no computador"
                  className="w-full h-auto rounded-xl shadow-card"
                />
                <div className="absolute -z-10 top-6 left-6 w-full h-full bg-primary/20 rounded-xl blur-lg"></div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="text-lg md:text-xl leading-relaxed space-y-4">
                <p className="text-foreground">
                  <strong className="text-primary">Copytrading é quando você copia automaticamente</strong> operações de traders experientes.
                </p>
                
                <p className="text-muted-foreground">
                  Mas aqui está a verdade: <strong className="text-destructive">apenas 5% dos traders em todo o mundo realmente são lucrativos.</strong>
                </p>
                
                <p className="text-foreground">
                  Por isso, <strong className="text-secondary">entender os riscos e escolher bem é essencial.</strong>
                </p>
              </div>
              
              <div className="bg-muted p-6 rounded-xl border-l-4 border-primary">
                <p className="text-sm text-muted-foreground font-medium">
                  💡 <strong>Dica importante:</strong> Neste material, você aprenderá exatamente como identificar traders verdadeiramente lucrativos e como proteger seu capital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CopytradingEducation;