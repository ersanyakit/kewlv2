import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TradeTerminal from './components/Swap/TradeTerminal';
import Layout from './components/Layout/Layout';
import About from './components/About/About';
import { TokenProvider } from './context/TokenContext';
import { Web3ProviderContext } from './context/Web3ProviderContext';
import { SwapProvider } from './context/SwapContext';
import Rewards from './components/Pages/Rewards';
import TosPage from './components/Pages/TosPage';
import Assets from './components/Pages/Assets';
import TestPage from './components/Pages/TestPage';

function App() {
  return (
    <Web3ProviderContext>
      <TokenProvider>
        <SwapProvider>


          <Router>
            <Routes>
              <Route path="/test" element={<TestPage />} />
            
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<TradeTerminal />} />
                    <Route path="/swap" element={<TradeTerminal />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/assets" element={<Assets />} />
                  </Routes>
                </Layout>
              }
            />
            </Routes>

          </Router>
        </SwapProvider>
      </TokenProvider>
    </Web3ProviderContext>
  );
}

export default App;