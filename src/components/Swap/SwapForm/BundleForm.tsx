import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle,
  BarChart3,  XCircle,

  Shuffle,
  PlusCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { SWAP_MODE, useTokenContext } from '../../../context/TokenContext';
import TokenShape from '../../UI/TokenShape';
import { TradeType } from '../../../constants/entities/utils/misc';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import ConnectButton from '../../UI/ConnectButton';
import { useSwapContext } from '../../../context/SwapContext';

// Token type

// memo ile render performansını optimize etme
const BundleForm: React.FC = () => {
  // Token context'inden verileri al
  const {
    nativeToken,
    isDarkMode,
    baseToken,
    swapMode,
    tokenFilter,
    tradeType,
    openTokenSelector,
    setTokenFilter,
    setSwapMode,
    setTradeType,

  } = useTokenContext();

  const {
    isSwapping,
    loading,
    canAggregatorSwap,
    fromAmount,
    toggleDetails,
    aggregatorPairs,
    setAggregatorPairs,
    setToggleDetails,
    handleFromChange,
    handleBundleSwap,
    handleAggregatorSwap,
    setCanAggregatorSwap,
    handleToChange,
  } = useSwapContext();
  const { chainId } = useAppKitNetwork(); // AppKit'ten chainId'yi al
  const { walletProvider } = useAppKitProvider('eip155');
  const { address, isConnected } = useAppKitAccount();

  const fanTokens: any[] =
    [
      {
        "chainId": 88888,
        "name": "Wrapped Galatasaray S.K.",
        "symbol": "WGAL",
        "address": "0xCFc896fe8C791B6d1c085e69451E4B2f675a4927",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x6dab8fe8e5d425f2eb063aae58540aa04e273e0d/logo.svg",
        "pair": "0xd9ED0A752590948da6e436A3BFbb8674e5366698"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Flamengo",
        "symbol": "WMENGO",
        "address": "0xa8732Dbb1985a570a1d98F57001E3c837046F618",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xd1723eb9e7c6ee7c7e2d421b2758dc0f2166eddc/logo.svg",
        "pair": "0xD00d9098857Eab3Bdc54eD3B0d2833E8dee2103B"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Arsenal FC",
        "symbol": "WAFC",
        "address": "0x109523174dD4431dFd2628eaF9435cFD14dC6c2f",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x1d4343d35f0e0e14c14115876d01deaa4792550b/logo.svg",
        "pair": "0x4486e089784f696e5010f752B83C101307463d87"
      },
      {
        "chainId": 88888,
        "name": "Wrapped AC Milan",
        "symbol": "WACM",
        "address": "0x859DB9e2569bb87990482fC53E2F902E52585Ecb",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xf9c0f80a6c67b1b39bddf00ecd57f2533ef5b688/logo.svg",
        "pair": "0x0bBe6D5FC3ddbF8fF1232D7490a520189D39b2FD"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Corinthians",
        "symbol": "WSCCP",
        "address": "0x89c2b844Da2B9b12eE704E2b544cEC064a9243a2",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x20bfeab58f8be903753d037ba7e307fc77c97388/logo.svg",
        "pair": "0xa243D918bAF2A4254F1433331257Cb9137c76461"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Inter Milan",
        "symbol": "WINTER",
        "address": "0xc587CF9ff27D7722ff4A3063abaFf81551803730",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xc727c9c0f2647cb90b0fca64d8ddb14878716bed/logo.svg",
        "pair": "0x7af3e0109e15b8A75cE7c7F9E19270a3E03691c6"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Juventus",
        "symbol": "WJUV",
        "address": "0xaCf221C4f6C713459981660e3146e64Cba54e0B1",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x454038003a93cf44766af352f74bad6b745616d0/logo.svg",
        "pair": "0xDD660c0C440762901729AA43E529cc02c621650a"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Argentina",
        "symbol": "WARG",
        "address": "0x7475777609CE0Bd8e06b471B95AC5330511e03aE",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xd34625c1c812439229ef53e06f22053249d011f5/logo.svg",
        "pair": "0x5EA21A112169C3222D5a0a68F317f09818D18108"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Manchester City FC",
        "symbol": "WCITY",
        "address": "0x368F1EB2E4FA30C1C5957980C576Df6163575416",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x6401b29f40a02578ae44241560625232a01b3f79/logo.svg",
        "pair": "0x5026EA40204015e6FB61635a02f79A1A8f5B6657"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Professional Fighters League",
        "symbol": "WPFL",
        "address": "0x9b18841FE851f5B4b9400E67602eC2FE65aaaE0a",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xde05490b7ac4b86e54eff43f4f809c3a7bb16564/logo.svg",
        "pair": "0x85D93126D9506772B2f5AB04B135F24d5a1c5CAC"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Alliance",
        "symbol": "WALL",
        "address": "0x1eb33b4243691f6FFbE0f77BBEa3be1C6b26E43E",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xc5c0d1e98d9b1398a37c82ed81086674baef2a72/logo.svg",
        "pair": "0xE7aDB0DFc589E6a45b91A5c3B94e1a11A724A33A"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Aston Martin Cognizant",
        "symbol": "WAM",
        "address": "0xE51a3c216afB6e7c9BeBb4968CD4A8d1E0E99F77",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x3757951792edfc2ce196e4c06cffd04027e87403/logo.svg",
        "pair": "0x46ad4729d8f73EB4A2443eF85DC463c6470aBc56"
      },
      {
        "chainId": 88888,
        "name": "Wrapped FC Barcelona",
        "symbol": "WBAR",
        "address": "0xbaAAEF59F4A6C11cC87FF75EAa7a386e753b2666",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xfd3c73b3b09d418841dd6aff341b2d6e3aba433b/logo.svg",
        "pair": "0xF4f4524E3840f5116af077F0d8B36E2D809aDE98"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Goztepe S.K.",
        "symbol": "WGOZ",
        "address": "0x71103f7892c6c5BeCC135A22aFa9F021D905B750",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x0e469d1c78421c7952e4d9626800dad22f45361d/logo.svg",
        "pair": "0x056177c1254cC21535637d590C9c367e9C593d59"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Roush Fenway Facing",
        "symbol": "WROUSH",
        "address": "0x369C0bf5B24cfc088BD1E634ecDF95F786DBF5CB",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xba20ef1670393150d1c1b135f45043740ec3a729/logo.svg",
        "pair": "0xd62FFeB2447Dbb43Df89976F43f5D59ef26D482c"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Paris Saint-Germain",
        "symbol": "WPSG",
        "address": "0x476eF844B3E8318b3bc887a7db07a1A0FEde5557",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xc2661815c69c2b3924d3dd0c2c1358a1e38a3105/logo.svg",
        "pair": "0xEA844079241c84Fae62648C380a38b913d86e7CF"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Valencia CF",
        "symbol": "WVCF",
        "address": "0xf9ae77D7658ad1a1Ff49Ca4D082fEDb680A83373",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xba0c26485b1909f80476067272d74a99cc0e1d57/logo.svg",
        "pair": "0xEB86b66558D4b0B297F79F1bB401AacA2530d56b"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Alfa Romeo Racing ORLEN",
        "symbol": "WSAUBER",
        "address": "0x9632E5D03Bb7568b68096AbF34B1367B87295d82",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xcf6d626203011e5554c82babe17dd7cdc4ee86bf/logo.svg",
        "pair": "0x4b4d089F62c995Abc4B78Aa4Ba8667b63F1DD809"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Portugal National Team",
        "symbol": "WPOR",
        "address": "0x804C701c3d548d68773e4E06c76C03aFa0e32d42",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xffad7930b474d45933c93b83a2802204b8787129/logo.svg",
        "pair": "0x6F69E8698D8250f25C0108f670ba539011aC838a"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Alanyaspor",
        "symbol": "WALA",
        "address": "0x685Ba5134F373785263DB5a5BC5CFF686264500b",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x863f7537b38130f01a42e9e9406573b1f1e309f7/logo.svg",
        "pair": "0xA40E028192D5Df6131b32b505C1d3b443154d0dD"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Vitality",
        "symbol": "WVIT",
        "address": "0x82E159F2704A9d00f2079be89Dc1d6c499536957",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x1754bbc90f8c004edbacc59e41aa4be7a36b5d5b/logo.svg",
        "pair": "0xE90492073D2F5a363A62243559B6aF97B4a867f9"
      },
      {
        "chainId": 88888,
        "name": "Wrapped AS Monaco",
        "symbol": "WASM",
        "address": "0x7Ad193240F89b2f60c087eb9aebcf64139Dd7b89",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x371863096cf5685cd37ae00c28de10b6edbab3fe/logo.svg",
        "pair": "0xF1D89FE2D161301E043d35797FA13E2eaEe523a2"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Clube Atlético Mineiro",
        "symbol": "WGALO",
        "address": "0xb7ff11AA7612e8c04A276dFEa3ff95fFc9724EA1",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xe5274eb169e0e3a60b9dc343f02ba940958e8683/logo.svg",
        "pair": "0x53e7EC26030cC635cdCbA83c1C0F2106726c606e"
      },
      {
        "chainId": 88888,
        "name": "Wrapped BSC Young Boys",
        "symbol": "WYBO",
        "address": "0xd14f7b7fD6D18A16c4f0c678E301a783D36a2BF0",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x0dc1776c56ffd3a046134be6fdc23a3214359329/logo.svg",
        "pair": "0x17d32622D80e9750e55f9916BC8ac2918Ee9A0fc"
      },
      {
        "chainId": 88888,
        "name": "Wrapped AS Roma",
        "symbol": "WASR",
        "address": "0x36C8239aabd0C6F7856B20aD9DEEb5080adAf0fb",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xa6610b3361c4c0d206aa3364cd985016c2d89386/logo.svg",
        "pair": "0x8e80764897aC1c8cB83A856cB00dd89273D6b97B"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Trabzonspor",
        "symbol": "WTRA",
        "address": "0x80E5DCCABC8566d4b12812142A6609d6b9dd84CF",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x304193f18f3b34647ae1f549fc825a7e50267c51/logo.svg",
        "pair": "0xFe2218B78951da5F70df6d962949ab6D47dE590b"
      },
      {
        "chainId": 88888,
        "name": "Wrapped UFC",
        "symbol": "WUFC",
        "address": "0xa698a6D7275A461D6F2D425E31dAB4a61a171AFd",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x0ffa63502f957b66e61f87761cc240e51c74cee5/logo.svg",
        "pair": "0x9c4EbFE5373C338f05c98bF98d2F48AF0659F20d"
      },
      {
        "chainId": 88888,
        "name": "Wrapped İstanbul Başakşehir FK",
        "symbol": "WIBFK",
        "address": "0x3415C4bf4bDc284133831C2Ed414bC57Dbe5cFfc",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xd5febd04badd83e7ed56ca093fd57655b737cd3e/logo.svg",
        "pair": "0xDc90E92bb69fe5Ba29E12ACB4B3E0796BEA3ba96"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Leeds United FC",
        "symbol": "WLUFC",
        "address": "0x2D271B3826090872a7A79DD69FFe660367f8579d",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xf67a8a4299f7ebf0c58dbfb38941d0867f300c30/logo.svg",
        "pair": "0x7Ae56321a05Bac7422079E780F15992F90bA8921"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Natus Vincere",
        "symbol": "WNAVI",
        "address": "0xF242cD01cc984EC8cE7a8567D40d15837Fe5C7e8",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x05765a792a04ecc6d45102b45874bc44a95a2d7e/logo.svg",
        "pair": "0x080E3fa9EEA532afCF6f9D935F4084E51852B1DB"
      },
      {
        "chainId": 88888,
        "name": "Wrapped São Paulo FC",
        "symbol": "WSPFC",
        "address": "0x60175b07658694FC1c16578376c439879C05d1Cb",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x540165b9dfdde31658f9ba0ca5504eda448bffd0/logo.svg",
        "pair": "0x7AE869DfB8C1Ac79AB306a1bbC27afe01cbe6bcE"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Bologna FC",
        "symbol": "WBFC",
        "address": "0x3Bce6c975Ed6Ed39aB80daC8774E5A6CE0E58515",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x319067e6253fdbf183c27abcaf31d45ad50e98ff/logo.svg",
        "pair": "0x94DfDb5ee188287b4513aFBF1c22Fb7804670DE5"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Aston Villa",
        "symbol": "WAVL",
        "address": "0xC8f1C7267F7c362A178EB94Ac74877ea2F6c034c",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x095726841dc9bf395114ac83f8fd42b176cfad10/logo.svg",
        "pair": "0x898a79D5dFA872A810a939E40d66A28D013f2397"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Dinamo Zagreb",
        "symbol": "WDZG",
        "address": "0xD97215C8515688d1573B058b9D30bA04A6Af6aa2",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x6412afdfdf2a465b2e2464a5f9d1743a9cffd6ff/logo.svg",
        "pair": "0xEbfbd5B6A34DC4a0EA9EB170eC6191d73760Bcb7"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Atlético de Madrid",
        "symbol": "WATM",
        "address": "0x7Ac8cAa7c42e13d31247B1F370E2CF0c242957e8",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xe9506f70be469d2369803ccf41823713bafe8154/logo.svg",
        "pair": "0xcb57586AdB97A37730141dC4de598eA3798b2643"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Club Atletico Independiente",
        "symbol": "WCAI",
        "address": "0xe6FfE9E1dE0E5bA375F10AeCA8E710225098D233",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x8a48ad8279318757ea7905b460816c4b92de447e/logo.svg",
        "pair": "0x60e3AEE7dC53981508ad98f3F34961675c2E9Ae1"
      },
      {
        "chainId": 88888,
        "name": "Wrapped SL Benfica",
        "symbol": "WBENFICA",
        "address": "0x8b11453f790726eC863422D47c2bDF6222dD0F2D",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xad7c869f357b57bb03050183d1ba8ec465cd69dc/logo.svg",
        "pair": "0xDe7F04C0DA81e2880f43BDC43c3339C7Caff946a"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Everton Football Club",
        "symbol": "WEFC",
        "address": "0xFC8799E0895b3B92936075F3B1A4D1bF5F183166",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xabee61f8ff0eadd8d4ee87092792aaf2d9b2ca8e/logo.svg",
        "pair": "0xab1d4A122CBaf281BD072cDE8Da2feea72313FEF"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Levante",
        "symbol": "WLEV",
        "address": "0xD37938861Bd995FdC016B6383ac7D78b345107BA",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x69d65e72266b15c2b2abcd69561399d9bd1843ef/logo.svg",
        "pair": "0xcEA6a0fD6923cdC9b579e5a55a81565eAc1D77bf"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Samsunspor",
        "symbol": "WSAM",
        "address": "0x72e24AaDEE54E65152C14246D2C62C1D42804764",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xfc21c38f4802ab29aed8cc7367542a0955cfa9d7/logo.svg",
        "pair": "0x32ade86070BfD466eFD840155e0794a3b3b564c0"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Legia Warsaw",
        "symbol": "WLEG",
        "address": "0x58386A2d1c45D4c5349468892f5f73CA3E53EA22",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x3ce3946a68eb044c59afe77dfdfdc71f19eb4328/logo.svg",
        "pair": "0x8FE2225c3E115DF99b69b73aB5bae24CD6f0a83f"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Millonarios",
        "symbol": "WMFC",
        "address": "0xb1d0fADa44D28d31844241460d90C1775706126C",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xdeb5a271a67652a84decb6278d70a6d6a18d7c3b/logo.svg",
        "pair": "0x4F0B65906D09CaF2BBC83161B5FDF8C2853E6f70"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Endpoint CeX",
        "symbol": "WENDCEX",
        "address": "0xAb445A85384287E5ea1265d3E393180d4b7aeA04",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x3f521d391e2ad0093d3bfabb2516f1c57d73b4d1/logo.svg",
        "pair": "0x869f9dEb95ec87F1740e92D8B6cbC2CCd4100B12"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Fortuna Sittard",
        "symbol": "WFOR",
        "address": "0xf0f458B1E8Cd27d585De1baB5484B05C4d512a0E",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x4b56f121f769bbdee3faba6e8b9163e7cffdd59a/logo.svg",
        "pair": "0x573f9356AebeAB240f1B464D1b50d6e8773E54AF"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Gaziantep FK",
        "symbol": "WGFK",
        "address": "0x2bA57f4b99e9D2401381B2D2a1f60760CE3f1E82",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x2a5dbf10a9eb8d948aef256fde8e62f811624c4f/logo.svg",
        "pair": "0x658Dd48C001C075B626057Eb46d821264Ea2F3fA"
      },
      {
        "chainId": 88888,
        "name": "Wrapped FIGC",
        "symbol": "WITA",
        "address": "0x9EccD05BBA630cba3E6E119f9243AA649F443b19",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x7483263ca24bfcff716a21f4a9bbf2610bdd9ec9/logo.svg",
        "pair": "0xECCF42FAC3b5787350F53CeBCeD1B6ABe47B83b2"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Napoli",
        "symbol": "WNAP",
        "address": "0x9b24b3D55737BC28fdb21171ea5fD9eE50B136e6",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xbe7f1ebb1fd6246844e093b04991ae0e66d12c77/logo.svg",
        "pair": "0x061bAfe6145439948E07f1D81583Eced277B7773"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Universidad de Chile",
        "symbol": "WUCH",
        "address": "0x1A21a5C735a48FdE12637D85501205A85FA9aB37",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xa082ec45af038100d4989636a4a5e52fd7e5c636/logo.svg",
        "pair": "0xB5B46e689B01db879e86c82939eA677b4c469c46"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Racing",
        "symbol": "WRACING",
        "address": "0x7CB4FFbf64CD58fE6dC57ED8011b65b73691F0AD",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x06ed14a885d0710118fc20d51efdc151a48005b3/logo.svg",
        "pair": "0xc8d3Fc05964e8d9d1B564e3C4B9c5faC6db7fa66"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Team Heretics",
        "symbol": "WTH",
        "address": "0x6c5e381aF6E3B237F8471A7e1448A4CdF82d3447",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x06b4213774dd069cf603ad11770b52f1e98160a7/logo.svg",
        "pair": "0x43A4A6Ee43E2Fd2B100DC87C6F1a43E7063D1D30"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Crystal Palace",
        "symbol": "WCPFC",
        "address": "0x081232E5fee74ACa4C40bCe224C64e014A6AC245",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xa70bd29bef2936765fe33b0f4b0cf8e947d75581/logo.svg",
        "pair": "0x36be8edE2479D8Dc635f281A8683c4DDaB8CE7f4"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Davis Cup",
        "symbol": "WDAVIS",
        "address": "0x82741b8B13e95eBA9b60dDb8b368F9b793E92f3a",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xf50b3db1d498b69b0dc8ccc0b03643009a6bda78/logo.svg",
        "pair": "0x7639eED20782Ad8b5a89383B641AAd50eBE42992"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Sevilla FC",
        "symbol": "WSEVILLA",
        "address": "0xb71597e18D9933b38a56817Ed74C64618232e325",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x60a5e1f5f0071c5d870bb0a80b411bde908ad51e/logo.svg",
        "pair": "0x39aE6543E8A1363184D9117c6B4db907E2ef1EF1"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Internacional",
        "symbol": "WSACI",
        "address": "0xE41a78C047E455C3f57F610091D0dE023A7b3D0B",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x3175e779b42d35e2c9eeafadcf5b6e6ec6e4f910/logo.svg",
        "pair": "0xA9ac8c7f7080018B2636B29a934a7C07420B60A6"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Palmeiras",
        "symbol": "WVERDAO",
        "address": "0x6dB3ECA64DC5B789a70571BD81332864bA327A56",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x971364ec452958d4d65ba8d508faa226d7117279/logo.svg",
        "pair": "0xfEd8d75c3019c90D5D9D25882067a803669EE2F5"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Apollon Limassol FC",
        "symbol": "WAPL",
        "address": "0xe265Db1EBEe1487Ea6EbA7ed9fdCECC8010c8e98",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xb407a167fe99eb97970e41b2608d0d9484c489c8/logo.svg",
        "pair": "0x7b002CE5c04525017E25C4a5948A31BEc90b9EaB"
      },
      {
        "chainId": 88888,
        "name": "Wrapped MIBR",
        "symbol": "WMIBR",
        "address": "0x57488F1C881b2D5832D61781e741D09c5b3410Fb",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xa8206af1e6a0289156d45b9d60e5bbd5d1fcf68d/logo.svg",
        "pair": "0x54FfEd938DdE3a2d66A55cA71dbE896f421C6AcE"
      },
      {
        "chainId": 88888,
        "name": "Wrapped EC Bahia",
        "symbol": "WBAHIA",
        "address": "0x55BD5c6b24F3c445f7EA813Cc37eD16473057073",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xe92e152fc0ff1368739670a5175175154ceeef42/logo.svg",
        "pair": "0xBF6FB03Cb562A1239e3e928D209fd37c55cB4ddf"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Real Sociedad",
        "symbol": "WRSO",
        "address": "0xeF571542DcF394Da8B5190F75A20dacC07fAC741",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xdd03a533d6a309afff3053fe9fc6c197324597bb/logo.svg",
        "pair": "0x6834D0Db33ec1eBefAcBDF842f74dd75F9CE5B80"
      },
      {
        "chainId": 88888,
        "name": "Wrapped OG",
        "symbol": "WOG",
        "address": "0x07Eb6147263F2Fedb00002bAdaFc79ea769240f2",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x19ca0f4adb29e2130a56b9c9422150b5dc07f294/logo.svg",
        "pair": "0xcEb509fff87AFFB3E98ab7dB996ff3fFD9851f5c"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Harlequins",
        "symbol": "WQUINS",
        "address": "0x1f9002a9964894213507966c1F352Dcf1ACb1484",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x539e00d2487a06f3f08cdaf7bf7a8b4a32c3a14e/logo.svg",
        "pair": "0x6C811239356043eD55BAD2ca0B3d57bdB433628E"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Vasco da Gama",
        "symbol": "WVASCO",
        "address": "0x2EAe5689908ac76996B70B48d5CE5d2f2fCC09e0",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x6d72034d7508d16988bf84638d51592a8c02887b/logo.svg",
        "pair": "0x120E47455FBbd2e36Ae7c0ab87E9F1ed8F8033aB"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Saracens",
        "symbol": "WSARRIES",
        "address": "0xCcE302af2BBe84b5c44C3A460165816EE2fd7fF3",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x753dda10c7b3069f0c90837dc3755c7c40a81b8c/logo.svg",
        "pair": "0xED22D860A39A079e2cAE014fCf7b507fc0dd96Aa"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Fluminense FC",
        "symbol": "WFLU",
        "address": "0xD6E703752E5457825734f74eaF8813251A9970E4",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x86930777d43605c40ba786f7802778ff5413efab/logo.svg",
        "pair": "0x043b815769fa975E531859564AB11B4D9E85A3EB"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Tigers",
        "symbol": "WTIGERS",
        "address": "0x4b71E34bCb5feBa0dd51696863bcd792A84df196",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x0b39ff3de07e8b6d2b97357d6f2a658ed7de52cf/logo.svg",
        "pair": "0x5AC40be424F3e026674FD6525638B3CB5C4711B8"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Atlas FC",
        "symbol": "WATLAS",
        "address": "0x7B9d4199368CA5F567999Fc35Aa3F6f86b18D2F2",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x936ae5911f49634fd7f4f7385db1613c5e350ede/logo.svg",
        "pair": "0xeF321Ceca81be0914EE9d9644f47eC494f41Fe6c"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Stade Français",
        "symbol": "WSFP",
        "address": "0x802B51D1Aa89C7222993463Ade8600cF08700DfF",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x2a89f8af25b01b837d67be3b1a162a663f77b26e/logo.svg",
        "pair": "0x5d56E26e736c1852ef29a917C6E998E65f402a13"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Udinese",
        "symbol": "WUDI",
        "address": "0xCE1E295c23D6c99909A414b0dDE447c15bB4Db7D",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xd2571bb5e84f1a3ac643b6be1dd94fc9fb97041d/logo.svg",
        "pair": "0xC563BEc763194df3Cd7EF9defC00326450857a06"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Sint-Truidense Voetbalvereniging",
        "symbol": "WSTV",
        "address": "0x6d58211888D381D6Fd3D344A7a33789cE0628b01",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xe446d966ba9a36e518cf450abbd22f45688107da/logo.svg",
        "pair": "0x6fF27F6acB5c11B583BF0D8F031055A0b9AdE3f7"
      },
      {
        "chainId": 88888,
        "name": "Wrapped BALI UNITED",
        "symbol": "WBUFC",
        "address": "0x53DB5c49CE9d0AB222e3a7458af140B78f857c81",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xe87cb1546d50f523057d3f94b07381dce3f85ef9/logo.svg",
        "pair": "0xaF4ed2F0b658FCA86D1A8F50a26aAe7F3fD377Ff"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Club Santos Laguna",
        "symbol": "WSAN",
        "address": "0x39C0E77Cb84a893166cC0E943b8e22b7F56Dc9f5",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x44941a2d2049be0acb00baf0a5dee8931c33712e/logo.svg",
        "pair": "0x1117641eD27CcbFe316f415d6BaFB41c9B7b1720"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Hashtag United F.C.",
        "symbol": "WHASHTAG",
        "address": "0xE8C45FBbFdC1bA65A05D9Eb9C0ffF71900492802",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x7be4aebc9900d2c1b628530ffc59416a98420b15/logo.svg",
        "pair": "0x0Ef2794F75Cc17984c4616A6075bB0426458c9C8"
      },
      {
        "chainId": 88888,
        "name": "Wrapped PERSIB",
        "symbol": "WPERSIB",
        "address": "0x22a82491C4bA35E6910213811ddE4F8702aE0709",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xc34bfba5db50152ef3312348a814d24f85748d64/logo.svg",
        "pair": "0x1d006db2A80e792293a90cD248F1b87007b31269"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Sharks",
        "symbol": "WSHARKS",
        "address": "0x8b8454ad0bc75C3C4bECb250b48D9a2072Fd55E3",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x1f5ed1182b673338ecff0eeab13ed79ceaf775f5/logo.svg",
        "pair": "0xD8fbc102C41662B21cCbe2a97c83080B374221dA"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Tigres",
        "symbol": "WTIGRES",
        "address": "0x2EA082e1053f05EfFEB8E28c350fa0ff8fe78538",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xf17b1e028537aba705433f7cebdca881b5c5b79e/logo.svg",
        "pair": "0xFEC8121Fa337A15930f57dFc433c93a0545e43e7"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Tottenham Hotspur",
        "symbol": "WSPURS",
        "address": "0xf6Bebad8bE7bb9ce05b9A71b9ab62E2e7fA58e9f",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x93d84ff2c5f5a5a3d7291b11af97679e75eeac92/logo.svg",
        "pair": "0xc4F713247418CFfbAEe588D5e5F26FF3B43cE1d7"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Chivas",
        "symbol": "W$CHVS",
        "address": "0xB00d2468FB7471D080Ec301dcD1E12e334A1d9a3",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xf66288961a3495ea9140fbd7c69e70a59db08b16/logo.svg",
        "pair": "0x198F6897D54E562F427D67f6Ca25d3F3e775B2b5"
      },
      {
        "chainId": 88888,
        "name": "Wrapped Johor Darul Tazim F.C",
        "symbol": "WJDT",
        "address": "0xdc9cAd4bceb669E823aEB30e80F2d124b0a58b6b",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0x12129ad866906ab5aa456ae1ebaea9e8a13e8197/logo.svg",
        "pair": "0xa7c364Ff98239f5fc91644752f88bEC5a6211147"
      },
      {
        "chainId": 88888,
        "name": "DOJO",
        "symbol": "DOJO",
        "address": "0xb66D72efc5fD77A8F9Dc2E7c0f14304828956644",
        "decimals": 18,
        "logoURI": "https://raw.githubusercontent.com/kewlexchange/assets/main/chiliz/tokens/0xb66D72efc5fD77A8F9Dc2E7c0f14304828956644/logo.png",
        "pair": "0x4b73692bd9b34c9e352faad07de132f790521562"
      }
    ]

  const fanTokenList = fanTokens.map(token => ({
    ...token,
    isSelected: true
  }))



  const [selectableFanTokens, setSelectableFanTokens] = useState(fanTokenList);
  const filteredFanTokens = useMemo(() => {
    return selectableFanTokens.filter(token => {
      const matchesSearch = token.symbol.toLowerCase().includes(tokenFilter.toLowerCase()) ||
        token.name.toLowerCase().includes(tokenFilter.toLowerCase());
      return matchesSearch;
    });
  }, [selectableFanTokens, tokenFilter]);


  useEffect(() => {
    setSwapMode(SWAP_MODE.COLLECTOR);
}, []);
  const toggleSelection = (tokenAddress: string) => {
    const updatedFanTokens = selectableFanTokens.map(token => {
      if (token.address.toLowerCase() === tokenAddress.toLowerCase()) {
        return {
          ...token,
          isSelected: !token.isSelected,
        };
      }
      return token;
    });

    setSelectableFanTokens(updatedFanTokens);
  };

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="flex flex-col">


      <div className="p-3 relative">
        <div className="flex justify-between items-start mb-1">
          <div>
            <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-0.5`}>You Pay</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Balance: {nativeToken && parseFloat(nativeToken.balance).toLocaleString(undefined, {maximumFractionDigits: 4})} {nativeToken && nativeToken.symbol}</div>
          </div>

          <div className="flex gap-1 flex-row items-center">

            {['25', '50', '75', '100'].map((percent) => {
              const label = percent === '100' ? 'MAX' : `${percent}%`;
              return (
                <button
                  key={percent}
                  className={`text-xs ${isDarkMode
                    ? 'bg-pink-900/30 text-pink-300 hover:bg-pink-800/40'
                    : 'bg-pink-50 text-[#ff1356] hover:bg-pink-100'
                    } px-2 py-0.5 rounded-lg transition-colors`}
                  onClick={() => {
                    const rawBalance = baseToken?.balance.replace(',', '') || '0';
                    const amount = (parseFloat(rawBalance) * (parseInt(percent) / 100)).toString();
                    handleFromChange({ target: { value: amount } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className={`flex items-center justify-between relative z-10 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'} p-2 rounded-xl`}>
          <div className="flex-grow">
            <input
              type="text"
              placeholder="0.00"
              className={`w-full text-2xl font-light ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-800 placeholder-gray-300'} focus:outline-none bg-transparent transition-colors`}
              value={fromAmount}
              onChange={handleFromChange}
            />
            {fromAmount && (
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                <span>≈ ${(parseFloat(fromAmount) * parseFloat(baseToken ? baseToken?.price.replace('$', '') : '0')).toFixed(2)}</span>
              </div>
            )}
          </div>


        </div>
      </div>
      {/* Token Seçim Slider'ı */}
      <div className="mb-5 px-6 no-select group">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>0 Tokens</span>
          <span className={`text-xs font-medium ${isDarkMode ? 'text-pink-300' : 'text-pink-600'}`}>
            {selectableFanTokens.filter(t => t.isSelected).length} Selected
          </span>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectableFanTokens.length} Tokens</span>
        </div>

        <div className="relative w-full h-9  flex items-center">
          {/* Slider Track Background */}
          <div className={`absolute w-full h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

          {/* Colored Progress Bar */}
          <div
            className={`absolute h-1 rounded-full left-0 ${isDarkMode ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gradient-to-r from-pink-400 to-purple-400'}`}
            style={{
              width: `${(selectableFanTokens.filter(t => t.isSelected).length / selectableFanTokens.length) * 100}%`
            }}
          ></div>

          {/* Actual Range Input (hidden visually but functional) */}
          <input
            type="range"
            min="0"
            max="100"
            value={(selectableFanTokens.filter(t => t.isSelected).length / selectableFanTokens.length) * 100}
            onChange={(e) => {
              const percentage = parseInt(e.target.value);
              const selectCount = Math.round((percentage / 100) * selectableFanTokens.length);

              // Update token selections based on slider position
              const updatedTokens = selectableFanTokens.map((token, index) => ({
                ...token,
                isSelected: index < selectCount
              }));

              setSelectableFanTokens(updatedTokens);
            }}
            className="absolute w-full h-9 opacity-0 cursor-pointer z-10"
          />

          {/* Visible Thumb */}
          <div
            className={`absolute w-9 h-9 rounded-full select-none shadow-md border-2 pointer-events-none ${isDarkMode ? 'bg-pink-600 border-pink-400' : 'bg-pink-500 border-pink-300'
              }`}
            style={{
              left: `${(selectableFanTokens.filter(t => t.isSelected).length / selectableFanTokens.length) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex justify-center items-center h-full">
              <span className="text-xs text-white">
                {Math.round((selectableFanTokens.filter(t => t.isSelected).length / selectableFanTokens.length) * 100)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-1">
          <button
            onClick={() => {
              const updatedTokens = selectableFanTokens.map(token => ({
                ...token,
                isSelected: false
              }));
              setSelectableFanTokens(updatedTokens);
            }}
            className={`text-xs px-2 py-1 rounded-md ${isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Clear All
          </button>

          <button
            onClick={() => {
              const updatedTokens = selectableFanTokens.map(token => ({
                ...token,
                isSelected: true
              }));
              setSelectableFanTokens(updatedTokens);
            }}
            className={`text-xs px-2 py-1 rounded-md ${isDarkMode
              ? 'bg-pink-700 text-white hover:bg-pink-600'
              : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
          >
            Select All
          </button>
        </div>
      </div>

      {/* Swap Mechanism Button */}
      <div className="flex flex-row gap-2 my-4 justify-center items-center relative h-7">
        {/* Horizontal line (now below the buttons due to z-index) */}
        <div className={`absolute left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDarkMode ? 'via-gray-600' : 'via-gray-300'} to-transparent`}></div>

        {
          isConnected ?
        
        <div className="relative z-20">
          {/* Background div to hide the line */}
          <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}></div>

 
            <motion.button
              disabled={swapMode == SWAP_MODE.COLLECTOR && isSwapping}
            onClick={() => { setTradeType(TradeType.EXACT_INPUT); handleBundleSwap(walletProvider, selectableFanTokens.filter(t => t.isSelected)) }}
            className={`z-[100] relative flex flex-row items-center transition-all duration-300 bg-gradient-to-r from-[#ff1356]/10 to-[#3b82f6]/10 p-1 rounded-full`}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 8px rgba(255, 19, 86, 0.3)",
              backgroundColor: isDarkMode ? "rgba(255, 19, 86, 0.15)" : "rgba(255, 19, 86, 0.1)"
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <TokenShape isDarkMode={isDarkMode} token={nativeToken} size="sm" />
            </div>
            <motion.div
              animate={{
                rotateX: openTokenSelector && tradeType === TradeType.EXACT_INPUT ? 180 : 0,
                y: openTokenSelector && tradeType === TradeType.EXACT_INPUT ? 2 : 0
              }}
              transition={{ duration: 0.3 }}
            >
            </motion.div>
            <div className="flex w-full text-start flex-col items-start mx-2">
              <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{swapMode == SWAP_MODE.COLLECTOR && isSwapping ? "Swapping..." : "Invest Now"}</div>
            </div>
            <Shuffle className={`w-6 h-6 mx-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} group-hover:text-pink-500`} />

          </motion.button>
      
        </div>
        :
        <div className="flex absolute flex-row z-5 items-center gap-2">
            <div className={` inset-0 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}></div>
            <div className="z-[100] relative flex flex-row items-center gap-2">
              <ConnectButton />
          </div>
          </div>
        }


      </div>



      <div className={`flex flex-col gap-3 mx-3 mt-3 p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/90 border border-gray-200'}`}>
        {/* Summary Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${isDarkMode ? 'bg-pink-900/30' : 'bg-pink-100'}`}>
              <BarChart3 className={`w-4 h-4 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
            </div>
            <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Investment Summary</h3>
          </div>
          <div className={`px-2 py-1 text-xs rounded-full ${isDarkMode ? 'bg-pink-900/20 text-pink-300' : 'bg-pink-100 text-pink-700'}`}>
            {selectableFanTokens.filter(t => t.isSelected).length} tokens selected
          </div>
        </div>

        {/* Summary Content */}
        <div className={`grid grid-cols-2 gap-3 text-sm`}>
          {/* Selected Tokens */}
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Selected Tokens</div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectableFanTokens.filter(t => t.isSelected).length} / {selectableFanTokens.length}
            </div>
          </div>

          {/* Total Investment */}
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Investment</div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {fromAmount || '0'} {nativeToken?.symbol || 'CHZ'}
            </div>
          </div>

          {/* Per Token Investment */}
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Per Token Investment (~)</div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {fromAmount && selectableFanTokens.filter(t => t.isSelected).length > 0
                ? (parseFloat(fromAmount) / selectableFanTokens.filter(t => t.isSelected).length).toFixed(6)
                : '0'} {nativeToken?.symbol || 'CHZ'}
            </div>
          </div>

          {/* Token Distribution */}
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Token Distribution</div>
            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-1`}>
              <Shuffle className="w-3.5 h-3.5" /> Even Split
            </div>
          </div>
        </div>

        {/* Distribution Visualization */}
        <div className={`mt-1 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-2 rounded-lg`}>
          <div className="flex justify-between items-center mb-1">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Token Distribution
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500`}></div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Even Split</span>
            </div>
          </div>



          {/* Token selection preview */}
          <div className="grid grid-cols-5 gap-2 mt-2 mb-1 flex-wrap gap-1">
            {selectableFanTokens.filter(t => t.isSelected).map((token, idx) => (
              <div
                key={idx}
                className={`cursor-pointer basis-5 w-full py-0.5 text-xs rounded-full flex flex-col items-center gap-1 hover:bg-gray-200/40 
                                        ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
              >
                <div className='w-full flex flex-row items-center justify-start gap-1 px-1'>
                  <div className="min-w-5 min-h-5 w-5 h-5 rounded-full overflow-hidden">
                    <img src={token.logoURI} alt={token.symbol} className="w-full h-full object-cover" />
                  </div>
                  <span className='text-[10px] truncate'> {token.symbol}</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`overflow-hidden ${isDarkMode
            ? 'bg-gray-700/90 border-gray-600'
            : 'bg-white/90 border-gray-200'
            }  mt-1 rounded-xl mx-3`}
        >
          <div className="p-3">


            {/* Arama ve Filtre */}
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-grow">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                <input
                  type="text"
                  placeholder="Token Search..."
                  value={tokenFilter}
                  onChange={(e) => setTokenFilter(e.target.value)}
                  className={`w-full pl-9 ${tokenFilter ? 'pr-9' : 'pr-3'} py-1.5 ${isDarkMode
                    ? 'bg-gray-600 border-gray-500 text-gray-200 placeholder-gray-400'
                    : 'bg-gray-50 border-gray-100 text-gray-800 placeholder-gray-400'
                    } border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors`}
                />

                {/* Clear button */}
                {tokenFilter && (
                  <button
                    onClick={() => setTokenFilter('')}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-80 transition-colors ${isDarkMode
                      ? 'hover:bg-gray-500/30 text-gray-400 hover:text-gray-300'
                      : 'hover:bg-gray-200/50 text-gray-500 hover:text-gray-700'
                      }`}
                    type="button"
                    aria-label="Clear search"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Görünüm Seçenekleri */}
              <div className={`flex rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${viewMode === 'grid'
                    ? (isDarkMode ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white')
                    : (isDarkMode ? 'text-gray-300 hover:bg-gray-500' : 'text-gray-500 hover:bg-gray-200')
                    }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${viewMode === 'list'
                    ? (isDarkMode ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white')
                    : (isDarkMode ? 'text-gray-300 hover:bg-gray-500' : 'text-gray-500 hover:bg-gray-200')
                    }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Token Listesi */}
            <div className={`min-h-[45dvh] max-h-[45dvh]  scrollbar-hide overflow-y-auto ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'} pr-1`}>
              {viewMode === 'list' ? (
                /* Liste Görünümü */
                <div className="space-y-1">
                  {filteredFanTokens.length > 0 ? (
                    filteredFanTokens.map((token: any, tokenIndex: number) => {
                      const isSelected = token.isSelected

                      return (
                        <div
                          key={token.symbol}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 ${isSelected
                            ? isDarkMode
                              ? 'bg-pink-900/30 border border-pink-800/50'
                              : 'bg-pink-50 border border-pink-200'
                            : isDarkMode
                              ? 'hover:bg-gray-600/70 border border-transparent hover:border-gray-500'
                              : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                            }`}
                          onClick={() => toggleSelection(token.address)}
                        >
                          <div className="flex items-center">
                            <TokenShape isDarkMode={isDarkMode} token={token} size="sm" />
                            <div className="ml-2">
                              <div className="flex items-center">
                                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {token.symbol}
                                </span>
                              </div>
                              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {token.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {token.loading ? (
                              <div className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                                aria-hidden="true">
                              </div>
                            ) : (
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected
                                ? (isDarkMode ? 'bg-pink-500 text-white' : 'bg-pink-500 text-white')
                                : (isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400')
                                }`}>
                                {isSelected
                                  ? <CheckCircle className="w-5 h-5" />
                                  : <PlusCircle className="w-5 h-5" />
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={`py-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p>Token Not Found</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Grid Görünümü */
                <div className="grid grid-cols-3 gap-2">
                  {filteredFanTokens.length > 0 ? (
                    filteredFanTokens.map((token: any, tokenIndex: number) => {
                      const isSelected = token.isSelected

                      return (
                        <div
                          key={token.symbol}
                          className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-150 ${isSelected
                            ? isDarkMode
                              ? 'bg-pink-900/30 border border-pink-800/50'
                              : 'bg-pink-50 border border-pink-200'
                            : isDarkMode
                              ? 'hover:bg-gray-600/70 border border-transparent hover:border-gray-500'
                              : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                            }`}
                          onClick={() => toggleSelection(token.address)}
                        >
                          <div className="relative">
                            <TokenShape isDarkMode={isDarkMode} token={token} size="md" />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isSelected
                              ? (isDarkMode ? 'bg-pink-500 text-white' : 'bg-pink-500 text-white')
                              : (isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400')
                              }`}>
                              {isSelected
                                ? <CheckCircle className="w-4 h-4" />
                                : <PlusCircle className="w-4 h-4" />
                              }
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {token.symbol}
                            </div>
                            <div className={`text-xs truncate max-w-[90px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {token.name}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={`col-span-2 py-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p>Token Not Found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </AnimatePresence>






    </div>
  );
};

BundleForm.displayName = 'BundleForm';

export default BundleForm; 