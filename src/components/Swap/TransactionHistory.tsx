import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import TokenShape from '../UI/TokenShape';
import { Token } from '../../context/TokenContext';
import { getContractByName } from '../../constants/contracts/contracts';
import { TContractType } from '../../constants/contracts/addresses';
import { useAppKitNetwork } from '@reown/appkit/react';
import { publicClient } from '../../context/Web3ProviderContext';


type Transaction = {
  id: number;
  from: string;
  to: string;
  fromAmount: string;
  toAmount: string;
  status: 'completed' | 'pending';
  time: string;
};

interface TransactionHistoryProps {
  transactions: Transaction[];
  tokens: Token[];
  isDarkMode: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  tokens, 
  isDarkMode 
}) => {
  const { chainId } = useAppKitNetwork()

  let dexContract = getContractByName(TContractType.DEX, Number(chainId));




  const readLogs = async () => {



    let apiURL = `https://cdn.routescan.io/api/evm/all/transactions?count=true&fromAddresses=${dexContract.caller.address }&includedChainIds=${chainId}&limit=5&sort=desc&toAddresses=${dexContract.caller.address}`

    const response = await fetch(apiURL)
    const data = await response.json()

    console.log(data)

    if(data.items.length > 0){

      data.items.forEach(async (item:any) => {
        const receipt = await publicClient.getTransactionReceipt({ hash: item.txHash });
        console.log(receipt)
      })
     
    

    }


 

 
 


  }
  useEffect(()=>{
    //readLogs()
  },[chainId])
  



  return (
    <motion.div 
      className={`${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700/50' 
          : 'bg-white/80 border-white/30'
      } backdrop-blur-md  rounded-3xl   shadow-[0_4px_20px_rgba(0,0,0,0.08)] border overflow-hidden mb-4 h-full transition-all duration-300`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex justify-between items-center">
          <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Son İşlemler</h3>
          <div className={`${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-50'} px-2 py-1 rounded-md text-xs ${isDarkMode ? 'text-pink-300' : 'text-[#ff1356]'}`}>
            {transactions.length} işlem
          </div>
        </div>
      </div>
              
      <div className={`p-4 overflow-y-auto max-h-[calc(100vh-280px)] ${isDarkMode ? 'scrollbar-dark' : ''}`}>
        {transactions.map(tx => (
          <div key={tx.id} className={`flex items-center justify-between py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} last:border-0`}>
            <div className="flex items-center">
              <div className="mr-3 w-10 h-10 relative">
                <div className="absolute -top-2 left-0">
                  <TokenShape 
                    token={tokens.find(t => t.symbol === tx.from) || tokens[0]} 
                    size="sm"
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="absolute left-0 bottom-0 top-5 right-0">
                  <TokenShape 
                    token={tokens.find(t => t.symbol === tx.to) || tokens[1]} 
                    size="sm"
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
              <div>
                <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {tx.fromAmount} {tx.from} → {tx.toAmount} {tx.to}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.time}</div>
              </div>
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">
              {tx.status === 'completed' ? 'Tamamlandı' : 'İşleniyor'}
            </div>
          </div>
        ))}

        {/* Market Summary Section */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-3`}>
            Piyasa Özeti
          </h3>
          <div className="space-y-3">
            {tokens.map(token => (
              <div 
                key={token.symbol} 
                className={`flex items-center justify-between p-2 ${
                  isDarkMode 
                    ? 'hover:bg-gray-700/70' 
                    : 'hover:bg-gray-50'
                } rounded-lg transition-colors duration-300`}
              >
                <div className="flex items-center">
                  <TokenShape token={token} size="sm" isDarkMode={isDarkMode} />
                  <div className="ml-2">
                    <div className={`font-medium text-sm ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>{token.symbol}</div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium text-sm ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>{token.price}</div>
                  <div className={`text-xs ${
                    token.trend === 'up' ? 'text-green-500' : 
                    token.trend === 'down' ? 'text-red-500' : 
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {token.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionHistory; 