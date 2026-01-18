import { Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="text-center py-8 px-4">
      <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
      </div>
      <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
        Skin <span className="text-primary">Classifier</span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        Analisis kondisi kulit Anda dengan teknologi machine learning yang akurat
      </p>
    </header>
  );
};
