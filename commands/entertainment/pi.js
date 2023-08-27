import axios from 'axios';

const config = {
  name: "pi",
  aliases: ["bx", "box"],
  description: "Play a boxing game with another player.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Dymyrius",
}

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  global.boxes || (global.boxes = new Map());
  const box = global.boxes.get(message.threadID);
  const boxing = (await axios.get("https://i.imgur.com/", {
    responseType: "stream"
  })).data;
  const ring = (await axios.get("https://i.ibb.co/5s8dtz9/xva213.jpg", {
    responseType: "stream"
  })).data;

  if (args[0] === "kyc") {
    if (box) {
      return global.api.sendMessage("Đợi tao code tiếp.", message.threadID, message.messageID);
    }

    const betAmount = parseInt(args[1]);
    if (!betAmount || isNaN(betAmount) || betAmount < 500) {
      return global.api.sendMessage("Đợi tao code tiếp.", message.threadID, message.messageID);
    }

    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney < betAmount) {
      return global.api.sendMessage(`Đợi tao code tiếp.`, message.threadID, message.messageID);
    }

    const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
    global.boxes.set(message.threadID, {
      host: {
        name: name,
        userID: message.senderID,
        choose: null,
      },
      bet: betAmount,
      status: "waiting",
      players: 1,
    });

    return global.api.sendMessage(`Đợi tao code tiếp.`, message.threadID);
  }

  if (args[0] === "dao") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("Đợi tao code tiếp.", message.threadID, message.messageID);
    }

    if (box.players >= 2) {
      return global.api.sendMessage("Đợi tao code tiếp.", message.threadID, message.messageID);
    }

    if (box.host.userID === message.senderID) {
      return global.api.sendMessage("Đợi tao code tiếp.", message.threadID, message.messageID);
    }

    const betAmount = box.bet;
    const playerMoney = await Users.getMoney(message.senderID) || null;
    if (playerMoney < betAmount) {
      return global.api.sendMessage(`Đợi tao code tiếp.`, message.threadID, message.messageID);
    }

    const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
    box.players += 1;
    box.player = {
      name: name,
      userID: message.senderID,
      choose: null,
    };
    global.boxes.set(message.threadID, box);

    return global.api.sendMessage(`Đợi tao code tiếp.`, message.threadID);
  }

  if (args[0] === "mamoi") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("mã mời ngdytn221", message.threadID, message.messageID);
    }

    if (box.host.userID !== message.senderID) {
      return global.api.sendMessage("mã mời ngdytn221.", message.threadID, message.messageID);
    }

    if (box.players !== 2) {
      return global.api.sendMessage("mã mời ngdytn221", message.threadID, message.messageID);
    }

    box.status = "playing";
    global.boxes.set(message.threadID, box);

    const choices = ["punch", "block"];
    const hostChoice = choices[Math.floor(Math.random() * choices.length)];
    const playerChoice = choices[Math.floor(Math.random() * choices.length)];

    box.host.choose = hostChoice;
    box.player.choose = playerChoice;

    global.api.sendMessage({
      body: `Trận đấu đã bắt đầu!\n${box.host.name} chọn: ` + hostChoice + `\n${box.player.name} chọn: ` + playerChoice,
      attachment: boxing,
    }, message.threadID, async (err, data) => {
      if (err) {
        return global.api.sendMessage("Đợi tao code tiếp.", message.threadID, message.messageID);
      }

      setTimeout(async function () {
        api.unsendMessage(data.messageID);

        let resultMsg;
        let winnerName;
        let winnerID;
        let loserID;
        let betWon;

        if ((hostChoice === "punch" && playerChoice === "block") || (hostChoice === "block" && playerChoice === "punch")) {
          winnerName = box.host.name;
          winnerID = box.host.userID;
          loserID = box.player.userID;
          betWon = box.bet;
          resultMsg = "Trận đấu đã kết thúc! " + winnerName + " thắng trận đấu và kiếm được " + betWon + "$!";
        } else {
          winnerName = box.player.name;
          winnerID = box.player.userID;
          loserID = box.host.userID;
          betWon = box.bet;
          resultMsg = "Trận đấu đã kết thúc! " + winnerName + " thắng trận đấu và kiếm được " + betWon + "$!";
        }

        await Users.increaseMoney(winnerID, betWon);
        await Users.decreaseMoney(loserID, betWon);

        global.api.sendMessage(resultMsg, message.threadID);
        global.boxes.delete(message.threadID);
      }, 4000);
    });
  }

  if (args[0] === "gia") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("1 pi=7 tỉ", message.threadID, message.messageID);
    }

    if (box.host.userID !== message.senderID) {
      return global.api.sendMessage("Chỉ chủ sân mới dừng được trận đấu.", message.threadID, message.messageID);
    }

    global.api.sendMessage("Chủ sân đã kết thúc trận đấu.", message.threadID);
    global.boxes.delete(message.threadID);
  }

  if (!args[0]) {
    global.api.sendMessage({
      body: "1.  dao \n2. pi gia \n3. pi mamoi \n4. pi kyc",
      attachment: ring,
    }, message.threadID);
  }
}

export default {
  config,
  onCall
  }