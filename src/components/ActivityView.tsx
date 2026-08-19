import React, { useState } from 'react';
import { ScanHistoryItem } from '../types';
import { formatCurrency } from '../services/currencyService';
import { clearScanHistory } from '../services/storageService';
import { History, Search, ShieldCheck, ChevronRight, Trash2, X, Globe, ArrowRight } from 'lucide-react';

interface ActivityViewProps {
  scans: ScanHistoryItem[];
  onRefresh: () => void;
  onStartScan: () => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  scans,
  onRefresh,
  onStartScan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);

  const filteredScans = scans.filter(
    s => s.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.network.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all scan history?')) {
      clearScanHistory();
      onRefresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B1F33]">Scan Activity</h1>
          <p className="text-xs text-slate-500">History of your scanned payment QR codes</p>
        </div>

        {scans.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-1 text-slate-400 hover:text-rose-600 text-xs font-medium px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by merchant, country, or network..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-card text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
      </div>

      {/* Scan History Items List */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-3">
        {filteredScans.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-500 font-medium">No matching scans found.</p>
            <button
              onClick={onStartScan}
              className="text-xs font-semibold text-[#3B82F6] hover:underline"
            >
              Scan a QR code now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredScans.map(scan => (
              <div
                key={scan.id}
                onClick={() => setSelectedScan(scan)}
                className="py-4 flex items-center justify-between hover:bg-slate-50 px-3 rounded-2xl cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3.5">
                  <span className="text-3xl">{scan.countryFlag}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-[#0B1F33] group-hover:text-[#3B82F6] transition-colors">
                        {scan.merchantName}
                      </h3>
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                        Not Processed
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                      <span>{scan.country}</span>
                      <span>•</span>
                      <span>{scan.network}</span>
                      <span>•</span>
                      <span>{new Date(scan.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-3">
                  <div>
                    <div className="font-extrabold text-sm text-[#0B1F33]">
                      {formatCurrency(scan.originalAmount, scan.originalCurrency)}
                    </div>
                    <div className="text-xs font-semibold text-[#3B82F6]">
                      ≈ {formatCurrency(scan.totalEstimatedCost, scan.homeCurrency)}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Scan Inspection Modal (Screen 11) */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedScan.countryFlag}</span>
                <div>
                  <h3 className="font-extrabold text-lg text-[#0B1F33]">{selectedScan.merchantName}</h3>
                  <p className="text-xs text-slate-500">{selectedScan.country} • {selectedScan.network}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center space-x-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Payment Not Processed</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono">Informational Only</span>
            </div>

            {/* Complete Scan Details (Screen 11 requirements) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Merchant Identifier</span>
                <span className="font-mono text-slate-800">{selectedScan.merchantId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Payment Network</span>
                <span className="font-semibold text-slate-800">{selectedScan.network}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Original Amount</span>
                <span className="font-bold text-[#0B1F33]">
                  {formatCurrency(selectedScan.originalAmount, selectedScan.originalCurrency)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Home Currency Estimate</span>
                <span className="font-bold text-[#3B82F6]">
                  {formatCurrency(selectedScan.totalEstimatedCost, selectedScan.homeCurrency)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Exchange Rate</span>
                <span className="font-medium text-slate-700">1 {selectedScan.originalCurrency} ≈ {selectedScan.exchangeRate} {selectedScan.homeCurrency}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Estimated FX Fee</span>
                <span className="font-medium text-slate-700">{formatCurrency(selectedScan.estimatedFxFee, selectedScan.homeCurrency)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-500">Estimated Service Fee</span>
                <span className="font-medium text-slate-700">{formatCurrency(selectedScan.estimatedServiceFee, selectedScan.homeCurrency)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-700">{new Date(selectedScan.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedScan(null)}
              className="w-full py-3 rounded-2xl bg-[#0B1F33] hover:bg-slate-800 text-white font-bold text-xs"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
