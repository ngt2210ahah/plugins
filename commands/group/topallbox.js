const config = {
  name: "topallbox",
  aliases: ["topall", "topxcall","top"],
  description: "Shows the top users all box",
  usage: "",
  cooldown: 5,
  credits: "WaifuCat",
};

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  let top = parseInt(args[0]) || 10;

  if (top > 50) top = 50;

  const allUsers = await Users.getAll();
  const topBalances = allUsers.filter((user) => user.data.money !== undefined)
    .sort((a, b) => b.data.money - a.data.money).slice(0, top);

  let messageToSend = "";
  topBalances.forEach((user, index) => {
    messageToSend += `${index + 1}. ${user.info.name}: ${Number(user.data.money).toLocaleString('en-US')} XC\n`;
  });

  const resultMessage = `Danh sách ${top} người có số XC cao nhất`;
  const response = `${resultMessage}\n${messageToSend}`;

  try {
    await message.reply(response);
  } catch (err) {
    console.error(err);
  }
}

export default {
  config,
  onCall,
};