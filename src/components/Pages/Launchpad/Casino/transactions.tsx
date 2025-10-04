import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://cdn.routescan.io/api/evm/all/transactions?count=true&fromAddresses=0x458FD418a1311348b1b5D99f331730Ce5cFe51af&includedChainIds=88888&limit=50&sort=desc&toAddresses=0x458FD418a1311348b1b5D99f331730Ce5cFe51af"
        );
        const data = await response.json();
        setTransactions(data.items || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {transactions.map((tx,index) => (
                <motion.div
          key={tx.txHash}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.25)" }}
          style={{
            padding: "15px 20px",
            borderRadius: "12px",
            backgroundColor: "#f1f1f1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            transition: "box-shadow 0.2s",
          }}
        >
          <div className="flex flex-col justify-between gap-2">
            <strong>From:</strong> <span className="text-xs">{tx.from.id}</span>
          </div>
          <div className="flex flex-col justify-between">
            <strong>Amount:</strong>
            <span className="text-xs">{Number(tx.value) / 10 ** 18} CHZ</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;