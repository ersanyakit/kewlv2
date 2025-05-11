import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TradeTerminal from './components/Swap/TradeTerminal';
import Layout from './components/Layout/Layout';
import About from './components/About/About';
import { TokenProvider } from './context/TokenContext';
import { Web3ProviderContext } from './context/Web3ProviderContext';
import { SwapProvider } from './context/SwapContext';

function App() {
  return (
    <Web3ProviderContext>
      <TokenProvider>
        <SwapProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<TradeTerminal />} />
                <Route path="/swap" element={<TradeTerminal />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Layout>
          </Router>
        </SwapProvider>
      </TokenProvider>
    </Web3ProviderContext>
  );
}

export default App;