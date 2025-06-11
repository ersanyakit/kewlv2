import { TWITTER_USERS } from "./TwitterUsers";

export const getRandomUsers = (users: string[], count: number): string[] => {
    const shuffled = [...users].sort(() => Math.random() - 0.5); // Shuffle the array
    const selectedUsers = shuffled.slice(0, count); // Select the first `count` users
    return selectedUsers.map(user => `@${user}`); // Add "@" to the beginning of each username
};


export const randomUser = (count: number): Promise<string> => {
  return TWITTER_USERS()
    .then(twitterUsers => {
      const selected = getRandomUsers(twitterUsers, count);
      return [
        ...selected,
        "@alex_dreyfus",
        "@kewlswap",
        "@chiliz"
      ].join(' ');
    })
    .catch(error => {
      console.error("Error generating random users:", error);
      return "@alex_dreyfus @kewlswap @chiliz";
    });
};

const tweets = [
    "Just got 1000 $1K tokens. Feels like I hit a mini jackpot! 💰🎉 I’m on cloud nine! 😎",
    "My wallet's $1K heavier today. Thanks KEWL 😎💵 I feel like a million bucks! 💥",
    "Claimed 1000 $1K tokens — felt like getting a crisp stack of cash! 💸💥 I’m so happy right now! 😁",
    "This airdrop felt like free money. 1000 $1K in my bag! 🎁💵 I’m literally smiling ear to ear! 😆",
    "1000 $1K tokens received… I swear it feels like real dollars! 💸💎 I feel unstoppable! 💪",
    "KEWL just made my day — 1000 $1K tokens straight to my wallet! ✨💰 I can’t stop grinning! 😁",
    "I don't know what's better — free tokens or how $1K feels like $1,000! 💥💰 I’m over the moon! 🌙",
    "1000 $1K tokens dropped like it's payday 🔥💸 My heart is racing with excitement! 💓",
    "KEWL airdropped 1000 $1K and I feel RICH 💰💥 Everything feels so perfect! ✨",
    "Wallet update: +1000 $1K. Emotion: like I won $1000! 🎉💵 I’m literally living the dream! 🌟",
    "Big thank you to KEWL for the 1000 $1K tokens. Time to party! 🥳💰 I’m feeling on top of the world! 🌍",
    "Got 1000 $1K tokens today, this airdrop is the real deal! 🚀💸 Can’t believe my luck! 🍀",
    "Nothing beats free money — 1000 $1K tokens in my wallet 💥💰 I’m so grateful for this! 🙏",
    "KEWL knows how to treat its users! 1000 $1K tokens in my bag 🎁💵 I’m in heaven right now! 🌤",
    "My wallet is smiling today with 1000 $1K tokens 😁💰 Can’t believe how lucky I am! 🍀",
    "1000 $1K tokens? KEWL, you just made my week 🙌💸 I’m feeling like a boss right now! 👑",
    "Today’s highlight: 1000 $1K tokens from KEWL. Blessings! ✨💰 I feel like I hit the jackpot! 🎰",
    "Feels like a win! 1000 $1K tokens straight to my wallet 🏆💵 I’m on top of the world! 🌍",
    "Just got my hands on 1000 $1K tokens, this is pure gold! 💎💰 I feel like I’m in a dream! 🌙",
    "Claimed 1000 $1K tokens — feels like I’m living the dream 💭💸 I can’t believe this is real! 💤",
    "KEWL airdrop, 1000 $1K tokens, and I’m on cloud nine ☁️💰 I’ve never been this happy! 😁",
    "Big thanks to KEWL for the 1000 $1K tokens! I’m rich now 😉💵 I’m walking on air! 💨",
    "1000 $1K tokens just landed in my wallet. It’s payday! 💸🎉 I feel like the luckiest person alive! 🍀",
    "I don’t need a lottery when I have 1000 $1K tokens from KEWL 🎰💰 I’m richer than ever! 💎",
    "1000 $1K tokens… feels like KEWL just handed me a small fortune 💵💥 I’m on top of the world! 🌟",
    "Got myself 1000 $1K tokens. Time to flex! 💪💰 I’m living my best life right now! 🌈",
    "When KEWL drops 1000 $1K tokens, you know it’s a good day 😎💵 I’m smiling from ear to ear! 😄",
    "Woke up to 1000 $1K tokens in my wallet. This is how dreams come true 🌟💸 I feel so blessed! 🙏",
    "Just received 1000 $1K tokens from KEWL. Thank you! 🙌💰 I feel on top of the world! 🌍",
    "My wallet just got a little fatter with 1000 $1K tokens 🔥💸 I’m on cloud nine! ☁️",
    "KEWL’s 1000 $1K tokens just hit different, it’s like a win every time 🏅💵 I feel like a champion! 🏆",
    "Airdrop alert: 1000 $1K tokens in my wallet — feeling unstoppable 🔥💰 I feel like I’m on top of the world! 🌍",
    "Who needs luck when you’ve got 1000 $1K tokens from KEWL? 🍀💸 I’m feeling lucky for sure! 🍀",
    "KEWL just gave me 1000 $1K tokens. I’m living the dream now 🌈💰 I feel like a millionaire! 💸",
    "Can’t stop smiling after receiving 1000 $1K tokens from KEWL 🎉💵 I’m so grateful right now! 🙏",
    "1000 $1K tokens, and I feel like I just hit the jackpot! 💥💰 I’m on cloud nine! ☁️",
    "1000 $1K tokens in my wallet... this is how you win life 🏆💸 I feel like I’m on top! 😎",
    "Got 1000 $1K tokens! Best surprise of the year 💰🎁 I can’t believe how lucky I am! 🍀",
    "KEWL just airdropped me 1000 $1K tokens — today’s lucky day! 🍀💵 I feel so happy! 😁",
    "1000 $1K tokens just hit my wallet like a golden ticket 🎟️💸 I’m grinning from ear to ear! 😆",
    "This feels like winning the lottery — 1000 $1K tokens dropped in my wallet 💰🎰 I feel like a superstar! 🌟",
    "1000 $1K tokens today… the future looks bright! 🌟💸 I feel like I’m unstoppable! 💥",
    "KEWL’s airdrop came through strong! 1000 $1K tokens straight to my wallet 🚀💵 I feel like a winner! 🏆",
    "I’m rolling in tokens today — 1000 $1K from KEWL 💥💸 I feel like a boss right now! 👑",
    "KEWL gave me 1000 $1K tokens and I’m living the life 💰✨ I’m so thankful for this! 🙏",
    "1000 $1K tokens just made my day! This is better than any paycheck 💵🔥 I’m on top of the world! 🌍",
    "Feeling on top of the world after receiving 1000 $1K tokens 💰🌍 I’m living the dream! 💭",
    "KEWL just dropped 1000 $1K tokens — I feel like a millionaire 💸💥 I’m smiling all day! 😁",
    "1000 $1K tokens and I’m ready to take over the world! 🌍💰 I feel like I’ve made it! 💥",
    "KEWL’s 1000 $1K tokens just made me feel like I’m on top 💥💸 I’m on cloud nine! ☁️",
    "Feeling like a VIP with 1000 $1K tokens from KEWL 💎💰 I’m living my best life! 🌈",
    "1000 $1K tokens received today — time to level up! 🚀💸 I feel amazing right now! 💥",
    "I don’t need to play the lottery, KEWL just gave me 1000 $1K tokens 🎰💰 I’m feeling like a winner! 🏆",
    "1000 $1K tokens from KEWL — this is what dreams are made of 💫💵 I feel so blessed! 🙏",
    "Woke up to 1000 $1K tokens — it’s a good day for sure! ☀️💰 I feel like I’m living the dream! 💭",
    "1000 $1K tokens, I’m feeling on top of the world! 💸🔥 I feel like a king! 👑",
    "KEWL just made my day — 1000 $1K tokens in my wallet 🎁💰 I’m the happiest person alive! 😁",
    "Just got 1000 $1K tokens. Feels like I hit a mini jackpot! 💰🎉",
    "My wallet's $1K heavier today. Thanks KEWL 😎💵",
    "Claimed 1000 $1K tokens — felt like getting a crisp stack of cash! 💸💥",
    "This airdrop felt like free money. 1000 $1K in my bag! 🎁💵",
    "1000 $1K tokens received… I swear it feels like real dollars! 💸💎",
    "KEWL just made my day — 1000 $1K tokens straight to my wallet! ✨💰",
    "I don't know what's better — free tokens or how $1K feels like $1,000! 💥💰",
    "1000 $1K tokens dropped like it's payday 🔥💸",
    "KEWL airdropped 1000 $1K and I feel RICH 💰💥",
    "Wallet update: +1000 $1K. Emotion: like I won $1000! 🎉💵",
    "Big thank you to KEWL for the 1000 $1K tokens. Time to party! 🥳💰",
    "Got 1000 $1K tokens today, this airdrop is the real deal! 🚀💸",
    "Nothing beats free money — 1000 $1K tokens in my wallet 💥💰",
    "KEWL knows how to treat its users! 1000 $1K tokens in my bag 🎁💵",
    "My wallet is smiling today with 1000 $1K tokens 😁💰",
    "1000 $1K tokens? KEWL, you just made my week 🙌💸",
    "Today’s highlight: 1000 $1K tokens from KEWL. Blessings! ✨💰",
    "Feels like a win! 1000 $1K tokens straight to my wallet 🏆💵",
    "Just got my hands on 1000 $1K tokens, this is pure gold! 💎💰",
    "Claimed 1000 $1K tokens — feels like I’m living the dream 💭💸",
    "KEWL airdrop, 1000 $1K tokens, and I’m on cloud nine ☁️💰",
    "Big thanks to KEWL for the 1000 $1K tokens! I’m rich now 😉💵",
    "1000 $1K tokens just landed in my wallet. It’s payday! 💸🎉",
    "I don’t need a lottery when I have 1000 $1K tokens from KEWL 🎰💰",
    "1000 $1K tokens… feels like KEWL just handed me a small fortune 💵💥",
    "Got myself 1000 $1K tokens. Time to flex! 💪💰",
    "When KEWL drops 1000 $1K tokens, you know it’s a good day 😎💵",
    "Woke up to 1000 $1K tokens in my wallet. This is how dreams come true 🌟💸",
    "Just received 1000 $1K tokens from KEWL. Thank you! 🙌💰",
    "My wallet just got a little fatter with 1000 $1K tokens 🔥💸",
    "KEWL’s 1000 $1K tokens just hit different, it’s like a win every time 🏅💵",
    "Airdrop alert: 1000 $1K tokens in my wallet — feeling unstoppable 🔥💰",
    "Who needs luck when you’ve got 1000 $1K tokens from KEWL? 🍀💸",
    "KEWL just gave me 1000 $1K tokens. I’m living the dream now 🌈💰",
    "Can’t stop smiling after receiving 1000 $1K tokens from KEWL 🎉💵",
    "1000 $1K tokens, and I feel like I just hit the jackpot! 💥💰",
    "1000 $1K tokens in my wallet... this is how you win life 🏆💸",
    "Got 1000 $1K tokens! Best surprise of the year 💰🎁",
    "KEWL just airdropped me 1000 $1K tokens — today’s lucky day! 🍀💵",
    "1000 $1K tokens just hit my wallet like a golden ticket 🎟️💸",
    "This feels like winning the lottery — 1000 $1K tokens dropped in my wallet 💰🎰",
    "1000 $1K tokens today… the future looks bright! 🌟💸",
    "KEWL’s airdrop came through strong! 1000 $1K tokens straight to my wallet 🚀💵",
    "I’m rolling in tokens today — 1000 $1K from KEWL 💥💸",
    "KEWL gave me 1000 $1K tokens and I’m living the life 💰✨",
    "1000 $1K tokens just made my day! This is better than any paycheck 💵🔥",
    "Feeling on top of the world after receiving 1000 $1K tokens 💰🌍",
    "KEWL just dropped 1000 $1K tokens — I feel like a millionaire 💸💥",
    "1000 $1K tokens and I’m all in on this KEWL journey 🚀💰",
    "1000 $1K tokens in my wallet and my smile is worth a million 😁💵",
    "Claimed 1000 $1K tokens — pure joy and money in the bank! 💥💰",
    "1000 $1K tokens just arrived, and I’m feeling like the luckiest person alive 🎉💸",
    "KEWL airdrop? 1000 $1K tokens in my wallet. I’m feeling blessed 🙏💵",
    "Got 1000 $1K tokens today, this is the best kind of freebie 💰🎁",
    "Woke up with 1000 $1K tokens in my wallet. Dream come true! 🌟💸",
    "1000 $1K tokens received — I feel like a financial genius 💡💵",
    "Thanks to KEWL for the 1000 $1K tokens! I’m in love with airdrops 💖💰",
    "1000 $1K tokens in my wallet and I couldn’t be happier 🥳💸",
    "1000 $1K tokens just dropped… I feel richer by the second 💰🔥",
    "Airdrop heaven: 1000 $1K tokens in my account today 🎉💵",
    "1000 $1K tokens and I’m ready to take over the world! 🌍💰",
    "KEWL’s 1000 $1K tokens just made me feel like I’m on top 💥💸",
    "Feeling like a VIP with 1000 $1K tokens from KEWL 💎💰",
    "1000 $1K tokens received today — time to level up! 🚀💸",
    "I don’t need to play the lottery, KEWL just gave me 1000 $1K tokens 🎰💰",
    "1000 $1K tokens from KEWL — this is what dreams are made of 💫💵",
    "Woke up to 1000 $1K tokens — it’s a good day for sure! ☀️💰",
    "1000 $1K tokens, I’m feeling on top of the world! 💸🔥",
    "KEWL just made my day — 1000 $1K tokens in my wallet 🎁💰"
];


