import React, { useState, useEffect, useMemo } from 'react';
import { SWAP_MODE, Token, useTokenContext } from '../../../context/TokenContext';
import { motion } from 'framer-motion';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    CheckCircle,
    ArrowRight,
    Filter,
    RefreshCcw,
    Briefcase
} from 'lucide-react';
import SwapTabs from '../../Swap/SwapTabs';
import NFTCard from './NFTCard';
import NFTDetailView from './NFTDetailView';
import PurchaseModal, { BuyParam, PurchaseParam } from './PurchaseModal';
import { NFTItem, useNFT } from '../../../context/NFTContext';
import { formatEther, parseEther } from 'viem';



const NFTsPage = () => {
    const {
        isDarkMode,
        slippageTolerance,
        baseToken,
        swapMode,
        quoteToken,
        tokenFilter,
        favoriteOnly,
        filteredTokens,
        openTokenSelector,
        setOpenTokenSelector,
        setTokenFilter,
        setFavoriteOnly,
        selectToken,
        reloadTokens,
        handleSwapTokens,
        nativeToken,
        setSwapMode,
        tokens,
        setActiveView,
        activeView
    } = useTokenContext();

    const { collections, loading, error, refresh } = useNFT();
    const { address, isConnected } = useAppKitAccount();

    const { walletProvider } = useAppKitProvider('eip155');


    useEffect(() => {
        console.log("COLLECTIONS,", error, loading, collections)
    }, [loading, error, collections])




    const [viewingNFT, setViewingNFT] = useState<any | null>(null);
    const [purchasingNFT, setPurchasingNFT] = useState<any | null>(null);
    const [selectedCollectionId, setSelectedCollectionId] = useState<Number>(0);

    // Sweep State
    const [sweepValue, setSweepValue] = useState(0);
    const maxSweep = 12; // Reduced max sweep for better demo visibility in current grid
    const floorPrice = 44.5;

    // Calculate selected NFTs for the sweep (first N NFTs in the current list)
    const sweepSelectedItems = useMemo(() => {
        if (!collections.length) return [];

        const selectedCollection =
            collections[selectedCollectionId as number];

        if (!selectedCollection) return [];

        return selectedCollection.items.slice(0, sweepValue);
    }, [collections, selectedCollectionId, sweepValue]);



    const sweepSummary = useMemo(() => {
        if (!collections.length) {
            return { totalPrice: 0n, totalItems: 0 };
        }

        const selectedCollection =
            collections[selectedCollectionId as number];

        if (!selectedCollection) {
            return { totalPrice: 0n, totalItems: 0 };
        }

        const selectedItems =
            selectedCollection.items.slice(0, sweepValue);

        let totalPrice = 0n;
        let totalItems = 0;

        for (const item of selectedItems) {
            totalPrice += item.price_per_token * item.remaining_amount;
            totalItems += Number(item.remaining_amount);
        }

        return { totalPrice, totalItems };

    }, [collections, selectedCollectionId, sweepValue]);


    useEffect(() => {
        console.log("Native Token", nativeToken)
        setActiveView('nfts')
    }, [nativeToken])


    useEffect(() => {
        refresh(walletProvider)
    }, [walletProvider])

    const handleBuy = (nftItem: NFTItem, quantity: number) => {


        const collection = collections[selectedCollectionId as number];
        if (!collection) return;
        let totalPrice: bigint = 0n;

        const collectionName = collection.name;

        const buyItem: BuyParam = {
            collectionId: nftItem.collectionId,
            itemId: nftItem.itemId,
            tokenId: nftItem.tokenId,
            amount: BigInt(quantity),
        };

        totalPrice = nftItem.price_per_token * BigInt(quantity);

        const purchaseParam: PurchaseParam = {
            collectionName: collectionName,
            nfts: [nftItem],
            totalPrice: totalPrice,
            items: [buyItem],
        };

        setPurchasingNFT(purchaseParam);
    };

    const handleSweepBuy = () => {
        if (sweepValue === 0) return;
        return;






        setPurchasingNFT({
            name: `${sweepValue} NFTs Batch Sweep`,
            price: parseFloat((sweepValue * floorPrice).toFixed(2))
        });
    };
    return (<>

        {/* Detail Overlay */}
        {viewingNFT && (
            <NFTDetailView
                nft={viewingNFT}
                onClose={() => setViewingNFT(null)}
                onBuy={handleBuy}
            />
        )}

        {/* Purchase Modal */}
        {purchasingNFT && (
            <PurchaseModal
                purchase={purchasingNFT}
                onClose={() => setPurchasingNFT(null)}
            />
        )}


        <div className={`select-none flex flex-col gap-4 items-center justify-center px-0 py-4 md:p-4 transition-colors duration-300  transition-all duration-500 ${viewingNFT || purchasingNFT ? 'blur-md scale-95 opacity-50' : ''}`}>
            <div translate='no' className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-4">

                <div className="order-2 sm:order-1 lg:col-span-2">


                    <div className="flex items-center gap-4 mb-2">
                        <motion.div
                            className={`relative ${isDarkMode
                                ? 'bg-gray-800/30 border-gray-700/30'
                                : 'bg-white/40 border-white/20'
                                } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}>

                            <div className='w-full'>
                                <div className="bg-white rounded-3xl p-6 soft-shadow border border-gray-50 h-fit">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="w-full text-lg font-black text-gray-800">Collections</h2>

                                        <div className='flex w-full items-center justify-end gap-2'>

                                            <span className="bg-pink-50 text-pink-500 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight">Top Picks</span>
                                            <motion.button
                                                onClick={() => {
                                                    refresh(walletProvider)

                                                }}
                                                className={`${isDarkMode
                                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 ring-gray-600'
                                                    : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100 ring-pink-200'
                                                    } p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                aria-label="Ayarlar"
                                            >
                                                <RefreshCcw className="w-5 h-5" />
                                            </motion.button>

                                        </div>
                                    </div>

                                    <div className="relative mb-6">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search collections..."
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-200"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Trending Galleries</h3>

                                        <div className="space-y-3">
                                            {collections && collections.map((col, index) => (
                                                <div onClick={() => {
                                                    setSelectedCollectionId(index)

                                                }} key={col.collection} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-pink-50/50 group cursor-pointer transition-all border border-transparent hover:border-pink-100">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm relative flex-shrink-0">
                                                        <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(col.name ?? col.collection)}`} alt={col.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex items-center gap-1">
                                                            <h4 className="text-sm font-black text-gray-800 truncate">{col?.name}</h4>
                                                            <CheckCircle size={12} className="text-pink-500" fill="currentColor" fillOpacity={0.1} />
                                                        </div>
                                                        <div className="flex items-center justify-between mt-0.5">
                                                            <p className="text-[10px] text-gray-400 font-bold">{col.itemsCount} items</p>
                                                            <p className="text-[10px] font-black text-pink-500">Floor: {formatEther(col.floorPrice)} {"CHZ"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button className="w-full mt-4 py-3 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
                                            View All Collections
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>

                <div className="order-1 sm:order-2 lg:col-span-3 flex flex-col gap-4">
                    <div className='flex flex-col gap-4'>
                        <SwapTabs isLimitOrder={true} isDarkMode={isDarkMode} />
                    </div>

                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}>
                        <div className='w-full'>




                            <div className="bg-white rounded-3xl p-5 flex flex-col items-center justify-between gap-4 soft-shadow mb-8 border border-gray-100 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/[0.02] to-transparent opacity-100 pointer-events-none" />

                                <div className="w-full flex items-center gap-4 flex-grow w-full relative z-10">
                                    <span className="text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] ml-2 opacity-90">Sweep</span>

                                    <div className="relative flex-grow h-11 flex items-center bg-gray-50 rounded-2xl px-5 border border-gray-100 shadow-inner">
                                        {/* Dots Track */}
                                        <div className="absolute left-5 right-5 h-full flex items-center justify-between px-2 pointer-events-none">
                                            {Array.from({ length: maxSweep + 1 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1 h-1 rounded-full transition-all duration-300 ${i <= sweepValue
                                                        ? 'bg-pink-500 shadow-[0_0_8px_rgba(255,59,107,0.4)] scale-110'
                                                        : 'bg-gray-500'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Range Input */}
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxSweep}
                                            value={sweepValue}
                                            onChange={(e) => setSweepValue(parseInt(e.target.value))}
                                            className="w-full h-full bg-transparent appearance-none cursor-pointer relative z-20 accent-pink-500 hover:accent-pink-400 transition-all [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-xl [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:ring-[4px] [&::-webkit-slider-thumb]:ring-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:hover:scale-105 transition-transform"
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex items-center justify-between sm:justify-end gap-6 lg:gap-10 w-full ">
                                    <div className="text-right min-w-[70px]">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">EST. VALUE</span>
                                        <p className="font-black text-xs tracking-tighter whitespace-nowrap">
                                            {formatEther(sweepSummary.totalPrice)} <span className="text-pink-500 text-[8px] ml-0.5 font-black tracking-tight">CHZ</span>
                                        </p>
                                    </div>
                                    <div className="text-right min-w-[50px]">
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">UNITS</span>
                                        <p className="font-black text-xs tracking-tighter whitespace-nowrap">
                                            {sweepSummary.totalItems.toFixed(2)} <span className="text-pink-500 text-[8px] ml-0.5 font-black tracking-tight">NFT</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSweepBuy}
                                        disabled={sweepValue === 0}
                                        className={`w-full px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${sweepValue > 0
                                            ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white ring-pink-200 text-white shadow-pink-500/30 hover:scale-[1.03] active:scale-95'
                                            : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200'
                                            }`}
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 px-4 mb-5 md:grid-cols-2 gap-4">
                                {!loading && collections && collections.length > 0 && collections[selectedCollectionId as number]?.items.map((nft, nftIndex) => (
                                    <NFTCard
                                        key={`nftItem${nftIndex}`}
                                        nft={nft}
                                        onView={setViewingNFT}
                                        onBuy={handleBuy}
                                        isSelected={sweepSelectedItems.some(i => i.itemId === nft.itemId)}
                                    />
                                ))}
                            </div>


                        </div>


                    </motion.div>


                </div>

                <div className="order-3 sm:order-3 lg:col-span-2">
                    <motion.div
                        className={`relative ${isDarkMode
                            ? 'bg-gray-800/30 border-gray-700/30'
                            : 'bg-white/40 border-white/20'
                            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}>
                        <div className="flex-1">

                            <div className="bg-white rounded-3xl p-6 soft-shadow border border-gray-50">
                                <h2 className="text-lg font-black text-gray-900 mb-8 tracking-tight">Portfolio</h2>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-xl">
                                            <img src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${encodeURIComponent(address ? address : "KEWL")}`} alt={"KEWL"} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900">Collector_v2</h3>
                                            <p className="text-[9px] text-pink-500 uppercase font-black tracking-widest mt-0.5">Level 48 Elite</p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-100 space-y-5">
                                        <h2 className="text-lg font-black text-gray-900 mb-8 tracking-tight">Inventory</h2>

                                        <div className="flex justify-between items-end">
                                            <p className="text-base font-black text-gray-900 tracking-tighter">0 <span className="text-pink-500 text-xs">NFT</span></p>
                                        </div>

                                        <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                                            <div className="w-16 h-16 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center">
                                                <Briefcase size={24} className="text-gray-300" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your inventory is empty.</p>
                                            <p className="text-[9px] font-medium text-gray-300 mt-1">You will see your NFTs here.</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </>
    );
};

export default NFTsPage;

