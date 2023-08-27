import axios from 'axios';

const config = {
  name: "boxing",
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
  const boxing = (await axios.get("https://i.imgur.com/AmuVh7a.gif", {
    responseType: "stream"
  })).data;
  const ring = (await axios.get("https://i.imgur.com/OWd9m1i.jpg", {
    responseType: "stream"
  })).data;

  if (args[0] === "create") {
    if (box) {
      return global.api.sendMessage("Một bàn đã được tạo trong nhóm này.", message.threadID, message.messageID);
    }

    const betAmount = parseInt(args[1]);
    if (!betAmount || isNaN(betAmount) || betAmount < 500) {
      return global.api.sendMessage("Bạn cần nhập số tiền đặt cược hợp lệ (tối thiểu 500$).", message.threadID, message.messageID);
    }

    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney < betAmount) {
      return global.api.sendMessage(`Bạn không có đủ tiền để tạo một vòng cá cược với số tiền đặt cược là ${betAmount}$.`, message.threadID, message.messageID);
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

    return global.api.sendMessage(`Một vòng cá cược đã được tạo với số tiền đặt cược là ${betAmount}$. Đang chờ người chơi khác tham gia...`, message.threadID);
  }

  if (args[0] === "join") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("Không có bàn nào có thể vào.", message.threadID, message.messageID);
    }

    if (box.players >= 2) {
      return global.api.sendMessage("Trận đấu đã đủ người, bạn không thể vào.", message.threadID, message.messageID);
    }

    if (box.host.userID === message.senderID) {
      return global.api.sendMessage("Bạn không thể tham gia vòng mà bạn đã tạo.", message.threadID, message.messageID);
    }

    const betAmount = box.bet;
    const playerMoney = await Users.getMoney(message.senderID) || null;
    if (playerMoney < betAmount) {
      return global.api.sendMessage(`Bạn không có đủ tiền để tham gia vòng cá cược này với mức cược là ${betAmount}$.`, message.threadID, message.messageID);
    }

    const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
    box.players += 1;
    box.player = {
      name: name,
      userID: message.senderID,
      choose: null,
    };
    global.boxes.set(message.threadID, box);

    return global.api.sendMessage(`${name} đã tham gia trận đấu. Đang chờ chủ sân bắt đầu trò chơi...`, message.threadID);
  }

  if (args[0] === "fight") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("Không có trận nào để bắt đầu trò chơi.", message.threadID, message.messageID);
    }

    if (box.host.userID !== message.senderID) {
      return global.api.sendMessage("Chỉ có chủ sân mới có thể bắt đầu.", message.threadID, message.messageID);
    }

    if (box.players !== 2) {
      return global.api.sendMessage("Trận đấu phải có đúng 2 người chơi để bắt đầu trò chơi.", message.threadID, message.messageID);
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
        return global.api.sendMessage("Đã xảy ra lỗi khi hiển thị kết quả, vui lòng thừ lại sau.", message.threadID, message.messageID);
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

  if (args[0] === "end") {
    if (!box || box.status !== "waiting") {
      return global.api.sendMessage("Không có trận đấu đang diễn ra để kết thúc.", message.threadID, message.messageID);
    }

    if (box.host.userID !== message.senderID) {
      return global.api.sendMessage("Chỉ chủ sân mới dừng được trận đấu.", message.threadID, message.messageID);
    }

    global.api.sendMessage("Chủ sân đã kết thúc trận đấu.", message.threadID);
    global.boxes.delete(message.threadID);
  }

  if (!args[0]) {
    global.api.sendMessage({
      body: "1. bx create <số tiền đặt cược> => Tạo võ đài quyền anh có đặt cược.\n2. bx join => Tham gia võ đài quyền anh hiện có.\n3. bx fight => Bắt đầu trận đấu quyền anh (chỉ dành cho người tổ chức).\n4. bx end => Kết thúc võ đài (chỉ dành cho chủ sân).",
      attachment: ring,
    }, message.threadID);
  }
}

export default {
  config,
  onCall
  }