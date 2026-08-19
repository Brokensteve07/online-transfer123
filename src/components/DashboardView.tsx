import React, { useState } from 'react';
import { UserProfile, ScanHistoryItem, WalletState, DestinationCountry } from '../types';
import { DESTINATION_COUNTRIES } from '../constants/currencies';
import { getExchangeRate, formatCurrency } from '../services/currencyService';
import { QrCode, Wallet, Plus, RefreshCw, ChevronRight, ShieldCheck, History, ArrowUpRight } from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  wallet: WalletState;
  scanHistory: ScanHistoryItem[];
  onStartScan: () => void;
  onSelectHistoryItem: (item: ScanHistoryItem) => void;
  onOpenSetup: () => void;
  onOpenAddCash: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  wallet,
  scanHistory,
  onStartScan,
  onSelectHistoryItem,
  onOpenSetup,
  onOpenAddCash,
}) => {
  const [selectedDestCode, setSelectedDestCode] = useState('JP');
  
  const destCountry = DESTINATION_COUNTRIES.find(c => c.code === selectedDestCode) || DESTINATION_COUNTRIES[0];
  const { rate, source, lastUpdated } = getExchangeRate(destCountry.currency, userProfile.homeCurrency);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-8">
      {/* Top Greeting & Travel Destination */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Welcome Back
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight">
            Good day, {userProfile.name} 👋
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Where are you paying today?
          </p>
        </div>

        {/* Travel Destination Selector */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
          <span className="text-2xl">{destCountry.flag}</span>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400">
              Paying in Destination
            </label>
            <select
              value={selectedDestCode}
              onChange={e => setSelectedDestCode(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#0B1F33] focus:outline-none cursor-pointer pr-2"
            >
              {DESTINATION_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 💳 TRAVEL WALLET CARD */}
      <div className="bg-gradient-to-br from-[#0B1F33] via-[#132B45] to-[#0B1F33] text-white rounded-3xl p-6 sm:p-8 shadow-fintech relative overflow-hidden space-y-6 border border-slate-700/60">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xs font-extrabold tracking-wider uppercase text-slate-300">
              GlobePay Travel Wallet
            </span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-emerald-400/30 uppercase">
            Demo Cash Balance
          </span>
        </div>

        {/* Main Wallet Balance */}
        <div className="relative z-10 space-y-1">
          <span className="text-xs text-slate-300 font-medium">Available Budget ({userProfile.homeCurrency})</span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {formatCurrency(wallet.balanceHomeCurrency, userProfile.homeCurrency)}
          </div>
        </div>

        {/* Multi-Currency Balances Bar */}
        <div className="relative z-10 grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
          {wallet.multiCurrencyHoldings.map(h => (
            <div key={h.currency} className="space-y-0.5">
              <span className="text-[10px] text-slate-300 flex items-center space-x-1">
                <span>{h.flag}</span>
                <span>{h.currency}</span>
              </span>
              <div className="font-bold text-white text-xs">
                {formatCurrency(h.amount, h.currency)}
              </div>
            </div>
          ))}
        </div>

        {/* Wallet Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onStartScan}
            className="flex-1 py-3.5 bg-[#3B82F6] hover:bg-blue-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Payment QR</span>
          </button>
          
          <button
            onClick={onOpenAddCash}
            className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl text-xs border border-white/20 flex items-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Demo Cash</span>
          </button>
        </div>

        {/* Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Currency Exchange Rate & Spent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spent Today Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Spent Today ({userProfile.homeCurrency})
            </span>
            <div className="text-2xl font-bold text-[#0B1F33]">
              {formatCurrency(wallet.spentTodayHomeCurrency, userProfile.homeCurrency)}
            </div>
            <p className="text-[11px] font-semibold text-emerald-600">
              Saved ~{formatCurrency(wallet.savedFxHomeCurrency, userProfile.homeCurrency)} in FX fees
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Compact Currency Exchange Ticker */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>FX Ticker</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                {source === 'LIVE' ? 'LIVE API' : 'SIMULATED DEMO'}
              </span>
            </div>

            <div className="text-xl font-extrabold text-[#0B1F33]">
              {destCountry.currency} → {userProfile.homeCurrency}
            </div>

            <div className="text-xs font-semibold text-[#3B82F6]">
              1 {destCountry.currency} ≈ {formatCurrency(rate, userProfile.homeCurrency)}
            </div>
            <p className="text-[10px] text-slate-400">
              Source: {source} ({lastUpdated})
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-[#0B1F33] text-base">Recent Scans</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Saved locally</span>
        </div>

        {scanHistory.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500">No payment QRs scanned yet.</p>
            <button
              onClick={onStartScan}
              className="text-xs font-semibold text-[#3B82F6] hover:underline"
            >
              Scan your first QR code
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {scanHistory.slice(0, 5).map(scan => (
              <div
                key={scan.id}
                onClick={() => onSelectHistoryItem(scan)}
                className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-2xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{scan.countryFlag}</span>
                  <div>
                    <h4 className="font-bold text-sm text-[#0B1F33] group-hover:text-[#3B82F6] transition-colors">
                      {scan.merchantName}
                    </h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <span>{scan.network}</span>
                      <span>•</span>
                      <span>{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-3">
                  <div>
                    <div className="font-bold text-sm text-[#0B1F33]">
                      {formatCurrency(scan.originalAmount, scan.originalCurrency)}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      ≈ {formatCurrency(scan.totalEstimatedCost, scan.homeCurrency)}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
