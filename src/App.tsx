import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import TradeTerminal from './components/Swap/TradeTerminal';
import Layout from './components/Layout/Layout';
import About from './components/About/About';
import { TokenProvider } from './context/TokenContext';
import { Web3ProviderContext } from './context/Web3ProviderContext';
import { SwapProvider } from './context/SwapContext';
import Rewards from './components/Pages/Rewards';
import TosPage from './components/Pages/TosPage';
import Assets from './components/Pages/Assets';
import EmbeddedSwapPage from './components/Pages/EmbedPages';
import ExchangePage from './components/Pages/ExchangePage';
import { AnimatePresence,motion, LazyMotion, domAnimation, m } from 'framer-motion'
import TestPage from './components/Pages/TestPage';
import LeaderBoard from './components/Pages/LeaderBoard';
import { MoralisProvider } from './context/MoralisProviderContext';
import Launchpad from './components/Pages/Launchpad';

function App() {
//188467.014
//188578.453
 

  
  return (
    
    <Web3ProviderContext>
      <TokenProvider>
        <SwapProvider>
            <Routes>
              <Route path="/testfunc" element={<TestPage />} />
              <Route path="/test" element={<EmbeddedSwapPage swap="swap" />} />
              <Route path="/embed" element={<EmbeddedSwapPage swap="swap" />} />
              <Route path="/embed/swap" element={<EmbeddedSwapPage swap="swap" />} />
              <Route path="/embed/aggregator" element={<EmbeddedSwapPage swap="aggregator" />} />
              <Route path="/embed/bundle" element={<EmbeddedSwapPage swap="bundle" />} />
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<TradeTerminal />} />
                    <Route path="/swap" element={<TradeTerminal />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/launchpad" element={<Launchpad />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/tos" element={<TosPage />} />
                    <Route path="/leaderboard" element={<LeaderBoard />} />
                    <Route path="/exchange" element={<ExchangePage />} />
                  </Routes>
                </Layout>
              }
            />
            </Routes>
        </SwapProvider>
      </TokenProvider>
    </Web3ProviderContext>
  );
}

export default App;