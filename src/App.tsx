import React from 'react';
import TradeTerminal from './components/Swap/TradeTerminal';
import Layout from './components/Layout/Layout';
import { TokenProvider } from './context/TokenContext';
import { Web3ProviderContext } from './context/Web3ProviderContext';

function App() {
  return (
    <Web3ProviderContext>
    <TokenProvider>
      <Layout>
        <TradeTerminal />
      </Layout>
    </TokenProvider>
    </Web3ProviderContext>
  );
}

export default App;