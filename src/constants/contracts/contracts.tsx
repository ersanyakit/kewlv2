import { createPublicClient, Chain, http, getContract, encodeFunctionData, createWalletClient, custom } from "viem";
import { getChainById } from "../../context/Web3ProviderContext";
import { ContractList, TContractType, TCustomContract } from "./addresses";
import { Token as TToken } from "../../context/TokenContext";
import { AbiCoder, BrowserProvider, ethers, getAddress, ZeroAddress } from "ethers";
import { CurrencyAmount, Token } from "../entities";
import 'viem/window'

export const getContractByName = async (contractType: TContractType, chainId: string | number,walletProvider?:any): Promise<TCustomContract> => {
    const contractGroup = ContractList[contractType];

    if (!contractGroup) {
        throw new Error(`Unknown contract type: ${contractType}`);
    }
    if (!contractGroup.contracts) {
        throw new Error(`No contracts found for contract type: ${contractType}`);
    }

    let chain = getChainById(Number(chainId));
    let client = createPublicClient({
        batch: {
            multicall: true,
        },
        cacheTime: 10_000,
        pollingInterval: 10_000,
        chain: chain as Chain,
        transport: http(chain?.rpcUrls.default.http[0]),
    });

    const caller = getContract({
        address: contractGroup.contracts[chainId].address,
        abi: contractGroup.abi,
        client: {
            public: client,
        },
    });

    var wallet : any =  createWalletClient({
            chain: chain as Chain,
            transport:  walletProvider ?custom(walletProvider) : http()
        });

        console.log("wallet",wallet)
    

    let signer;
    if (walletProvider) {
      signer = await GetSigner(walletProvider);
    } else {
      signer = undefined;
    }
    let contract: TCustomContract = {
        abi: contractGroup.abi,
        pair: contractGroup.pair,
        address: contractGroup.contracts[chainId].address,
        client: client,
        wallet: wallet,
        caller: caller,
        signer: signer
    }
    return contract;
}


export async function GetSigner(walletProvider: any) {
    const provider = new BrowserProvider(walletProvider);
    return await provider.getSigner();
}


const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const fetchBalancesLegacy = async (chainId: string | number,account: string | undefined, walletProvider: any, tokenList: TToken[],setTokenList: (tokenList: TToken[]) => void) => {
    
    try{
    if(!account){

        tokenList.forEach((tokenInfo : any, index : number) => {
            tokenInfo.address = ethers.getAddress(tokenInfo.address);
            const tokenAddr = new Token(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals);
            tokenList[index]['balance'] = CurrencyAmount.fromRawAmount(tokenAddr,("0")).toSignificant();
            tokenList[index]['loading'] = false;
            tokenList[index]['favorite'] = false;
        });
        setTokenList(tokenList);
        return;
    }

    
    let dexContract = await getContractByName(TContractType.MULTICALL, chainId,walletProvider);
     
    let abiERC = ['function balanceOf(address user)','function getEthBalance(address user)'];
    let abiInterfaceParam = new ethers.Interface(abiERC);
    let multicallParams = tokenList.map((item: any) => ({
        target: item.address === ZeroAddress ? dexContract.caller.address : item.address,
        callData: item.address === ZeroAddress ? abiInterfaceParam.encodeFunctionData('getEthBalance', [account]) : abiInterfaceParam.encodeFunctionData('balanceOf', [account])
    }));


    const multicallResult : any = await dexContract.client.readContract({
        address: dexContract.caller.address,
        abi: dexContract.abi,
        functionName: 'aggregate',
        args: [multicallParams],
        account: ethers.getAddress(account) as `0x${string}`,
      })


    const abiCoder = AbiCoder.defaultAbiCoder();

    if(multicallResult && multicallResult.length > 0){
        multicallResult[1].forEach((encodedMulticallData : any, index : number) => {
            let tokenInfo = tokenList[index];
            tokenInfo.address = ethers.getAddress(tokenInfo.address);
            const tokenAddr = new Token(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals);
            const isNative = tokenInfo.address === ZeroAddress;
            const [rawBalance] = abiCoder.decode(["uint256"], encodedMulticallData);
            tokenList[index]['balance'] = CurrencyAmount.fromRawAmount(tokenAddr,rawBalance.toString()).toSignificant();
            tokenList[index]['loading'] = false;
            tokenList[index]['favorite'] = rawBalance > 0;
        });

        let shortedTokens = [...tokenList].sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
        setTokenList(shortedTokens);

    }
    }catch(error){
        console.log("error:fetchBalances",error)
    }

}

