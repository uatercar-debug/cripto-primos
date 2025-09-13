import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-24 w-24",
    md: "h-32 w-32", 
    lg: "h-40 w-40"
  };

  const textSizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/logo.png" 
        alt="Cripto Primos" 
        className={cn("object-contain", sizeClasses[size])}
      />
    </div>
  );
};

export default Logo;
