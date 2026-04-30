import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';
import PaymentSelection from '../components/PaymentSelection';
import api from '../api';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [vaNumber, setVaNumber] = useState('');

  if (!state || !state.total) {
    return <div className="text-center py-20 text-gray-400">Invalid access. Please go through the cart.</div>;
  }

  const executeTransaction = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      const purchasePromises = state.items.map(item => 
        api.post('/transaction/create', {
          user_id: user.id,
          item_id: item.id,
          quantity: item.quantity
        })
      );
      await Promise.all(purchasePromises);
      localStorage.removeItem('cart');
      setStep(3);
    } catch (err) {
      console.error(err);
      alert('Payment execution failed. Please check your balance.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep1Submit = async () => {
    if (selectedMethod.method === 'qr') {
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://funkomart.com/pay/${Date.now()}`);
      setStep(2);
    } else if (selectedMethod.method === 'va') {
      const randomVA = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setVaNumber(randomVA);
      setStep(2);
    } else {
      await executeTransaction();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-8 duration-700">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Cart
      </button>

      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
        {step === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-neon-blue/20 rounded-2xl">
                <CreditCard className="w-6 h-6 text-neon-blue" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Checkout Payment</h1>
            </div>
            <PaymentSelection amount={state.total} onSelect={setSelectedMethod} type="purchase" />
            <button
              disabled={!selectedMethod || loading}
              onClick={handleStep1Submit}
              className="w-full mt-8 py-5 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Confirm & Pay'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in zoom-in duration-500 text-center py-6">
            <div className="flex items-center justify-center gap-2 text-neon-blue font-bold uppercase tracking-widest mb-6">
              <ShieldCheck className="w-5 h-5" /> Waiting for Payment
            </div>

            {selectedMethod?.method === 'qr' ? (
              <>
                <div className="bg-white p-6 rounded-3xl inline-block mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  <img src={qrCode} alt="Payment QR Code" className="w-64 h-64" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Scan QRIS</h2>
                <p className="text-gray-400 text-sm mb-8">Pay exactly Rp {parseInt(state.total).toLocaleString('id-ID')} via any e-wallet.</p>
              </>
            ) : (
              <div className="mb-8">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{selectedMethod?.name} Virtual Account</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-mono font-black text-white tracking-widest">{vaNumber}</span>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neon-blue">
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Please transfer Rp {parseInt(state.total).toLocaleString('id-ID')} to the VA number above.</p>
              </div>
            )}

            <button 
              disabled={loading}
              onClick={executeTransaction} 
              className="w-full py-4 bg-neon-blue text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:bg-blue-600 transition-all"
            >
              {loading ? 'Verifying...' : 'I Have Completed Payment'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in zoom-in duration-500 text-center py-10">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Order Placed!</h2>
            <p className="text-gray-400 mb-10">Your tech artifacts are being prepared for neural shipping. History & Points updated.</p>
            <button onClick={() => navigate('/')} className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all">
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
