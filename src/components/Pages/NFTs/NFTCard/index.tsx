
import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, Heart, Zap, Loader2 } from 'lucide-react';

interface NFTCardProps {
  nft: any;
  onView: (nft: any) => void;
  onBuy: (nft: any) => void;
  isSelected?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onView, onBuy, isSelected }) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Helper to format BigInt prices (18 decimals)
  const formatPrice = (price: any) => {
    try {
      if (!price) return "0.00";
      const p = BigInt(price);
      const etherValue = Number(p) / 1e18;
      return etherValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    } catch {
      return "0.00";
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      // Ensure we have the required parameters
      if (!nft.contract_address || nft.tokenId === undefined) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Convert BigInt tokenId to string for URL
        const tid = nft.tokenId.toString();
        let u = `https://chilitize.com/api/metadata?contract=${nft.contract_address}&tokenId=${tid}`
        let proxyURL =  `https://cors.isomorphic-git.org/${encodeURIComponent(u)}`
        const response = await fetch(u);
        
        if (!response.ok) throw new Error("Metadata fetch failed");
        
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        console.error("Error fetching NFT metadata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [nft.contract_address, nft.tokenId]);

  // Derived data
  const displayName = metadata?.name || nft.name || `Token #${nft.tokenId?.toString().slice(0, 6)}...`;
  const displayImage = imgError ? `https://api.dicebear.com/9.x/identicon/svg?seed=${nft.tokenId}` : (metadata?.image || nft.image);
  const rarity = metadata?.attributes?.find((a: any) => a.trait_type === 'Rarity')?.value || 'Common';

  return (
    <div 
      onClick={() => onView({ ...nft, metadata })}
      style={{ isolation: 'isolate' }}
      className={`bg-white overflow-hidden rounded-[2rem] soft-shadow group transition-all duration-300 hover:-translate-y-1 border-2 relative cursor-pointer transform-gpu z-0 ${
        isSelected 
        ? 'border-pink-500 shadow-[0_0_20px_rgba(255,59,107,0.15)] ring-4 ring-pink-500/5' 
        : 'border-transparent hover:border-pink-100'
      }`}
    >
      <div className="relative aspect-square overflow-hidden z-10 bg-gray-50">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 animate-pulse">
            <Loader2 className="text-pink-200 animate-spin" size={32} />
          </div>
        ) : (
          <img 
            src={displayImage} 
            alt={displayName} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu"
          />
        )}
        
        {/* Sweep Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="bg-pink-500 text-white p-3 rounded-full shadow-2xl scale-110">
              <Zap size={20} fill="currentColor" />
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className="p-2.5 bg-white/80 backdrop-blur-md rounded-2xl text-gray-400 hover:text-pink-500 transition-colors shadow-sm"
          >
            <Heart size={18} />
          </button>
        </div>

        {!loading && (
          <div className="absolute bottom-4 left-4 z-20">
            <span className={`px-3 py-1.5 text-[9px] font-black tracking-widest rounded-xl text-white shadow-lg uppercase ${
              rarity === 'Legendary' ? 'bg-orange-500' :
              rarity === 'Epic' ? 'bg-purple-600' :
              rarity === 'Rare' ? 'bg-blue-600' : 'bg-slate-700'
            }`}>
              {rarity}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-grow min-w-0">
            {loading ? (
              <div className="h-5 w-3/4 bg-gray-100 rounded-md animate-pulse mb-2" />
            ) : (
              <h3 className="font-black text-gray-900 truncate tracking-tight">{displayName}</h3>
            )}
          </div>
          {nft.verified !== false && <CheckCircle size={16} className="text-pink-500 flex-shrink-0 mt-0.5 ml-1" fill="currentColor" fillOpacity={0.1} />}
        </div>
        
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 truncate">
          {metadata?.collection || nft.collectionName || 'Unknown Collection'}
        </p>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider mb-0.5">Valuation</p>
            <div className="flex items-center gap-1">
              <p className="text-xl font-black text-gray-900 tracking-tighter">
                {formatPrice(nft.price_per_token)}
              </p>
              <span className="text-pink-500 text-xs font-black">CHZ</span>
            </div>
          </div>
          
          <div className="text-right">
             <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider mb-0.5">Stock</p>
             <p className="text-xs font-black text-gray-700">
               {nft.remaining_amount?.toString() || '1'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
