import axios from 'axios';
import fs from 'fs';

const config = {
  name: "poli",
  description: "AI tạo ảnh",
  usage: "<prompt>",
  cooldown: 0,
  permissions: [0],
  credits: "NLam182",
  aliases: ["pli","plli","polli","art","aiart"],
  isAbsolute: false,
  isHidden: false,
  extra: {}
};


async function onCall({ message, args, getLang, extra, data, userPermissions, prefix }) {
  if (!args[0]) {
    return message.send(getLang("message")); 
  }

  const prompt = args.join(" ");
  const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

  try {
    const waitMessage = await message.send("Đang tiến hành tạo ảnh, vui lòng chờ...");

    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    if (response.status === 200) {
      const imageBuffer = Buffer.from(response.data, 'binary');
      const imagePath = `poli.jpg`;
      fs.writeFileSync(imagePath, imageBuffer, "binary");

      const messageData = {
        body: "Đã tạo xong ảnh theo yêu cầu của bạn",
        attachment: fs.createReadStream(imagePath)
      };

      await message.send(messageData);

      fs.unlinkSync(imagePath);
      await waitMessage.unsend();
    } else {
      await message.send("Không thể tạo ảnh. Vui lòng thử lại sau.");
      await waitMessage.unsend();
    }
  } catch (error) {
    console.error(error);
    await message.send("Đã xảy ra lỗi trong quá trình tạo ảnh.");
  }
}

export default {
  config,
  onCall
};