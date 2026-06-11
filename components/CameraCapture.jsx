'use client';

import { useState, useRef, useEffect } from 'react';

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera unavailable — open the app on localhost or over HTTPS.');
      return;
    }

    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setReady(true);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Camera access denied');
      });

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg', 0.9);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Take Photo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="relative bg-black aspect-video">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Starting camera...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 p-6 text-center">
              <svg className="w-12 h-12 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
              <p className="text-sm">{error}</p>
              <p className="text-xs text-gray-300">Camera requires HTTPS or localhost. Allow camera access in your browser settings and try again.</p>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="p-4 flex justify-center">
          <button
            onClick={capture}
            disabled={!ready}
            className="flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-full font-semibold disabled:opacity-40 hover:bg-orange-700 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}
