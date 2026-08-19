export interface SampleQR {
  id: string;
  label: string;
  description: string;
  flag: string;
  payload: string;
}

export const SAMPLE_QRS: SampleQR[] = [
  {
    id: 'tokyo-ramen',
    label: 'Tokyo Ramen (Japan JPY)',
    description: '¥10,000 Payment QR',
    flag: '🇯🇵',
    payload: 'https://payqr.jp/pay?m=Tokyo%20Ramen&amt=10000&cur=JPY'
  },
  {
    id: 'hyderabad-cafe',
    label: 'Hyderabad Cafe (India UPI)',
    description: '₹1,000 Indian UPI QR',
    flag: '🇮🇳',
    payload: 'upi://pay?pa=hyderabadcafe@upi&pn=Hyderabad%20Cafe&am=1000&cu=INR&tn=Dinner%20Bill'
  },
  {
    id: 'bangkok-street',
    label: 'Bangkok Street Market (Thailand THB)',
    description: '฿850 PromptPay QR',
    flag: '🇹🇭',
    payload: 'https://promptpay.io/pay?m=Bangkok%20Night%20Market&amt=850&cur=THB'
  },
  {
    id: 'singapore-hawker',
    label: 'Marina Bay Hawker (Singapore SGD)',
    description: 'S$45.00 SGQR',
    flag: '🇸🇬',
    payload: 'https://sgqr.nets.com.sg/pay?m=Marina%20Bay%20Hawker&amt=45.00&cur=SGD'
  },
  {
    id: 'london-coffee',
    label: 'Soho Roasters (UK GBP)',
    description: '£12.50 Payment QR',
    flag: '🇬🇧',
    payload: 'https://payqr.eu/checkout?m=Soho%20Roasters%20London&amt=12.50&cur=GBP'
  },
  {
    id: 'unsupported-website',
    label: 'Non-Payment QR (Website URL)',
    description: 'Standard Web Link',
    flag: '🌐',
    payload: 'https://globepay.travel/info'
  }
];
