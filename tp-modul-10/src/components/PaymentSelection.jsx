import { useState } from 'react';
import { ChevronDown, CreditCard, Landmark, Wallet, QrCode, CheckCircle2 } from 'lucide-react';

const paymentMethods = [
  {
    id: 'debit',
    name: 'Debit Card',
    icon: CreditCard,
    providers: [
      { name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
      { name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/id/5/51/Logo_BNI.svg' },
      { name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' }
    ]
  },
  {
    id: 'credit',
    name: 'Credit Card',
    icon: CreditCard,
    providers: [
      { name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
      { name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/id/5/51/Logo_BNI.svg' },
      { name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
      { name: 'CIMB NIAGA', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/CIMB_Niaga_logo.svg' }
    ]
  },
  {
    id: 'va',
    name: 'Virtual Account',
    icon: Landmark,
    providers: [
      { name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
      { name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/id/5/51/Logo_BNI.svg' },
      { name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
      { name: 'BTN', logo: 'https://upload.wikimedia.org/wikipedia/id/0/0e/Logo_Bank_BTN.svg' },
      { name: 'CIMB NIAGA', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/CIMB_Niaga_logo.svg' },
      { name: 'BSI', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Bank_Syariah_Indonesia.svg' }
    ]
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    icon: Wallet,
    providers: [
      { name: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
      { name: 'OVO', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
      { name: 'Dana', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_DANA.svg' }
    ]
  },
  {
    id: 'qr',
    name: 'QRIS / QR Code',
    icon: QrCode,
    providers: [
      { name: 'QRIS', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg' }
    ]
  }
];

export default function PaymentSelection({ onSelect, amount, type }) {
  const [expanded, setExpanded] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  return (
    <div className="space-y-4">
      <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
        <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">
          {type === 'topup' ? 'Top Up Amount' : 'Total Payment'}
        </p>
        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
          Rp {parseInt(amount).toLocaleString('id-ID')}
        </p>
      </div>

      <h3 className="text-lg font-bold text-white mb-4">Select Payment Method</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const isExpanded = expanded === method.id;
          const Icon = method.icon;

          return (
            <div key={method.id} className="glass-panel overflow-hidden border-white/10 hover:border-white/20 transition-all">
              <button 
                onClick={() => setExpanded(isExpanded ? null : method.id)}
                className="w-full px-5 py-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/5 text-neon-blue group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-200">{method.name}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4">
                  {method.providers.map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => {
                        setSelectedProvider({ ...provider, method: method.id });
                        onSelect({ ...provider, method: method.id });
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        selectedProvider?.name === provider.name && selectedProvider?.method === method.id
                          ? 'bg-neon-purple/20 border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.2)]'
                          : 'bg-dark-surface/50 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="h-10 w-full mb-2 flex items-center justify-center">
                        <img src={provider.logo} alt={provider.name} className="max-h-full max-w-full object-contain filter brightness-110" />
                      </div>
                      <span className="text-xs font-bold text-gray-300">{provider.name}</span>
                      {selectedProvider?.name === provider.name && selectedProvider?.method === method.id && (
                        <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-neon-purple" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
