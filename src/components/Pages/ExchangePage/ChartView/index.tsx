import { useEffect, useState } from 'react'
import { init, dispose } from 'klinecharts'
import { useTokenContext } from '../../../../context/TokenContext';
import { BarChart, CandlestickChart, LineChart, Maximize2, Minimize2, RefreshCcw } from 'lucide-react';
import { OrderMatchedEventNative, useSwapContext } from '../../../../context/SwapContext';
import { LIMIT_ORDER_BOOK_DECIMALS } from '../../../../constants/contracts/exchanges';
import { ethers } from 'ethers';
import { useAppKitProvider } from '@reown/appkit/react';

const ChartView = () => {
  const { limitOrderHistory, limitOrderHistoryLoading, selectedPair, fetchLimitOrderHistory } = useSwapContext();
  const { isDarkMode } = useTokenContext();
  var chart: any = null;
  var volumePane: any = null;
  var macdPane: any = null;


  const [chartHeight, setChartHeight] = useState(200);
  const { walletProvider } = useAppKitProvider('eip155');

  const [toggleVOLUME, setToggleVOLUME] = useState(false);
  const [toggleMACD, setToggleMACD] = useState(false);




   



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

    let high = first?.price;
    let low = first?.price;
    let volume = 0;

    for (const evt of parsedEvents) {
      if (evt.price > high) high = evt.price;
      if (evt.price < low) low = evt.price;
      volume += evt.amount;
    }

    return {
      open: first?.price,
      high,
      low,
      close: last?.price,
      volume,
      timestamp: first?.timestamp,
    };
  }

  

  const initOHLCData = async () => {


    fetch('https://klinecharts.com/datas/kline.json')
      .then(res => res.json())
      .then(dataList => { chart.applyNewData(dataList); });
    return
    console.log("OHLC_ORDER_HISTORY", limitOrderHistory);
    if (limitOrderHistory.length === 0) return;
    const ohlcData = await buildDailyOHLC(limitOrderHistory, LIMIT_ORDER_BOOK_DECIMALS);
    if (!ohlcData || limitOrderHistory.length == 0 || !selectedPair) {
      return;
    }
    chart.clearData();
    chart.applyNewData([ohlcData]);
  }


  useEffect(() => {
    initOHLCData();
  }, [limitOrderHistoryLoading, limitOrderHistory.length, chartHeight ,toggleMACD,toggleVOLUME])

  useEffect(() => {
    chart = init('chart')

    if(toggleVOLUME){
      volumePane = chart.createIndicator('VOL');
      chart.setPaneOptions({
        id: volumePane,
        height: 160
      })
    }

    if(toggleMACD){
      macdPane = chart.createIndicator('MACD');
      chart.setPaneOptions({
        id: macdPane,
        height: 160
      })
    }


    

      
  

    chart.setStyles({
      "separator": {
        "size": 1,
        "color": "rgba(255,255,255,0.05)",
        "fill": false
      },
      "grid": {
        "show": true,
        "horizontal": {
          "show": true,
          "size": 1,
          "color": "rgba(255, 255, 255, 0.05)",
          "style": "dashed",
          "dashedValue": [2, 2]
        },
        "vertical": {
          "show": true,
          "size": 1,
          "color": "rgba(255, 255, 255, 0.05)",
          "style": "dashed",
          "dashedValue": [2, 2]
        }
      },

      "xAxis": {
        "axisLine": {
          "color": "rgba(255, 255, 255, 0.08)" // Hafif görünür, karanlık temaya uygun
        },
        "tickLine": {
          "color": "#3b82f6",  // KEWL renkleriyle uyumlu, canlı yeşil
          "size": 1
        }
      },
      "yAxis": {
        "axisLine": {
          "color": "rgba(255, 255, 255, 0.08)"
        },
        "tickLine": {
          "color": "#3b82f6",
          "size": 1
        }
      },
      "tooltip": {
        "text": { "color": "#76808F" },
        "rect": { "borderColor": "#059669", "color": "#FEFEFE" }
      },
      "crosshair": {
        "horizontal": {
          "line": { "color": "#76808F" },
          "text": { "color": "#FFFFFF", "borderColor": "#059669", "backgroundColor": "#059669" }
        },
        "vertical": {
          "line": { "color": "#76808F" },
          "text": { "color": "#FFFFFF", "borderColor": "#059669", "backgroundColor": "#059669" }
        }
      },
      priceMark: {
        "last": {
          "line": { "show": true, "style": "dashed", "dashedValue": [4, 4], "size": 1 },
          "text": {
            "color": "#FFFFFF",
            "borderColor": "#059669",
            "backgroundColor": "#059669"
          }
        }
      },
      candle: {
        bar: {
          upColor: '#22c55e',
          upBorderColor: '#059669',
          upWickColor: '#059669',
          downColor: '#ec4899',
          downBorderColor: '#db2777',
          downWickColor: '#db2777',
        },
      },
      "indicator": {
        "bars": [
          {
            "upColor": "#10B981",
            "downColor": "#EF4444",
            "noChangeColor": "#9CA3AF"
          }
        ],
        "lines": [
          {
            "color": "#FACC15"   // MACD çizgisi (sarı)
          },
          {
            "color": "#3B82F6"   // Signal çizgisi (mavi)
          },
          {
            "color": "#6B7280"   // Sıfır çizgisi (gri)
          }
        ],
      }



    });
    const styles = chart.getStyles()
    console.log("CHART", JSON.stringify(styles));

    return () => {
      dispose('chart')
    }
  }, [chartHeight ,toggleMACD,toggleVOLUME])

  return (
    <div className={`w-full h-full rounded-lg flex flex-col items-between justify-around p-2`}>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <button onClick={() => {
              setToggleMACD(!toggleMACD)
    
            }} className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">MACD</button>
            <button onClick={() =>{
              setToggleVOLUME(!toggleVOLUME)

          }} className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">VOLUME</button>

            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1m</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">5m</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">15m</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1h</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">4h</button>
            <button className="px-2 py-0.5 rounded text-xs bg-gray-200/20 hover:bg-gray-200/30">1d</button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => {
            fetchLimitOrderHistory(walletProvider)

          }} className="p-1 rounded hover:bg-gray-200/20">
            <RefreshCcw className="w-4 h-4" />
          </button>

          <button onClick={() => setChartHeight(chartHeight === 200 ? 300 : 200)} className="p-1 rounded hover:bg-gray-200/20">
            {chartHeight === 200 ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

        </div>
      </div>
      <div className={`w-full h-full min-h-[${chartHeight}px]   rounded-lg`}>
        <div className='w-full h-full min-h-[260px]' id="chart" style={{ width: "100%", minHeight: `${chartHeight}px`, height: `${chartHeight}px` }} />
      </div>

    </div>)
}
export default ChartView;