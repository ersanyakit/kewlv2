// src/context/MoralisProvider.tsx
import React, { useEffect, createContext, useContext, useState } from "react";
import Moralis from "moralis";

const MoralisContext = createContext(false);

export const MoralisProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const startMoralis = async () => {
      try {
        await Moralis.start({
            apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFlYzkxMTE1LTg1M2MtNDhiNi1iOTVkLTI3MThjZGJlM2RmYyIsIm9yZ0lkIjoiMzMzNTE4IiwidXNlcklkIjoiMzQyOTExIiwidHlwZUlkIjoiYWUyOTc4ODItMTFlOS00NDRmLTg0NDUtMjkzNjc2ZjA2MzkwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODQxNDU2NTgsImV4cCI6NDgzOTkwNTY1OH0.01WPn9YU14X70Uq4HvOcQoNoA71cZ58lSuq4-vyTcNk"
          });
        setIsInitialized(true);
        console.log("✅ Moralis initialized.");
      } catch (error) {
        console.error("Moralis init error:", error);
      }
    };

    startMoralis();
  }, []);

  return (
    <MoralisContext.Provider value={isInitialized}>
      {children}
    </MoralisContext.Provider>
  );
};

export const useMoralisInitialized = () => useContext(MoralisContext);