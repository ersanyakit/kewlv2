
import React, { useState } from 'react';
import { X, CheckCircle, ExternalLink, Minus, Plus, Layers, User } from 'lucide-react';
import { formatUnits } from 'viem';
import { NFTItem } from '../../../../context/NFTContext';

interface NFTDetailViewProps {
  nft: any;
  onClose: () => void;
  onBuy: (nft: NFTItem, quantity: number) => void;
}

const NFTDetailView: React.FC<NFTDetailViewProps> = ({ nft, onClose, onBuy }) => {
  const details = nft.metadata;
  const innerMeta = details?.metadata;
    const [quantity, setQuantity] = useState(1);

   const maxAvailable = nft.remaining_amount || 1;


  const displayName = innerMeta?.name || nft.name || `Token #${nft.tokenId?.toString().slice(0, 8)}...`;
  
  let displayImage = details?.image_url || innerMeta?.image || nft.image;
  if (displayImage && typeof displayImage === 'string' && displayImage.startsWith('ipfs://')) {
    displayImage = displayImage.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }

  const attributes = innerMeta?.attributes || [];
  const rarity = attributes.find((a: any) => a.trait_type === 'Rarity')?.value || 'Common';
  const collectionName = attributes.find((a: any) => a.trait_type === 'Collection')?.value || nft.collectionName || 'IMON Collection';


  const handleIncrement = () => {
    if (quantity < maxAvailable) setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-black backdrop-blur-xl hover:bg-black/40 text-white rounded-2xl flex items-center justify-center transition-all"
        >
          <X size={20} />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 relative bg-gray-100 flex items-center justify-center">
          <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-pink-50 text-pink-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {rarity}
            </span>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-gray-400 text-xs font-bold">Token ID #{nft.tokenId?.toString()}</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{displayName}</h2>
          
          <div className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-70 transition-opacity">
            <p className="text-sm font-black text-pink-500 uppercase tracking-widest">{collectionName}</p>
            <CheckCircle size={14} className="text-pink-500" fill="currentColor" fillOpacity={0.1} />
          </div>



      <div className="flex flex-wrap items-center gap-4 mb-10">
            <div className="flex items-center gap-3 bg-gray-50 px-2 py-2.5 rounded-2xl border border-gray-100">
              <div className="w-8 h-8 bg-pink-100 rounded-xl flex items-center justify-center">
                <User size={14} className="text-pink-600" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-black uppercase">Seller</p>
                <p className="text-xs font-bold text-gray-800">{nft.seller}</p>
              </div>
            </div>
    
              <div className="flex items-center gap-3 bg-gray-50 px-2 py-2.5 rounded-2xl border border-gray-100">
                <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Layers size={14} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-black uppercase">Asset Type</p>
                  <p className="text-xs font-bold text-gray-800">{nft.seller.assetType == 3 ? "ERC-1155" : "ERC-721"}</p>
                </div>
              </div>
      
          </div>
      

          <div className="bg-gray-50 flex flex-col gap-2 rounded-3xl p-6 mb-8 border border-gray-100">

      
            {nft.remaining_amount > 1 && (
              <section className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Select Quantity</h3>
                  <span className="text-[10px] font-black text-gray-400 uppercase">{maxAvailable} AVAILABLE</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white rounded-2xl p-2 border border-gray-100 shadow-sm gap-4">
                    <button 
                      onClick={handleDecrement}
                      className="p-3 hover:bg-pink-50 rounded-xl transition-colors text-gray-400 hover:text-pink-500 disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-black text-gray-900 min-w-[3ch] text-center">{quantity}</span>
                    <button 
                      onClick={handleIncrement}
                      className="p-3 hover:bg-pink-50 rounded-xl transition-colors text-gray-400 hover:text-pink-500 disabled:opacity-30"
                      disabled={quantity >= maxAvailable}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-tight">
                    You can purchase up to {maxAvailable} copies <br/> of this asset in one transaction.
                  </p>
                </div>
              </section>
            )}
         

            <div className="flex flex-row justify-between items-end mb-4">


              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Current Price</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-gray-900 tracking-tighter">{formatUnits(nft.price_per_token * BigInt(quantity),18)}</span>
                  <span className="text-sm font-black text-pink-500">CHZ</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 font-bold mb-1">Stock: {nft.remaining_amount ?.toString() || '1'}</p>
            </div>
            <button 
              onClick={() => onBuy(nft,quantity)}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-gray-200"
            >
              Confirm Purchase
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Properties</h4>
              <div className="grid grid-cols-2 gap-3">
                {attributes.filter((a: any) => a.trait_type !== 'Rarity' && a.trait_type !== 'Collection').map((trait: any, i: number) => (
                  <div key={i} className="bg-pink-50/50 border border-pink-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-1">{trait.trait_type}</span>
                    <span className="text-xs font-black text-gray-800">{trait.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Description</h4>
              <p className="text-xs leading-relaxed text-gray-500 font-medium">
                {innerMeta?.description || "No description provided for this unique digital collectible."}
              </p>
            </div>
            
            <div className="flex gap-4">
               <a 
                href={`https://chiliscan.com/address/${nft.contract_address}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-gray-50 border border-gray-100 text-gray-600 rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-all"
               >
                  <ExternalLink size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">ChiliScan</span>
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailView;
