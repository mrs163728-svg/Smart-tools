import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, RotateCcw, Trash2, ArrowUp, ArrowDown, FileText, Check } from 'lucide-react';

interface UploadedPdf {
  id: string;
  file: File;
  pageCount?: number;
}

export const MergePdf: React.FC = () => {
  const [files, setFiles] = useState<UploadedPdf[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    setError(null);

    const newFiles: UploadedPdf[] = [];
    for (let i = 0; i < selected.length; i++) {
      const f = selected[i];
      if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
        try {
          const buffer = await f.arrayBuffer();
          const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
          newFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            file: f,
            pageCount: doc.getPageCount(),
          });
        } catch {
          newFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            file: f,
          });
        }
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newFiles.length) return;
    [newFiles[index], newFiles[targetIdx]] = [newFiles[targetIdx], newFiles[index]];
    setFiles(newFiles);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    } catch (err) {
      setError(`Failed to merge PDF documents: ${(err as Error).message}`);
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlobUrl) return;
    const a = document.createElement('a');
    a.href = mergedBlobUrl;
    a.download = `merged-document-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
    setFiles([]);
    setMergedBlobUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">
          Select or drop PDF files to combine
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Add 2 or more PDF documents. Files are merged safely inside your browser.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Selected PDF Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{files.length} PDFs selected. Drag or use arrows to reorder pages:</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-400 font-semibold hover:underline"
            >
              + Add More PDFs
            </button>
          </div>

          <div className="space-y-2">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-200 block truncate">
                      {item.file.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {(item.file.size / 1024).toFixed(1)} KB {item.pageCount ? `· ${item.pageCount} pages` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveFile(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
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
              onClick={handleMerge}
              disabled={isMerging || files.length < 2}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isMerging ? 'Merging Documents...' : 'Merge PDFs Now'}
            </button>
          </div>
        </div>
      )}

      {/* Merged Success State */}
      {mergedBlobUrl && (
        <div className="p-6 bg-gradient-to-tr from-emerald-950/30 to-indigo-950/30 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Your Merged PDF is Ready!</h4>
              <p className="text-xs text-slate-300">
                All {files.length} documents have been successfully combined into a single file.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-2 shadow-lg shrink-0"
          >
            <Download className="w-4 h-4" />
            Download Merged PDF
          </button>
        </div>
      )}
    </div>
  );
};
