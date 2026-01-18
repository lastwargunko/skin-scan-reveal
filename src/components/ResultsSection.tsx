import { ResultCard, ClassificationResult } from "./ResultCard";
import { LoadingAnimation } from "./LoadingAnimation";
import { FileWarning } from "lucide-react";

interface ResultsSectionProps {
  results: ClassificationResult[] | null;
  isLoading: boolean;
  loadingStage?: "scanning" | "analyzing" | "processing";
}

export const ResultsSection = ({ results, isLoading, loadingStage = "scanning" }: ResultsSectionProps) => {
  if (isLoading) {
    return <LoadingAnimation stage={loadingStage} />;
  }

  if (!results) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center py-8 px-4 bg-muted/50 rounded-xl border border-border">
          <FileWarning className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Tidak dapat mendeteksi kondisi kulit</p>
          <p className="text-sm text-muted-foreground mt-1">
            Coba upload gambar dengan kualitas yang lebih baik
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        Hasil Analisis
      </h2>
      <div className="space-y-3">
        {results.map((result, index) => (
          <ResultCard
            key={`${result.label}-${index}`}
            result={result}
            isTopResult={index === 0}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-4 px-4">
        ⚠️ Hasil ini bukan diagnosis medis. Konsultasikan dengan dokter untuk diagnosis yang akurat.
      </p>
    </div>
  );
};