export const airdropHashtags: string[] = [
   "#airdrop",
  "#airdrops",
  "#cryptoairdrop",
  "#airdropalert",
  "#freecrypto",
  "#freemoney",
  "#cryptogiveaway",
  "#crypto",
  "#airdrops2025",
  "#airdropshunter",
  "#airdropszn",
  "#airdropincoming",
  "#airdropsupdate",
  "#web3airdrop",
  "#web3giveaway",
  "#web3rewards",
  "#bountycampaign",
  "#freecoins",
  "#cryptorewards",
  "#claimairdrop",
  "#airdroploot",
  "#airdrophunters",
  "#airdropsdaily",
  "#freecryptoalert",
  "#airdropsforyou",
  "#airdropslist",
  "#airdropscampaign",
  "#airdropnews",
  "#airdropprojects",
  "#airdropspecial",
  "#airdropsactive",
  "#airdropshare",
  "#airdropsentry",
  "#cryptoprize",
  "#freetokens",
  "#freecryptoearn",
  "#tokenairdrop",
  "#ethairdrop",
  "#bnbairdrop",
  "#solairdrop",
  "#airdropspot",
  "#airdropready",
  "#claimfreecrypto",
  "#claimrewards",
  "#airdroprush",
  "#cryptoalerts",
  "#airdropshunter2025",
  "#cryptoairdrops2025",
  "#airdropscommunity",
  "#airdropsnow",
  "#airdropspace",
  "#airdropszn2025",
  "#airdropsrush",
  "#defiairdrop",
  "#airdropsclaim",
  "#airdropsfinder",
  "#airdropsfarm",
  "#airdropswave"
  ];


  export const getRandomAirdropHashtag = (limit: number): string => {
    const shuffled = [...airdropHashtags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit).join(' ');
  };


  export const getRandomTweet = async (): Promise<string> => {
    const users = await randomUser(3);
    return `${tweets[Math.floor(Math.random() * tweets.length)]}\n\n${users}\n\n${getRandomAirdropHashtag(3)} #1K$\n\nhttps://kewl.exchange`;
  };
