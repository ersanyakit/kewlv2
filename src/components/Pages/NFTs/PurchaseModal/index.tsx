
import React, { useState } from 'react';
import { X, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PurchaseModalProps {
  nft: any;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ nft, onClose }) => {
  const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');
  
  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const gasFee = (nft.price * 0.002).toFixed(4);
  const total = (nft.price + parseFloat(gasFee)).toFixed(4);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-pink-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {step === 'review' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Checkout</h2>
              <p className="text-xs text-gray-400 mb-8">Confirm your transaction on the KEWL network.</p>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-8">
                <img src={nft.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                <div>
                  <p className="text-sm font-black text-gray-900">{nft.name}</p>
                  <p className="text-[10px] text-pink-500 font-bold">{nft.collection}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price</span>
                  <span className="font-bold text-gray-900">{nft.price} {nft.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Fee (Gas)</span>
                  <span className="font-bold text-gray-900">{gasFee} {nft.currency}</span>
                </div>
                <div className="h-px bg-gray-100 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-black">Total Cost</span>
                  <span className="text-xl font-black text-pink-500">{total} {nft.currency}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl mb-8">
                <ShieldCheck className="text-blue-500" size={20} />
                <p className="text-[10px] text-blue-700 leading-tight">
                  Your funds are protected by our smart contract vault until the transfer is verified on-chain.
                </p>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full py-4 pink-gradient text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-pink-200 transition-transform active:scale-95"
              >
                Confirm Transaction <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-500 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin" />
                <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500" size={30} />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Executing Transaction...</h2>
              <p className="text-xs text-gray-400 max-w-[200px]">Talking to nodes and mining your asset onto your wallet address.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 text-center">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Purchase Successful!</h2>
              <p className="text-xs text-gray-400 mb-8">The asset has been successfully transferred to your KEWL wallet.</p>
              
              <div className="bg-gray-50 p-4 rounded-2xl w-full text-left mb-8 border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Transaction Hash</p>
                <p className="text-[10px] font-mono text-gray-800 break-all">0x7d21c...f88a91c2b551c092a911</p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-transform active:scale-95"
              >
                Go to Inventory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
