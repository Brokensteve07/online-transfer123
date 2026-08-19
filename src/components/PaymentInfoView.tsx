import React, { useState } from 'react';
import { QRPayload, UserProfile, ScanHistoryItem } from '../types';
import { calculateFees } from '../services/feeCalculator';
import { formatCurrency } from '../services/currencyService';
import { addScanHistoryItem } from '../services/storageService';
import { ShieldCheck, Info, CheckCircle, ExternalLink, ArrowLeft, RefreshCcw, AlertTriangle } from 'lucide-react';

interface PaymentInfoViewProps {
  payload: QRPayload;
  amount: number;
  userProfile: UserProfile;
  onFinish: () => void;
  onBackToScan: () => void;
}

export const PaymentInfoView: React.FC<PaymentInfoViewProps> = ({
  payload,
  amount,
  userProfile,
  onFinish,
  onBackToScan,
}) => {
  const [showExecutionModal, setShowExecutionModal] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);

  const originalCurrency = payload.currency || 'USD';
  const feeDetails = calculateFees(amount, originalCurrency, userProfile.homeCurrency);

  const isUPI = payload.type === 'UPI_QR';
  const isSameCurrency = originalCurrency.toUpperCase() === userProfile.homeCurrency.toUpperCase();

  // Save scan to local history on action
  const handleSaveAndComplete = () => {
    if (!hasSaved) {
      const newScan: ScanHistoryItem = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        merchantName: payload.merchantName || 'Merchant QR',
        merchantId: payload.merchantId,
        country: payload.country || 'International',
        countryFlag: payload.countryFlag || '🌐',
        network: payload.network,
        originalCurrency,
        originalAmount: amount,
        homeCurrency: userProfile.homeCurrency,
        convertedAmount: feeDetails.baseConvertedAmount,
        exchangeRate: feeDetails.exchangeRate,
        estimatedFxFee: feeDetails.fxFeeAmount,
        estimatedServiceFee: feeDetails.serviceFeeAmount,
        totalEstimatedCost: feeDetails.totalEstimatedCost,
        status: 'NOT_PROCESSED',
        rawPayload: payload.rawText,
      };

      addScanHistoryItem(newScan);
      setHasSaved(true);
    }
    onFinish();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToScan}
          className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Rescan</span>
        </button>

        <span className="text-[11px] font-bold uppercase bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
          Payment Information Only
        </span>
      </div>

      {/* Main Payment Conversion Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-fintech border border-slate-200/80 space-y-6">
        {/* Merchant Banner */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{payload.countryFlag || '🌐'}</span>
            <div>
              <h2 className="text-xl font-extrabold text-[#0B1F33]">
                {payload.merchantName || 'Merchant Payment'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {payload.country || 'International'} • {payload.network}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
            {payload.merchantId ? payload.merchantId.substring(0, 18) : 'Verified QR'}
          </span>
        </div>

        {/* Large Conversion Hero Box */}
        <div className="bg-[#0B1F33] text-white rounded-3xl p-6 shadow-lg relative overflow-hidden space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-slate-300">Merchant Receives</span>
              <div className="text-2xl font-extrabold tracking-tight text-white mt-0.5">
                {formatCurrency(amount, originalCurrency)}
              </div>
            </div>
            <span className="text-xl">{payload.countryFlag || '🌐'}</span>
          </div>

          <div className="h-px bg-slate-700/60 w-full"></div>

          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Your Estimated Cost ({userProfile.homeCurrency})
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
                ≈ {formatCurrency(feeDetails.totalEstimatedCost, userProfile.homeCurrency)}
              </div>
            </div>
            <span className="text-2xl">{userProfile.countryFlag}</span>
          </div>
        </div>

        {/* Fee & Exchange Rate Breakdown */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div className="font-bold text-[#0B1F33] pb-1 border-b border-slate-200/60 flex items-center justify-between">
            <span>Fee Breakdown</span>
            <span className="text-[10px] text-slate-400 font-normal">
              Rate Source: {feeDetails.rateSource} ({feeDetails.lastUpdated})
            </span>
          </div>

          {/* Exchange Rate */}
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500">Exchange Rate</span>
            <span className="font-semibold text-slate-800">
              {isSameCurrency
                ? '1:1 (No FX conversion)'
                : `1 ${originalCurrency} = ${formatCurrency(feeDetails.exchangeRate, userProfile.homeCurrency)}`}
            </span>
          </div>

          {/* Base Conversion */}
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500">Base Converted Amount</span>
            <span className="font-medium text-slate-800">
              {formatCurrency(feeDetails.baseConvertedAmount, userProfile.homeCurrency)}
            </span>
          </div>

          {/* FX Markup Fee */}
          {!isSameCurrency && (
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">
                Estimated FX Markup ({feeDetails.fxMarkupPercent}%)
              </span>
              <span className="font-medium text-slate-800">
                + {formatCurrency(feeDetails.fxFeeAmount, userProfile.homeCurrency)}
              </span>
            </div>
          )}

          {/* Service Fee */}
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-500">Estimated Service Fee</span>
            <span className="font-medium text-slate-800">
              {feeDetails.serviceFeeAmount > 0
                ? `+ ${formatCurrency(feeDetails.serviceFeeAmount, userProfile.homeCurrency)}`
                : '₹0 (Free)'}
            </span>
          </div>

          {/* Total Estimated Cost */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-extrabold text-sm text-[#0B1F33]">
            <span>Estimated Total</span>
            <span className="text-[#3B82F6]">
              {formatCurrency(feeDetails.totalEstimatedCost, userProfile.homeCurrency)}
            </span>
          </div>
        </div>

        {/* Disclaimer Status Badge */}
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start space-x-3 text-xs text-emerald-800">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Payment Not Processed</span>
            <p className="text-[11px] text-emerald-700 leading-normal">
              GlobePay has calculated this cost breakdown for your information. No funds have been transferred or deducted.
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setShowExecutionModal(true)}
            className="w-full py-4 rounded-2xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <span>Open Payment Method</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveAndComplete}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-colors"
          >
            Save to History & Return Home
          </button>
        </div>
      </div>

      {/* Informational Execution Disclaimer Modal */}
      {showExecutionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#3B82F6] flex items-center justify-center mx-auto border border-blue-100">
              <Info className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#0B1F33]">
                Payment execution is not available in V1.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                GlobePay currently helps you understand the payment and FX costs before you pay. Real money transfer is disabled in this prototype.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-500 border border-slate-200">
              <span className="font-semibold text-slate-700 block">Prototype Status</span>
              Information Only • Zero Financial Connection
            </div>

            <button
              onClick={() => {
                setShowExecutionModal(false);
                handleSaveAndComplete();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#0B1F33] hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
