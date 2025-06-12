import DEX_ABI from "./abis/KEWLDEX.json";
import ERC20_ABI from "./abis/ERC20.json";
import PAIR_ABI from "./abis/PAIR.json";
import MULTICALL_ABI from "./abis/MULTICALL.json";
import { Address } from "@reown/appkit-adapter-ethers";
import { PublicClient, WalletClient } from "viem";
 
export enum TContractType {
    DEX,
    ERC20,
    MULTICALL,
  }
  
  export interface TContract {
    address: Address;
  }
  
  export interface TCustomContract {
    address: Address;
    abi:object[];
    pair?:any|object[]|undefined;
    client: PublicClient;
    wallet:WalletClient;
    caller: any;
    signer: any;
  }

  export type MultiContractConfig = {
    [contractType in TContractType]: {
      abi: object[];
      multicall:object[];
      pair?:any | object[]
      contracts?: Record<number | string, TContract>;
    };
  };

export const KEWL_DEPLOYER_ADDRESS = "0x700Ff3371Befd82FdD207Ce40B866905B1B9990b"

export const ContractList: MultiContractConfig = {
    [TContractType.DEX]: {
        abi: DEX_ABI.abi,
        pair:PAIR_ABI.abi,
        multicall:MULTICALL_ABI.abi,
        contracts: {
            88888: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            88882: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            42161: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            43114: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            146: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            1907: {
                address: "0x1793515D0E1132C5eF1F32881c6313Fb692D5b12",
            },
            31337: {
                address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
            },
            

        },
    },
    [TContractType.ERC20]: {
        abi: ERC20_ABI.abi,
        multicall:MULTICALL_ABI.abi,
        pair:PAIR_ABI.abi,
        contracts: {
            88888: {
                address: "0x570e91fe0D25D46C5e0C83aF6bc95afB0072C321",
            },
            88882: {
                address: "0x570e91fe0D25D46C5e0C83aF6bc95afB0072C321",
            },
            42161: {
                address: "0x570e91fe0D25D46C5e0C83aF6bc95afB0072C321",
            },
            43114: {
                address: "0x570e91fe0D25D46C5e0C83aF6bc95afB0072C321",
            },
            31337: {
                address: "0x570e91fe0D25D46C5e0C83aF6bc95afB0072C321",
            },
            146: {
                address: "0x570e91fe0D25D46C5e0C83aF6bc95afB0072C321",
            },
            1907: {
                address: "0x570e91fe0D25D46C5e0C83aF6bc95afB0072C321",
            },
        }
    },
    [TContractType.MULTICALL]: {
            abi: MULTICALL_ABI.abi,
            multicall:MULTICALL_ABI.abi,
            pair:PAIR_ABI.abi,
            contracts: {
                88888: {
                    address: "0xcA11bde05977b3631167028862bE2a173976CA11",
                },
                88882: {
                    address: "0xcA11bde05977b3631167028862bE2a173976CA11",
                },
                42161: {
                    address: "0xcA11bde05977b3631167028862bE2a173976CA11",
                },
                43114: {
                    address: "0xcA11bde05977b3631167028862bE2a173976CA11",
                },
                31337: {
                    address: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
                },
                146: {
                    address: "0xcA11bde05977b3631167028862bE2a173976CA11",
                },
                8453:{
                    address: "0xcA11bde05977b3631167028862bE2a173976CA11", 
                },
                1907: {
                    address: "0xEd5740209FcF6974d6f3a5F11e295b5E468aC27c",
                },
        },
    },
}

