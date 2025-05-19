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

    chart.createIndicator(
      'MA',
      false,
      { id: 'candle_pane' }
    );
    chart.createIndicator('VOL');


    chart.applyNewData([
      { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
      { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
      { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
      { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
      { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
      { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
      { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
      { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
      { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
      { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
    ])

    return () => {
      dispose('chart')
    }
  }, [])

  return(
    <div className="ounded-lg flex flex-col items-between justify-around">

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
    <div className='w-full h-full h-[29dvh] bg-gray-200/20 rounded-lg'>
    <div className='w-full h-full' id="chart" style={{ width: `100%`, height: "100%" }} />
    </div>

  </div>)
}
export default ChartView;