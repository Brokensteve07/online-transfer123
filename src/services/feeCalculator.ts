import { FeeCalculation } from '../types';
import { getExchangeRate } from './currencyService';

export const calculateFees = (
  originalAmount: number,
  originalCurrency: string,
  homeCurrency: string
): FeeCalculation => {
  const { rate, source, lastUpdated } = getExchangeRate(originalCurrency, homeCurrency);

  const isSameCurrency = originalCurrency.toUpperCase() === homeCurrency.toUpperCase();

  // Base raw conversion without markup
  const baseConvertedAmount = originalAmount * rate;

  if (isSameCurrency) {
    return {
      originalAmount,
      originalCurrency: originalCurrency.toUpperCase(),
      homeCurrency: homeCurrency.toUpperCase(),
      baseConvertedAmount,
      exchangeRate: 1.0,
      fxMarkupPercent: 0,
      fxFeeAmount: 0,
      serviceFeeAmount: 0,
      totalEstimatedCost: originalAmount,
      rateSource: source,
      lastUpdated,
    };
  }

  // FX markup (e.g. 1.25% estimated cross-border interchange rate)
  const fxMarkupPercent = 1.25;
  const fxFeeAmount = baseConvertedAmount * (fxMarkupPercent / 100);

  // Flat service fee estimated in target currency (e.g. approx ₹30 / $0.40 USD)
  const flatServiceFeeInUsd = 0.40;
  const { rate: usdToHomeRate } = getExchangeRate('USD', homeCurrency);
  const serviceFeeAmount = Math.max(10, flatServiceFeeInUsd * usdToHomeRate);

  const totalEstimatedCost = baseConvertedAmount + fxFeeAmount + serviceFeeAmount;

  return {
    originalAmount,
    originalCurrency: originalCurrency.toUpperCase(),
    homeCurrency: homeCurrency.toUpperCase(),
    baseConvertedAmount: Number(baseConvertedAmount.toFixed(2)),
    exchangeRate: rate,
    fxMarkupPercent,
    fxFeeAmount: Number(fxFeeAmount.toFixed(2)),
    serviceFeeAmount: Number(serviceFeeAmount.toFixed(2)),
    totalEstimatedCost: Number(totalEstimatedCost.toFixed(2)),
    rateSource: source,
    lastUpdated,
  };
};
