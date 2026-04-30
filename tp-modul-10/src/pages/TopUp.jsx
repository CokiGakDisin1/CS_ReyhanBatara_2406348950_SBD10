import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowLeft, ShieldCheck, Copy } from 'lucide-react';
import PaymentSelection from '../components/PaymentSelection';
import api from '../api';

export default function TopUp() {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [vaNumber, setVaNumber] = useState('');
  const navigate = useNavigate();

  const executeTopUp = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      const response = await api.put('/user/update', {
        id: user.id,
        balance: parseInt(user.balance || 0) + parseInt(amount)
      });

      if (response.data.success) {
        const updatedUser = response.data.payload;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setStep(4);
      }
    } catch (err) {
      console.error(err);
      alert('Top up failed. Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    if (selectedMethod.method === 'qr') {
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://funkomart.com/topup/${Date.now()}`);
      setStep(3);
    } else if (selectedMethod.method === 'va') {
      const randomVA = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setVaNumber(randomVA);
      setStep(3);
    } else {
      await executeTopUp();
    }
  };

  const commonAmounts = [50000, 100000, 250000, 500000, 1000000, 2000000];

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-8 duration-700">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Profile
      </button>

      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
        {step === 1 && (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-neon-purple/20 rounded-2xl">
                <Wallet className="w-6 h-6 text-neon-purple" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Top Up Balance</h1>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-bold uppercase tracking-widest mb-3">Enter Amount (IDR)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">Rp</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Min. 10,000"
                    className="w-full pl-14 pr-5 py-5 bg-dark-bg/50 border border-dark-border rounded-2xl text-2xl font-black text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {commonAmounts.map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className={`py-3 rounded-xl border font-bold transition-all ${
                      amount === val.toString() 
                        ? 'bg-neon-purple/20 border-neon-purple text-neon-purple' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {val.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              <button
                disabled={!amount || parseInt(amount) < 10000}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:shadow-[0_0_35px_rgba(176,38,255,0.5)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                Proceed to Payment Method
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in duration-500">
            <PaymentSelection amount={amount} onSelect={setSelectedMethod} type="topup" />
            <div className="mt-8 flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10">
                Back
              </button>
              <button
                disabled={!selectedMethod || loading}
                onClick={handleStep2Submit}
                className="flex-[2] py-4 bg-neon-purple text-white font-bold rounded-xl shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in zoom-in duration-500 text-center py-6">
            <div className="flex items-center justify-center gap-2 text-neon-blue font-bold uppercase tracking-widest mb-6">
              <ShieldCheck className="w-5 h-5" /> Waiting for Payment
            </div>

            {selectedMethod?.method === 'qr' ? (
              <>
                <div className="bg-white p-6 rounded-3xl inline-block shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-8">
                  <img src={qrCode} alt="Top Up QR Code" className="w-64 h-64" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Scan with e-Wallet</h2>
                <p className="text-gray-400 text-sm mb-8">Please scan this unique QRIS code to complete your Rp {parseInt(amount).toLocaleString('id-ID')} top up.</p>
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
                <p className="text-gray-400 text-sm">Please transfer Rp {parseInt(amount).toLocaleString('id-ID')} to the VA number above.</p>
              </div>
            )}

            <button 
              disabled={loading}
              onClick={executeTopUp} 
              className="w-full py-4 bg-neon-blue text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:bg-blue-600 transition-all"
            >
              {loading ? 'Verifying...' : 'I Have Paid'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in zoom-in duration-500 text-center py-10">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <ShieldCheck className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Top Up Successful</h2>
            <p className="text-gray-400 mb-10">Rp {parseInt(amount).toLocaleString('id-ID')} has been credited to your account. Your lifestyle upgrade continues.</p>
            <button onClick={() => navigate('/profile')} className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all">
              Return to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
