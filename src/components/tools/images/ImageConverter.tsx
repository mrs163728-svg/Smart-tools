import React, { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, ArrowRight } from 'lucide-react';

export const ImageConverter: React.FC<{ defaultTarget?: 'png' | 'jpg' | 'webp' }> = ({ defaultTarget = 'png' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpg' | 'webp'>(defaultTarget);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreviewUrl(url);
    convertImage(f, url, targetFormat, bgColor);
  };

  const convertImage = (sourceFile: File, url: string, format: 'png' | 'jpg' | 'webp', bg: string) => {
    setIsProcessing(true);
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

      // If converting to JPG, fill white background for transparent pixels
      if (format === 'jpg') {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      canvas.toBlob(blob => {
        if (blob) {
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, mimeType, 0.92);
    };
    img.src = url;
  };

  const handleFormatChange = (newFormat: 'png' | 'jpg' | 'webp') => {
    setTargetFormat(newFormat);
    if (file && previewUrl) {
      convertImage(file, previewUrl, newFormat, bgColor);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl || !file) return;
    const a = document.createElement('a');
    a.href = convertedUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-10 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Choose an image to convert
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Easily convert between PNG, JPG, and WebP. Works 100% locally in your browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Format selection */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Convert To:
              </span>
              <div className="flex gap-1.5 p-1 bg-slate-900 border border-slate-700 rounded-xl">
                {(['png', 'jpg', 'webp'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => handleFormatChange(f)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${
                      targetFormat === f
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {targetFormat === 'jpg' && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Background fill:</span>
                <input
                  type="color"
                  value={bgColor}
                  onChange={e => {
                    setBgColor(e.target.value);
                    if (file && previewUrl) convertImage(file, previewUrl, targetFormat, e.target.value);
                  }}
                  className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
              <span className="text-xs text-slate-400 font-mono">Original: {file.name}</span>
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                <img src={previewUrl!} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
              <span className="text-xs text-indigo-400 font-mono font-bold">
                Output Format: .{targetFormat.toUpperCase()}
              </span>
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                {convertedUrl ? (
                  <img src={convertedUrl} alt="Converted" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400">Converting...</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Choose Another Image
            </button>
            <button
              onClick={handleDownload}
              disabled={!convertedUrl || isProcessing}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              Download .{targetFormat.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
