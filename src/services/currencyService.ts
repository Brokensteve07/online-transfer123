import { FALLBACK_USD_RATES, SUPPORTED_CURRENCIES } from '../constants/currencies';

export interface RateResult {
  rate: number;
  source: 'LIVE' | 'DEMO';
  lastUpdated: string;
}

let cachedRates: Record<string, number> = { ...FALLBACK_USD_RATES };
let lastFetchTime: string = 'Simulated Demo Rates';
let isLiveApi: boolean = false;

// Attempt to fetch live rates from open exchange rates API
export const fetchLiveRates = async (): Promise<boolean> => {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        cachedRates = { ...FALLBACK_USD_RATES, ...data.rates };
        isLiveApi = true;
        lastFetchTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return true;
      }
    }
  } catch (e) {
    console.warn('GlobePay: Live FX API unavailable, using calibrated demo rates.', e);
  }
  isLiveApi = false;
  lastFetchTime = 'Simulated Demo Rates';
  return false;
};

// Calculate exchange rate from source currency to target currency
export const getExchangeRate = (fromCurrency: string, toCurrency: string): RateResult => {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) {
    return {
      rate: 1.0,
      source: isLiveApi ? 'LIVE' : 'DEMO',
      lastUpdated: lastFetchTime,
    };
  }

  const fromUsdRate = cachedRates[from] || FALLBACK_USD_RATES[from] || 1;
  const toUsdRate = cachedRates[to] || FALLBACK_USD_RATES[to] || 1;

  // Cross rate calculation: (1 USD in target currency) / (1 USD in source currency)
  const crossRate = toUsdRate / fromUsdRate;

  return {
    rate: Number(crossRate.toFixed(4)),
    source: isLiveApi ? 'LIVE' : 'DEMO',
    lastUpdated: lastFetchTime,
  };
};

// Get currency symbol
export const getCurrencySymbol = (code: string): string => {
  const found = SUPPORTED_CURRENCIES.find(c => c.code === code.toUpperCase());
  return found ? found.symbol : code;
};

// Format amount with currency symbol
export const formatCurrency = (amount: number, code: string): string => {
  const symbol = getCurrencySymbol(code);
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: code === 'JPY' ? 0 : 2,
    maximumFractionDigits: code === 'JPY' ? 0 : 2,
  }).format(amount);

  if (code === 'INR') return `${symbol}${formattedNumber}`;
  if (code === 'JPY') return `${symbol}${formattedNumber}`;
  if (code === 'THB') return `${symbol}${formattedNumber}`;
  if (code === 'EUR') return `${symbol}${formattedNumber}`;
  if (code === 'GBP') return `${symbol}${formattedNumber}`;
  return `${symbol}${formattedNumber}`;
};
