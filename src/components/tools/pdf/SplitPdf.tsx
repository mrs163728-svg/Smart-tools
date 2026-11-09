import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, RotateCcw, FileText, Check, Scissors } from 'lucide-react';

export const SplitPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setError(null);
    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setFile(selected);
      setTotalPages(count);
      setPageRange(count > 1 ? `1-${Math.min(count, 2)}` : '1');
    } catch (err) {
      setError(`Failed to read PDF file: ${(err as Error).message}`);
    }
  };

  const parsePageIndices = (rangeStr: string, maxPages: number): number[] => {
    const indices = new Set<number>();
    const parts = rangeStr.split(',').map(s => s.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let p = from; p <= to; p++) {
            indices.add(p - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const p = parseInt(part);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          indices.add(p - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    const pageIndices = parsePageIndices(pageRange, totalPages);
    if (pageIndices.length === 0) {
      setError(`Please specify valid pages between 1 and ${totalPages}. (e.g. "1-2" or "1, 3")`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach(p => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
      setSplitBlobUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(`Error extracting pages: ${(err as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!splitBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = splitBlobUrl;
    a.download = `extracted-pages-${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
    setFile(null);
    setTotalPages(0);
    setSplitBlobUrl(null);
    setError(null);
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
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            Choose a PDF file to split or extract
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Extract selected pages or split document ranges locally in your browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File summary */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">{file.name}</span>
                <span className="text-xs text-slate-400">
                  Total {totalPages} page{totalPages !== 1 ? 's' : ''} · {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white"
            >
              Change PDF
            </button>
          </div>

          {/* Range Configuration */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Pages to Extract
            </label>
            <input
              type="text"
              value={pageRange}
              onChange={e => setPageRange(e.target.value)}
              placeholder='e.g. "1-3" or "1, 4, 7"'
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono"
            />
            <p className="text-xs text-slate-400">
              Examples: <span className="font-mono text-indigo-400">1-{totalPages}</span> (all),{' '}
              <span className="font-mono text-indigo-400">1</span> (first page),{' '}
              <span className="font-mono text-indigo-400">1-3, 5</span> (range and individual).
            </p>

            <button
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors shadow"
            >
              {isProcessing ? 'Extracting Pages...' : 'Extract Selected Pages'}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Download split result */}
          {splitBlobUrl && (
            <div className="p-6 bg-gradient-to-tr from-emerald-950/30 to-indigo-950/30 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Extracted PDF Ready!</h4>
                  <p className="text-xs text-slate-300">
                    Your selected pages have been extracted into a new PDF document.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 shadow-lg shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Extracted PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
