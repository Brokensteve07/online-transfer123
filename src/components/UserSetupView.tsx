import React, { useState } from 'react';
import { UserProfile } from '../types';
import { SUPPORTED_CURRENCIES, DESTINATION_COUNTRIES } from '../constants/currencies';
import { User, Globe, Check, Search, ShieldAlert } from 'lucide-react';

interface UserSetupViewProps {
  currentProfile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose?: () => void;
}

export const UserSetupView: React.FC<UserSetupViewProps> = ({
  currentProfile,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    DESTINATION_COUNTRIES.find(c => c.name === currentProfile.country)?.code || 'IN'
  );
  const [homeCurrency, setHomeCurrency] = useState(currentProfile.homeCurrency);
  const [currencySearch, setCurrencySearch] = useState('');

  const selectedCountry = DESTINATION_COUNTRIES.find(c => c.code === selectedCountryCode) || DESTINATION_COUNTRIES[1];

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(
    c => c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
         c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...currentProfile,
      name: name.trim() || 'Traveler',
      country: selectedCountry.name,
      countryFlag: selectedCountry.flag,
      homeCurrency,
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-fintech border border-slate-200/80 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Prototype Account</span>
            </div>
            <h2 className="text-xl font-bold text-[#0B1F33] mt-2">Traveler Profile & Preferences</h2>
            <p className="text-xs text-slate-500 mt-0.5">Customize your home currency and origin country</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-2"
            >
              ✕
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Your Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Nikhil"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium text-[#0B1F33]"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Home Country Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Origin Country
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DESTINATION_COUNTRIES.slice(0, 6).map(country => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    setSelectedCountryCode(country.code);
                    setHomeCurrency(country.currency);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center space-x-2 transition-all ${
                    selectedCountryCode === country.code
                      ? 'border-[#3B82F6] bg-blue-50 text-[#0B1F33] font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  <span className="truncate">{country.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Home Currency Searchable Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Home Currency (Conversions calculated into this currency)
            </label>
            <div className="relative mb-2">
              <input
                type="text"
                value={currencySearch}
                onChange={e => setCurrencySearch(e.target.value)}
                placeholder="Search currency e.g. INR, USD, EUR..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-white">
              {filteredCurrencies.map(currency => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => setHomeCurrency(currency.code)}
                  className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors ${
                    homeCurrency === currency.code
                      ? 'bg-blue-50 text-[#3B82F6] font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{currency.flag}</span>
                    <span className="font-bold text-[#0B1F33]">{currency.code}</span>
                    <span className="text-slate-500">({currency.symbol})</span>
                    <span className="text-slate-400 truncate text-[11px]">{currency.name}</span>
                  </div>
                  {homeCurrency === currency.code && (
                    <Check className="w-4 h-4 text-[#3B82F6]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Non-KYC Info notice */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">Prototype Disclaimer</div>
            <p>
              No real identity verification is performed. GlobePay only stores your local currency preferences in your browser.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            Save Preferences & Start Scanning
          </button>
        </form>
      </div>
    </div>
  );
};
