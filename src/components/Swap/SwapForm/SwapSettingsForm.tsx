import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowDownUp,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  RotateCcw,
  RefreshCw,
  DollarSign,
  XCircle,
  RefreshCcw,
  X,
  Percent,
} from 'lucide-react';
import { SWAP_MODE, useTokenContext } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';
import { TradeType } from '../../../constants/entities/utils/misc';
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { useSwapContext } from '../../../context/SwapContext';
import { warningSeverity } from '../../../constants/entities/utils/calculateSlippageAmount';

// memo ile render performansını optimize etme
const SwapSettingsForm: React.FC = () => {
  // Token context'inden verileri al
  const {
    isDarkMode,
    slippageTolerance,
    baseToken,
    swapMode,
    quoteToken,
    selectingTokenIndex,
    tokenFilter,
    favoriteOnly,
    filteredTokens,
    tradeType,
    openTokenSelector,
    setOpenTokenSelector,
    setTokenFilter,
    setFavoriteOnly,
    selectToken,
    reloadTokens,
    handleSwapTokens,
    setSelectingTokenIndex,
    setTradeType,
    setRiskTolerance,
    riskTolerance,
    enableTaxesContract,
    setEnableTaxesContract,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
  } = useTokenContext();
  const [slippage, setSlippage] = useState('0.5');
  const [deadline, setDeadline] = useState('20');
  const [expertMode, setExpertMode] = useState(false);

  const predefinedSlippages = ['0.1', '0.5', '1.0', '3.0'];

  const handleSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlippage(e.target.value);
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  const handleRiskToleranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRiskTolerance(parseInt(e.target.value));
  };

  const handleExpertModeToggle = () => {
      setEnableTaxesContract(!enableTaxesContract);
  };

  // Get the color based on risk value (green to red gradient)
  const getRiskColor = () => {
    if (riskTolerance <= 10) return 'rgb(34, 197, 94)';       // Yeşil
    if (riskTolerance <= 25) return 'rgb(132, 204, 22)';      // Açık yeşil / limon
    if (riskTolerance <= 50) return 'rgb(234, 179, 8)';       // Sarı
    if (riskTolerance <= 75) return 'rgb(249, 115, 22)';      // Turuncu
    return 'rgb(239, 68, 68)';                                // Kırmızı
  };

  const getRiskLabel = () => {
    if (riskTolerance <= 10) return "Ultra-safe preference";
    if (riskTolerance <= 25) return "Low-risk transactions preferred";
    if (riskTolerance <= 50) return "Moderate risk tolerance";
    if (riskTolerance <= 75) return "High risk tolerance";
    return "Willing to accept very high risk";
  };

  return (
    <div className="flex flex-col">

      <motion.div
        className={`w-full h-full
                ${isDarkMode
            ? 'bg-gray-800 text-white border-gray-700'
            : 'bg-white text-gray-800 border-gray-200'}
                p-6 rounded-3xl shadow-2xl border`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Transaction Settings
          </h3>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSettingsModalOpen(false)}
            className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-6">
              {/* Risk Tolerance */}
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-3">
              <Star className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <label className="font-medium">Risk Tolerance</label>
            </div>
            <div className="mb-3">
              <div className="relative pt-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={riskTolerance}
                  onChange={handleRiskToleranceChange}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(234, 179, 8), rgb(249, 115, 22), rgb(239, 68, 68))'
                  }}
                />
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-green-500">Low</span>
                  <span className="text-yellow-500">Medium</span>
                  <span className="text-red-500">High</span>
                  <span className="text-red-500">Very High</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300"
                style={{
                  backgroundColor: getRiskColor(),
                  boxShadow: `0 0 10px ${getRiskColor()}`
                }}
              >
                <span className="text-white text-xs font-bold">{riskTolerance}</span>
              </div>
              <div className="flex-1 text-sm">
                {getRiskLabel()}
              </div>
            </div>
            <p className="text-xs mt-2 text-gray-500">
              Higher risk tolerance means greater potential for both gains and losses.
            </p>
          </div>

                

          {/* Expert Mode Option */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="flex items-start">
              <Shield className={`w-5 h-5 mr-3 mt-0.5 ${enableTaxesContract ? 'text-red-500' : 'text-yellow-500'}`} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Expert Mode</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableTaxesContract}
                      onChange={handleExpertModeToggle}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer 
                            ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff1356]`}></div>
                  </label>
                </div>
                <p className="text-xs mt-2 text-gray-500">
                  Disables warnings for high slippage values and risky tokens. Only for advanced users.
                </p>
                {enableTaxesContract && (
                  <div className="mt-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-xs text-red-500">
                      Warning: Expert mode is enabled. Proceed with caution!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Slippage Tolerance */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-3">
              <Percent className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
              <label className="font-medium">Slippage Tolerance</label>
            </div>
            <div className="flex gap-2 mb-3">
              {predefinedSlippages.map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${slippage === value
                      ? 'bg-[#ff1356] text-white shadow-md'
                      : (isDarkMode
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                    }`}
                >
                  {value}%
                </button>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={slippage}
                onChange={handleSlippageChange}
                className={`w-full p-3 rounded-lg ${isDarkMode
                    ? 'bg-gray-600 text-white border-gray-500 focus:border-pink-500'
                    : 'bg-white text-gray-800 border-gray-300 focus:border-pink-500'
                  } border outline-none transition-colors`}
                step="0.1"
                min="0.1"
              />
              <span className="ml-2 font-medium">%</span>
            </div>
            <p className={`text-xs mt-2 ${parseFloat(slippage) > 5
                ? 'text-yellow-500'
                : (parseFloat(slippage) < 0.1 ? 'text-red-500' : 'text-gray-500')
              }`}>
              {parseFloat(slippage) > 5
                ? 'High slippage values may lead to transaction losses'
                : (parseFloat(slippage) < 0.1 ? 'Low slippage values may cause transactions to fail' : 'Recommended slippage values are between 0.5-1%')}
            </p>
          </div>

          {/* Transaction Deadline */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="flex items-center mb-3">
              <Clock className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <label className="font-medium">Transaction Timeout</label>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                value={deadline}
                onChange={handleDeadlineChange}
                className={`w-full p-3 rounded-lg ${isDarkMode
                    ? 'bg-gray-600 text-white border-gray-500 focus:border-pink-500'
                    : 'bg-white text-gray-800 border-gray-300 focus:border-pink-500'
                  } border outline-none transition-colors`}
                min="1"
              />
              <span className="ml-2 font-medium">minutes</span>
            </div>
            <p className="text-xs mt-2 text-gray-500">
              Your transaction will revert if it is pending for more than this period of time.
            </p>
          </div>


          {/* Save Button */}
          <motion.button
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white font-medium shadow-lg"
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(255, 19, 86, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSettingsModalOpen(false)}
          >
            Save Settings
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

SwapSettingsForm.displayName = 'SwapSettingsForm';

export default SwapSettingsForm; 