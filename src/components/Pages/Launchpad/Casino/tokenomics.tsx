import React from "react";

interface Props {
  isDarkMode: boolean;
}

const TokenomicsInfo: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">KEWL Playground – Tokenomics / Asset Model</h2>

      <p className="mb-4">
        <strong>No Token:</strong> KEWL Playground does not require a native platform token. All games,
        rewards, and incentives operate using existing <strong>ecosystem assets</strong> (e.g., CHZ or other supported tokens).
      </p>

      <h3 className="text-lg font-semibold mb-2">Core Principles:</h3>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>
          <strong>Asset-Based Participation:</strong> Users play games with their existing assets,
          without the need to acquire new tokens.
        </li>
        <li>
          <strong>Decentralized Economy:</strong> All rewards, ticket distributions, and game
          incentives are executed automatically and transparently on-chain.
        </li>
        <li>
          <strong>Liquidity & Participation Incentives:</strong> Swap activities (e.g., 1 free game
          ticket for every 1000 CHZ swapped) drive engagement without introducing a new token.
        </li>
        <li>
          <strong>Flexible Reward Pools:</strong> Game-specific reward pools are created using
          supported assets, ensuring fairness and transparency.
        </li>
        <li>
          <strong>No Inflation Risk:</strong> Without a native token, there is no risk of token
          inflation or value dilution.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mb-2">Investor & User Benefits:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>Users can join the platform immediately without needing to acquire a new token.</li>
        <li>Early users benefit from free game tickets and high participation incentives.</li>
        <li>The ecosystem leverages existing, trusted tokens (CHZ, Avalanche assets) without adding complexity.</li>
      </ul>

      <p className="mt-4">
        <strong>Summary:</strong> KEWL Playground operates <strong>fully on-chain and tokenless</strong>,
        utilizing existing ecosystem assets. This approach keeps the system simple, fair, and secure,
        while encouraging maximum user engagement.
      </p>
    </div>
  );
};

export default TokenomicsInfo;