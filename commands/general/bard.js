import axios from 'axios';

const config = {
  name: "bard",
  aliases: ["chat","ai"],
  description: "",
  usage: "",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Eien Mojiki f/. Mirai",
  extra: {}
};

const onCall = async ({ message, args }) => {
  const input = args.join(" "),
        apikey = 'tuanpi2023';
  
  try {
    const res = await axios.get(`https://api.mproductions2006.repl.co/ai/chat?prompt=${encodeURIComponent(input)}&apikey=${apikey}`);
    const chat = res.data.data;
    await message.send(`${chat.content}`);
  } catch (error) {
    message.send(`Có lỗi đã xảy ra hoặc không tìm thấy thông tin!`);
  }
};

export default {
  config,
  onCall
};
