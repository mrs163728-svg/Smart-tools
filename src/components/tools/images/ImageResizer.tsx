import React, { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Lock, Unlock } from 'lucide-react';

export const ImageResizer: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOrigDimensions({ width: img.width, height: img.height });
      setTargetWidth(img.width);
      setTargetHeight(img.height);
      setOriginalFile(file);
      setOriginalUrl(url);
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspect && origDimensions.width > 0) {
      const ratio = origDimensions.height / origDimensions.width;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspect && origDimensions.height > 0) {
      const ratio = origDimensions.width / origDimensions.height;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handleResizeAndDownload = () => {
    if (!originalUrl || targetWidth <= 0 || targetHeight <= 0) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(blob => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `resized-${targetWidth}x${targetHeight}-${originalFile?.name || 'image.png'}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }
        setIsProcessing(false);
      }, originalFile?.type || 'image/png');
    };
    img.src = originalUrl;
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setResizedUrl(null);
    setOrigDimensions({ width: 0, height: 0 });
    setTargetWidth(0);
    setTargetHeight(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {!originalFile ? (
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
            Choose an image to resize
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Change pixel dimensions or scale by percentage while maintaining sharpness.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dimension Controls */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Original Dimensions:</span>
              <span className="font-mono text-slate-200">
                {origDimensions.width} × {origDimensions.height} px
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={targetWidth}
                  onChange={e => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={targetHeight}
                  onChange={e => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setLockAspect(!lockAspect)}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  lockAspect
                    ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>Maintain Aspect Ratio ({lockAspect ? 'Locked' : 'Unlocked'})</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleWidthChange(Math.round(origDimensions.width * 0.5));
                    handleHeightChange(Math.round(origDimensions.height * 0.5));
                  }}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  50%
                </button>
                <button
                  onClick={() => {
                    handleWidthChange(Math.round(origDimensions.width * 0.75));
                    handleHeightChange(Math.round(origDimensions.height * 0.75));
                  }}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  75%
                </button>
                <button
                  onClick={() => {
                    handleWidthChange(origDimensions.width);
                    handleHeightChange(origDimensions.height);
                  }}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  100%
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[220px]">
            <img
              src={originalUrl!}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
              }}
              className="rounded-lg shadow"
            />
            <span className="text-[11px] text-slate-400 mt-2 font-mono">
              Target Output: {targetWidth} × {targetHeight} pixels
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleResizeAndDownload}
              disabled={isProcessing || targetWidth <= 0 || targetHeight <= 0}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              Download Resized Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
