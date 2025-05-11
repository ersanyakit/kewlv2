<div className="p-4">
{/* Token çifti seçimi ve havuz bilgileri */}
<div className={`p-3 mb-4 rounded-xl ${
  isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
}`}>
  <div className="flex justify-between mb-2">
    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
      Likidite Havuzu Seçin
    </div>
  </div>
  
  <div className="flex items-center mb-3">
    <div className="flex -space-x-2 mr-3">
      <TokenShape token={baseToken} size="sm" isDarkMode={isDarkMode} />
      <TokenShape token={quoteToken} size="sm" isDarkMode={isDarkMode} />
    </div>
    <div className="flex-1">
      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        {baseToken.symbol}-{quoteToken.symbol}
      </div>
      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Bakiyeniz: 3.45 LP Token ≈ $853.20
      </div>
    </div>
    <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
  </div>
  
  {/* Likidite çıkarma miktarı */}
  <div className="mb-3">
    <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      Çıkarılacak Miktar
    </div>
    <div className={`p-2 rounded-lg ${
      isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'
    } flex items-center justify-between`}>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        defaultValue="50"
        className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
      <span className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        50%
      </span>
    </div>
  </div>
  
  {/* Çıkarılacak token miktarları */}
  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
      <div className="flex items-center">
        <TokenShape token={baseToken} size="sm" isDarkMode={isDarkMode} />
        <div className="ml-2">
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alacağınız</div>
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            125.34 {baseToken.symbol}
          </div>
        </div>
      </div>
    </div>
    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
      <div className="flex items-center">
        <TokenShape token={quoteToken} size="sm" isDarkMode={isDarkMode} />
        <div className="ml-2">
          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alacağınız</div>
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            42.5 {quoteToken.symbol}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Uyarı mesajı */}
  <div className={`p-2 rounded-lg ${
    isDarkMode ? 'bg-gray-800/70 text-gray-400' : 'bg-white/70 text-gray-500'
  } text-xs flex items-start`}>
    <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 text-amber-500" />
    <div>
      <p>Likidite çıkarıldığında, havuzdaki her iki tokeni de alırsınız. Çıkarma işlemi sonrası toplam değer piyasa koşullarına bağlı olarak değişebilir.</p>
    </div>
  </div>
</div>

{/* Onay ve İşlem Butonu */}
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
  
  <span>Likidite Çıkar</span>
  <MinusCircle className="w-4 h-4" />
</motion.button>
</div>