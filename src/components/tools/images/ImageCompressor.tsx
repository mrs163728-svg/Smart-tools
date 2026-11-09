import React, { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [quality, setQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCompression = (file: File, q: number) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        // Compress as image/jpeg or image/webp
        const outputMime = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
        canvas.toBlob(
          blob => {
            if (blob) {
              if (compressedUrl) URL.revokeObjectURL(compressedUrl);
              const newUrl = URL.createObjectURL(blob);
              setCompressedUrl(newUrl);
              setCompressedBlob(blob);
            }
            setIsProcessing(false);
          },
          outputMime,
          q / 100
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    processCompression(file, quality);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (originalFile) {
      processCompression(originalFile, newQ);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !originalFile) return;
    const a = document.createElement('a');
    a.href = compressedUrl!;
    const ext = originalFile.type === 'image/webp' ? '.webp' : '.jpg';
    a.download = `compressed-${originalFile.name.replace(/\.[^/.]+$/, '')}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setCompressedBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const originalSizeKb = originalFile ? (originalFile.size / 1024).toFixed(1) : '0';
  const compressedSizeKb = compressedBlob ? (compressedBlob.size / 1024).toFixed(1) : '0';
  const reductionPercent =
    originalFile && compressedBlob
      ? Math.round(((originalFile.size - compressedBlob.size) / originalFile.size) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Upload Dropzone */}
      {!originalFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-10 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Choose an image or drop it here
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Supports JPG, PNG, and WebP up to 50MB. Processed entirely in your browser with 100% privacy.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Compression Quality: {quality}%
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lower quality produces smaller file sizes with minor loss.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">Original: {originalSizeKb} KB</span>
                <span>→</span>
                <span className="text-emerald-400 font-bold">New: {compressedSizeKb} KB</span>
                {reductionPercent > 0 && (
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    -{reductionPercent}%
                  </span>
                )}
              </div>
            </div>

            <input
              type="range"
              min="10"
              max="95"
              value={quality}
              onChange={e => handleQualityChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Side by side Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Original Image</span>
                <span className="font-mono">{originalSizeKb} KB</span>
              </div>
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                <img
                  src={originalUrl!}
                  alt="Original upload"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Compressed Image ({quality}%)</span>
                <span className="font-mono text-emerald-400">{compressedSizeKb} KB</span>
              </div>
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                {compressedUrl ? (
                  <img
                    src={compressedUrl}
                    alt="Compressed result"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-slate-400">Compressing...</div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Compress Another Image
            </button>
            <button
              onClick={handleDownload}
              disabled={!compressedBlob || isProcessing}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              Download Compressed Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
