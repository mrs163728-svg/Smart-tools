import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, RotateCcw, Image as ImageIcon, Trash2, Check } from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export const JpgToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);

    const newItems: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith('image/')) {
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          previewUrl: URL.createObjectURL(f),
        });
      }
    }

    setImages(prev => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Embed as JPG (or canvas convert webp to jpeg buffer first if needed)
          try {
            embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
          } catch {
            // Convert to canvas blob then embed PNG
            const blob = await new Promise<Blob>((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(b => b ? resolve(b) : reject(new Error('Canvas error')), 'image/png');
              };
              img.onerror = reject;
              img.src = item.previewUrl;
            });
            const pngBuf = await blob.arrayBuffer();
            embeddedImage = await pdfDoc.embedPng(pngBuf);
          }
        }

        const { width, height } = embeddedImage;
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(`Failed to create PDF from images: ${(err as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    a.download = `images-converted-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setImages([]);
    setPdfBlobUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Upload area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">
          Select or drop JPG / PNG images
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Convert one or multiple images into a clean PDF document.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{images.length} image{images.length !== 1 ? 's' : ''} added:</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-400 font-semibold hover:underline"
            >
              + Add More Images
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((item, idx) => (
              <div
                key={item.id}
                className="relative group bg-slate-950 border border-slate-800 rounded-xl p-2 overflow-hidden"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src={item.previewUrl}
                    alt={`Preview ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate pr-1">Page {idx + 1}</span>
                  <button
                    onClick={() => removeImage(item.id)}
                    className="text-slate-400 hover:text-rose-400"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </button>
            <button
              onClick={handleConvertToPdf}
              disabled={isGenerating || images.length === 0}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isGenerating ? 'Converting Images...' : `Convert ${images.length} Images to PDF`}
            </button>
          </div>
        </div>
      )}

      {/* PDF Ready state */}
      {pdfBlobUrl && (
        <div className="p-6 bg-gradient-to-tr from-emerald-950/30 to-indigo-950/30 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">PDF Successfully Created!</h4>
              <p className="text-xs text-slate-300">
                Your images have been packaged into a high-quality PDF document.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 shadow-lg shrink-0"
          >
            <Download className="w-4 h-4" />
            Download Generated PDF
          </button>
        </div>
      )}
    </div>
  );
};
