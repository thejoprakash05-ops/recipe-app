'use client';

import { useState, useRef, useEffect } from 'react';

export default function ImageUpload({ initialFile, onAnalyzed, onClose }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (initialFile) handleFile(initialFile);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
    });

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType: file.type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      onAnalyzed(data.ingredients);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Find by Ingredients</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {!preview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
            }`}
          >
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-gray-600 font-medium">Drop an image here</p>
            <p className="text-gray-400 text-sm mt-1">or click to browse</p>
            <p className="text-gray-400 text-xs mt-3">
              Snap your fridge or pantry — AI will find matching recipes!
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="w-full h-52 object-cover rounded-xl" />
            {loading && (
              <div className="flex items-center justify-center gap-2 text-orange-600 py-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span className="text-sm font-medium">Analyzing with AI...</span>
              </div>
            )}
            {error && (
              <div className="text-center">
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={() => { setPreview(null); setError(null); }}
                  className="mt-2 text-sm text-orange-500 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
