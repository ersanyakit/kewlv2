<div className="p-4">
<div className="mb-3 flex justify-between items-center">
  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
    Aktif Likidite Havuzlarınız
  </div>
  <div className={`text-xs px-2 py-1 rounded-lg ${
    isDarkMode ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-[#ff1356]'
  }`}>
    Toplam: $15,582.52
  </div>
</div>

{myPools.map((pool, index) => (
  <div key={index} className={`p-3 rounded-xl ${
    isDarkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-50/70 border border-gray-200/50'
  } mb-3`}>
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center">
        <div className="flex -space-x-2 mr-2">
          <TokenShape token={pool.token1} size="sm" isDarkMode={isDarkMode} />
          <TokenShape token={pool.token2} size="sm" isDarkMode={isDarkMode} />
        </div>
        <div>
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {pool.pair}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Havuz APR: <span className="text-green-500">{pool.apr}</span>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          ${pool.myLiquidity}
        </div>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Payınız: {pool.share}
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Toplam Havuz</div>
        <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{pool.totalLiquidity}</div>
      </div>
      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/70'}`}>
        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kazançlarınız</div>
        <div className={`font-medium text-green-500`}>{pool.earnings}</div>
      </div>
    </div>
    
    <div className="flex space-x-2">
      <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gray-600 hover:bg-gray-500 text-white' 
          : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
      }`}>
        <PlusCircle className="w-3 h-3 mr-1" />
        Ekle
      </button>
      <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gray-600 hover:bg-gray-500 text-white' 
          : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
      }`}>
        <MinusCircle className="w-3 h-3 mr-1" />
        Çıkar
      </button>
      <button className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white`}>
        <BarChart3 className="w-3 h-3 mr-1" />
        Detaylar
      </button>
    </div>
  </div>
))}

{/* Boş havuz durumu */}
{myPools.length === 0 && (
  <div className={`p-4 rounded-xl ${
    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50/70'
  } text-center`}>
    <PieChart className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
    <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      Henüz Likidite Eklemediniz
    </div>
    <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      Likidite ekleyerek işlem ücretlerinden pay alabilirsiniz
    </div>
    <button 
      className="px-4 py-2 bg-gradient-to-r from-[#ff1356] to-[#ff4080] text-white rounded-xl text-sm font-medium flex items-center justify-center mx-auto"
      onClick={() => setActiveTab('add')}
    >
      <PlusCircle className="w-4 h-4 mr-1.5" />
      İlk Havuzumu Oluştur
    </button>
  </div>
)}
</div>