export const generateTweetIntentURL = (tweetText: string): string => {
   
    const encodedTweetText = encodeURIComponent(tweetText);
  
    return `https://x.com/intent/tweet?text=${encodedTweetText}`;
  };

  export type TweetInfo = {
    valid: boolean;
    username: string | null;
    tweetId: string | null;
    packedId: bigint | null;
  };
  
  export const parseTweetUrl = (url: string): TweetInfo | null => {
    const regex = /\/([^\/]+)\/status\/(\d+)/;
    const match = url.match(regex);
  
    if (!match) {
        return { valid: false, username: null, tweetId: null,packedId: null };
    }
  
    const [, username, tweetId] = match;
    const packedId = packTweetAndContributionIds(BigInt(tweetId), BigInt(0));
    return { valid: true, username:username,tweetId: tweetId,packedId: packedId };
  }


// TypeScript Interface Definitions
export interface DecodedTweetID {
    timestamp: number;
    machineId: number;
    sequence: number;
  }
  
  export interface DecodedInput {
    tweetId: bigint;
    claimId: bigint;
    timestamp: number;
  }
  
  // Constants
  const MASK_128_BITS = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"); // 128-bit mask
  // Epoch Constant
  const EPOCH = 1288834974657n; // Twitter Snowflake Epoch in milliseconds
  
  // Function to decode tweet ID
  
  export interface TweetIdComponents {
    timestamp: number;
    machineId: number;
    sequence: number;
    tweetId: bigint;
  }
  
  // Function to decode tweet ID
  export const decodeTweetId = (inputTweetId: string | number | bigint): TweetIdComponents => {
    // Ensure tweetId is of type BigInt
    const tweetId = typeof inputTweetId === "bigint" ? inputTweetId : BigInt(inputTweetId);
  
    // Decode components using BigInt operations
    const timestampBigInt = (tweetId >> 22n) + EPOCH; // Extract timestamp as BigInt
    const timestamp = Number(timestampBigInt); // Convert to number for compatibility
  
    const machineId = Number((tweetId & 0x3FF000n) >> 12n); // Extract Machine ID
    const sequence = Number(tweetId & 0xFFFn); // Extract Sequence Number
  
    return {
      timestamp,
      machineId,
      sequence,
      tweetId, // Return original tweetId as BigInt
    };
  };
  
  // Function to unpack packed data (equivalent to unpackTweetAndUserIds in Solidity)
  export const unpackTweetAndContributionIds = (packedData: bigint): DecodedInput => {
    const tweetId = packedData >> 128n; // Extract the top 128 bits for tweetId
    const claimId = packedData & MASK_128_BITS; // Extract the bottom 128 bits for claimId
  
    // Decode the tweet ID to extract timestamp
    const decodedTweet = decodeTweetId(tweetId);
  
    return {
      tweetId,
      claimId,
      timestamp: decodedTweet.timestamp,
    };
  };
   
  export const packTweetAndContributionIds = (tweetId: bigint, claimId: bigint): bigint => {
    // Pack tweetId and claimId into a single BigInt (left shift tweetId by 128 bits and OR with claimId)
    const packedData = (tweetId << 128n) | claimId;
    console.log(packedData);
    return packedData;
  };