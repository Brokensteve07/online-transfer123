import React, { useState, useEffect } from 'react';
import { QRPayload, UserProfile } from '../types';
import { ShieldCheck, AlertCircle, ArrowRight, HelpCircle, Scan, CheckCircle2, RotateCcw } from 'lucide-react';

interface QRDetectionModalProps {
  payload: QRPayload;
  userProfile: UserProfile;
  onConfirmAmount: (amount: number) => void;
  onRescan: () => void;
}

export const QRDetectionModal: React.FC<QRDetectionModalProps> = ({
  payload,
  userProfile,
  onConfirmAmount,
  onRescan,
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [customAmount, setCustomAmount] = useState<string>(
    payload.amount ? payload.amount.toString() : ''
  );
  const [amountError, setAmountError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 900); // 900ms scanning animation
    return () => clearTimeout(timer);
  }, []);

  const handleProceed = () => {
    const amt = parseFloat(customAmount);
    if (isNaN(amt) || amt <= 0) {
      setAmountError('Please enter a valid amount greater than 0.');
      return;
    }
    setAmountError(null);
    onConfirmAmount(amt);
  };

  if (isAnimating) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#3B82F6] flex items-center justify-center mx-auto animate-bounce">
          <Scan className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-lg text-[#0B1F33]">Analyzing QR Payload...</h3>
        <p className="text-xs text-slate-400">Identifying payment network, merchant, and encoded parameters</p>
      </div>
    );
  }

  // Handle Unsupported or Non-Payment QR
  if (payload.type === 'UNSUPPORTED_PAYMENT_QR' || payload.type === 'NON_PAYMENT_QR') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-fintech border border-slate-200/80 space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {payload.type === 'UNSUPPORTED_PAYMENT_QR' ? 'Unsupported Payment QR' : 'Non-Payment QR'}
            </span>
            <h2 className="text-xl font-bold text-[#0B1F33]">
              We couldn't identify this as a supported payment QR.
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              GlobePay currently parses Indian UPI, Japan PayQR, Thai PromptPay, SGQR, and standard EMVCo payment codes.
            </p>
          </div>

          {/* Raw payload safely previewed */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Raw Decoded Content</span>
            <p className="text-xs font-mono text-slate-700 break-all max-h-24 overflow-y-auto">
              {payload.rawText}
            </p>
          </div>

          <button
            onClick={onRescan}
            className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Scan Another QR</span>
          </button>
        </div>
      </div>
    );
  }

  // Supported QR Detection View (UPI or Foreign Payment QR)
  const isUPI = payload.type === 'UPI_QR';

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-fintech border border-slate-200/80 space-y-6">
        {/* Detection Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{payload.countryFlag || '🌐'}</span>
            <div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {isUPI ? '🇮🇳 UPI QR Detected' : `${payload.country || 'Payment'} QR Detected`}
              </span>
              <h2 className="text-lg font-bold text-[#0B1F33] mt-1">{payload.network}</h2>
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>

        {/* QR Details Breakdown Grid */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          {/* Merchant */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Merchant</span>
            <span className="font-bold text-[#0B1F33]">
              {payload.merchantName || <span className="text-slate-400 italic">Not available in QR</span>}
            </span>
          </div>

          {/* Merchant Identifier / VPA */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Merchant Identifier</span>
            <span className="font-mono text-slate-700">
              {payload.merchantId || <span className="text-slate-400 italic">Not available in QR</span>}
            </span>
          </div>

          {/* Country & Currency */}
          <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Currency</span>
            <span className="font-bold text-[#0B1F33]">
              {payload.currency || <span className="text-slate-400 italic">Not specified</span>}
            </span>
          </div>

          {/* Encoded Amount in QR */}
          <div className="flex justify-between items-center py-1.5">
            <span className="text-slate-500 font-medium">Encoded Amount</span>
            <span className="font-extrabold text-sm text-[#0B1F33]">
              {payload.amount ? (
                `${payload.currency} ${payload.amount.toLocaleString()}`
              ) : (
                <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">Not specified in QR</span>
              )}
            </span>
          </div>
        </div>

        {/* Amount Input (If specified or missing) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            {payload.amount ? 'Confirm Payment Amount' : 'Enter Payment Amount'} ({payload.currency || 'Currency'})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-base font-bold text-slate-400">
              {payload.currency || '$'}
            </span>
            <input
              type="number"
              step="any"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAmountError(null);
              }}
              placeholder="e.g. 1000"
              className="w-full pl-14 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold text-[#0B1F33]"
            />
          </div>
          {amountError && (
            <p className="text-xs text-rose-600 mt-1">{amountError}</p>
          )}
        </div>

        {/* Action CTAs */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleProceed}
            className="w-full py-4 rounded-2xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <span>Continue to Conversion Breakdown</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onRescan}
            className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold"
          >
            Scan a Different QR Code
          </button>
        </div>
      </div>
    </div>
  );
};
