import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "pokemon",
  aliases: ["poke"],
  description: "Play Pokémon game.",
  usage: "",
  cooldown: 5,
  credits: "Dymyrius, (Duy Tuấn việt hóa)"
};

const langData = {
  "en_US": {
    "pokemon.battleWin": "Congratulations! You defeated {opponent} and won the battle!",
    "pokemon.challenge": "You've challenged {opponent} to a Pokémon battle! Place your bet using `pokemon challenge @user <betAmount>`.",
    "pokemon.noPokémon": "You don't have any Pokémon. Use `pokemon buy` to buy one.",
    "pokemon.buySuccess": "Congratulations! You've purchased a Pokémon named {pokemonName}!",
    "pokemon.buyFailure": "You don't have enough credits to buy a Pokémon.",
    "pokemon.feedSuccess": "You fed your {pokemonName}! Its level has increased to {newLevel}.",
    "pokemon.feedFailure": "You don't have any Pokémon to feed.",
    "pokemon.checkStatus": "Pokémon Name: {pokemonName}\nLevel: {pokemonLevel} 🆙\nPower Level: {pokemonPower} ⬆️\nPokemon Value: ₱{pokemonValue} 🪙",
    "pokemon.menuOptions": "◦❭❯❱【Pokémon Battle Game】❰❮❬◦\n\n1. `pokemon battle` » Start a battle with your Pokémon.\n2. `pokemon list` » List available Pokémon names.\n3. `pokemon buy <Pokémon name>` » Buy Pokémon.\n4. `pokemon feed` » Feed your Pokémon.\n5. `pokemon check` » Check your Pokémon information.\n6. `pokemon challenge @user` » Challenge another user to a Pokémon battle.\n7. `pokemon trade @user` » Trade Pokémon with another user.\n8. `pokemon accept @user` » Accept the trade from another user.\n9. `pokemon collect` » Collect the increased value of your Pokémon.\n10. `pokemon release` » To release your current Pokémon."
  },
  "vi_VN": {
    "pokemon.battleWin": "Chúc mừng! Bạn đã đánh bại {opponent} và chiến thắng!",
    "pokemon.challenge": "Bạn đã thách đấu {opponent} trong trận Pokémon! Đặt cược của bạn bằng cách sử dụng `pokemon challenge @user <số tiền cược>`.",
    "pokemon.noPokémon": "Bạn không có bất kỳ Pokémon nào. Sử dụng `pokemon buy` để mua một con.",
    "pokemon.buySuccess": "Xin chúc mừng! Bạn đã mua một con Pokémon tên là {pokemonName}!",
    "pokemon.buyFailure": "Bạn không có đủ tiền để mua một con Pokémon.",
    "pokemon.feedSuccess": "Bạn đã cho ăn {pokemonName}! Cấp độ của nó đã tăng lên thành {newLevel}.",
    "pokemon.feedFailure": "Bạn không có bất kỳ Pokémon nào để cho ăn.",
    "pokemon.checkStatus": "Tên Pokémon: {pokemonName}\nCấp độ: {pokemonLevel} 🆙\nSức mạnh: {pokemonPower} ⬆️\nGiá trị Pokémon: ₱{pokemonValue} 🪙",
    "pokemon.menuOptions": "◦❭❯❱【Trò Chơi Pokémon】❰❮❬◦\n\n1. `pokemon battle` » Bắt đầu trận đấu với Pokémon của bạn.\n2. `pokemon list` » Liệt kê tên Pokémon có sẵn.\n3. `pokemon buy` » Mua Pokémon.\n4. `pokemon feed` » Cho ăn cho Pokémon của bạn.\n5. `pokemon check` » Xem thông tin Pokémon của bạn.\n6. `pokemon challenge @user` » Thách đấu một người dùng khác trong trận Pokémon.\n7. `pokemon trade @user` » Giao dịch Pokémon với người dùng khác.\n8. `pokemon accept @user` » Chấp nhận giao dịch từ người dùng khác.\n9. `pokemon collect` » Thu thập giá trị tăng thêm của Pokémon của bạn.\n10. `pokemon release` » Thả Pokémon hiện tại của bạn."
  },
  // Add translations for other languages if needed
};

