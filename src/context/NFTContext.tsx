import {
    createContext,
    useContext,
    useReducer,
    useCallback,
    useMemo,
    useEffect,
    ReactNode,
} from "react";
import { getContractByName } from "../constants/contracts/contracts";
import { TContractType } from "../constants/contracts/addresses";
import { useTokenContext } from "./TokenContext";
import { useAppKitNetwork } from "@reown/appkit/react";
import { ethers } from "ethers";


// =========================
// Types
// =========================

export interface NFTItem {
    is_cancelled: boolean;
    is_completed: boolean;
    collectionId: bigint;
    remaining_amount: bigint;
    price_per_token: bigint;
}

export interface NFTCollection {
    // ABI'den gelenler
    exists: boolean;
    banned: boolean;
    assetType: number; // enum uint8
    collectionId: bigint;
    created_at: bigint;
    totalVolume: bigint;
    collection: `0x${string}`;

    // Frontend tarafında eklenenler
    name: string;
    floorPrice: bigint;
    itemsCount: number;
    items: NFTItem[];
}

interface NFTState {
    collections: NFTCollection[];
    loading: boolean;
    error: string | null;
}

type NFTAction =
    | { type: "LOAD_START" }
    | { type: "LOAD_SUCCESS"; payload: NFTCollection[] }
    | { type: "LOAD_ERROR"; payload: string };


// =========================
// Reducer
// =========================

const initialState: NFTState = {
    collections: [],
    loading: false,
    error: null,
};

function nftReducer(state: NFTState, action: NFTAction): NFTState {
    switch (action.type) {
        case "LOAD_START":
            return { ...state, loading: true, error: null };

        case "LOAD_SUCCESS":
            return {
                ...state,
                loading: false,
                collections: action.payload,
            };

        case "LOAD_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
}


// =========================
// Context
// =========================

interface NFTContextValue extends NFTState {
    refresh: (walletProvider: any) => Promise<void>;
}

const NFTContext = createContext<NFTContextValue | undefined>(undefined);


// =========================
// Provider
// =========================

export const NFTProvider = ({ children }: { children: ReactNode }) => {
    const { chainId } = useAppKitNetwork();
    const { account } = useTokenContext();
    const [state, dispatch] = useReducer(nftReducer, initialState);

    const refreshEx = useCallback(async (walletProvider: any) => {

        dispatch({ type: "LOAD_START" });

        try {
            let marketContract = await getContractByName(TContractType.NFT_MARKETPLACE, Number(chainId), walletProvider);
            const [signerAccount] = await marketContract.wallet.getAddresses();
            let userAccount = account ? account : ethers.ZeroAddress;


            const rawCollections = await marketContract.client.readContract({
                address: marketContract.caller.address,
                abi: marketContract.abi,
                functionName: "fetchCollections",
            }) as any[];


            const processed: NFTCollection[] = await Promise.all(
                rawCollections.map(async (c: any) => {
                    const items = await marketContract.client.readContract({
                        address: marketContract.caller.address,
                        abi: marketContract.abi,
                        functionName: "fetch", // 🔥 BURASI ÖNEMLİ
                        args: [c.collectionId],
                    }) as NFTItem[];

                    const liveItems = items.filter(
                        (i) => !i.is_cancelled && !i.is_completed
                    );

                    return {
                        ...c,
                        items: liveItems,
                    };
                })
            );

            dispatch({ type: "LOAD_SUCCESS", payload: processed });
        } catch (err: any) {
            dispatch({
                type: "LOAD_ERROR",
                payload: err?.message || "NFT load failed",
            });
        }
    }, [chainId]);

    const refresh = useCallback(async (walletProvider: any) => {
    if (!chainId) return;

    dispatch({ type: "LOAD_START" });

    try {
        const marketContract = await getContractByName(
            TContractType.NFT_MARKETPLACE,
            Number(chainId),
            walletProvider
        );

        const erc721Contract = await getContractByName(
            TContractType.ERC721,
            Number(chainId),
            walletProvider
        );

        const rawCollections = await marketContract.client.readContract({
            address: marketContract.caller.address,
            abi: marketContract.abi,
            functionName: "fetchCollections",
        }) as any[];

        const processed: NFTCollection[] = await Promise.all(
            rawCollections
                .slice()
                .reverse()
                .map(async (c: any) => {

                    // 1️⃣ Collection Items
                    const items = await marketContract.client.readContract({
                        address: marketContract.caller.address,
                        abi: marketContract.abi,
                        functionName: "fetch",
                        args: [c.collectionId],
                    }) as NFTItem[];

                    // 2️⃣ NFT Contract Name
                    const collectionName = await erc721Contract.client.readContract({
                         address: c.collection,
                        abi: erc721Contract.abi,
                        functionName: "name",                    
                });


                    // 3️⃣ Floor & Count Calculation
                    let floorPrice: bigint | null = null;
                    let itemsCount = 0;

                    const liveItems = items.filter((item) => {
                        const isLive =
                            !item.is_cancelled && !item.is_completed;

                        if (isLive) {
                            if (
                                floorPrice === null ||
                                item.price_per_token < floorPrice
                            ) {
                                floorPrice = item.price_per_token;
                            }

                            itemsCount += Number(item.remaining_amount);
                        }

                        return isLive;
                    });

                    return {
                        ...c,
                        name: collectionName,
                        items: liveItems,
                        floorPrice: floorPrice ?? 0n,
                        itemsCount,
                    };
                })
        );

        // 4️⃣ Sort by liquidity
        const sorted = processed.sort(
            (a: any, b: any) => b.itemsCount - a.itemsCount
        );

        dispatch({ type: "LOAD_SUCCESS", payload: sorted });

    } catch (err: any) {
        dispatch({
            type: "LOAD_ERROR",
            payload: err?.message || "NFT load failed",
        });
    }
}, [chainId]);

    // Reactive reload
    useEffect(() => {
        if (account) {
            refresh(null);
        }
    }, [account, chainId, refresh]);

    const value = useMemo(
        () => ({
            collections: state.collections,
            loading: state.loading,
            error: state.error,
            refresh,
        }),
        [state, refresh]
    );

    return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};


// =========================
// Hook
// =========================

export const useNFT = () => {
    const context = useContext(NFTContext);
    if (!context) {
        throw new Error("useNFT must be used within NFTProvider");
    }
    return context;
};