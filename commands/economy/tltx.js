import axios from 'axios';

const config = {
  name: "tltx",
  aliases: ["txnng", "cl"],
  description: "Play odd-even with multiple people!",
  usage: "",
  cooldown: 5,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Sies + WaifuCat",
}

const { api } = global;

async function onCall({ message, args, extra, data, userPermissions }) {
  try {
    const { senderID, threadID, messageID, body, send, reply } = message;
    const { Users } = global.controllers;
    global.chanle || (global.chanle = new Map);
    var bcl = global.chanle.get(message.threadID);
    const anhbcl = (await axios.get("https://i.imgur.com/LClPl36.jpg", {
      responseType: "stream"
    })).data;

    switch (args[0]) {
      case "create": {
        if (!args[1] || isNaN(args[1])) return global.api.sendMessage("[⚜️] ➜ Vui lòng nhập số tiền đặt cược!", message.threadID, message.messageID);
        if (parseInt(args[1]) < 5000) return global.api.sendMessage("[⚜️] ➜ Số tiền phải lớn hơn hoặc bằng 5000", message.threadID, message.messageID);
        const userMoney = await Users.getMoney(message.senderID) || null;
        if (userMoney < parseInt(args[1])) return global.api.sendMessage(`[⚜️] ➜ Bạn không đủ ${args[1]} để chơi!`, message.threadID, message.messageID);
        if (global.chanle.has(message.threadID)) return global.api.sendMessage("[⚜️] ➜ Nhóm đã có phòng!", message.threadID, message.messageID);
        const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
        return global.chanle.set(message.threadID, {
          box: message.threadID,
          start: false,
          author: message.senderID,
          player: [{
            name: name,
            userID: message.senderID,
            choose: {
              status: false,
              msg: null
            }
          }],
          money: parseInt(args[1])
        }), global.api.sendMessage("[⚜️] ➜ Đã tạo thành công một bàn với số tiền đặt cược là: " + args[1], message.threadID);
      }

      case "join": {
        if (!global.chanle.has(message.threadID)) return global.api.sendMessage("[⚜️] ➜ Nhóm này không có bàn nào đang hoạt động!\n[⚜️] ➜ Hãy tạo một bàn để chơi!", message.threadID, message.messageID);
        if (bcl.start === 1) return global.api.sendMessage("[⚜️] ➜ Nhóm đã có 1 bàn", message.threadID, message.messageID);
        const playerMoney = await Users.getMoney(message.senderID) || null;
        if (playerMoney < bcl.money) return global.api.sendMessage(`[⚜️] ➜ Bạn không có đủ tiền để tham gia ${bcl.money}$`, message.threadID, message.messageID);
        const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
        if (bcl.player.find((player) => player.userID === message.senderID)) return global.api.sendMessage("[⚜️] ➜ Bạn đã ở trong phòng!", message.threadID, message.messageID);
        return bcl.player.push({
          name: name,
          userID: message.senderID,
          choose: {
            status: false,
            msg: null
          }
        }), global.chanle.set(message.threadID, bcl), global.api.sendMessage(`[⚜️] ➜ Bạn đã tham gia bàn\n[⚜️] ➜ Số người chơi: ${bcl.player.length}`, message.threadID, message.messageID);
      }

      case "start":
        return bcl ? bcl.author !== message.senderID ? global.api.sendMessage("[⚜️] ➜ Bạn không phải chủ bàn!", message.threadID, message.messageID) : bcl.player.length <= 1 ? global.api.sendMessage("[⚜️] ➜ Bàn không có đủ thành viên để bắt đầu", message.threadID, message.messageID) : bcl.start === 1 ? global.api.sendMessage("[⚜️] ➜ Bàn đã được bắt đầu!", message.threadID, message.messageID) : (bcl.start = true, global.chanle.set(message.threadID, bcl), global.api.sendMessage(`[⚜️] ➜ Trò chơi đã được bắt đầu\n\n[⚜️] ➜ Số người chơi: ${bcl.player.length}\n\n[⚜️] ➜ Hãy chat "Even" or "Odd"`, message.threadID)) : global.api.sendMessage("[⚜️] Nhóm này chưa có bàn nào!\n[⚜️] ➜ Hãy tạo một bàn để chơi!", message.threadID, message.messageID);

      case "end":
        return bcl ? bcl.author !== message.senderID ? global.api.sendMessage("[⚜️] ➜ You are not the room owner!", message.threadID, message.messageID) : (global.chanle.delete(message.threadID), global.api.sendMessage("[⚜️] ➜ Room has been deleted!", message.threadID, message.messageID)) : global.api.sendMessage("[⚜️] ➜ This group does not have any active rooms yet!\n[⚜️] ➜ Create a room to play!", message.threadID, message.messageID);

      case "out":
        if (!global.chanle.has(message.threadID)) return api.sendMessage('[⚜️] ➜ Không có bàn nào đang hoạt động', message.threadID, message.messageID);
        if (!bcl.player.find((player) => player.userID === message.senderID)) return api.sendMessage('[⚜️] ➜ Bạn không ở trong bàn!', threadID, messageID);
        if (bcl.start === true) return api.sendMessage('[⚜️] ➜ Bạn không thể rời khỏi một bàn vừa mới bắt đầu!', threadID, messageID);
        if (bcl.author === message.senderID) {
          global.chanle.delete(message.threadID);
          const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
          return global.api.sendMessage('[⚜️] ➜ Thành viên <' + name + '> đã rời bàn!', message.threadID, message.messageID);
        }
        else {
          bcl.player.splice(bcl.player.findIndex((player) => player.userID === message.senderID), 1);
          global.chanle.set(message.threadID, bcl);
          const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
          global.api.sendMessage('[⚜️] ➜ Thành công thoát phòng!', message.threadID, message.messageID);
          return global.api.sendMessage('[⚜️] ➜ Thành viên <' + name + '> đã rời khỏi bàn!\n[⚜️] ➜ Hiện tại, đã có ' + bcl.player.length + ' người chơi ở trong phòng', message.threadID);
        }
        
      default:
        return global.api.sendMessage({
          body: "[⚜️] Chơi tài xỉu với nhiều người [⚜️]\n[⚜️] ➜ Dùng 'create <số tiền>' để tham gia phòng\n[⚜️] ➜ Dùng 'join' để tham gia phòng\n[⚜️] ➜ Dùng 'start' để bắt đầu bàn\n[⚜️] ➜ Dùng 'end' để kết thúc bàn",
          attachment: anhbcl
        }, message.threadID, message.messageID);
    }
  } catch (e) {
    message.send("Error: " + e);
    console.error(e);
  }
}

export default {
  config,
  onCall
}
