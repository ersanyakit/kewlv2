import { createPublicClient, Chain, http, getContract, encodeFunctionData } from "viem";
import { getChainById } from "../../context/Web3ProviderContext";
import { ContractList, TContractType, TCustomContract } from "./addresses";
import { Token as TToken } from "../../context/TokenContext";
import { AbiCoder, BrowserProvider, ethers, getAddress, ZeroAddress } from "ethers";
import { CurrencyAmount, Token } from "../entities";

export const getContractByName = (contractType: TContractType, chainId: string | number): TCustomContract => {
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

    let contract: TCustomContract = {
        abi: contractGroup.abi,
        address: contractGroup.contracts[chainId].address,
        client: client,
        caller: caller
    }
    return contract;
}


export async function GetSigner(wallet: any) {
    const provider = new BrowserProvider(wallet);
    return await provider.getSigner();
}

export const fetchBalances = async (chainId: string | number,account: string | undefined, walletProvider: any, tokenList: TToken[],setTokenList: (tokenList: TToken[]) => void) => {
    if(!account){
        return;
    }
    if(account == ""){
        return;
    }
    
    let dexContract = getContractByName(TContractType.DEX, chainId);
     
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

}

