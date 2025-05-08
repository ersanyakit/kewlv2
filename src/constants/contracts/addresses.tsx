import DEX_ABI from "./abis/KEWLDEX.json";
import ERC20_ABI from "./abis/ERC20.json";
import { Address } from "@reown/appkit-adapter-ethers";
import { PublicClient } from "viem";
 
export enum TContractType {
    DEX,
    ERC20,
  }
  
  export interface TContract {
    address: Address;
  }
  
  export interface TCustomContract {
    address: Address;
    abi:object[];
    client: PublicClient;
    caller: any;
  }

  export type MultiContractConfig = {
    [contractType in TContractType]: {
      abi: object[];
      contracts?: Record<number | string, TContract>;
    };
  };


export const ContractList: MultiContractConfig = {
    [TContractType.DEX]: {
        abi: DEX_ABI.abi,
        contracts: {
            88888: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            42161: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            31337: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            43114: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
            146: {
                address: "0xA0BB8f9865f732C277d0C162249A4F6c157ae9D0",
            },
        },
    },
    [TContractType.ERC20]: {
        abi: ERC20_ABI.abi,
        contracts: {
            88888: {
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
        },
    },
}

