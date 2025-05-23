import { useEffect } from 'react'
import { init, dispose } from 'klinecharts'
import { useTokenContext } from '../../../../context/TokenContext';
import { BarChart, CandlestickChart, LineChart, Maximize2 } from 'lucide-react';

const ChartView = () => {

  const {
    isDarkMode,
  } = useTokenContext();
  useEffect(() => {
    const chart: any = init('chart')



    chart.applyNewData([
      { close: 4.16, high: 4.99, low: 4.12, open: 4.89, timestamp: 1587660000000, volume: 204 },
      { close: 4.33, high: 4.94, low: 4.34, open: 4.20, timestamp: 1587660060000, volume: 194 },
      { close: 4.93, high: 4.93, low: 4.20, open: 4.53, timestamp: 1587660120000, volume: 197 },
      { close: 4.77, high: 4.53, low: 4.20, open: 4.88, timestamp: 1587660180000, volume: 28 },
      { close: 4.56, high: 4.61, low: 4.28, open: 4.28, timestamp: 1587660240000, volume: 184 },
      { close: 4.19, high: 4.74, low: 4.42, open: 4.64, timestamp: 1587660300000, volume: 191 },
      { close: 4.93, high: 4.70, low: 4.55, open: 4.96, timestamp: 1587660360000, volume: 105 },
      { close: 4.31, high: 4.61, low: 4.99, open: 4.06, timestamp: 1587660420000, volume: 35 },
      { close: 4.02, high: 4.66, low: 4.14, open: 4.66, timestamp: 1587660480000, volume: 135 },
      { close: 4.09, high: 4.62, low: 4.30, open: 4.72, timestamp: 1587660540000, volume: 76 }
    ])

    return () => {
      dispose('chart')
    }
  }, [])

  return(
    <div className="min-h-[29dvh] h-[300px] rounded-lg flex flex-col items-between justify-around">

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1m</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">5m</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">15m</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1h</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">4h</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1d</button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-200/20">
            <LineChart className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200/20">
            <CandlestickChart className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200/20">
            <BarChart className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200/20">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className='w-full h-full h-[29dvh] min-h-[29dvh]  bg-gray-200/20 rounded-lg'>
      <div className='w-full h-full min-h-[260px]' id="chart" style={{ width: `100%`, minHeight: "260px", height: "100%" }} />
      </div>

  </div>)
}
export default ChartView;