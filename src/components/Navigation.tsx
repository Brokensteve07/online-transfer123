import React from 'react';
import { Home, QrCode, History, User } from 'lucide-react';
import { UserProfile } from '../types';

interface NavigationProps {
  activeTab: 'home' | 'scan' | 'activity' | 'profile';
  setActiveTab: (tab: 'home' | 'scan' | 'activity' | 'profile') => void;
  userProfile: UserProfile;
  onOpenSetup: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSetup
}) => {
  return (
    <>
      {/* Desktop Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0B1F33] text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              G
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-[#0B1F33] tracking-tight">GlobePay</span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                  Travel Wallet
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Scan. Understand. Pay.</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-[#0B1F33] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'scan'
                  ? 'bg-[#3B82F6] text-white shadow-sm font-semibold'
                  : 'bg-blue-50 text-[#3B82F6] hover:bg-blue-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'activity'
                  ? 'bg-white text-[#0B1F33] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Activity</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-[#0B1F33] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>

          {/* User Currency Badge & Setup Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenSetup}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium border border-slate-200/80 transition-colors"
              title="Change user settings"
            >
              <span>{userProfile.countryFlag}</span>
              <span className="font-semibold">{userProfile.homeCurrency}</span>
              <span className="text-slate-400">({userProfile.name})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-2 pb-safe shadow-lg">
        <div className="flex items-center justify-around relative">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
              activeTab === 'home' ? 'text-[#3B82F6]' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
              activeTab === 'activity' ? 'text-[#3B82F6]' : 'text-slate-500'
            }`}
          >
            <History className="w-5 h-5 mb-1" />
            <span>Activity</span>
          </button>

          {/* Center Floating Scan CTA */}
          <button
            onClick={() => setActiveTab('scan')}
            className="flex flex-col items-center -mt-6 group focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-active:scale-95 transition-transform border-4 border-[#F7F9FC]">
              <QrCode className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-semibold text-[#0B1F33] mt-1">Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-3 text-xs font-medium transition-colors ${
              activeTab === 'profile' ? 'text-[#3B82F6]' : 'text-slate-500'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span>Profile</span>
          </button>

          <button
            onClick={onOpenSetup}
            className="flex flex-col items-center py-1 px-3 text-xs font-medium text-slate-400"
          >
            <span className="text-base leading-none mb-1">{userProfile.countryFlag}</span>
            <span>{userProfile.homeCurrency}</span>
          </button>
        </div>
      </div>
    </>
  );
};
