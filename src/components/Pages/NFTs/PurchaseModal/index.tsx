
import React, { useState } from 'react';
import { X, Check, Loader2, AlertCircle, RefreshCcw } from 'lucide-react';
import { formatEther, formatUnits, parseEther } from 'viem';
import { NFTItem, useNFT } from '../../../../context/NFTContext';
import { useAppKitProvider } from '@reown/appkit/react';


export interface BuyParam {
  collectionId: bigint;
  itemId: bigint;
  tokenId: bigint;
  amount: bigint;
}
export interface PurchaseParam {
  collectionName: string;
  nfts: NFTItem[]
  totalPrice: bigint;
  items: BuyParam[];
}


interface PurchaseModalProps {
  purchase: PurchaseParam;
  onClose: () => void;
}


const PurchaseModal: React.FC<PurchaseModalProps> = ({ purchase, onClose }) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const { collections, loading, buy, error, refresh } = useNFT();
  const { walletProvider } = useAppKitProvider('eip155');
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleConfirm = async () => {

    try {
      console.log("NFTs", purchase.collectionName)
      setStep('processing');
      await buy(walletProvider, purchase.items, purchase.totalPrice)
      setStep('success');
    } catch (err: any) {
       setErrorMessage("Transaction rejected by the network. Insufficient gas or network congestion detected.");
        setStep('error');
    }


  };

   const handleRetry = () => {
    setStep('confirm');
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl text-center">
        {step !== 'processing' && (
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        )}

        {step === 'confirm' && (
          <>
            <div className="w-20 h-20 bg-pink-50 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
              <img src={"/assets/logo/logo.svg"} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Checkout</h2>
            <p className="text-sm text-gray-500 font-medium mb-8">You are about to purchase <span className="text-gray-900 font-black">{purchase.collectionName}</span> from the <span className="text-pink-500 font-black">{purchase.collectionName}</span> collection.</p>

            <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 flex justify-between items-center">
              <div className="text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Pay</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black text-gray-900 tracking-tighter">{formatUnits(purchase.totalPrice, 18)}</span>
                  <span className="text-xs font-black text-pink-500">{"CHZ"}</span>
                </div>
              </div>

            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-[#ff1356] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-pink-200 hover:scale-[1.02] active:scale-95"
            >
              Authorize Transaction
            </button>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-pink-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500 animate-pulse" size={32} />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-sm text-gray-400 font-medium">Please confirm the request in your wallet and wait for blockchain verification.</p>
          </div>
        )}

        {step === 'error' && (
          <div className="py-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-red-500 shadow-2xl shadow-red-100">
              <AlertCircle size={48} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">Transaction Failed</h3>
            <p className="text-xs text-red-400 font-medium mb-10 leading-relaxed px-4">
              {errorMessage || "An unexpected error occurred during the transaction. Please check your wallet connection and try again."}
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleRetry}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-gray-800"
              >
                <RefreshCcw size={14} />
                Try Again
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-white text-gray-400 border border-gray-100 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default PurchaseModal;
