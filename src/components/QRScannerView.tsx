import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { QRPayload } from '../types';
import { parseQRCodeData } from '../services/qrParser';
import { SAMPLE_QRS, SampleQR } from '../constants/sampleQRs';
import { Camera, Upload, AlertTriangle, ShieldCheck, RefreshCw, X, Sparkles, SwitchCamera } from 'lucide-react';

interface QRScannerViewProps {
  onQRDecoded: (payload: QRPayload) => void;
  onClose?: () => void;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({
  onQRDecoded,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default facingMode to 'environment' (REAR BACK CAMERA on mobile phones)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraState, setCameraState] = useState<'INITIALIZING' | 'ACTIVE' | 'PERMISSION_DENIED' | 'UNAVAILABLE' | 'ERROR'>('INITIALIZING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannerInstance, setScannerInstance] = useState<QrScanner | null>(null);
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

  // Initialize Camera QR Scanner with Rear Camera priority
  useEffect(() => {
    let scanner: QrScanner | null = null;

    const startCamera = async () => {
      if (!videoRef.current) return;

      try {
        setCameraState('INITIALIZING');
        setErrorMessage(null);

        // Create QrScanner instance targeting mobile rear camera
        scanner = new QrScanner(
          videoRef.current,
          (result) => {
            if (result && result.data) {
              const decoded = parseQRCodeData(result.data);
              scanner?.stop();
              onQRDecoded(decoded);
            }
          },
          {
            highlightScanRegion: false,
            highlightCodeOutline: false,
            maxScansPerSecond: 5,
            preferredCamera: facingMode, // Explicitly 'environment' for rear camera or 'user' for front camera
          }
        );

        await scanner.start();
        setScannerInstance(scanner);
        setCameraState('ACTIVE');
      } catch (err: any) {
        console.error('GlobePay Camera Scanner Error:', err);
        if (err?.name === 'NotAllowedError' || err?.message?.includes('Permission')) {
          setCameraState('PERMISSION_DENIED');
          setErrorMessage('Camera permission is required to scan physical QR codes.');
        } else {
          setCameraState('UNAVAILABLE');
          setErrorMessage(err?.message || 'Rear camera unavailable. Try uploading an image or using sample QRs.');
        }
      }
    };

    startCamera();

    return () => {
      if (scanner) {
        scanner.stop();
        scanner.destroy();
      }
    };
  }, [facingMode, onQRDecoded]);

  // Toggle Camera (Rear vs Front)
  const handleToggleCamera = () => {
    if (scannerInstance) {
      scannerInstance.stop();
    }
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle File Upload QR decoding
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingFile(true);
      setErrorMessage(null);
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });

      if (result && result.data) {
        const decoded = parseQRCodeData(result.data);
        onQRDecoded(decoded);
      } else {
        setErrorMessage("Couldn't read a QR code from this image. Try moving closer or improving lighting.");
      }
    } catch (e: any) {
      console.warn('Image QR decoding failed:', e);
      setErrorMessage("Couldn't read a valid QR code from this image. Please try another image.");
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Trigger preset sample QR
  const handleSelectSample = (sample: SampleQR) => {
    const decoded = parseQRCodeData(sample.payload);
    onQRDecoded(decoded);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {facingMode === 'environment' ? '📱 Mobile Rear Camera' : '📷 Front Camera'}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-[#0B1F33]">Scan payment QR</h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Point your phone camera at a payment QR code.
        </p>
      </div>

      {/* Main Scanner Container */}
      <div className="relative bg-[#0B1F33] rounded-3xl overflow-hidden shadow-fintech border-2 border-slate-800 aspect-square max-w-sm mx-auto flex items-center justify-center">
        {/* Video Camera Preview */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            cameraState === 'ACTIVE' ? 'opacity-100' : 'opacity-0'
          }`}
          playsInline
          muted
        ></video>

        {/* Camera Active Square Scanning Frame */}
        {cameraState === 'ACTIVE' && (
          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <div className="relative w-56 h-56 border-2 border-blue-400/60 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-[1px]">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#3B82F6] rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#3B82F6] rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#3B82F6] rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#3B82F6] rounded-br-xl"></div>
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent shadow-[0_0_15px_#3B82F6] animate-scan-line"></div>
            </div>
          </div>
        )}

        {/* Initializing Loading State */}
        {cameraState === 'INITIALIZING' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3 bg-[#0B1F33]">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-xs text-slate-300 font-medium">Starting rear camera stream...</p>
          </div>
        )}

        {/* Camera Permission Denied / Error State */}
        {(cameraState === 'PERMISSION_DENIED' || cameraState === 'UNAVAILABLE') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-4 bg-[#0B1F33]">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="font-bold text-sm text-white">
                {cameraState === 'PERMISSION_DENIED' ? 'Camera Permission Required' : 'Rear Camera Unavailable'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {errorMessage || 'GlobePay needs rear camera access to scan physical QR codes.'}
              </p>
            </div>

            <div className="flex flex-col w-full space-y-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                Upload QR Image Instead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Frame Guidance Message */}
      <div className="text-center space-y-2">
        <p className="text-xs text-slate-500 font-medium">
          Position the QR code inside the frame
        </p>

        {/* Secondary Upload Image & Switch Camera Option */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={handleToggleCamera}
            className="px-3.5 py-2.5 rounded-2xl bg-[#0B1F33] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all active:scale-95"
            title="Switch between front and rear camera"
          >
            <SwitchCamera className="w-4 h-4 text-blue-400" />
            <span>Switch Cam</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingFile}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm flex items-center space-x-2 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>{isProcessingFile ? 'Scanning Image...' : 'Upload QR image'}</span>
          </button>

          <button
            onClick={() => setShowPresets(!showPresets)}
            className="px-3.5 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#3B82F6] text-xs font-semibold border border-blue-100 flex items-center space-x-1.5 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* Error Toast */}
      {errorMessage && cameraState === 'ACTIVE' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Informational Disclaimer */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-card flex items-start space-x-3 text-xs text-slate-500">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700 font-semibold">Payment Information Only:</strong> GlobePay reads and parses QR codes to convert currencies and estimate fees. It does not process real payments or handle funds.
        </p>
      </div>

      {/* Sample Preset Drawer */}
      {showPresets && (
        <div className="bg-white rounded-3xl p-5 shadow-fintech border border-blue-100 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-xs text-[#0B1F33]">Test with Sample Payment QRs</h4>
            </div>
            <span className="text-[10px] text-slate-400">1-click test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_QRS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{sample.flag}</span>
                  <span className="text-[10px] font-bold text-blue-600 group-hover:underline">Scan</span>
                </div>
                <div className="font-bold text-xs text-[#0B1F33] truncate">{sample.label}</div>
                <div className="text-[11px] text-slate-500">{sample.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
