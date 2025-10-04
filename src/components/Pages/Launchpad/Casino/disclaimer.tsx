import React from "react";

interface Props {
  isDarkMode: boolean;
}

const LaunchpadDisclaimer: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Important Notice</h2>
      <p className="mb-4">
        This is <strong>not a token sale</strong>. The KEWL Playground launchpad is a community-driven fundraising initiative.
        Users' contributions will directly support the development of our upcoming decentralized game platform, including
        Bingo, Slot, Roulette, and Plinko games.
      </p>
      <p className="mb-4">
        All contributions are voluntary donations to help bring these games to life. No tokens, assets, or financial returns
        will be issued in exchange.
      </p>
      <p className="text-red-600 font-bold">
        ⚠️ Reminder: Contributions are <strong>non-refundable</strong> and solely intended to support the development of KEWL Playground.
      </p>
    </div>
  );
};

export default LaunchpadDisclaimer;