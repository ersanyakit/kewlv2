


export const TWITTER_USERS = async (): Promise<any[]> => {
    try {
      const response = await fetch("/data/twitter_accounts.json");
      if (!response.ok) {
        throw new Error("Failed to fetch twitter accounts");
      }
  
      const data = await response.json();
      console.log("ERSAN",data)
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching twitter accounts:", error);
      return [];
    }
  };
  
  export const EMOJIS = [
      "😊", "🚀", "🔥", "💎", "💰", "⚡", "🌍", "🎉", "🌟", "💡", "✨", "💥", 
      "🌈", "💯", "👑", "🎯", "🚨", "🤑", "👀", "🥇", "💬", "🎵", "⚔️", "🍀", 
      "📈", "💪", "🏆", "💥", "🌠", "🌙", "🦄", "🥂", "🎁", "🔑", "🍾", "🔮", 
      "🥳", "🎬", "🔔", "👑", "🌸", "🔥", "🍀", "💃", "🏅", "🏖️", "🏄‍♂️", "🧠", 
      "💭", "🤩", "🎮", "🦸‍♀️", "🦸‍♂️", "🕹️", "🍕", "🍔", "🍩", "🌮", "🍿"
    ];
  
 
  