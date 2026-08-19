import { UserProfile, ScanHistoryItem } from '../types';

const PROFILE_KEY = 'globepay_user_profile';
const SCANS_KEY = 'globepay_scan_history';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Nikhil',
  country: 'India',
  countryFlag: '🇮🇳',
  homeCurrency: 'INR',
  theme: 'light',
  notifications: true,
  isPrototypeAccount: true,
};

const SAMPLE_INITIAL_SCANS: ScanHistoryItem[] = [
  {
    id: 'scan-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    merchantName: 'Tokyo Ramen',
    merchantId: 'jp.ramen.shibuya@payqr',
    country: 'Japan',
    countryFlag: '🇯🇵',
    network: 'Japan PayQR',
    originalCurrency: 'JPY',
    originalAmount: 10000,
    homeCurrency: 'INR',
    convertedAmount: 5520,
    exchangeRate: 0.552,
    estimatedFxFee: 69,
    estimatedServiceFee: 50,
    totalEstimatedCost: 5639,
    status: 'NOT_PROCESSED',
    rawPayload: 'https://payqr.jp/pay?m=TokyoRamen&amt=10000&cur=JPY'
  },
  {
    id: 'scan-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    merchantName: 'Tokyo Metro',
    merchantId: 'metro_ticket_shinjuku',
    country: 'Japan',
    countryFlag: '🇯🇵',
    network: 'Japan PayQR',
    originalCurrency: 'JPY',
    originalAmount: 800,
    homeCurrency: 'INR',
    convertedAmount: 441.6,
    exchangeRate: 0.552,
    estimatedFxFee: 5.5,
    estimatedServiceFee: 10,
    totalEstimatedCost: 457.1,
    status: 'NOT_PROCESSED',
    rawPayload: 'https://payqr.jp/pay?m=TokyoMetro&amt=800&cur=JPY'
  },
  {
    id: 'scan-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    merchantName: 'Hyderabad Cafe',
    merchantId: 'hyderabadcafe@upi',
    country: 'India',
    countryFlag: '🇮🇳',
    network: 'UPI',
    originalCurrency: 'INR',
    originalAmount: 1000,
    homeCurrency: 'INR',
    convertedAmount: 1000,
    exchangeRate: 1.0,
    estimatedFxFee: 0,
    estimatedServiceFee: 0,
    totalEstimatedCost: 1000,
    status: 'NOT_PROCESSED',
    rawPayload: 'upi://pay?pa=hyderabadcafe@upi&pn=Hyderabad%20Cafe&am=1000&cu=INR'
  }
];

export const getStoredProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse user profile', e);
  }
  return DEFAULT_PROFILE;
};

export const saveStoredProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
};

export const getScanHistory = (): ScanHistoryItem[] => {
  try {
    const data = localStorage.getItem(SCANS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse scan history', e);
  }
  // Initialize with sample scans if empty
  saveScanHistory(SAMPLE_INITIAL_SCANS);
  return SAMPLE_INITIAL_SCANS;
};

export const saveScanHistory = (scans: ScanHistoryItem[]): void => {
  try {
    localStorage.setItem(SCANS_KEY, JSON.stringify(scans));
  } catch (e) {
    console.error('Failed to save scan history', e);
  }
};

export const addScanHistoryItem = (item: ScanHistoryItem): void => {
  const current = getScanHistory();
  const updated = [item, ...current];
  saveScanHistory(updated);
};

export const clearScanHistory = (): void => {
  try {
    localStorage.removeItem(SCANS_KEY);
  } catch (e) {
    console.error('Failed to clear scan history', e);
  }
};
