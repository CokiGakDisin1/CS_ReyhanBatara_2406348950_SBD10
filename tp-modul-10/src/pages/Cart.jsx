import { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stock)) };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/payment', { state: { total: calculateTotal(), items: cartItems, type: 'purchase' } });
  };

  const itemImages = {
    1: '/assets/iphone.png',
    2: '/assets/mouse.png',
    3: '/assets/keyboard.png',
    4: '/assets/monitor.png',
    5: '/assets/laptop.png',
    6: '/assets/watch.png',
    7: '/assets/macmini.png',
    8: '/assets/ipad.png',
  };

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-neon-blue" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Your cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-3xl border border-dark-border">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Cart is empty</h2>
          <p className="text-gray-500 mb-8">You haven't added any gear to your cart yet.</p>
          <Link to="/" className="px-6 py-3 bg-neon-purple text-white rounded-xl font-bold hover:bg-purple-600 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="glass-panel p-4 rounded-2xl flex items-center gap-6 group hover:border-neon-purple/30 transition-colors">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white p-2 shrink-0 relative">
                  <img src={itemImages[item.id] || `https://picsum.photos/seed/neo-${item.id}/200/200`} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-100 mb-1">{item.name}</h3>
                  <div className="text-neon-blue font-bold">Rp {parseInt(item.price).toLocaleString('id-ID')}</div>
                </div>

                <div className="flex items-center gap-3 bg-dark-bg/50 p-2 rounded-lg border border-dark-border">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">-</button>
                  <span className="w-4 text-center font-bold text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">+</button>
                </div>

                <button onClick={() => removeItem(item.id)} className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-3xl sticky top-28">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-dark-border pb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 text-gray-400 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-200">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span className="text-gray-200">Rp 0</span>
                </div>
              </div>

              <div className="border-t border-dark-border pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
