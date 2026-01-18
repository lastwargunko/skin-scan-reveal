import { useState } from "react";
import { Clock, ChevronRight, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClassificationResult } from "./ResultCard";

export interface HistoryItem {
  id: string;
  imagePreview: string;
  results: ClassificationResult[];
  timestamp: Date;
}

interface AnalysisHistoryProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const AnalysisHistory = ({
  history,
  onSelectItem,
  onDeleteItem,
  onClearAll,
}: AnalysisHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }).format(date);
  };

  const getSeverityColor = (severity?: "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return "bg-destructive";
      case "medium":
        return "bg-warning";
      default:
        return "bg-success";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium text-foreground">Riwayat Analisis</p>
            <p className="text-sm text-muted-foreground">{history.length} hasil tersimpan</p>
          </div>
        </div>
        <ChevronRight className={cn(
          "w-5 h-5 text-muted-foreground transition-transform duration-200",
          isExpanded && "rotate-90"
        )} />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 space-y-3 animate-slide-up">
          {/* Clear All Button */}
          <div className="flex justify-end">
            <button
              onClick={onClearAll}
              className="text-sm text-destructive hover:text-destructive/80 flex items-center gap-1.5 px-3 py-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </button>
          </div>

          {/* History Items */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="relative group bg-card rounded-xl border border-border p-3 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => onSelectItem(item)}
                  className="w-full flex items-center gap-3"
                >
                  <img
                    src={item.imagePreview}
                    alt="History thumbnail"
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        getSeverityColor(item.results[0]?.severity)
                      )} />
                      <p className="font-medium text-foreground truncate">
                        {item.results[0]?.label || "Unknown"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(item.results[0]?.confidence * 100).toFixed(1)}% confidence
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTime(item.timestamp)}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </button>
                
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-card/90 hover:bg-destructive hover:text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};