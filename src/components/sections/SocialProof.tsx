import { Card, CardContent } from "@/components/ui/card";
import { Star, Users } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Silva",
    message: "Finalmente entendi como funciona o copytrading de verdade! Material muito didático.",
    rating: 5
  },
  {
    name: "Maria Santos", 
    message: "Não sabia que existiam tantos riscos. Agora consigo escolher traders com mais segurança.",
    rating: 5
  },
  {
    name: "João Oliveira",
    message: "Excelente conteúdo! As explicações são claras e sem enrolação.",
    rating: 5
  }
];

const SocialProof = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Stats */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">2.800+</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground px-2">
              pessoas já transformaram sua visão sobre investimentos online com esse conteúdo
            </h2>
          </div>
          
          {/* Testimonials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-left hover:shadow-card transition-all duration-300">
                <CardContent className="p-4 sm:p-5 md:p-6">
                  {/* Stars */}
                  <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3 md:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Message */}
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 italic">
                    "{testimonial.message}"
                  </p>
                  
                  {/* Name */}
                  <div className="border-t pt-3 sm:pt-4">
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {testimonial.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-5 md:p-6 bg-primary/5 rounded-lg sm:rounded-xl border border-primary/20">
            <p className="text-xs sm:text-sm text-muted-foreground italic">
              💬 Depoimentos baseados em feedbacks reais de usuários que adquiriram nosso material educativo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;