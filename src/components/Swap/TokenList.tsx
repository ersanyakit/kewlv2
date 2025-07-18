import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, CheckCircle, RefreshCcw, XCircle } from 'lucide-react';
import { useTokenContext, Token } from '../../context/TokenContext';
import TokenShape from '../UI/TokenShape';



const TokenList: React.FC = () => {
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
    isDarkMode
  } = useTokenContext();

  const handleSelectToken = (token: Token) => {
    setBaseToken(token);
  };

  useEffect(() => {
  }, [isDarkMode]);

  return (                    <motion.div
    className={`relative ${isDarkMode
        ? 'bg-gray-800/30 border-gray-700/30'
        : 'bg-white/40 border-white/20'
        } backdrop-blur-sm p-0.5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden transition-all duration-300 w-full`}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3 }}>
 
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
                 {/* Clear button */}
                 {tokenFilter && (
                  <button
                    onClick={() => setTokenFilter('')}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-80 transition-colors ${isDarkMode
                      ? 'hover:bg-gray-500/30 text-gray-400 hover:text-gray-300'
                      : 'hover:bg-gray-200/50 text-gray-500 hover:text-gray-700'
                      }`}
                    type="button"
                    aria-label="Clear search"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
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
        <div className={`w-full px-3 py-2 overflow-y-scroll scrollbar-hide max-h-[calc(68dvh-300px)] ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          {filteredTokens.map(token => (
            <motion.div
              key={`${token.symbol}-${token.address}`}
              className={`flex select-none items-center justify-between p-2 rounded-xl transition-all duration-300 mb-2 cursor-pointer ${baseToken && token.symbol === baseToken.symbol
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
                    parseFloat(token.balance).toLocaleString(undefined, {maximumFractionDigits: 4})
                 
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className='w-full flex  flex-row items-center justify-center gap-2'>
        <div className={`w-full p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'
          } transition-colors duration-300`}>
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
            } mb-2 transition-colors duration-300`}>Token Information</h4>
          <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            } rounded-xl transition-colors duration-300`}>
            <div className="grid grid-cols-2 mt-2 p-2 text-xs">
            <div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } transition-colors duration-300`}>Name</div>
                <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  } transition-colors duration-300 truncate`}>{baseToken && baseToken.name}</div>
              </div>
              <div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } transition-colors duration-300`}>Symbol</div>
                <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  } transition-colors duration-300`}>{baseToken && baseToken.symbol}</div>
              </div>
              <div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } transition-colors duration-300`}>Decimals</div>
                <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  } transition-colors duration-300`}>{baseToken && baseToken.decimals}</div>
              </div>
              <div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } transition-colors duration-300`}>Contract</div>
                <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  } transition-colors duration-300`}>
                      {baseToken && `${baseToken.address.slice(0, 6)}...${baseToken.address.slice(-4)}`}
                  </div>
              </div>
             
              
            </div>
          </div>
        </div>
      </div>
 
  </motion.div>)
};

export default TokenList; 