
const config = {
  name: "spin",
  aliases: ["s"],
  description: "Làm giàu bằng nhân phẩm",
  usage: "<none>",
  cooldown: 300,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

async function onCall({ message, args, data }) {
  const { Users } = global.controllers;

  try {
    const targetID = message.senderID;
    const randomAmount = Math.floor(Math.random() * 100001);
    const totalAmount = randomAmount;

    let replyMessage = `🎰 *Chúc mừng!* Bạn đã trúng: ${totalAmount.toLocaleString()} coin 💰`;

    message.reply(replyMessage);

    await Users.increaseMoney(targetID, totalAmount);
  } catch (error) {
    console.error(error);
    message.reply('Đã xảy ra lỗi!');
  }
}

export default {
  config,
  onCall,
};
