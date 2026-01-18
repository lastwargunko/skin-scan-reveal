import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { ResultsSection } from "@/components/ResultsSection";
import { ClassificationResult } from "@/components/ResultCard";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ClassificationResult[] | null>(null);

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

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResults(null);

    try {
      // TODO: Replace with actual API endpoint
      // Example API call structure:
      // const formData = new FormData();
      // formData.append('image', selectedFile);
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // setResults(data.results);

      // Simulated API response for demonstration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock results - replace with actual API response
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
            />
          </section>

          {imagePreview && (
            <section className="animate-fade-in">
              <AnalyzeButton
                onClick={handleAnalyze}
                isLoading={isLoading}
                disabled={!selectedFile}
              />
            </section>
          )}

          <section>
            <ResultsSection results={results} isLoading={isLoading} />
          </section>
        </main>

        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Skin Classifier • Powered by Machine Learning
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
