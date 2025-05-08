import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  MinusCircle, 
  TrendingUp, 
  PieChart, 
  Info, 
  Zap, 
  ChevronDown, 
  ArrowDownUp,
  AlertCircle,
  Clock,
  Shield,
  CheckCircle,
  BarChart3,
  DollarSign,
  LineChart,
  BarChart2,
  Layers,
  Award,
  X
} from 'lucide-react';
import { useTokenContext, Token } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';

interface ETFViewProps {
  isDarkMode: boolean;
}

const ETFView: React.FC<ETFViewProps> = ({ isDarkMode }) => {
  const { tokens, baseToken, quoteToken } = useTokenContext();
  
  // ETF screen specific states
  const [activeTab, setActiveTab] = useState<'discover' | 'my-etfs' | 'create'>('discover');
  const [investAmount, setInvestAmount] = useState<string>('');
  const [selectedETF, setSelectedETF] = useState<number>(0);
  
  // Sample ETF packages
  const etfPackages = [
    {
        id: 4,
        name: 'Fan Tokens',
        description: 'Sports and entertainment fan tokens',
        performance: '+8.7%',
        trend: 'up',
        apy: '15.3%',
        tvl: '$12.8M',
        risk: 'Medium',
        composition: [
          { token: tokens[4] || tokens[0], weight: 35 },
          { token: tokens[5] || tokens[1], weight: 35 },
          { token: tokens[2], weight: 30 }
        ],
        color: '#8247e5'
      },
    {
      id: 1,
      name: 'DeFi Momentum',
      description: 'Leading tokens of the DeFi ecosystem',
      performance: '+14.8%',
      trend: 'up',
      apy: '18.2%',
      tvl: '$24.5M',
      risk: 'Medium',
      composition: [
        { token: tokens[0], weight: 30 },
        { token: tokens[1], weight: 40 },
        { token: tokens[2], weight: 15 },
        { token: tokens[3], weight: 15 }
      ],
      color: '#627eea'
    },
    {
      id: 2,
      name: 'Stablecoin Yield',
      description: 'Low-risk stablecoin yield strategy',
      performance: '+5.2%',
      trend: 'up',
      apy: '8.6%',
      tvl: '$48.7M',
      risk: 'Low',
      composition: [
        { token: tokens[3], weight: 60 },
        { token: tokens[1], weight: 25 },
        { token: tokens[0], weight: 15 }
      ],
      color: '#26a17b'
    },
    {
      id: 3,
      name: 'MEME Index',
      description: 'MEME and gaming tokens',
      performance: '-3.2%',
      trend: 'down',
      apy: '12.4%',
      tvl: '$16.3M',
      risk: 'High',
      composition: [
        { token: tokens[2], weight: 45 },
        { token: tokens[0], weight: 30 },
        { token: tokens[1], weight: 25 }
      ],
      color: '#f7931a'
    }
  ];
  
  // User's invested ETFs (sample data)
  const myEtfs = [
    {
      etfId: 1,
      invested: '$2,500',
      currentValue: '$2,873',
      profit: '+$373',
      profitPercentage: '+14.9%',
      joinDate: '2 months ago'
    }
  ];

  // Form operations
  const handleInvestAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInvestAmount(value);
  };
  
  return (
    <motion.div 
      className={`${
        isDarkMode 
          ? 'bg-gray-800/30 border-gray-700/30' 
          : 'bg-white/40 border-white/20'
      } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-30 z-0"
        style={{
          background: `linear-gradient(135deg, ${etfPackages[selectedETF].color}40 0%, transparent 70%),
                      linear-gradient(315deg, ${etfPackages[selectedETF].color}40 0%, transparent 70%)`
        }}
      ></div>
      
      <div className={`relative z-10 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md rounded-3xl overflow-hidden`}>
        {/* Tab Selector */}
        <div className="flex p-3 border-b border-gray-200 dark:border-gray-700">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-xl flex items-center justify-center ${
              activeTab === 'discover' 
                ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white' 
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:bg-gray-100/70'
            }`}
            onClick={() => setActiveTab('discover')}
          >
            <PieChart className="w-4 h-4 mr-1.5" />
            Discover ETF
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-xl flex items-center justify-center mx-2 ${
              activeTab === 'my-etfs' 
                ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white' 
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:bg-gray-100/70'
            }`}
            onClick={() => setActiveTab('my-etfs')}
          >
            <Layers className="w-4 h-4 mr-1.5" />
            My Investments
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-xl flex items-center justify-center ${
              activeTab === 'create' 
                ? 'bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white' 
                : isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-600 hover:bg-gray-100/70'
            }`}
            onClick={() => setActiveTab('create')}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create ETF
          </button>
        </div>
        
        {/* ETF Discovery Screen */}
        {activeTab === 'discover' && (
          <div className="p-4">
            {/* ETF Packages List */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Popular ETF Packages
                </h3>
                <div className={`text-xs px-2 py-1 rounded-lg ${
                  isDarkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-[#ff1356]'
                }`}>
                  {etfPackages.length} ETFs
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {etfPackages.map((etf, index) => (
                  <motion.div 
                    key={etf.id} 
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 relative ${
                      selectedETF === index
                        ? isDarkMode
                          ? 'bg-gradient-to-r from-gray-700/90 to-gray-800/90 border border-pink-600/50'
                          : 'bg-gradient-to-r from-pink-50 to-white border border-pink-200'
                        : isDarkMode
                          ? 'bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50'
                          : 'bg-gray-50/70 border border-gray-200/50 hover:border-gray-300/50'
                    }`}
                    onClick={() => setSelectedETF(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                          {etf.name}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {etf.description}
                        </div>
                      </div>
                      <div className={`text-sm font-medium flex items-center ${
                        etf.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {etf.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                        {etf.performance}
                      </div>
                    </div>
                    
                    {/* Token Icons Fixed Area */}
                    <div className="relative h-8 mb-2">
                      {etf.composition.map((item, i) => (
                        <div 
                          key={i} 
                          className="absolute" 
                          style={{ 
                            left: `${i * 20}px`, 
                            zIndex: 10 - i,
                            top: '0'
                          }}
                        >
                          <TokenShape token={item.token} size="sm" isDarkMode={isDarkMode} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className={`${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} p-1.5 rounded-lg`}>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>APY</div>
                        <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{etf.apy}</div>
                      </div>
                      <div className={`${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} p-1.5 rounded-lg`}>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>TVL</div>
                        <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{etf.tvl}</div>
                      </div>
                      <div className={`${isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'} p-1.5 rounded-lg`}>
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Risk</div>
                        <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{etf.risk}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Selected ETF Details */}
            <div className={`p-3 rounded-xl ${
              isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
            } mb-4 relative`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {etfPackages[selectedETF].name}
                  </h3>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                    {etfPackages[selectedETF].description}
                  </div>
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  etfPackages[selectedETF].trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {etfPackages[selectedETF].trend === 'up' 
                    ? <TrendingUp className="w-4 h-4 mr-1" /> 
                    : <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                  }
                  {etfPackages[selectedETF].performance}
                </div>
              </div>
              
              {/* Selected ETF's token icons */}
              <div className="relative h-8 mb-3">
                {etfPackages[selectedETF].composition.map((item, i) => (
                  <div 
                    key={i} 
                    className="absolute" 
                    style={{ 
                      left: `${i * 24}px`, 
                      zIndex: 10 - i,
                      top: '0'
                    }}
                  >
                    <TokenShape token={item.token} size="sm" isDarkMode={isDarkMode} />
                  </div>
                ))}
              </div>
              
              {/* ETF Content Chart - Simplified */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} p-3 rounded-xl`}>
                  <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ETF Composition
                  </div>
                  {/* Simple Bar Chart */}
                  <div className="space-y-2">
                    {etfPackages[selectedETF].composition.map((item, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <TokenShape token={item.token} size="sm" isDarkMode={isDarkMode} />
                            <div className={`ml-2 text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {item.token.symbol}
                            </div>
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            %{item.weight}
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${item.weight}%`,
                              backgroundColor: item.token.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'} p-3 rounded-xl`}>
                  <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ETF Performance and Information
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Award className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                      <div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Annual Return</div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{etfPackages[selectedETF].apy}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      <div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Risk Level</div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{etfPackages[selectedETF].risk}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      <div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Value</div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{etfPackages[selectedETF].tvl}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LineChart className={`w-4 h-4 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                      <div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Volatility</div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Medium</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-1.5 rounded-lg mt-2 ${isDarkMode ? 'bg-green-900/20 text-green-300 border border-green-800/30' : 'bg-green-50 text-green-700 border border-green-100'} text-xs flex items-start`}>
                    <Info className="w-3 h-3 mr-1 mt-0.5" />
                    <span>This ETF gained 14.8% in the last 30 days. 6-month return is 38.6.</span>
                  </div>
                </div>
              </div>
              
              {/* Investment Form */}
              <div className={`mt-3 p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'}`}>
                <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Invest
                </div>
                <div className="flex">
                  <div className="flex-1 relative">
                    <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} w-4 h-4`} />
                    <input
                      type="text"
                      placeholder="0.00"
                      value={investAmount}
                      onChange={handleInvestAmountChange}
                      className={`w-full pl-10 pr-3 py-2 rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-pink-500' 
                          : 'bg-gray-50 border-gray-100 text-gray-800 placeholder-gray-400 focus:ring-pink-200'
                      } border text-sm focus:outline-none focus:ring-2 transition-colors`}
                    />
                  </div>
                  <motion.button
                    className="ml-2 py-2 px-4 rounded-lg font-medium flex items-center justify-center text-white relative overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!investAmount}
                    style={{
                      background: `linear-gradient(135deg, #ff1356, #ff4080)`,
                      opacity: !investAmount ? 0.7 : 1
                    }}
                  >
                    <span>Invest</span>
                    <Zap className="w-4 h-4 ml-1.5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* User's ETF Investments */}
        {activeTab === 'my-etfs' && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Active ETF Investments
              </h3>
              <div className={`text-xs px-2 py-1 rounded-lg ${
                isDarkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-[#ff1356]'
              }`}>
                Total: $2,873
              </div>
            </div>
            
            {myEtfs.length > 0 ? (
              <div className="space-y-3">
                {myEtfs.map((investment) => {
                  const etf = etfPackages.find(e => e.id === investment.etfId);
                  if (!etf) return null;
                  
                  return (
                    <div 
                      key={investment.etfId} 
                      className={`p-3 rounded-xl relative ${
                        isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {etf.name}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Joined: {investment.joinDate}
                          </div>
                        </div>
                        <div className={`text-sm font-medium flex items-center text-green-500`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {investment.profitPercentage}
                        </div>
                      </div>
                      
                      {/* Token icons correction */}
                      <div className="relative h-8 mb-3">
                        {etf.composition.map((item, i) => (
                          <div 
                            key={i} 
                            className="absolute" 
                            style={{ 
                              left: `${i * 24}px`, 
                              zIndex: 10 - i,
                              top: '0'
                            }}
                          >
                            <TokenShape token={item.token} size="sm" isDarkMode={isDarkMode} />
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Invested</div>
                          <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{investment.invested}</div>
                        </div>
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Value</div>
                          <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{investment.currentValue}</div>
                        </div>
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profit</div>
                          <div className={`font-medium text-green-500`}>{investment.profit}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center ${
                          isDarkMode 
                            ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                            : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                        }`}>
                          <PlusCircle className="w-3 h-3 mr-1" />
                          Add
                        </button>
                        <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center ${
                          isDarkMode 
                            ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                            : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                        }`}>
                          <MinusCircle className="w-3 h-3 mr-1" />
                          Remove
                        </button>
                        <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white`}>
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/70'
              } text-center`}>
                <PieChart className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  You Don't Have Any ETF Investments Yet
                </div>
                <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  You can invest in ETF packages from the Discover section
                </div>
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white rounded-xl text-sm font-medium flex items-center justify-center mx-auto"
                  onClick={() => setActiveTab('discover')}
                >
                  <PieChart className="w-4 h-4 mr-1.5" />
                  Discover ETFs
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* ETF Creation Screen - Redesigned */}
        {activeTab === 'create' && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Create Your Own ETF Package
              </h3>
              
              {/* ETF Basic Information */}
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
              } mb-4`}>
                <div className="mb-3">
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ETF Name
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: DeFi Leaders ETF"
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-pink-500' 
                        : 'bg-white border-gray-100 text-gray-800 placeholder-gray-400 focus:ring-pink-200'
                    } border text-sm focus:outline-none focus:ring-2 transition-colors`}
                  />
                </div>
                <div className="mb-3">
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Short description about the ETF"
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-pink-500' 
                        : 'bg-white border-gray-100 text-gray-800 placeholder-gray-400 focus:ring-pink-200'
                    } border text-sm focus:outline-none focus:ring-2 transition-colors`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Risk Level
                  </label>
                  <div className="flex space-x-2">
                    <button className={`text-xs py-1.5 px-3 rounded-lg flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-green-900/30 text-green-300 border border-green-800/30' 
                        : 'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                      <Shield className="w-3 h-3 mr-1" />
                      Low
                    </button>
                    <button className={`text-xs py-1.5 px-3 rounded-lg flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-800/30' 
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                    }`}>
                      <Shield className="w-3 h-3 mr-1" />
                      Medium
                    </button>
                    <button className={`text-xs py-1.5 px-3 rounded-lg flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-pink-900/30 text-pink-300 border border-pink-800/30' 
                        : 'bg-pink-50 text-pink-700 border border-pink-100'
                    }`}>
                      <Shield className="w-3 h-3 mr-1" />
                      High
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Token Addition and Weight Determination */}
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
              } mb-4`}>
                <div className="flex justify-between items-center mb-3">
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Create ETF Composition
                  </div>
                  <button className={`text-xs py-1 px-2 rounded-lg flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}>
                    <PlusCircle className="w-3 h-3 mr-1" />
                    Add Token
                  </button>
                </div>
                
                {/* Token List - Sample tokens */}
                <div className="space-y-3 mb-3">
                  {/* Token 1 */}
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <TokenShape token={tokens[0]} size="sm" isDarkMode={isDarkMode} />
                        <div className="ml-2">
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {tokens[0].symbol}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {tokens[0].name}
                          </div>
                        </div>
                      </div>
                      <div>
                        <button className={`text-xs p-1 rounded ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Weight: 40%
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Price: {tokens[0].price}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        defaultValue="40"
                        className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  {/* Token 2 */}
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <TokenShape token={tokens[1]} size="sm" isDarkMode={isDarkMode} />
                        <div className="ml-2">
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {tokens[1].symbol}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {tokens[1].name}
                          </div>
                        </div>
                      </div>
                      <div>
                        <button className={`text-xs p-1 rounded ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Weight: 30%
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Price: {tokens[1].price}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        defaultValue="30"
                        className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  {/* Token 3 */}
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <TokenShape token={tokens[2]} size="sm" isDarkMode={isDarkMode} />
                        <div className="ml-2">
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {tokens[2].symbol}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {tokens[2].name}
                          </div>
                        </div>
                      </div>
                      <div>
                        <button className={`text-xs p-1 rounded ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Weight: 30%
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Price: {tokens[2].price}
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        defaultValue="30"
                        className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Weight Summary */}
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-800/50 text-gray-300 border border-gray-700' : 'bg-white text-gray-700 border border-gray-200'
                } text-xs flex items-start`}>
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span>Total Weight</span>
                      <span className={`font-medium ${
                        100 === 100 ? 'text-green-500' : 'text-red-500'
                      }`}>100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#ff1356] to-[#ff4080]"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ETF Preview */}
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
              } mb-4`}>
                <div className={`text-xs font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ETF Preview
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="relative h-9 w-28 mr-3">
                    {[tokens[0], tokens[1], tokens[2]].map((token, i) => (
                      <div 
                        key={i} 
                        className="absolute" 
                        style={{ 
                          left: `${i * 22}px`, 
                          zIndex: 10 - i,
                          top: '0'
                        }}
                      >
                        <TokenShape token={token} size="sm" isDarkMode={isDarkMode} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Custom ETF Package
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      3 tokens • Medium risk
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {/* Pie Chart Placeholder */}
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'} flex items-center justify-center`} style={{height: '120px'}}>
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 rounded-full bg-[#627eea] opacity-70" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%, 50% 100%)' }}></div>
                      <div className="absolute inset-0 rounded-full bg-[#ff1356] opacity-70" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)' }}></div>
                      <div className="absolute inset-0 rounded-full bg-[#f7931a] opacity-70" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 50% 50%)' }}></div>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        <div className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          100%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Summary Information */}
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Estimated APY:</span>
                        <span className={`text-xs font-medium text-green-500`}>15.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expected Volatility:</span>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Medium</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Management Fee:</span>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>1.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Min. Investment:</span>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>$100</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' : 'bg-blue-50 text-blue-700 border border-blue-100'
                } text-xs flex items-start mb-3`}>
                  <Info className="w-3 h-3 mr-1 mt-0.5" />
                  <span>
                    Your created ETF will be exclusively listed for 7 days for early investors. 
                    During this period, only people you designate can invest.
                  </span>
                </div>
              </div>
              
              {/* Confirmation and Action Button */}
              <motion.button
                className="w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 text-white relative overflow-hidden shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: `linear-gradient(135deg, #ff1356, #ff4080)`
                }}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-white opacity-20">
                  <div className="h-full w-1/3 bg-white/40 blur-xl transform -skew-x-30 -translate-x-full animate-shimmer"></div>
                </div>
                
                <span>Create ETF Package</span>
                <Zap className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ETFView; 