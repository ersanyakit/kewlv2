import { getChainDefaultAssetsURI } from "../context/Web3ProviderContext";

export const fetchTokenListByChainId = async (chainId: number) => {
    let fetchURL = getChainDefaultAssetsURI(chainId);
    let assets = await (await fetch(fetchURL)).json();
    return assets;
}

export const generateTokenColorByContractAddress = (address: any, isDarkMode: boolean) => {
    address = address.toLowerCase();
    const color1 = `#${address.substring(2, 8)}`;               // unique from address
    const color2 = `#${address.substring(address.length - 6)}`; // unique from address
    const rainbow = [
      "#FF0000", // red
      "#FF7F00", // orange
      "#FFFF00", // yellow
      "#00FF00", // green
      "#0000FF", // blue
      "#4B0082", // indigo
      "#8B00FF", // violet
    ];
  
    return `linear-gradient(128deg, 
      ${isDarkMode ? `${color1}66` : `${color2}66`}, 
      ${rainbow.join("55, ")}, 
      ${isDarkMode ? color2 : color1})`;
  }