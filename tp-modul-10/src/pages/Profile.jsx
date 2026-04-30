import { useState, useEffect } from 'react';
import { User, Mail, Phone, Wallet, History, ReceiptText, TrendingUp, Loader2, Camera, X, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '', photo: null });
  const [editError, setEditError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
          setEditData({ 
            name: storedUser.name || '', 
            email: storedUser.email || '', 
            phone: storedUser.phone || '',
            photo: storedUser.photo || null 
          });
          
          const [historyRes, totalRes] = await Promise.all([
            api.get(`/user/history?user_id=${storedUser.id}`),
            api.get(`/user/total-spent?user_id=${storedUser.id}`)
          ]);

          if (historyRes.data.success) {
            setHistory(historyRes.data.payload);
          }
          if (totalRes.data.success) {
            setTotalSpent(totalRes.data.payload.total_spent || 0);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditError('');

    // Simulated 1 month limit for name/username change
    const lastChange = localStorage.getItem(`last_name_change_${user.id}`);
    const now = new Date().getTime();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (editData.name !== user.name && lastChange && (now - parseInt(lastChange)) < oneMonth) {
      setEditError('You can only change your name/username every 1 month.');
      return;
    }

    const updatedUser = { ...user, ...editData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    if (editData.name !== user.name) {
      localStorage.setItem(`last_name_change_${user.id}`, now.toString());
    }

    setShowEdit(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculatePoints = () => {
    return Math.floor(totalSpent / 100000); // 1 point per 100k
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-neon-purple animate-spin mb-4" />
        <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">Decrypting Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 glass-panel border-red-500/30 max-w-lg mx-auto mt-12 rounded-2xl">
        <p className="text-red-400 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto space-y-8">
      
      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-dark-border shadow-[0_0_50px_rgba(176,38,255,0.2)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Edit Identity</h2>
              <button onClick={() => setShowEdit(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              {editError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4" /> {editError}
                </div>
              )}

              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-neon-purple bg-dark-surface">
                    {editData.photo ? (
                      <img src={editData.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-[-8px] right-[-8px] p-2 bg-neon-purple rounded-xl cursor-pointer hover:bg-purple-600 transition-colors shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-neon-purple transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-neon-purple transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-neon-purple transition-all"
                />
              </div>

              <button type="submit" className="w-full py-4 bg-neon-purple text-white font-bold rounded-xl mt-4 shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:bg-purple-600 transition-all">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="glass-panel rounded-3xl overflow-hidden relative">
        <div className="h-40 bg-gradient-to-r from-neon-purple/80 via-neon-blue/60 to-dark-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6 z-10">
            <div className="w-32 h-32 rounded-2xl p-1 bg-gradient-to-br from-neon-purple to-neon-blue shadow-[0_0_30px_rgba(176,38,255,0.4)]">
              <div className="w-full h-full bg-dark-bg rounded-xl flex items-center justify-center overflow-hidden">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
            <button 
              onClick={() => setShowEdit(true)}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors border border-white/10 hover:border-neon-blue/50 group"
            >
              <span className="group-hover:text-neon-blue transition-colors">Edit Profile</span>
            </button>
          </div>
          
          <div>
            <h1 className="text-4xl font-black text-white capitalize tracking-tight mb-1">{user?.name}</h1>
            <p className="text-neon-blue font-bold mb-6 text-lg">@{user?.username}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 bg-dark-surface px-4 py-2.5 rounded-xl border border-dark-border">
                <Mail className="w-4 h-4 text-neon-purple" />
                {user?.email}
              </div>
              <div className="flex items-center gap-2 bg-dark-surface px-4 py-2.5 rounded-xl border border-dark-border">
                <Phone className="w-4 h-4 text-neon-blue" />
                {user?.phone || 'No communications link'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel border-neon-purple/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(176,38,255,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="w-24 h-24 text-neon-purple" />
            </div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neon-purple/20 rounded-lg">
                  <Wallet className="w-5 h-5 text-neon-purple" />
                </div>
                <span className="font-bold text-gray-300 tracking-wide">Credits Available</span>
              </div>
              <button 
                onClick={() => navigate('/topup')}
                className="p-1.5 bg-neon-purple rounded-lg hover:scale-110 transition-transform shadow-[0_0_15px_rgba(176,38,255,0.4)]"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="text-3xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 relative z-10">
              Rp {parseInt(user?.balance || 0).toLocaleString('id-ID')}
            </div>
            <p className="text-neon-purple text-sm font-bold relative z-10 uppercase tracking-widest">Active Funds</p>
          </div>

          <div className="glass-panel border-neon-blue/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-24 h-24 text-neon-blue" />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-neon-blue/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-neon-blue" />
              </div>
              <span className="font-bold text-gray-300 tracking-wide">FUNKO Points</span>
            </div>
            <div className="text-4xl font-black mb-2 text-white relative z-10">
              {calculatePoints().toLocaleString('id-ID')}
            </div>
            <p className="text-neon-blue text-sm font-bold relative z-10 uppercase tracking-widest">Rewards Level</p>
          </div>
        </div>

        {/* History Column */}
        <div className="md:col-span-2">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 h-full">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark-border">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                <History className="w-6 h-6 text-neon-blue" />
                Transaction Log
              </h2>
            </div>

            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-dark-surface/50 border border-dark-border hover:border-neon-purple/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple shrink-0 group-hover:scale-110 transition-transform">
                        <ReceiptText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-200">Order #{tx.id}</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {new Date(tx.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white tracking-wide">Rp {parseInt(tx.total).toLocaleString('id-ID')}</p>
                      <p className="text-xs text-neon-blue font-bold px-2 py-1 rounded bg-neon-blue/10 mt-1 inline-block uppercase tracking-widest">
                        Verified
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-dark-surface rounded-2xl border border-dark-border flex items-center justify-center mx-auto mb-6">
                  <ReceiptText className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-300 font-bold text-xl mb-2">No data found</p>
                <p className="text-gray-500 text-sm">Your transaction log is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
