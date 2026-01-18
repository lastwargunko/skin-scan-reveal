import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { ResultsSection } from "@/components/ResultsSection";
import { CameraCapture } from "@/components/CameraCapture";
import { AnalysisHistory, HistoryItem } from "@/components/AnalysisHistory";
import { ClassificationResult } from "@/components/ResultCard";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { toast } from "@/hooks/use-toast";

// TODO: Set your API endpoint here
const API_ENDPOINT = "";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<"scanning" | "analyzing" | "processing">("scanning");
  const [results, setResults] = useState<ClassificationResult[] | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const { history, addToHistory, deleteFromHistory, clearHistory } = useAnalysisHistory();

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedFile(file);
    setImagePreview(preview);
    setResults(null);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
    setResults(null);
  }, []);

  const handleCameraCapture = useCallback((file: File, preview: string) => {
    handleImageSelect(file, preview);
    setIsCameraOpen(false);
  }, [handleImageSelect]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setImagePreview(item.imagePreview);
    setResults(item.results);
    setSelectedFile(null);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResults(null);
    setLoadingStage("scanning");

    try {
      if (API_ENDPOINT) {
        // Real API call
        const formData = new FormData();
        formData.append('image', selectedFile);

        // Stage progression for real API
        setTimeout(() => setLoadingStage("analyzing"), 1000);
        setTimeout(() => setLoadingStage("processing"), 2500);

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Adjust this based on your actual API response structure
        const apiResults: ClassificationResult[] = data.results || data.predictions || data;
        
        setResults(apiResults);
        
        if (imagePreview) {
          addToHistory(imagePreview, apiResults);
        }
      } else {
        // Mock API response for demonstration
        // Stage 1: Scanning
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoadingStage("analyzing");
        
        // Stage 2: Analyzing
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setLoadingStage("processing");
        
        // Stage 3: Processing
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockResults: ClassificationResult[] = [
          {
            label: "Melanoma",
            confidence: 0.85,
            description: "Jenis kanker kulit yang berkembang dari sel melanosit",
            severity: "high",
          },
          {
            label: "Nevus",
            confidence: 0.12,
            description: "Tahi lalat atau nevi adalah pertumbuhan jinak pada kulit",
            severity: "low",
          },
          {
            label: "Seborrheic Keratosis",
            confidence: 0.03,
            description: "Pertumbuhan kulit non-kanker yang umum pada orang dewasa",
            severity: "low",
          },
        ];

        setResults(mockResults);
        
        if (imagePreview) {
          addToHistory(imagePreview, mockResults);
        }
      }
      
      toast({
        title: "Analisis Selesai",
        description: "Hasil klasifikasi kulit telah tersedia",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: "Gagal menganalisis gambar. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <div className="container max-w-2xl mx-auto px-4 py-6 pb-12">
        <Header />
        
        <main className="space-y-6">
          <section>
            <ImageUploader
              onImageSelect={handleImageSelect}
              selectedImage={imagePreview}
              onClear={handleClear}
              isLoading={isLoading}
              onCameraOpen={() => setIsCameraOpen(true)}
            />
          </section>

          {imagePreview && !results && (
            <section className="animate-fade-in">
              <AnalyzeButton
                onClick={handleAnalyze}
                isLoading={isLoading}
                disabled={!selectedFile && !imagePreview}
              />
            </section>
          )}

          <section>
            <ResultsSection 
              results={results} 
              isLoading={isLoading} 
              loadingStage={loadingStage}
            />
          </section>

          {!isLoading && (
            <section className="animate-fade-in">
              <AnalysisHistory
                history={history}
                onSelectItem={handleHistorySelect}
                onDeleteItem={deleteFromHistory}
                onClearAll={clearHistory}
              />
            </section>
          )}
        </main>

        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Skin Classifier • Powered by Machine Learning
          </p>
        </footer>
      </div>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

export default Index;