const valueIncreaseInterval = 3 * 60 * 1000; // 3 minutes in milliseconds
const battleCooldownDuration = 30 * 1000; // 2 minutes in milliseconds

setInterval(() => {
  for (const [userID, userPokemon] of userPokémon.entries()) {
    const increaseAmount = 30000; // Value increase amount
    // Increase the value of the Pokémon
    userPokemon.value = (userPokemon.value || 0) + increaseAmount;
  }

  const currentTime = Date.now();
  for (const [userID, lastBattleTime] of lastBattleTimestamps.entries()) {
    if (currentTime - lastBattleTime >= battleCooldownDuration) {
      lastBattleTimestamps.delete(userID); // Reset cooldown
    }
  }
  
  saveUserPokémon(); // Save the updated values
}, valueIncreaseInterval);

const pokemonNames = ["Pikachu", "Charmander", "Marill", "Squirtle", "Bulbasaur", "Meowth", "Vulpix", "Growlithe", "Vaporeon", "Sylveon", "Cyndaquil", "Totodile", "Piplup", "Froakie"];
const pokemonImages = [
  "https://i.imgur.com/ubgz6BV.jpg",
  "https://i.imgur.com/VProBXh.png",
  "https://i.imgur.com/nWW89IE.png",
  "https://i.imgur.com/P6hqkF8.png",
  "https://i.imgur.com/euJWYgU.png",
  "https://i.imgur.com/FORB3IB.jpg",
  "https://i.imgur.com/wkIjaxK.jpg",
  "https://i.imgur.com/Ab9FEkd.jpg",
  "https://i.imgur.com/0wJNEPw.png",
  "https://i.imgur.com/lvYgtKZ.png",
  "https://i.imgur.com/DHfXXpD.jpg",
  "https://i.imgur.com/zOsaStd.jpg",
  "https://i.imgur.com/RnLUht5.jpg",
  "https://i.imgur.com/AZH78aA.jpg"
];

let lastBattleTimestamps = new Map();
let tradeRequests = new Map();
let lastFeedTimestamps = new Map();
let userPokémon = new Map();
const PATH = join(global.assetsPath, 'user_pokemon.json');

function loadUserPokémon() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    const parsedData = JSON.parse(data);
    userPokémon = new Map(parsedData.userPokémon);
    lastFeedTimestamps = new Map(parsedData.lastFeedTimestamps);
  } catch (err) {
    console.error('Ko thể load dữ liệu pokemon người dùng', err);
  }
}

function saveUserPokémon() {
  try {
    const data = JSON.stringify({
      userPokémon: Array.from(userPokémon),
      lastFeedTimestamps: Array.from(lastFeedTimestamps)
    });
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Thất bại lưu dữ liệu pokemon người dùng', err);
  }
}

function calculatePokemonPower(level) {
  // Assume some attributes that contribute to power
  const basePower = 10; // A base power value
  const levelMultiplier = 5; // A multiplier based on level
  const otherAttributes = 2; // Additional attributes that contribute to power

  // Calculate the power using the attributes
  const power = basePower + (level * levelMultiplier) + otherAttributes;

  return power;
}

loadUserPokémon();

