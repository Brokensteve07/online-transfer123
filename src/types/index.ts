export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface DestinationCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  country: string;
  countryFlag: string;
  homeCurrency: string;
  pinCode?: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  isPrototypeAccount: boolean;
  isLoggedIn?: boolean;
}

export interface WalletState {
  balanceHomeCurrency: number;
  spentTodayHomeCurrency: number;
  savedFxHomeCurrency: number;
  multiCurrencyHoldings: Array<{
    currency: string;
    amount: number;
    flag: string;
  }>;
}

export type QRType = 
  | 'UPI_QR'
  | 'FOREIGN_PAYMENT_QR'
  | 'UNSUPPORTED_PAYMENT_QR'
  | 'NON_PAYMENT_QR';

export interface QRPayload {
  type: QRType;
  network: string;
  merchantName: string | null;
  merchantId: string | null;
  country: string | null;
  countryFlag: string | null;
  currency: string | null;
  amount: number | null;
  transactionNote: string | null;
  rawText: string;
}

export interface FeeCalculation {
  originalAmount: number;
  originalCurrency: string;
  homeCurrency: string;
  baseConvertedAmount: number;
  exchangeRate: number;
  fxMarkupPercent: number;
  fxFeeAmount: number;
  serviceFeeAmount: number;
  totalEstimatedCost: number;
  rateSource: 'LIVE' | 'DEMO';
  lastUpdated: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  merchantName: string;
  merchantId: string | null;
  country: string;
  countryFlag: string;
  network: string;
  originalCurrency: string;
  originalAmount: number;
  homeCurrency: string;
  convertedAmount: number;
  exchangeRate: number;
  estimatedFxFee: number;
  estimatedServiceFee: number;
  totalEstimatedCost: number;
  status: 'NOT_PROCESSED';
  rawPayload: string;
}
