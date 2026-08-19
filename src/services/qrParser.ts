import { QRPayload } from '../types';

/**
 * Parses raw text decoded from a QR code and identifies payment structure.
 */
export const parseQRCodeData = (rawText: string): QRPayload => {
  const text = rawText.trim();

  // 1. Check Indian UPI QR (upi://pay?...)
  if (text.toLowerCase().startsWith('upi://pay')) {
    return parseUPIQR(text);
  }

  // 2. Check Japan PayQR or HTTP/HTTPS payment link
  if (text.startsWith('http://') || text.startsWith('https://')) {
    const urlPayload = parseURLPaymentQR(text);
    if (urlPayload) return urlPayload;
  }

  // 3. Check EMVCo QR Code (TLV Tag-Length-Value standard used in SGQR, Thai PromptPay, Alipay, etc.)
  if (text.startsWith('000201') || text.includes('5303') || text.includes('5802')) {
    const emvCoPayload = parseEMVCoQR(text);
    if (emvCoPayload) return emvCoPayload;
  }

  // 4. Check JSON structured QR payload
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const json = JSON.parse(text);
      if (json.merchant || json.payee || json.amount || json.vpa || json.price || json.currency) {
        return {
          type: 'FOREIGN_PAYMENT_QR',
          network: json.network || 'Digital Merchant QR',
          merchantName: json.merchant || json.payee || json.name || null,
          merchantId: json.merchantId || json.id || json.vpa || null,
          country: json.country || 'International',
          countryFlag: json.countryFlag || '🌐',
          currency: (json.currency || json.cur || 'USD').toUpperCase(),
          amount: json.amount ? parseFloat(json.amount) : (json.price ? parseFloat(json.price) : null),
          transactionNote: json.note || json.description || null,
          rawText: text,
        };
      }
    } catch (e) {
      // Ignore JSON parse error
    }
  }

  // 5. Check if it mentions payment terms (e.g. pay, invoice, bill, transfer) -> UNSUPPORTED_PAYMENT_QR
  const lower = text.toLowerCase();
  if (lower.includes('pay') || lower.includes('invoice') || lower.includes('bill') || lower.includes('checkout') || lower.includes('transfer')) {
    return {
      type: 'UNSUPPORTED_PAYMENT_QR',
      network: 'Unrecognized Payment Protocol',
      merchantName: null,
      merchantId: null,
      country: null,
      countryFlag: null,
      currency: null,
      amount: null,
      transactionNote: null,
      rawText: text,
    };
  }

  // 6. Generic Non-payment QR (e.g., website link, text message, wifi credential)
  return {
    type: 'NON_PAYMENT_QR',
    network: 'Standard QR Code',
    merchantName: null,
    merchantId: null,
    country: null,
    countryFlag: null,
    currency: null,
    amount: null,
    transactionNote: null,
    rawText: text,
  };
};

/**
 * Parser for Indian UPI URI format (upi://pay?pa=...&pn=...&am=...&cu=...&tn=...)
 */
const parseUPIQR = (upiString: string): QRPayload => {
  try {
    const url = new URL(upiString);
    const params = new URLSearchParams(url.search);

    const pa = params.get('pa'); // Payee Address (VPA)
    const pn = params.get('pn'); // Payee Name (Merchant)
    const am = params.get('am'); // Amount
    const cu = params.get('cu') || 'INR'; // Currency
    const tn = params.get('tn'); // Transaction Note

    return {
      type: 'UPI_QR',
      network: 'UPI (Unified Payments Interface)',
      merchantName: pn ? decodeURIComponent(pn) : null,
      merchantId: pa ? decodeURIComponent(pa) : null,
      country: 'India',
      countryFlag: '🇮🇳',
      currency: cu.toUpperCase(),
      amount: am ? parseFloat(am) : null,
      transactionNote: tn ? decodeURIComponent(tn) : null,
      rawText: upiString,
    };
  } catch (e) {
    // Fallback regex parsing if URL parsing fails
    const paMatch = upiString.match(/[?&]pa=([^&]+)/i);
    const pnMatch = upiString.match(/[?&]pn=([^&]+)/i);
    const amMatch = upiString.match(/[?&]am=([^&]+)/i);
    const cuMatch = upiString.match(/[?&]cu=([^&]+)/i);
    const tnMatch = upiString.match(/[?&]tn=([^&]+)/i);

    return {
      type: 'UPI_QR',
      network: 'UPI (Unified Payments Interface)',
      merchantName: pnMatch ? decodeURIComponent(pnMatch[1]) : null,
      merchantId: paMatch ? decodeURIComponent(paMatch[1]) : null,
      country: 'India',
      countryFlag: '🇮🇳',
      currency: cuMatch ? cuMatch[1].toUpperCase() : 'INR',
      amount: amMatch ? parseFloat(amMatch[1]) : null,
      transactionNote: tnMatch ? decodeURIComponent(tnMatch[1]) : null,
      rawText: upiString,
    };
  }
};

/**
 * Parser for URL-based payment QR links
 */