async function onCall({ message, getLang, args }) {
  const { Users } = global.controllers;
  const pokemonImage = (await axios.get("https://i.imgur.com/DwnkPFD.png", {
    responseType: "stream"
  })).data;
  const battleCheckingGif = (await axios.get("https://i.imgur.com/vdgFO0w.gif", {
    responseType: "stream"
  })).data;
  const battle = (await axios.get("https://i.imgur.com/fZgCYe2.gif", {
    responseType: "stream"
  })).data;
  const levelup = (await axios.get("https://i.imgur.com/VIp6w8l.gif", {
    responseType: "stream"
  })).data;

  if (!message || !message.body) {
    console.error('Invalid message object or message body!');
    return;
  }

  const { senderID, mentions } = message;
  const mentionedUserID = Object.keys(mentions)[0]; // Get the user ID of the mentioned user
  const mentionedUser = await global.controllers.Users.getInfo(mentionedUserID); // Retrieve mentioned user's information

  if (args.length === 0 || args[0] === "menu") {
    const menuOptions = getLang("pokemon.menuOptions");
    return message.reply({
      body: menuOptions,
      attachment: pokemonImage
    });
  }

  if (args[0] === "buy") {
    if (userPokémon.has(senderID)) {
      return message.reply("Bạn đã có Pokémon.  Nếu bạn muốn có một cái mới, bạn có thể thả Pokémon hiện tại của mình bằng cách sử dụng `pokemon release`.");
    }
  
    const pokemonPrice = 100000;
    const userBalance = await Users.getMoney(senderID);
  
    if (userBalance < pokemonPrice) {
      return message.reply(getLang("pokemon.buyFailure"));
    }
  
    const requestedPokemonName = args[1].toLowerCase(); // Convert to lowercase
    const pokemonIndex = pokemonNames.findIndex(name => name.toLowerCase() === requestedPokemonName);
  
    if (pokemonIndex === -1) {
      return message.reply(`Xin lỗi, mặt hàng Pokémon "${args[1]}" hiện không khả dụng.`);
    }
  
    const randomPokemonName = pokemonNames[pokemonIndex];
    const randomPokemonImageURL = pokemonImages[pokemonIndex];
  
    const imageResponse = await axios.get(randomPokemonImageURL, {
      responseType: "stream"
    });
  
    await Users.decreaseMoney(senderID, pokemonPrice);
    userPokémon.set(senderID, { name: randomPokemonName, level: 1 });
    saveUserPokémon();
  
    const buySuccessMessage = getLang("pokemon.buySuccess").replace("{pokemonName}", randomPokemonName);
  
    return message.reply({
      body: buySuccessMessage,
      attachment: imageResponse.data
    });
  }

  if (args[0] === "feed") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.feedFailure"));
    }

    const userPokemon = userPokémon.get(senderID);
    const currentLevel = userPokemon.level;
    const maxLevel = 10; // Assuming the maximum level is 10

    if (currentLevel >= maxLevel) {
      return message.reply("Pokemon của bạn đã đạt cấp tối đa!");
    }

    const lastFeedTime = lastFeedTimestamps.get(senderID) || 0;
    const currentTime = Date.now();
    const cooldownDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    const timeSinceLastFeed = currentTime - lastFeedTime;

    if (timeSinceLastFeed < cooldownDuration) {
      const remainingCooldown = cooldownDuration - timeSinceLastFeed;
      const remainingCooldownHours = Math.floor(remainingCooldown / (60 * 60 * 1000));
      const remainingCooldownMinutes = Math.ceil((remainingCooldown % (60 * 60 * 1000)) / (60 * 1000));

      return message.reply(`Pokémon của bạn đã đầy và cần thời gian để tiêu hóa.  Bạn có thể cho nó ăn lại ${remainingCooldownHours} giờ và ${remainingCooldownMinutes} phút.`);
    }

    // Increase the Pokémon's level by 1
    userPokemon.level += 1;
    saveUserPokémon();

    // Update the last feed timestamp
    lastFeedTimestamps.set(senderID, currentTime);

    const feedSuccessMessage = getLang("pokemon.feedSuccess")
      .replace("{pokemonName}", userPokemon.name)
      .replace("{newLevel}", userPokemon.level);

    return message.reply({
      body: feedSuccessMessage,
      attachment: levelup
    });
  }

  if (args[0] === "check") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    const userPokemon = userPokémon.get(senderID);
    const checkStatusMessage = getLang("pokemon.checkStatus")
      .replace("{pokemonName}", userPokemon.name)
      .replace("{pokemonLevel}", userPokemon.level)
      .replace("{pokemonPower}", calculatePokemonPower(userPokemon.level)) // Display power here
      .replace("{pokemonValue}", userPokemon.value || 0); // Display value here

    const pokemonIndex = pokemonNames.indexOf(userPokemon.name);
    if (pokemonIndex !== -1) {
      const pokemonImageURL = pokemonImages[pokemonIndex];
      const imageResponse = await axios.get(pokemonImageURL, {
        responseType: "stream"
      });

      return message.reply({
        body: checkStatusMessage,
        attachment: imageResponse.data
      });
    } else {
      return message.reply(checkStatusMessage);
    }
  }

  if (args[0] === "list") {
    const availablePokémonList = pokemonNames.map(name => `• ${name}`).join("\n");
    const listMessage = `Đây là danh sách các Pokémon có sẵn\n\n${availablePokémonList}`;
    return message.reply(listMessage);
  }


  if (args[0] === "battle") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }
  
    if (args.length < 2) {
      return message.reply("Vui lòng chỉ định số tiền đặt cược cho trận chiến.");
    }
  
    // Check cooldown for battles
    const lastBattleTime = lastBattleTimestamps.get(senderID) || 0;
    const currentTime = Date.now();
    const battleCooldownDuration = 2 * 60 * 1000; // 2 minutes in milliseconds
  
    if (currentTime - lastBattleTime < battleCooldownDuration) {
      const remainingCooldown = battleCooldownDuration - (currentTime - lastBattleTime);
      const remainingMinutes = Math.ceil(remainingCooldown / (60 * 1000));
  
      return message.reply(`Bạn phải đợi ${remainingMinutes} trước khi gạ tiếp.`);
    }
  
    const betAmount = parseFloat(args[1]);
  
    if (isNaN(betAmount)) {
      return message.reply("Số tiền đặt cược không hợp lệ.  Vui lòng cung cấp số tiền hợp lệ.");
    }
  
    const userBalance = await Users.getMoney(senderID);
  
    if (betAmount > userBalance) {
      return message.reply("Bạn không có đủ tiền để cược");
    }
  
    // Update last battle timestamp
    lastBattleTimestamps.set(senderID, currentTime);
  
    const opponentPokémonLevel = Math.floor(Math.random() * 10) + 1; // Generate a random level for the opponent's Pokémon
    const userPokémonLevel = userPokémon.get(senderID).level;
  
    const battleResult = userPokémonLevel > opponentPokémonLevel;
    const battleResultMessage = battleResult
      ? `Chúc mừng!  Pokémon của bạn đã đánh bại Pokémon của đối thủ.  \n― Bạn đã thắng ${betAmount}!.`
      : `Ôi không!  Pokémon của bạn đã bị đánh bại bởi Pokémon của đối thủ.  \n― Bạn đã thuat ${betAmount}!.`;
  
    // Update user balance based on battle outcome
    if (battleResult) {
      await Users.increaseMoney(senderID, betAmount);
    } else {
      await Users.decreaseMoney(senderID, betAmount);
    }
  
    const battleCheckingMessage = await message.reply({
      body: "Kiểm tra kết quả đấu..",
      attachment: battle
    });
  
    setTimeout(() => {
      message.reply(battleResultMessage);
      if (global.api && global.api.unsendMessage) {
        global.api.unsendMessage(battleCheckingMessage.messageID);
      }
    }, 3000);
  
    return;
  }

  if (args[0] === "challenge") {
    if (!mentionedUser) {
      return message.reply("Bạn cần tag người dùng để gạ.");
    }

    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    if (!userPokémon.has(mentionedUserID)) {
      return message.reply(`${mentionedUser.name} không có pokemon để đấu`);
    }

    let betAmount = parseFloat(args[args.length - 1]); // Changed the index to -1

    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply("Số tiền đặt cược không hợp lệ.  Vui lòng cung cấp số tiền hợp lệ.");
    }

    const userBalance = await Users.getMoney(senderID);

    if (betAmount > userBalance) {
      return message.reply("Bạn không đủ tiền để cược.");
    }

    const challengeMessage = getLang("pokemon.challenge").replace("{opponent}", mentionedUser.name);

    const senderInfo = await global.controllers.Users.getInfo(senderID); // Get sender's information
    const checkingMessage = await message.reply({
      body: "Kiểm tra kết quả trận đấu...",
      attachment: battleCheckingGif
    });

    setTimeout(async () => {
      const challengeResult = Math.random() < 0.1; // 10% chance of success
      const winAmount = betAmount * 2;

      if (challengeResult) {
        await Users.increaseMoney(senderID, winAmount);
        await Users.decreaseMoney(mentionedUserID, betAmount);
      } else {
        await Users.decreaseMoney(senderID, betAmount);
        await Users.increaseMoney(mentionedUserID, betAmount);
      }

      const challengeResultMessage = challengeResult
        ? `Chúc mừng!  Pokémon của bạn đã thắng với ${mentionedUser.name}'s Pokémon.\n― Bạn đã húp ₱${winAmount}. 🪙`
        : `Pokémon của bạn đã thua ${mentionedUser.name}'s Pokémon.\n― Bạn bị nó nuốt ₱${betAmount}.`;

      await message.reply(challengeResultMessage);

      if (global.api && global.api.unsendMessage) {
        await global.api.unsendMessage(checkingMessage.messageID);
      }
    }, 4000);

    return;
  }

  if (args[0] === "trade") {
    if (!mentionedUser) {
      return message.reply("Bạn cần tag người muốn trao đổi.");
    }

    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    if (!userPokémon.has(mentionedUserID)) {
      return message.reply(`Người dùng ${mentionedUser.name} không có pokemon để trao đổi`);
    }

    tradeRequests.set(mentionedUserID, senderID); // Store the trade request with the target user's ID

    return message.reply(`Giao dịch trao đổi với ${mentionedUser.name}. Người dùng khác phải gõ "pokemon accept" để xác nhận.`);
  }

  if (args[0] === "accept") {
    if (!tradeRequests.has(senderID)) {
      return message.reply("Không có yêu cầu trao đổi.");
    }

    const initiatorID = tradeRequests.get(senderID);
    if (initiatorID !== mentionedUserID) {
      return message.reply("Không có yêu cầu trao đổi từ người dùng này.");
    }

    // Swap Pokémon between the users
    const userPokemon = userPokémon.get(senderID);
    const mentionedUserPokemon = userPokémon.get(mentionedUserID);
    userPokémon.set(senderID, mentionedUserPokemon);
    userPokémon.set(mentionedUserID, userPokemon);
    saveUserPokémon();

    tradeRequests.delete(senderID); // Clear the trade request

    return message.reply(`Trao đổi thành công! Bạn đã nhận được ${mentionedUser.name}'s Pokémon.`);
  }

  if (args[0] === "collect") {
    if (!userPokémon.has(senderID)) {
      return message.reply(getLang("pokemon.noPokémon"));
    }

    const userPokemon = userPokémon.get(senderID);
    if (!userPokemon.value || userPokemon.value === 0) {
      return message.reply("Không có tiền để thu thập cho Pokémon của bạn.");
    }

    const userBalance = await Users.getMoney(senderID);
    const collectAmount = userPokemon.value;

    await Users.increaseMoney(senderID, collectAmount);
    userPokemon.value = 0; // Reset the collected value
    saveUserPokémon();

    const collectMessage = `Bạn đã ăn chặn được ₱${collectAmount} tiền từ pokemon của bạn`;
    return message.reply(collectMessage);
  }

  if (args[0] === "release") {
    if (!userPokémon.has(senderID)) {
      return message.reply("Bạn không có pokemon để thả.");
    }

    // Remove the user's current Pokémon
    userPokémon.delete(senderID);
    saveUserPokémon();

    const releaseMessage = "Bạn đã thả Pokémon của mình.  Bây giờ bạn có thể mua một cái mới bằng cách sử dụng `pokemon buy`.";
    return message.reply(releaseMessage);
  }

  // If the command is not recognized, show the menu
  const menuOptions = getLang("pokemon.menuOptions");
  return message.reply(menuOptions);
}

export default {
  config,
  langData,
  onCall
};