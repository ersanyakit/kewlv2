import React from "react";

interface Props {
  isDarkMode: boolean;
}

const TeamInfo: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">KEWL Team</h2>
      <p className="mb-4">
        The KEWL ecosystem is being developed and maintained by the <strong>KEWL Team</strong>.
        KEWL has consistently provided its users with uninterrupted, secure, and optimally
        efficient blockchain transactions.
      </p>
      <p>
        Our mission is to deliver a reliable and innovative platform, ensuring users enjoy the
        best possible blockchain experience.
      </p>
    </div>
  );
};

export default TeamInfo;