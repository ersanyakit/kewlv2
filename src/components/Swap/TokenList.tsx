import React from 'react';
import { motion } from 'framer-motion';
import { Search, Star, CheckCircle, RefreshCcw } from 'lucide-react';
import { useTokenContext, Token } from '../../context/TokenContext';
import TokenShape from '../UI/TokenShape';

interface TokenListProps {
  isDarkMode: boolean;
}

const TokenList: React.FC<TokenListProps> = ({ isDarkMode }) => {
  const {
    tokens,
    baseToken,
    tokenFilter,
    favoriteOnly,
    filteredTokens,
    setTokenFilter,
    setFavoriteOnly,
    setBaseToken,
    reloadTokens,
  } = useTokenContext();

  const handleSelectToken = (token: Token) => {
    setBaseToken(token);
  };

  return (<motion.div
    className={`${isDarkMode
      ? 'bg-gray-800/90 border-gray-700/50'
      : 'bg-white/80 border-white/30'
      } backdrop-blur-md min-h-[68dvh]  max-h-[68dvh]  rounded-3xl flex h-full flex-col items-start justify-between gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300`}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
  >

 
      <div className='w-full'>

        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} transition-colors duration-300`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} transition-colors duration-300`}>Token List</h3>
            <div className='flex flex-row items-center justify-center gap-2'>
              <div className={`${isDarkMode
                ? 'bg-pink-900/30 text-pink-300'
                : 'bg-pink-50 text-[#ff1356]'
                } px-2 py-1 rounded-md text-xs transition-colors duration-300`}>
                {tokens.length} tokens
              </div>
              <motion.button
                onClick={() => {
                  reloadTokens();
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


          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
              } transition-colors duration-300`} />
            <input
              type="text"
              placeholder="Search tokens..."
              value={tokenFilter}
              onChange={(e) => setTokenFilter(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 ${isDarkMode
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-pink-500'
                : 'bg-gray-50 border-gray-100 text-gray-800 placeholder-gray-400 focus:ring-pink-200'
                } border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors`}
            />
          </div>

          <div className="flex items-center mt-2">
            <button
              onClick={() => setFavoriteOnly(!favoriteOnly)}
              className={`text-xs py-1 px-3 rounded-lg border flex items-center ${favoriteOnly
                ? isDarkMode
                  ? 'bg-pink-900/30 border-pink-800 text-pink-300'
                  : 'bg-pink-100 border-pink-200 text-[#ff1356]'
                : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-300'
                  : 'bg-white border-gray-200 text-gray-700'
                } transition-all duration-300`}
            >
              <Star className={`w-3 h-3 mr-1 ${favoriteOnly ? 'fill-[#ff1356]' : ''}`} />
              Favorites
            </button>

            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-auto transition-colors duration-300`}>
              {filteredTokens.length} results
            </span>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-1 items-start justify-center gap-2'>
        <div className={`w-full px-3 py-2 overflow-y-scroll max-h-[calc(68dvh-300px)] ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'
          }`}>
          {filteredTokens.map(token => (
            <motion.div
              key={token.symbol}
              className={`flex items-center justify-between p-2 rounded-xl transition-all duration-300 mb-2 cursor-pointer ${baseToken && token.symbol === baseToken.symbol
                ? isDarkMode
                  ? 'bg-pink-900/30 border border-pink-800/50'
                  : 'bg-pink-50 border border-pink-200'
                : isDarkMode
                  ? 'hover:bg-gray-700/70 border border-transparent hover:border-gray-600'
                  : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
              whileHover={{
                scale: 1.03,
                boxShadow: isDarkMode
                  ? "0 4px 8px rgba(0,0,0,0.25)"
                  : "0 4px 8px rgba(0,0,0,0.1)"
              }}
              whileTap={{
                scale: 0.97,
                boxShadow: "none",
                backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => {
                // Selection animation
                const element = document.getElementById(`token-${token.symbol}`);
                if (element) {
                  element.classList.add('animate-ping-once');
                  setTimeout(() => {
                    element.classList.remove('animate-ping-once');
                    handleSelectToken(token);
                  }, 300);
                } else {
                  handleSelectToken(token);
                }
              }}
            >
              <div className="flex items-center w-full">
                <div id={`token-${token.symbol}`}>
                  <TokenShape token={token} size="sm" isDarkMode={isDarkMode} />
                </div>
                <div className="ml-3 w-full">
                  <div className="flex items-center">
                    <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      } transition-colors duration-300`}>{token.symbol}</span>
                    {token.verified && (
                      <CheckCircle className="w-3 h-3 text-[#ff1356] ml-1" />
                    )}
                    {token.favorite && (
                      <Star className="w-3 h-3 text-[#ff1356] ml-1 fill-[#ff1356]" />
                    )}
                  </div>
                  <div className={`text-xs w-full  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } transition-colors duration-300 truncate overflow-hidden`}>{token.name.length > 10 ? token.name.slice(0, 20) + "..." : token.name}</div>
                </div>
              </div>
              <div className="text-right w-full">

                <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} transition-colors duration-300`}>
                  {token.loading ? (
                    <div className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      aria-hidden="true">
                    </div>
                  ) : (
                    token.balance
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className='w-full flex flex flex-row items-center justify-center gap-2'>
        <div className={` p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'
          } transition-colors duration-300`}>
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
            } mb-2 transition-colors duration-300`}>Token Information</h4>
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            } rounded-xl p-3 transition-colors duration-300`}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } transition-colors duration-300`}>Trading Volume (24h)</div>
                <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  } transition-colors duration-300`}>{baseToken && baseToken.volume24h}</div>
              </div>
              <div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } transition-colors duration-300`}>Market Cap</div>
                <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  } transition-colors duration-300`}>{baseToken && baseToken.marketCap}</div>
              </div>
              <div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } transition-colors duration-300`}>Category</div>
                <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  } transition-colors duration-300`}>{baseToken && baseToken.category}</div>
              </div>
              <div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } transition-colors duration-300`}>Status</div>
                <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  } flex items-center transition-colors duration-300`}>
                  {baseToken && baseToken.verified ?
                    <><CheckCircle className="w-3 h-3 text-[#ff1356] mr-1" /> Verified</> :
                    'Not Verified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
  </motion.div>)
};

export default TokenList; 