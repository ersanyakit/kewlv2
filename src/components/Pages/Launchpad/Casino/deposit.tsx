import React from "react";
import ContributeCard from "./contribute";

interface Props {
  isDarkMode: boolean;
}

const LaunchpadDeposit: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className='w-full'>
                        <ContributeCard isDarkMode={false}/>
                    </div>
    </div>
  );
};

export default LaunchpadDeposit;