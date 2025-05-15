import { motion } from "framer-motion";
import { useTokenContext } from "../../../context/TokenContext";
import { useEffect, useState, useCallback, useMemo, memo, useRef } from "react";
import { useSwapContext } from "../../../context/SwapContext";
import { useAppKitProvider } from "@reown/appkit/react";
import { formatEther } from "ethers";

// Move static components outside to prevent recreation on each render
const LoadingSkeleton = memo(({ isDarkMode }: { isDarkMode: boolean }) => (
    <>
        {[1, 2, 3,4,5].map((index) => (
            <motion.div
                key={index}
                className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10 animate-pulse" />
                    <div className={`h-4 w-20 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                    <div className={`h-4 w-16 rounded ml-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                </div>
                <div className="space-y-2">
                    <div className={`h-3 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                    <div className={`h-3 w-2/3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                    <div className={`h-3 w-1/2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                </div>
            </motion.div>
        ))}
    </>
));

const EmptyState = memo(({ isDarkMode }: { isDarkMode: boolean }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
    >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#ff1356]/10 to-[#ff4080]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#ff4080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-sm font-medium mb-1">No Claims Yet</p>
        <p className="text-xs">Your recent claims will appear here</p>
    </motion.div>
));

// Memoize the ClaimItem component
const ClaimItem = memo(({ claim, isDarkMode }: { claim: any, isDarkMode: boolean }) => (
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
));

const RecentClaim: React.FC = () => {
    const { fetchClaimedRewards, claimedRewards } = useSwapContext();
    const { walletProvider } = useAppKitProvider('eip155');
    const { isDarkMode } = useTokenContext();
    const [isLoading, setIsLoading] = useState(true);
    
    // Use refs to track previous values and prevent unnecessary re-renders
    const prevWalletProviderRef = useRef(walletProvider);
    const prevClaimedRewardsRef = useRef(claimedRewards);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Custom comparison function for claimedRewards
    const areClaimsEqual = useCallback((prev: any[], current: any[]) => {
        if (prev.length !== current.length) return false;
        
        return prev.every((prevClaim, index) => {
            const currentClaim = current[index];
            return (
                prevClaim.proof === currentClaim.proof &&
                prevClaim.timestamp === currentClaim.timestamp &&
                prevClaim.rewardType === currentClaim.rewardType &&
                prevClaim.user === currentClaim.user &&
                prevClaim.amount.toString() === currentClaim.amount.toString() &&
                prevClaim.isNew === currentClaim.isNew
            );
        });
    }, []);
  
    // Memoize the loadData function with stable dependencies
    const loadData = useCallback(async () => {
        if (!walletProvider) return;
        
        // Only update loading state if it's not already loading
        if (!isLoading) {
            setIsLoading(true);
        }
        
        try {
            await fetchClaimedRewards(walletProvider);
        } catch (error) {
            console.error("Error fetching claimed rewards:", error);
        } finally {
            setIsLoading(false);
        }
    }, [walletProvider, fetchClaimedRewards, isLoading]);
  
    useEffect(() => {
        // Only set up interval if walletProvider exists and has changed
        if (walletProvider && walletProvider !== prevWalletProviderRef.current) {
            // Clear any existing interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            
            // Initial load
            loadData();
            
            // Set up new interval
            intervalRef.current = setInterval(loadData, 300000); // 5 minutes
            
            // Update ref
            prevWalletProviderRef.current = walletProvider;
        }
        
        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [walletProvider, loadData]);

    // Memoize the rendered content with stable dependencies
    const renderedContent = useMemo(() => {
        // Only re-render if claimedRewards has actually changed
        if (!areClaimsEqual(prevClaimedRewardsRef.current, claimedRewards)) {
            prevClaimedRewardsRef.current = claimedRewards;
        }

        if (isLoading) {
            return <LoadingSkeleton isDarkMode={isDarkMode} />;
        }
        
        if (claimedRewards.length === 0) {
            return <EmptyState isDarkMode={isDarkMode} />;
        }
        
        return claimedRewards.map((claim) => (
            <ClaimItem key={claim.proof} claim={claim} isDarkMode={isDarkMode} />
        ));
    }, [isLoading, claimedRewards, isDarkMode, areClaimsEqual]);

    // Memoize the container styles to prevent unnecessary re-renders
    const containerStyles = useMemo(() => ({
        className: `relative ${isDarkMode
            ? 'bg-gray-800/30 border-gray-700/30'
            : 'bg-white/40 border-white/20'
            } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`
    }), [isDarkMode]);

    return (
        <motion.div
            {...containerStyles}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            <div className="p-4">
                <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} pb-5 transition-colors duration-300`}>
                    Recent Claims
                </h3>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide pt-2 pr-1">
                    {renderedContent}
                </div>
            </div>
        </motion.div>
    );
};

export default memo(RecentClaim);