
const config = {
  "name": "giveaway",
  "aliases": ["gv"],
  "description": "Giveaway box",
  "usage": "",
  "cooldown": 3,
  "permissions": [2],
  "credits": "WaifuCat",
  "extra": {}
};

export async function onCall({ message, args }) {
  const { Users } = global.controllers;
  const targetID = message.senderID;

  global.api.getThreadInfo(message.threadID, async (err, info) => {
    if (err) {
      console.error(err);
      return;
    }

    switch (args[0]) {
      case 'random':
        const memberIDs = info.participantIDs.filter(id => id !== global.botID);
        
        for (const memberID of memberIDs) {
          const randomAmount = Math.floor(Math.random() * 10001); 
          await Users.increaseMoney(memberID, randomAmount);
        }
        
        message.reply('[⚜️] ➜ Đã cộng số tiền ngẫu nhiên cho tất cả mọi người!');
        break;

      case 'amount':
        const amount = parseFloat(args[1]); 
        if (!isNaN(amount)) {
          const memberIDs = info.participantIDs.filter(id => id !== global.botID);
          
          for (const memberID of memberIDs) {
            await Users.increaseMoney(memberID, amount);
          }
          
          message.reply(`[⚜️] ➜ Đã cộng ${amount} tiền cho tất cả mọi người!`);
        } else {
          message.reply('[⚜️] ➜ Số tiền không hợp lệ.');
        }
        break;

      default:
        message.reply('[⚜️] Menu Hướng Dẫn Sử Dụng [⚜️] \n➜ Dùng lệnh kèm "random" để giveaway số tiền ngẫu nhiên cho mọi người.\n➜ Dùng lệnh kèm "amount <coin>" để giveaway số <coin> cho mọi người.');
        break;
    }
  });
}

export default {
  config,
  onCall
};