const readWithRetry = async (fn: () => Promise<any>, retries = 3) => {
  try {
    return await fn();
  } catch (err: any) {
    if (err?.details?.code === -32016 || err?.status === 429) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 500));
        return readWithRetry(fn, retries - 1);
      }
    }
    throw err;
  }
};

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const fetchBalances = async (
  chainId: string | number,
  account: string | undefined,
  walletProvider: any,
  tokenList: TToken[],
  setTokenList: (tokenList: TToken[]) => void
) => {
  try {
    if (!account) {
      tokenList.forEach((tokenInfo: any, index: number) => {
        tokenInfo.address = ethers.getAddress(tokenInfo.address);
        const tokenAddr = new Token(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals);

        tokenList[index]["balance"] = CurrencyAmount
          .fromRawAmount(tokenAddr, "0")
          .toSignificant();

        tokenList[index]["loading"] = false;
        tokenList[index]["favorite"] = false;
      });

      setTokenList(tokenList);
      return;
    }

    const dexContract = await getContractByName(
      TContractType.MULTICALL,
      chainId,
      walletProvider
    );

    const abiERC = [
      "function balanceOf(address user)",
      "function getEthBalance(address user)"
    ];

    const abiInterface = new ethers.Interface(abiERC);
    const abiCoder = AbiCoder.defaultAbiCoder();

    const CHUNK_SIZE = 50;

    const chunks = chunkArray(tokenList, CHUNK_SIZE);

    let updatedTokens = [...tokenList];

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
   await sleep(120); // 100-200ms ideal

      const multicallParams = chunk.map((item: any) => ({
        target:
          item.address === ZeroAddress
            ? dexContract.caller.address
            : item.address,
        callData:
          item.address === ZeroAddress
            ? abiInterface.encodeFunctionData("getEthBalance", [account])
            : abiInterface.encodeFunctionData("balanceOf", [account]),
      }));

    /*  const multicallResult: any = await dexContract.client.readContract({
        address: dexContract.caller.address,
        abi: dexContract.abi,
        functionName: "aggregate",
        args: [multicallParams],
        account: ethers.getAddress(account) as `0x${string}`,
      });
*/
      const multicallResult = await readWithRetry(() =>
  dexContract.client.readContract({
    address: dexContract.caller.address,
    abi: dexContract.abi,
    functionName: 'aggregate',
    args: [multicallParams],
    account: ethers.getAddress(account) as `0x${string}`,
  })
);

      if (multicallResult && multicallResult.length > 0) {
        multicallResult[1].forEach(
          (encodedMulticallData: any, index: number) => {
            const globalIndex = chunkIndex * CHUNK_SIZE + index;
            const tokenInfo = updatedTokens[globalIndex];

            tokenInfo.address = ethers.getAddress(tokenInfo.address);

            const tokenAddr = new Token(
              tokenInfo.chainId,
              tokenInfo.address,
              tokenInfo.decimals
            );

            const [rawBalance] = abiCoder.decode(
              ["uint256"],
              encodedMulticallData
            );

            updatedTokens[globalIndex]["balance"] =
              CurrencyAmount
                .fromRawAmount(tokenAddr, rawBalance.toString())
                .toSignificant();

            updatedTokens[globalIndex]["loading"] = false;
            updatedTokens[globalIndex]["favorite"] = rawBalance > 0n;
          }
        );
      }
    }

    const sortedTokens = [...updatedTokens].sort(
      (a, b) => parseFloat(b.balance) - parseFloat(a.balance)
    );

    setTokenList(sortedTokens);

  } catch (error) {
    console.log("error:fetchBalances", error);
  }
};



