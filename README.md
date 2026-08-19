# online-transfer123

## GlobePay — Scan. Understand. Pay. (Travel Wallet Prototype)

GlobePay is a minimalistic, high-trust fintech travel wallet web application designed for international travelers. It allows users to log in, manage multi-currency travel funds, scan physical payment QR codes with their mobile rear camera, decode merchant & amount data, and calculate exact home currency costs with transparent fee breakdowns.

### Features
- **Minimalist Login Screen**: Clean Apple-level onboarding experience.
- **GlobePay Travel Wallet**: Real-time travel wallet balance, daily limit tracking, and multi-currency holdings (`JPY`, `THB`, `USD`, `EUR`).
- **Real QR Camera Reader**: HTML5 camera stream with explicit mobile rear camera targeting (`facingMode: 'environment'`) & camera switch toggle.
- **Modular QR Parser**: Decodes Indian UPI (`upi://pay`), Japan PayQR, Thai PromptPay, SGQR, and EMVCo standards.
- **Live FX Engine**: Connects to live exchange rate API (`https://open.er-api.com/v6/latest/USD`) with fee estimation.

### Quick Start
Open `index.html` directly in any web browser or serve locally with `py -m http.server 3000`.
