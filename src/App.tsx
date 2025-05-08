import React from 'react';
import TradeTerminal from './components/Swap/TradeTerminal';
import Layout from './components/Layout/Layout';
import { TokenProvider } from './context/TokenContext';
import { Web3ProviderContext } from './context/Web3ProviderContext';
import { SwapProvider } from './context/SwapContext';

function App() {
  return (
    <Web3ProviderContext>
    <TokenProvider>
      <SwapProvider>
      <Layout>
        <TradeTerminal />
      </Layout>
      </SwapProvider>
    </TokenProvider>
    </Web3ProviderContext>
  );
}

export default App;