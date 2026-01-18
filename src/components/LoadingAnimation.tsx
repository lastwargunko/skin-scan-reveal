import { Scan, Brain, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  stage?: "scanning" | "analyzing" | "processing";
}

export const LoadingAnimation = ({ stage = "scanning" }: LoadingAnimationProps) => {
  const stages = [
    { key: "scanning", icon: Scan, label: "Memindai gambar..." },
    { key: "analyzing", icon: Brain, label: "Menganalisis pola kulit..." },
    { key: "processing", icon: Activity, label: "Memproses hasil..." },
  ];

  const currentIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
        {/* Main Animation */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Outer Ring */}
          <div className="absolute w-24 h-24 rounded-full border-4 border-primary/20" />
          <div className="absolute w-24 h-24 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          
          {/* Middle Ring */}
          <div className="absolute w-16 h-16 rounded-full border-2 border-accent/30" />
          <div 
            className="absolute w-16 h-16 rounded-full border-2 border-transparent border-t-accent animate-spin" 
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          />
          
          {/* Center Icon */}
          <div className="relative z-10 p-4 bg-gradient-to-br from-primary to-accent rounded-full text-primary-foreground shadow-glow">
            {stage === "scanning" && <Scan className="w-6 h-6" />}
            {stage === "analyzing" && <Brain className="w-6 h-6" />}
            {stage === "processing" && <Activity className="w-6 h-6" />}
          </div>

          {/* Pulse Effect */}
          <div className="absolute w-32 h-32 rounded-full bg-primary/10 animate-pulse-ring" />
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {stages.map((s, index) => {
            const Icon = s.icon;
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;
            
            return (
              <div
                key={s.key}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                  isActive && "bg-primary/10 border border-primary/20",
                  isComplete && "bg-success/10 border border-success/20",
                  !isActive && !isComplete && "opacity-40"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isActive && "bg-primary/20 text-primary",
                  isComplete && "bg-success/20 text-success",
                  !isActive && !isComplete && "bg-muted text-muted-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium",
                    isActive && "text-primary",
                    isComplete && "text-success",
                    !isActive && !isComplete && "text-muted-foreground"
                  )}>
                    {s.label}
                  </p>
                  {isActive && (
                    <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-shimmer"
                        style={{ 
                          width: "100%",
                          backgroundSize: "200% 100%"
                        }}
                      />
                    </div>
                  )}
                </div>
                {isComplete && (
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <svg className="w-3 h-3 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Mohon tunggu, ini mungkin memakan waktu beberapa detik
        </p>
      </div>
    </div>
  );
};