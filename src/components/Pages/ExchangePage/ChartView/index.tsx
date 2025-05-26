import { useEffect, useState } from 'react'
import { init, dispose } from 'klinecharts'
import { useTokenContext } from '../../../../context/TokenContext';
import { BarChart, CandlestickChart, LineChart, Maximize2, Minimize2 } from 'lucide-react';
import { OrderMatchedEventNative, useSwapContext } from '../../../../context/SwapContext';
import { LIMIT_ORDER_BOOK_DECIMALS } from '../../../../constants/contracts/exchanges';
import { ethers } from 'ethers';

const ChartView = () => {
  const {limitOrderHistory,limitOrderHistoryLoading,selectedPair} = useSwapContext();
  const {isDarkMode} = useTokenContext();
  var chart : any = null;
  const [chartHeight, setChartHeight] = useState(200);
  


  type OHLCData = {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: number; // milisaniye cinsinden
  };
  
 

  
function buildDailyOHLC(
  events: OrderMatchedEventNative[],
  LIMIT_ORDER_BOOK_DECIMALS: number
): {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
} | null {
  if (events.length === 0) return null;


  const parsedEvents = events
  .filter(evt => evt.pairId === selectedPair?.pair)
  .map(evt => {
    const price = Number(
      parseFloat(ethers.formatUnits(evt.price, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS)
    );
    const amount = Number(
      parseFloat(ethers.formatUnits(evt.amount, LIMIT_ORDER_BOOK_DECIMALS)).toFixed(LIMIT_ORDER_BOOK_DECIMALS)
    );
    const timestamp = Number(evt.timestamp) * 1000; // ms formatına

    return { price, amount, timestamp };
  });


  // timestamp'e göre sırala
  parsedEvents.sort((a, b) => a.timestamp - b.timestamp);

  const first = parsedEvents[0];
  const last = parsedEvents[parsedEvents.length - 1];

  let high = first.price;
  let low = first.price;
  let volume = 0;

  for (const evt of parsedEvents) {
    if (evt.price > high) high = evt.price;
    if (evt.price < low) low = evt.price;
    volume += evt.amount;
  }

  return {
    open: first.price,
    high,
    low,
    close: last.price,
    volume,
    timestamp: first.timestamp,
  };
}


  const initOHLCData = async () => {
    console.log("limitOrderHistory", limitOrderHistory);
    const ohlcData = await buildDailyOHLC(limitOrderHistory, LIMIT_ORDER_BOOK_DECIMALS);
    chart.applyNewData([ohlcData]);
  }


  useEffect(() => {
    initOHLCData();
  }, [limitOrderHistoryLoading,limitOrderHistory.length,chartHeight])
  
  useEffect(() => {
     chart = init('chart')



   
   

    



    return () => {
      dispose('chart')
    }
  }, [chartHeight])

  return(
    <div className={`w-full h-fullrounded-lg flex flex-col items-between justify-around p-2`}>

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
         
          <button onClick={() => setChartHeight(chartHeight === 200 ? 300 : 200)} className="p-1 rounded hover:bg-gray-200/20">
            {chartHeight === 200 ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className={`w-full h-full min-h-[${chartHeight}px]    bg-gray-200/20 rounded-lg`}>
      <div className='w-full h-full min-h-[260px]' id="chart" style={{ width: "100%", minHeight: `${chartHeight}px`, height: `${chartHeight}px`  }} />
      </div>

  </div>)
}
export default ChartView;