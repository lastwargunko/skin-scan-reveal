import { CheckCircle2, AlertTriangle, Info, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClassificationResult {
  label: string;
  confidence: number;
  description?: string;
  severity?: "low" | "medium" | "high";
}

interface ResultCardProps {
  result: ClassificationResult;
  isTopResult?: boolean;
}

export const ResultCard = ({ result, isTopResult = false }: ResultCardProps) => {
  const getSeverityConfig = (severity?: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return {
          icon: CheckCircle2,
          colorClass: "text-success",
          bgClass: "bg-success/10",
          borderClass: "border-success/20",
        };
      case "medium":
        return {
          icon: Info,
          colorClass: "text-warning",
          bgClass: "bg-warning/10",
          borderClass: "border-warning/20",
        };
      case "high":
        return {
          icon: AlertTriangle,
          colorClass: "text-destructive",
          bgClass: "bg-destructive/10",
          borderClass: "border-destructive/20",
        };
      default:
        return {
          icon: Info,
          colorClass: "text-primary",
          bgClass: "bg-primary/10",
          borderClass: "border-primary/20",
        };
    }
  };

  const config = getSeverityConfig(result.severity);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "gradient-card rounded-xl p-5 border-2 transition-all duration-300 animate-slide-up",
        isTopResult ? "shadow-xl border-primary/30" : "shadow-md",
        config.borderClass
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-lg", config.bgClass)}>
          <Icon className={cn("w-6 h-6", config.colorClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-semibold text-lg text-foreground truncate">
              {result.label}
            </h3>
            {isTopResult && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Top Match
              </span>
            )}
          </div>
          
          {result.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {result.description}
            </p>
          )}

          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Confidence
              </span>
              <span className="font-semibold text-foreground">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
