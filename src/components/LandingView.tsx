import React from 'react';
import { QrCode, ShieldCheck, Globe, Zap, Compass } from 'lucide-react';

interface LandingViewProps {
  onStartScan: () => void;
  onExploreDemo: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartScan,
  onExploreDemo
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide">
          <Globe className="w-3.5 h-3.5" />
          <span>International Traveler Edition</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1F33] tracking-tight leading-tight">
          Know what you're paying <br className="hidden sm:inline" />
          <span className="text-[#3B82F6]">before you pay.</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-normal">
          Scan a payment QR, understand the merchant and amount, and see the exact cost in your own currency.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartScan}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-3 transition-all active:scale-95"
          >
            <QrCode className="w-5 h-5" />
            <span>Scan a QR</span>
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#0B1F33] font-semibold text-base border border-slate-200 shadow-card flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <Compass className="w-5 h-5 text-slate-500" />
            <span>View Dashboard</span>
          </button>
        </div>

        {/* Small Trust Message */}
        <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Real-time QR reader • Zero FX markup guarantee</span>
        </div>
      </div>

      {/* Hero Conversion Illustration Card */}
      <div className="mt-12 sm:mt-16 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-fintech border border-slate-200/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="text-base">🇯🇵</span>
              <span className="font-semibold text-slate-800">Tokyo Ramen Store</span>
            </div>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-600">Japan PayQR</span>
          </div>

          <div className="space-y-4">
            {/* Foreign Currency Original */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Merchant Amount</span>
                <div className="text-2xl font-bold text-[#0B1F33]">¥10,000 <span className="text-sm font-medium text-slate-400">JPY</span></div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                ↓
              </div>
            </div>

            {/* Home Currency Converted */}
            <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase text-blue-600 tracking-wider">
                  Estimated Conversion
                </div>
                <div className="text-3xl font-extrabold text-[#0B1F33] tracking-tight">
                  ≈ ₹5,639 <span className="text-sm font-medium text-slate-500">INR</span>
                </div>
              </div>
              <span className="text-2xl">🇮🇳</span>
            </div>

            {/* Estimated Breakdown snippet */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="block text-slate-400">Rate</span>
                <span className="font-medium text-slate-700">1 JPY ≈ ₹0.552</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="block text-slate-400">Est. Total Fees</span>
                <span className="font-medium text-slate-700">₹119.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
