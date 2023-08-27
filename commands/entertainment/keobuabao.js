
const config = {
  name: 'keobuabao',
  aliases: ["oantuti", "kbb"],
  description: 'Chơi kéo búa bao với bot',
  usage: '<Sử dụng lệnh để hiện menu hướng dẫn>',
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

const choices = ['kéo', 'búa', 'bao'];
const emojis = ['✌️', '✊', '🖐'];

function determineWinner(userChoice, botChoice) {
  if (userChoice === botChoice) {
    return 'draw';
  } else if (
    (userChoice === 'búa' && botChoice === 'kéo') ||
    (userChoice === 'bao' && botChoice === 'búa') ||
    (userChoice === 'kéo' && botChoice === 'bao')
  ) {
    return 'win';
  } else {
    return 'lose';
  }
}

export async function onCall({ message, args }) {
  const { Users } = global.controllers;
  const userMoney = await Users.getMoney(message.senderID);
  const targetID = message.senderID;

  if (args.length === 0) {
    return message.reply(`
      [⚜️] Menu Hướng Dẫn [⚜️]\n[⚜️] ➜ Cần 5000$ để chơi\n[⚜️] ➜ Dùng lệnh kèm <case> để chơi\n[⚜️] ➜ Case: kéo,búa,bao`);
  }

  const userChoice = args.join(" ").toLowerCase();

  if (userMoney < 5000) {
    return message.reply('[⚜️] ➜ Bạn không có đủ tiền để chơi!');
  }

  if (!choices.includes(userChoice)) {
    return message.reply('[⚜️] ➜ Vui lòng sử dụng kéo, búa, bao!');
  }

  const botChoice = choices[Math.floor(Math.random() * choices.length)];
  const result = determineWinner(userChoice, botChoice);

  let winAmount = 0;
  if (result === 'win') {
    winAmount = 5000 * 2;
    await Users.increaseMoney(targetID, winAmount);
  } else if (result === 'lose') {
    await Users.decreaseMoney(targetID, 5000);
  }

  let resultMessage = '';
  if (result === 'win') {
    resultMessage = '[⚜️] ➜ Bạn thắng!';
  } else if (result === 'lose') {
    resultMessage = '[⚜️] ➜ Bạn thua!';
  } else {
    resultMessage = '[⚜️] ➜ Hòa!';
  }

  const userEmoji = emojis[choices.indexOf(userChoice)];
  const botEmoji = emojis[choices.indexOf(botChoice)];

  message.reply(
    `[⚜️] ➜ Bạn: ${userEmoji}\n[⚜️] ➜ Bot: ${botEmoji}\n${resultMessage}`
  );
}

export default {
  config,
  onCall,
};