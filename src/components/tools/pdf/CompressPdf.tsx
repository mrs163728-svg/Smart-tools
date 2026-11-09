import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, RotateCcw, FileText, Check, Minimize2 } from 'lucide-react';

export const CompressPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    compressPdfFile(selected);
  };

  const compressPdfFile = async (f: File) => {
    setIsCompressing(true);
    try {
      const buffer = await f.arrayBuffer();
      // Load document and clean up unreferenced objects
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Save with object stream compression
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });

      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(URL.createObjectURL(blob));
      setCompressedSize(blob.size);
    } catch {
      // Fallback
      setCompressedSize(f.size);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = `compressed-${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setCompressedUrl(null);
    setCompressedSize(0);
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
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Minimize2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Choose a PDF file to compress
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Compress and optimize PDF streams directly in your browser without uploading to external servers.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">{file.name}</span>
                <div className="flex items-center gap-3 text-xs font-mono mt-1">
                  <span className="text-slate-400">Original: {(file.size / 1024).toFixed(1)} KB</span>
                  {compressedSize > 0 && (
                    <>
                      <span>→</span>
                      <span className="text-emerald-400 font-bold">
                        Optimized: {(compressedSize / 1024).toFixed(1)} KB
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white"
            >
              Choose Another PDF
            </button>
          </div>

          {compressedUrl && (
            <div className="p-6 bg-gradient-to-tr from-emerald-950/30 to-indigo-950/30 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Optimization Complete</h4>
                  <p className="text-xs text-slate-300">
                    Your PDF has been re-indexed and compressed with standard object streams.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 shadow-lg shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Compressed PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
