
import axios from 'axios';

const config = {
  name: 'bank',
  aliases: ["bk", "b", "banking"],
  description: 'Bank Online',
  usage: '<Use command to show menu>',
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

const langData = {
  "en_US": {
    "no.account": "[⚜️] ➜ You don't have an account yet!",
    "have.account": "[⚜️] ➜ You already have an account!",
    "error": "[⚜️] ➜ Error, please try again!",
    "success": "[⚜️] ➜ Successful!",
    "fail": "[⚜️] ➜ Failed!",
    "no.money": "[⚜️] ➜ You don't have enough money!",
    "menu": "[⚜️] ➜ Menu using commands:\n1. Register an account: register <name>\n2. Withdraw money: withdraw <amount>\n3. Deposit money: deposit <amount>\n4. Rename account: rename <new name>\n5. Info account: check"
  },
  "vi_VN": {
    "no.account": "[⚜️] ➜ Bạn chưa có tài khoản!",
    "have.account": "[⚜️] ➜ Bạn đã có tài khoản!",
    "error": "[⚜️] ➜ Lỗi, vui lòng thử lại!",
    "success": "[⚜️] ➜ Thành công!",
    "fail": "[⚜️] ➜ Thất bại!",
    "no.money": "[⚜️] ➜ Bạn không đủ tiền!",
    "menu": "[⚜️] Hướng Dẫn Sử Dụng [⚜️]\n1. Tạo tài khoản: register <tên>\n2. Rút tiền: withdraw <số tiền>\n3. Nạp tiền: deposit <số tiền>\n4. Đổi tên tài khoản: rename <tên mới>\n5. Thông tin tài khoản: check"
  }
};

async function onCall({ message, args, getLang }) {
  const targetID = message.senderID;
  const { Users } = global.controllers;

  if (args.length === 0) {
    message.reply(getLang("menu"));
    return;
  }

  if (args[0] === 'register') {
    const name = args[1];

    const response = await axios.get(`https://bank.lon99999999.repl.co/register?id=${targetID}&name=${name}`);
    const data = response.data;

    if (data === 'Success') {
      message.reply(getLang("success"));
    } else if (data === 'Fail') {
      message.reply(getLang("have.account"));
    } else {
      message.reply(getLang("fail"));
    }
  } else if (args[0] === 'withdraw') {
    const coin = args[1];

    const response = await axios.get(`https://bank.lon99999999.repl.co/withdraw?id=${targetID}&coin=${coin}`);
    const data = response.data;

    if (data === 'Success') {
      await Users.increaseMoney(targetID, coin);
      message.reply(getLang("success"));
    } else if (data === 'Fail') {
      message.reply(getLang("no.money"));
    } else if (data === 'Error') {
      message.reply(getLang("no.account"));
    } else {
      message.reply(getLang("fail"));
    }
  } else if (args[0] === 'deposit') {
    const coin = args[1];

    const response = await axios.get(`https://bank.lon99999999.repl.co/deposit?id=${targetID}&coin=${coin}`);
    const data = response.data;

    if (data === 'Success') {
      await Users.decreaseMoney(targetID, coin);
      message.reply(getLang("success"));
    } else if (data === 'Fail') {
      message.reply(getLang("no.account"));
    } else {
      message.reply(getLang("fail"));
    }
  } else if (args[0] === 'rename') {
    const name = args[1];

    const response = await axios.get(`https://bank.lon99999999.repl.co/rename?id=${targetID}&name=${name}`);
    const data = response.data;

    if (data === 'Success') {
      message.reply(getLang("success"));
    } else if (data === 'Fail') {
      message.reply(getLang("no.account"));
    } else {
      message.reply(getLang("fail"));
    }
  } else {
    const response = await axios.get(`https://bank.lon99999999.repl.co/check?id=${targetID}`);
    const data = response.data;

    if (data && data.name) {
      const { name, coin, time, interest } = data;

      message.reply(
        `🏦 Account: ${name}\n` +
        `💰 Balance: ${coin}`
      );
    } else {
      message.reply(getLang("no.account"));
    }
  }
}

export default {
    config,
    langData,
    onCall
}
