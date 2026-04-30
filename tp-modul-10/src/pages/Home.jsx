import { useState, useEffect } from 'react';
import { ShoppingCart, Star, CheckCircle, Flame, Info, X, Package, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedItems, setAddedItems] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  // Map IDs to the generated images in public/assets
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

  // Mock specifications for the modal
  const itemSpecs = {
    1: "A19 Pro chip, Titanium design, 48MP Main camera, Super Retina XDR display.",
    2: "Less than 63 grams. LIGHTSPEED wireless. HERO 25K sensor. Zero additives.",
    3: "Custom mechanical keyboard with QMK/VIA support, double-gasket design, and wireless connectivity.",
    4: "24.5-inch FHD display, 100Hz refresh rate, EyesErgo technology, Built-in speakers.",
    5: "AMD Ryzen 9, NVIDIA RTX 4080, Nebula HDR Display, Anime Matrix.",
    6: "Aerospace-grade titanium, Precision dual-frequency GPS, Up to 36 hours of battery life.",
    7: "M4 Pro chip, 16-core Neural Engine, Thunderbolt 4, Ultra-compact design.",
    8: "M4 chip, Tandem OLED display, Apple Pencil Pro support, Incredibly thin."
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        if (response.data.success) {
          setItems(response.data.payload);
        } else {
          setError('Failed to fetch items');
        }
      } catch (err) {
        setError('Failed to load products. Neural network disconnected.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const addToCart = (e, item) => {
    e.stopPropagation(); 
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    setAddedItems({ ...addedItems, [item.id]: true });
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <Loader2 className="w-12 h-12 text-neon-blue animate-spin mb-4" />
        <p className="text-neon-blue font-bold tracking-widest uppercase text-sm animate-pulse">Initializing FUNKOMART...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-1000 max-w-7xl mx-auto space-y-16 pb-20">
      
      {/* Interactive Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedItem(null)}>
          <div className="glass-panel max-w-2xl w-full rounded-3xl overflow-hidden border border-dark-border shadow-[0_0_50px_rgba(176,38,255,0.2)] animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="relative h-80 bg-white flex items-center justify-center p-8 group">
              <img src={itemImages[selectedItem.id] || `https://picsum.photos/seed/neo-${selectedItem.id}/600/400`} alt={selectedItem.name} className="h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
              <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors backdrop-blur-md">
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2">{selectedItem.name}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                      Rp {parseInt(selectedItem.price).toLocaleString('id-ID')}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${selectedItem.stock > 0 ? 'bg-neon-blue/20 text-neon-blue' : 'bg-red-500/20 text-red-400'}`}>
                      Stock: {selectedItem.stock}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Technical Specifications
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {itemSpecs[selectedItem.id] || "Premium quality guaranteed. The perfect tool for your digital lifestyle."}
                </p>
              </div>

              <button
                onClick={(e) => addToCart(e, selectedItem)}
                disabled={selectedItem.stock === 0}
                className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(176,38,255,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {selectedItem.stock === 0 ? 'Out of Stock' : (
                  <>
                    <ShoppingCart className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center space-y-6 pt-10">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neon-blue text-sm font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Star className="w-4 h-4 mr-2" /> Welcome to FUNKOMART
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 tracking-tighter">
          Experience<br />The Best Tech Gear
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Latest generation model is here, complete your gear and lifestyle purpose to make your day better. engineer needs more than power!!!
        </p>
      </div>

      {error ? (
        <div className="glass-panel border-red-500/30 p-8 text-center rounded-3xl max-w-2xl mx-auto">
          <p className="text-red-400 font-bold text-lg">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="group glass-panel rounded-3xl overflow-hidden hover:border-neon-purple/50 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(176,38,255,0.15)] flex flex-col cursor-pointer"
            >
              {/* Image Container with White Studio Background */}
              <div className="relative h-64 bg-white p-6 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10"></div>
                
                {(index === 0 || index === 1) && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Best Seller
                  </div>
                )}
                
                <img 
                  src={itemImages[item.id] || `https://picsum.photos/seed/neo-${item.id}/400/300`} 
                  alt={item.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out z-0 drop-shadow-xl"
                  loading="lazy"
                />
                
                {item.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <span className="px-6 py-2 bg-red-500/80 text-white font-black tracking-widest uppercase rounded-full transform -rotate-12 border-2 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)]">Sold Out</span>
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow relative z-10 bg-dark-bg/80 backdrop-blur-md">
                <h3 className="text-xl font-bold text-gray-100 mb-2 leading-tight line-clamp-2 capitalize">{item.name}</h3>
                
                <div className="mt-auto pt-4 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                      Rp {parseInt(item.price).toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                      <Package className="w-4 h-4 text-neon-purple" />
                      <span>Stock: {item.stock}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => addToCart(e, item)}
                  disabled={item.stock === 0}
                  className={`mt-6 w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2
                    ${addedItems[item.id] 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
                      : 'bg-white/5 text-white hover:bg-neon-purple hover:text-white border border-white/10 hover:border-neon-purple hover:shadow-[0_0_20px_rgba(176,38,255,0.4)]'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {addedItems[item.id] ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
