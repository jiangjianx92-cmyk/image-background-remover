"use client";

import { useState, useCallback, useRef } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Image size must be less than 12MB");
      return;
    }
    setSelectedFile(file);
    setResultUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleRemoveBackground = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image_file", selectedFile);

      const response = await fetch("/api/removebg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to remove background");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "background-removed.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [resultUrl]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🪄 Image Background Remover
          </h1>
          <p className="text-slate-600">
            Upload an image and remove its background instantly
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer 
            transition-all duration-200 bg-white
            ${isDragOver 
              ? "border-blue-500 bg-blue-50" 
              : "border-slate-300 hover:border-blue-500 hover:bg-white"
            }
            ${selectedFile ? "border-solid border-slate-200" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          {!selectedFile && (
            <div id="uploadPrompt">
              <div className="text-6xl mb-4">📤</div>
              <p className="text-lg text-slate-700 mb-2">
                Drag & drop your image here
              </p>
              <p className="text-slate-500">or click to browse</p>
              <p className="text-sm text-slate-400 mt-4">
                Supports: JPG, PNG, WebP (max 12MB)
              </p>
            </div>
          )}

          {selectedFile && previewUrl && !resultUrl && (
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-2">Selected Image:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <p className="text-sm text-slate-400 mt-2">{selectedFile.name}</p>
            </div>
          )}
        </div>

        {/* Process Button */}
        {selectedFile && !resultUrl && (
          <div className="text-center mt-6">
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "✨ Remove Background"
              )}
            </button>
          </div>
        )}

        {/* Loading State */}
        {isProcessing && (
          <div className="text-center mt-8">
            <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-600">Processing your image...</p>
          </div>
        )}

        {/* Result Section */}
        {resultUrl && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                ✨ Result
              </h3>

              {/* Before/After Comparison */}
              <div className="flex gap-4 justify-center items-center">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-2">Original</p>
                  <div className="checkerboard rounded-lg overflow-hidden">
                    <img
                      src={previewUrl || ""}
                      alt="Original"
                      className="max-h-64 max-w-full"
                    />
                  </div>
                </div>

                <div className="text-3xl text-slate-400">→</div>

                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-2">No Background</p>
                  <div className="checkerboard rounded-lg overflow-hidden">
                    <img
                      src={resultUrl}
                      alt="Result"
                      className="max-h-64 max-w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="text-center mt-6">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  ⬇️ Download Image
                </button>
              </div>

              {/* Try Another */}
              <div className="text-center mt-4">
                <button
                  onClick={handleReset}
                  className="text-slate-500 hover:text-slate-700 underline text-sm"
                >
                  Process another image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>
            Powered by{" "}
            <a
              href="https://www.remove.bg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              remove.bg
            </a>{" "}
            &{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:underline"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
