import React from "react";

interface Props {
  isDarkMode: boolean;
}

const VestingInfo: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">KEWL Playground – Vesting & Lockup Policy</h2>

      <p className="mb-4">
        <strong>No Token & No Vesting:</strong> KEWL Playground does not issue a native token. As a
        result, there is <strong>no vesting period</strong>, <strong>no lockup</strong>, and
        users or investors have immediate access to the platform benefits.
      </p>

      <h3 className="text-lg font-semibold mb-2">Core Principles:</h3>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>
          <strong>Instant Participation:</strong> Users receive free game tickets immediately when
          swapping CHZ or other supported assets.
        </li>
        <li>
          <strong>No Time-Locks:</strong> There are no waiting periods or restrictions to access
          rewards and incentives.
        </li>
        <li>
          <strong>Fully Decentralized:</strong> All reward distributions and game incentives are
          executed automatically on-chain, without intermediary control.
        </li>
        <li>
          <strong>Transparent System:</strong> Users and investors can verify all distributions
          directly on-chain, ensuring trust and fairness.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mb-2">Investor & User Benefits:</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>No vesting means instant access to game incentives and rewards.</li>
        <li>Users can freely engage with the platform without waiting for unlock periods.</li>
        <li>The system encourages maximum participation and engagement from day one.</li>
      </ul>

      <p className="mt-4">
        <strong>Summary:</strong> KEWL Playground ecosystem is tokenless and does not have any
        vesting or lockup mechanisms. All users and investors enjoy immediate access to platform
        rewards and incentives.
      </p>
    </div>
  );
};

export default VestingInfo;