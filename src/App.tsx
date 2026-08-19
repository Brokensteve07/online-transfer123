import React, { useState, useEffect } from 'react';
import { UserProfile, ScanHistoryItem, QRPayload } from './types';
import { getStoredProfile, saveStoredProfile, getScanHistory, clearScanHistory } from './services/storageService';
import { fetchLiveRates } from './services/currencyService';

import { Navigation } from './components/Navigation';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { QRScannerView } from './components/QRScannerView';
import { QRDetectionModal } from './components/QRDetectionModal';
import { PaymentInfoView } from './components/PaymentInfoView';
import { ActivityView } from './components/ActivityView';
import { ProfileView } from './components/ProfileView';
import { UserSetupView } from './components/UserSetupView';

export function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'home' | 'scan' | 'activity' | 'profile'>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredProfile());
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>(getScanHistory());

  // Current active scanning flow states
  const [decodedPayload, setDecodedPayload] = useState<QRPayload | null>(null);
  const [confirmedAmount, setConfirmedAmount] = useState<number | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);

  // Fetch live FX exchange rates on initial load
  useEffect(() => {
    fetchLiveRates();
  }, []);

  // Update profile
  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    saveStoredProfile(updated);
    setIsSetupOpen(false);
  };

  // Refresh local history
  const handleRefreshHistory = () => {
    setScanHistory(getScanHistory());
  };

  // Handle QR Decoding from camera or image upload
  const handleQRDecoded = (payload: QRPayload) => {
    setDecodedPayload(payload);
  };

  // Reset current scanning flow back to camera
  const handleRescan = () => {
    setDecodedPayload(null);
    setConfirmedAmount(null);
  };

  // Finish scan flow and return home
  const handleFinishScanFlow = () => {
    setDecodedPayload(null);
    setConfirmedAmount(null);
    handleRefreshHistory();
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#111827] flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          handleRescan();
          setActiveTab(tab);
        }}
        userProfile={userProfile}
        onOpenSetup={() => setIsSetupOpen(true)}
      />

      {/* Main App Content View Switcher */}
      <main className="flex-1">
        {/* User Setup Modal Drawer */}
        {isSetupOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <UserSetupView
                currentProfile={userProfile}
                onSave={handleSaveProfile}
                onClose={() => setIsSetupOpen(false)}
              />
            </div>
          </div>
        )}

        {/* 1. Landing View */}
        {activeTab === 'landing' && (
          <LandingView
            onStartScan={() => setActiveTab('scan')}
            onExploreDemo={() => setActiveTab('home')}
          />
        )}

        {/* 2. Home Dashboard */}
        {activeTab === 'home' && !decodedPayload && (
          <DashboardView
            userProfile={userProfile}
            scanHistory={scanHistory}
            onStartScan={() => setActiveTab('scan')}
            onSelectHistoryItem={(scan) => setActiveTab('activity')}
            onOpenSetup={() => setIsSetupOpen(true)}
          />
        )}

        {/* 3. Real QR Camera Scanner */}
        {activeTab === 'scan' && !decodedPayload && (
          <QRScannerView
            onQRDecoded={handleQRDecoded}
            onClose={() => setActiveTab('home')}
          />
        )}

        {/* 4. QR Detection & Amount Confirmation Screen */}
        {decodedPayload && confirmedAmount === null && (
          <QRDetectionModal
            payload={decodedPayload}
            userProfile={userProfile}
            onConfirmAmount={(amt) => setConfirmedAmount(amt)}
            onRescan={handleRescan}
          />
        )}

        {/* 5. Payment Information & Conversion Breakdown Screen */}
        {decodedPayload && confirmedAmount !== null && (
          <PaymentInfoView
            payload={decodedPayload}
            amount={confirmedAmount}
            userProfile={userProfile}
            onFinish={handleFinishScanFlow}
            onBackToScan={handleRescan}
          />
        )}

        {/* 6. Activity View */}
        {activeTab === 'activity' && !decodedPayload && (
          <ActivityView
            scans={scanHistory}
            onRefresh={handleRefreshHistory}
            onStartScan={() => setActiveTab('scan')}
          />
        )}

        {/* 7. Profile View */}
        {activeTab === 'profile' && !decodedPayload && (
          <ProfileView
            profile={userProfile}
            onUpdateProfile={handleSaveProfile}
            onResetData={() => {
              clearScanHistory();
              handleRefreshHistory();
            }}
          />
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-6 border-t border-slate-200/60 text-center text-xs text-slate-400 space-y-1 hidden md:block">
        <p className="font-semibold text-slate-600">GlobePay — Scan. Understand. Pay.</p>
        <p>Payment information prototype only. No money is transferred or processed through this web application.</p>
      </footer>
    </div>
  );
}
export default App;
