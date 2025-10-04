import React, { useState } from "react";
import { motion } from "framer-motion";
import Contribute from "../../../Contribute";

interface Props {
  isDarkMode: boolean;
}

const ContributeCard: React.FC<Props> = ({ isDarkMode }) => {
  const [amount, setAmount] = useState<number>(0);

  const handleContribute = () => {
    if (amount <= 0) return;
    setAmount(0);
    alert(`Thank you for contributing ${amount} CHZ!`);
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-lg transition-colors duration-300 w-full w-full ${
        isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Contribute to KEWL Playground</h2>
   <p className="mb-4">
  Your contribution will help us launch our decentralized gaming platform. 
  This is a voluntary donation, no tokens or financial returns will be issued.
</p>
      <div className="flex flex-col gap-3 mb-4">
        <Contribute/>
      
      </div>
      <p className="text-xs text-red-500">
        ⚠️ Contributions are non-refundable and solely used for KEWL Playground development.
      </p>
    </motion.div>
  );
};

export default ContributeCard;