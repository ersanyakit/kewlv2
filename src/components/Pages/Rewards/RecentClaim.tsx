import { motion } from "framer-motion";
import { useTokenContext } from "../../../context/TokenContext";
import { useEffect, useState } from "react";
import { useSwapContext } from "../../../context/SwapContext";
import { useAppKitProvider } from "@reown/appkit/react";
import { formatEther } from "ethers";
const RecentClaim: React.FC = () => {
    const { fetchClaimedRewards, claimedRewards } = useSwapContext();
    const { walletProvider } = useAppKitProvider('eip155');

    const { isDarkMode } = useTokenContext();
  
      
    useEffect(() => {
        // Fetch initially on component mount
        fetchClaimedRewards(walletProvider);
        
        
    }, [walletProvider]); // Add walletProvider to dependencies if it could change

    useEffect(() => {
        console.log("LOGS,",claimedRewards);
    }, [claimedRewards]);

    return(
        <motion.div
        className={`relative ${isDarkMode
            ? 'bg-gray-800/30 border-gray-700/30'
            : 'bg-white/40 border-white/20'
            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
    >
        <div className="p-4">
        <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} pb-5 transition-colors duration-300`}>Recent Claims</h3>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide pt-2 pr-1">
                {claimedRewards.map((claim) => (
                <motion.div
                        key={claim.proof}
                    className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}
                    initial={claim.isNew ? { x: 0, opacity: 0, borderColor: '#ff4080' } : { opacity: 1 }}
                    animate={claim.isNew 
                        ? { 
                            x: 0, 
                            opacity: 1, 
                            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)',
                            transition: { duration: 0.4 } 
                        } 
                        : { opacity: 1 }
                    }
                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <motion.div 
                            className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff1356]/20 to-[#ff4080]/20 flex items-center justify-center"
                            animate={claim.isNew ? {
                                backgroundColor: ['rgba(255, 19, 86, 0.4)', 'rgba(255, 19, 86, 0.2)'],
                                scale: [1.2, 1],
                                transition: { duration: 0.8 }
                            } : {}}
                        >
                            <svg className="w-4 h-4 text-[#ff4080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{claim.timestamp}</span>
                            <motion.span 
                                className="ml-auto text-sm font-semibold text-[#ff4080]"
                                animate={claim.isNew ? {
                                    scale: [1.1, 1],
                                    transition: { duration: 0.5 }
                                } : {}}
                            >
                                {parseFloat(formatEther(claim.amount)).toFixed(2)}
                            </motion.span>
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                            <span className="font-medium">Reward Type:</span> {claim.rewardType}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate mb-1`}>
                            <span className="font-medium">Wallet:</span> {claim.user}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                            <span className="font-medium">Amount:</span> {formatEther(claim.amount)}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                            <span className="font-medium">Proof:</span> {claim.proof}
                    </div>
                </motion.div>
                ))} 
            </div>
        </div>
    </motion.div>
)
}





export default RecentClaim;