const parseURLPaymentQR = (urlString: string): QRPayload | null => {
  try {
    const url = new URL(urlString);
    const params = new URLSearchParams(url.search);
    const host = url.hostname.toLowerCase();

    // Check specific domains or path indicators
    const isJapan = host.includes('payqr.jp') || host.includes('paypay') || host.includes('linepay') || host.includes('.jp');
    const isThai = host.includes('promptpay') || host.includes('kbank') || host.includes('scb') || host.includes('.th');
    const isSg = host.includes('sgqr') || host.includes('nets') || host.includes('.sg');
    const isEu = host.includes('epc') || host.includes('revolut') || host.includes('.eu');

    let merchant = params.get('m') || params.get('merchant') || params.get('pn') || params.get('payee') || params.get('name');
    let amountStr = params.get('amt') || params.get('amount') || params.get('am') || params.get('price');
    let currency = params.get('cur') || params.get('currency') || params.get('cu');

    if (merchant) merchant = decodeURIComponent(merchant);

    if (isJapan) {
      return {
        type: 'FOREIGN_PAYMENT_QR',
        network: 'Japan PayQR / PayPay',
        merchantName: merchant || 'Japanese Merchant',
        merchantId: url.pathname.replace('/', '') || host,
        country: 'Japan',
        countryFlag: '🇯🇵',
        currency: (currency || 'JPY').toUpperCase(),
        amount: amountStr ? parseFloat(amountStr) : null,
        transactionNote: null,
        rawText: urlString,
      };
    }

    if (isThai) {
      return {
        type: 'FOREIGN_PAYMENT_QR',
        network: 'Thai PromptPay QR',
        merchantName: merchant || 'Thailand Merchant',
        merchantId: host,
        country: 'Thailand',
        countryFlag: '🇹🇭',
        currency: (currency || 'THB').toUpperCase(),
        amount: amountStr ? parseFloat(amountStr) : null,
        transactionNote: null,
        rawText: urlString,
      };
    }

    if (isSg) {
      return {
        type: 'FOREIGN_PAYMENT_QR',
        network: 'SGQR / PayNow Singapore',
        merchantName: merchant || 'Singapore Merchant',
        merchantId: host,
        country: 'Singapore',
        countryFlag: '🇸🇬',
        currency: (currency || 'SGD').toUpperCase(),
        amount: amountStr ? parseFloat(amountStr) : null,
        transactionNote: null,
        rawText: urlString,
      };
    }

    if (isEu) {
      return {
        type: 'FOREIGN_PAYMENT_QR',
        network: 'EPC QR Code (Eurozone)',
        merchantName: merchant || 'European Merchant',
        merchantId: host,
        country: 'Eurozone',
        countryFlag: '🇪🇺',
        currency: (currency || 'EUR').toUpperCase(),
        amount: amountStr ? parseFloat(amountStr) : null,
        transactionNote: null,
        rawText: urlString,
      };
    }

    // Generic URL with payment params
    if (merchant || amountStr || url.pathname.includes('pay') || url.pathname.includes('checkout')) {
      return {
        type: 'FOREIGN_PAYMENT_QR',
        network: 'Merchant Payment Portal',
        merchantName: merchant || host,
        merchantId: host,
        country: 'International',
        countryFlag: '🌐',
        currency: (currency || 'USD').toUpperCase(),
        amount: amountStr ? parseFloat(amountStr) : null,
        transactionNote: null,
        rawText: urlString,
      };
    }
  } catch (e) {
    // Ignore URL parse error
  }
  return null;
};

/**
 * Parser for EMVCo standard QR codes (TLV specification format)
 */
const parseEMVCoQR = (emvText: string): QRPayload | null => {
  try {
    let merchantName: string | null = null;
    let currencyCode: string | null = null;
    let countryCode: string | null = null;
    let amount: number | null = null;

    // TLV Tag 59: Merchant Name
    const nameMatch = emvText.match(/59(\d{2})([^\d]{2,})/);
    if (nameMatch) {
      const len = parseInt(nameMatch[1], 10);
      merchantName = nameMatch[2].substring(0, len);
    }

    // TLV Tag 53: Currency Code (e.g. 392 = JPY, 764 = THB, 702 = SGD, 356 = INR, 840 = USD, 978 = EUR)
    const currMatch = emvText.match(/5303(\d{3})/);
    if (currMatch) {
      const code = currMatch[1];
      if (code === '392') currencyCode = 'JPY';
      else if (code === '764') currencyCode = 'THB';
      else if (code === '702') currencyCode = 'SGD';
      else if (code === '356') currencyCode = 'INR';
      else if (code === '840') currencyCode = 'USD';
      else if (code === '978') currencyCode = 'EUR';
    }

    // TLV Tag 58: Country Code (e.g. JP, TH, SG, IN)
    const countryMatch = emvText.match(/5802([A-Z]{2})/);
    if (countryMatch) {
      countryCode = countryMatch[1];
    }

    // TLV Tag 54: Transaction Amount
    const amtMatch = emvText.match(/54(\d{2})(\d+(\.\d+)?)/);
    if (amtMatch) {
      const len = parseInt(amtMatch[1], 10);
      amount = parseFloat(amtMatch[2].substring(0, len));
    }

    let countryName = 'International';
    let flag = '🌐';
    if (countryCode === 'JP' || currencyCode === 'JPY') {
      countryName = 'Japan';
      flag = '🇯🇵';
      currencyCode = currencyCode || 'JPY';
    } else if (countryCode === 'TH' || currencyCode === 'THB') {
      countryName = 'Thailand';
      flag = '🇹🇭';
      currencyCode = currencyCode || 'THB';
    } else if (countryCode === 'SG' || currencyCode === 'SGD') {
      countryName = 'Singapore';
      flag = '🇸🇬';
      currencyCode = currencyCode || 'SGD';
    } else if (countryCode === 'IN' || currencyCode === 'INR') {
      countryName = 'India';
      flag = '🇮🇳';
      currencyCode = currencyCode || 'INR';
    }

    return {
      type: currencyCode === 'INR' ? 'UPI_QR' : 'FOREIGN_PAYMENT_QR',
      network: 'EMVCo Merchant QR Standard',
      merchantName: merchantName || 'EMVCo Merchant',
      merchantId: 'EMVCo Specifications',
      country: countryName,
      countryFlag: flag,
      currency: currencyCode || 'USD',
      amount: amount,
      transactionNote: null,
      rawText: emvText,
    };
  } catch (e) {
    return null;
  }
};
