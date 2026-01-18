import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  isLoading?: boolean;
  onCameraOpen: () => void;
}

export const ImageUploader = ({
  onImageSelect,
  selectedImage,
  onClear,
  isLoading = false,
  onCameraOpen,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImageSelect(file, event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImageSelect(file, event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  if (selectedImage) {
    return (
      <div className="relative w-full max-w-md mx-auto animate-fade-in">
        <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20">
          <img
            src={selectedImage}
            alt="Selected skin image"
            className="w-full h-auto object-cover"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-foreground/10 backdrop-blur-[2px]">
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
            </div>
          )}
          {!isLoading && (
            <button
              onClick={onClear}
              className="absolute top-3 right-3 p-2 bg-card/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className={cn(
            "p-4 rounded-full transition-all duration-300",
            isDragging ? "bg-primary/20" : "bg-muted"
          )}>
            {isDragging ? (
              <ImageIcon className="w-10 h-10 text-primary" />
            ) : (
              <Upload className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">
              {isDragging ? "Lepaskan gambar di sini" : "Upload gambar kulit"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Drag & drop atau klik untuk memilih file
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Format: JPG, PNG, WEBP (Max 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">atau</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Camera Button */}
      <button
        onClick={onCameraOpen}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
      >
        <div className="p-2 bg-primary/10 rounded-lg">
          <Camera className="w-5 h-5 text-primary" />
        </div>
        <span className="font-medium text-foreground">Ambil Foto dengan Kamera</span>
      </button>
    </div>
  );
};