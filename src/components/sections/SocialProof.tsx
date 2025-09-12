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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Stats */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-4xl font-bold text-primary">2.800+</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              pessoas já transformaram sua visão sobre investimentos online com esse conteúdo
            </h2>
          </div>
          
          {/* Testimonials */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-left hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Message */}
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.message}"
                  </p>
                  
                  {/* Name */}
                  <div className="border-t pt-4">
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-sm text-muted-foreground italic">
              💬 Depoimentos baseados em feedbacks reais de usuários que adquiriram nosso material educativo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;