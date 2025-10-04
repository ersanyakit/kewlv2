import React from 'react';
import LaunchpadDisclaimer from './disclaimer';
import TeamInfo from './team';
import VestingInfo from './vesting';
import TokenomicsInfo from './tokenomics';

interface KEWLLaunchpadProps {
  isDarkMode?: boolean;
}

const CasinoOverview: React.FC<KEWLLaunchpadProps> = ({ isDarkMode = false }) => {
  const containerClasses = `p-6 rounded-xl shadow-lg ${
    isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
  }`;

  const sectionTitleClasses = 'text-xl font-bold mb-2';
  const listItemClasses = 'mb-1';

  return (
    <>
    <div className={containerClasses}>
      <h2 className={sectionTitleClasses}>KEWL Playground Launchpad Introduction</h2>

      <div className="mb-4">
        <p><strong>Project:</strong> KEWL Playground – Decentralized Gaming & Entertainment Platform</p>
        <p><strong>Games:</strong> Bingo, DICE, Roulette, Plinko, SLOT</p>
        <p><strong>Blockchain:</strong> Chiliz</p>
      </div>


        
                    

      <div className="bg-blue-100 dark:bg-blue-900/40 p-3 my-5 rounded-lg">
        <h3 className="font-semibold mb-2">Development Timeline</h3>
        <ul className="list-disc list-inside">
          <li>KEWL Playground Platform: 3 months</li>
          <li>Bingo: 3 months</li>
          <li>Roulette: 3 months</li>
          <li>DICE: 1 months</li>
          <li>Plinko: 3 months</li>
           <li>Slot: 3 months</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Project Goal:</h3>
        <p>
          KEWL Platform merges DeFi and gaming to create a decentralized game ecosystem. Users earn a free game ticket for their preferred game for every 1000 CHZ swapped, incentivizing both liquidity provision and platform engagement.
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Key Features:</h3>
        <ul className="list-disc ml-6">
          <li className={listItemClasses}><strong>Decentralized & Transparent:</strong> All games run via smart contracts, ensuring fair play and automatic reward distribution.</li>
          <li className={listItemClasses}><strong>Free Participation Incentive:</strong> Swap transactions grant users game tickets, driving user adoption and transaction volume.</li>
          <li className={listItemClasses}><strong>Multiple Game Options:</strong> Popular games like Tombola, Roulette, and Plinko operate securely on-chain.</li>
          <li className={listItemClasses}><strong>Fast & Secure:</strong> Leveraging Avalanche for low gas fees and high transaction speed.</li>
          <li className={listItemClasses}><strong>Community-Driven:</strong> Users benefit from growing game and reward opportunities as the platform expands.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Investor Benefits:</h3>
        <ul className="list-disc ml-6">
          <li className={listItemClasses}>Early investors get access to platform tokens and exclusive game incentives.</li>
          <li className={listItemClasses}>As user engagement grows, platform revenue and token demand naturally increase.</li>
          <li className={listItemClasses}>Decentralized game playground trend is rapidly expanding globally, offering strategic advantage to early participants.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-1">Launch Plan:</h3>
        <ol className="list-decimal ml-6">
          <li className={listItemClasses}>Fundraising and early access through launchpad.</li>
          <li className={listItemClasses}>Swap + game ticket incentive system to engage users.</li>
          <li className={listItemClasses}>Beta release of Tombola, Roulette, and Plinko for community testing.</li>
          <li className={listItemClasses}>Full release with reward pools, scaling to a global user base.</li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Message to Investors:</h3>
        <p>
          KEWL Playground is set to be one of the first decentralized platforms combining DeFi and gaming. Early investors will maximize benefits from both platform tokens and game incentives.
        </p>
      </div>
    </div>
    <TokenomicsInfo isDarkMode={false}/>
             <VestingInfo isDarkMode={false}/>
      <TeamInfo isDarkMode={false}/>

    
    </>
  );
};

export default CasinoOverview;