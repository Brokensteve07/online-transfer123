import React, { useState } from 'react';
import { UserProfile } from '../types';
import { SUPPORTED_CURRENCIES, DESTINATION_COUNTRIES } from '../constants/currencies';
import { User, Shield, Bell, Moon, Sun, Lock, ShieldAlert, Check, RefreshCw, KeyRound } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
}) => {
  const [pinCode, setPinCode] = useState(profile.pinCode || '1234');
  const [pinSaved, setPinSaved] = useState(false);

  const handleCurrencyChange = (newCurrency: string) => {
    onUpdateProfile({
      ...profile,
      homeCurrency: newCurrency,
    });
  };

  const handleNotificationsToggle = () => {
    onUpdateProfile({
      ...profile,
      notifications: !profile.notifications,
    });
  };

  const handleSavePin = () => {
    onUpdateProfile({
      ...profile,
      pinCode,
    });
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-8">
      {/* Profile Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0B1F33] text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-[#0B1F33]">{profile.name}</h1>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                Prototype Account
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Origin: {profile.countryFlag} {profile.country} • Home Currency: {profile.homeCurrency}
            </p>
          </div>
        </div>
      </div>

      {/* Prototype Status Card (Screen 12 requirement) */}
      <div className="bg-gradient-to-r from-[#0B1F33] to-[#132B45] text-white rounded-3xl p-6 shadow-fintech space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">System Prototype Status</h3>
          </div>
          <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-amber-400/30 uppercase">
            V1 Prototype
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Payment execution disabled.</strong> GlobePay is configured as an informational QR parser and cost conversion engine only. No bank or UPI credentials are required or stored.
        </p>
      </div>

      {/* Preferences & Settings Section */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-6">
        <h3 className="font-bold text-base text-[#0B1F33] border-b border-slate-100 pb-3">
          App Preferences
        </h3>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-[#0B1F33]">Home Currency Preference</label>
            <p className="text-[11px] text-slate-400">All foreign QR payments will convert into this currency</p>
          </div>
          <select
            value={profile.homeCurrency}
            onChange={e => handleCurrencyChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0B1F33] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-4 h-4 text-slate-400" />
            <div>
              <label className="text-xs font-bold text-[#0B1F33]">FX Rate Notifications</label>
              <p className="text-[11px] text-slate-400">Receive alerts on major travel currency changes</p>
            </div>
          </div>
          <button
            onClick={handleNotificationsToggle}
            className={`w-11 h-6 rounded-full transition-colors relative p-1 ${
              profile.notifications ? 'bg-[#3B82F6]' : 'bg-slate-200'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              profile.notifications ? 'translate-x-5' : 'translate-x-0'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Demo Security PIN Section */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-base text-[#0B1F33]">Security & Access PIN</h3>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-[#0B1F33]">Demo Security PIN</label>
            <p className="text-[11px] text-slate-400">Local security code for quick app unlocks</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="password"
              maxLength={4}
              value={pinCode}
              onChange={e => setPinCode(e.target.value)}
              className="w-20 px-3 py-1.5 text-center text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
            />
            <button
              onClick={handleSavePin}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              {pinSaved ? <Check className="w-4 h-4 text-emerald-600" /> : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Privacy & Reset Section */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-base text-[#0B1F33]">Data Privacy & Security</h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          GlobePay strictly respects traveler privacy. This prototype does not collect passport numbers, financial credentials, or bank account tokens. Only your locally saved preferences and scan logs remain in your browser storage.
        </p>

        <button
          onClick={onResetData}
          className="flex items-center space-x-2 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-semibold border border-rose-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Prototype Storage Data</span>
        </button>
      </div>
    </div>
  );
};
