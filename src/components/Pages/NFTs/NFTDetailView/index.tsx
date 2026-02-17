
import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, Wallet, Clock, Tag, User, Zap, Shield } from 'lucide-react';

interface NFTDetailViewProps {
  nft: any;
  onClose: () => void;
  onBuy: (nft: any) => void;
}

const NFTDetailView: React.FC<NFTDetailViewProps> = ({ nft, onClose, onBuy }) => {
  const [appraisal, setAppraisal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAppraise = async () => {
    setLoading(true);
    const result = "ERSAN";
    setAppraisal(result || null);
    setLoading(false);
  };

  const properties = nft.traits?.filter(t => !t.display_type || t.display_type === 'property') || [];
  const boosts = nft.traits?.filter(t => t.display_type && t.display_type.startsWith('boost')) || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-6xl h-full max-h-[95vh] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-pink-500 transition-colors shadow-lg"
        >
          <X size={24} />
        </button>

        {/* Left: Media Section */}
        <div className="md:w-1/2 h-full bg-gray-50 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full h-full rounded-[2rem] overflow-hidden soft-shadow relative group">
            <img src={nft.image} alt={nft.name} className="w-full h-full object-cover shadow-inner" />
            <div className="absolute top-6 left-6">
              <div className="px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black text-gray-800 shadow-xl border border-white/50 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                   nft.rarity === 'Legendary' ? 'bg-orange-400' : 'bg-pink-500'
                }`} />
                {nft.rarity.toUpperCase()} ARTIFACT
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="md:w-1/2 h-full overflow-y-auto p-8 lg:p-12 bg-white">
          <div className="flex items-center gap-2 text-pink-500 font-black text-[10px] uppercase tracking-widest mb-4">
            <Tag size={14} fill="currentColor" className="opacity-20" />
            {nft.collection} Collection
          </div>
          
          <h2 className="text-4xl font-black text-gray-900 mb-6 flex items-center gap-3 tracking-tighter">
            {nft.name}
            {nft.verified && <CheckCircle size={28} className="text-pink-500" fill="currentColor" fillOpacity={0.1} />}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
              <div className="w-8 h-8 bg-pink-100 rounded-xl flex items-center justify-center">
                <User size={14} className="text-pink-600" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase">Creator</p>
                <p className="text-xs font-bold text-gray-800">{nft.creator}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
              <Clock size={16} className="text-gray-400" />
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase">Listing Age</p>
                <p className="text-xs font-bold text-gray-800">2 Hours</p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <section>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Shield size={12} /> Narrative & Provenance
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm font-medium">
                {nft.description || "This artifact holds a unique position in the digital continuum, representing high-fidelity synthesis of art and algorithm."}
              </p>
            </section>

            {/* Performance Boosts */}
            {boosts.length > 0 && (
              <section>
                <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <Zap size={12} fill="currentColor" /> Performance Boosts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {boosts.map((boost, i) => (
                    <div key={i} className="bg-pink-50/30 border border-pink-100 rounded-2xl p-4 group transition-all hover:bg-pink-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-pink-400 uppercase tracking-tighter">{boost.type}</span>
                        <span className="text-xs font-black text-pink-600">
                          {boost.display_type === 'boost_percentage' ? `+${boost.value}%` : `+${boost.value}`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-pink-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full pink-gradient transition-all duration-1000 ease-out shadow-sm"
                          style={{ width: `${(Number(boost.value) / (boost.maxValue || 100)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Properties Grid */}
            <section>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                Attributes & Data
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {properties.map((trait, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 transition-all hover:border-pink-200 hover:shadow-md group flex flex-col justify-center">
                    <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-tighter">{trait.type}</p>
                    <p className="text-xs font-black text-gray-800 truncate">{trait.value}</p>
                    {trait.rarity && (
                      <div className="mt-2 flex items-center gap-1">
                        <div className="w-1 h-1 bg-pink-300 rounded-full" />
                        <p className="text-[9px] text-pink-500 font-black">{trait.rarity}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                    <Sparkles size={16} />
                  </div>
                  <p className="text-[10px] text-gray-800 font-black uppercase tracking-tighter">Gemini AI Valuation</p>
                </div>
                <button 
                  onClick={handleAppraise}
                  disabled={loading}
                  className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-500 hover:border-pink-200 hover:text-pink-500 transition-all disabled:opacity-50"
                >
                  {loading ? "Analyzing..." : "Refresh Insight"}
                </button>
              </div>
              {appraisal ? (
                <p className="text-xs text-gray-600 italic leading-relaxed animate-in slide-in-from-left-2 px-1">
                   "{appraisal}"
                </p>
              ) : (
                <p className="text-[10px] text-gray-400 italic">No appraisal data available for this specific mint. Generate now for market insight.</p>
              )}
            </div>

            <div className="sticky bottom-0 bg-white/80 backdrop-blur-md pt-6 pb-2 mt-12 border-t border-gray-50">
              <div className="bg-gray-900 rounded-[2.5rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-gray-200 overflow-hidden relative group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-[0.2em]">Acquisition Value</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white tracking-tighter">
                      {nft.price.toLocaleString()}
                    </p>
                    <span className="text-lg font-black text-pink-500">{nft.currency}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => onBuy(nft)}
                  className="relative z-10 w-full md:w-auto px-12 py-5 pink-gradient text-white rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.05] active:scale-95 shadow-xl shadow-pink-500/20"
                >
                  <Wallet size={20} fill="currentColor" fillOpacity={0.2} />
                  Complete Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailView;
