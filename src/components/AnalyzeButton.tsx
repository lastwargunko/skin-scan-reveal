import { Scan, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const AnalyzeButton = ({
  onClick,
  isLoading,
  disabled,
}: AnalyzeButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "w-full max-w-md mx-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300",
        "gradient-primary text-primary-foreground shadow-lg",
        !disabled && !isLoading && "hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Menganalisis...</span>
        </>
      ) : (
        <>
          <Scan className="w-6 h-6" />
          <span>Analisis Gambar</span>
        </>
      )}
    </button>
  );
};
