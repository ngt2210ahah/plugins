
import axios from 'axios';

const config = {
  name: 'noteonline',
  aliases: ["nto", "nt", "ntonline"],
  description: 'Note Online :D',
  usage: '<Dùng lệnh để hiện menu>',
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

export async function onCall({ message, args }) {
  const targetID = message.senderID;
  const { Users } = global.controllers;

  const apiUrl = "https://note.apibasic2023.repl.co";

  const commands = {
    add: async (id, text) => {
      try {
        const response = await axios.get(`${apiUrl}/add?id=${id}&text=${encodeURIComponent(text)}`);
        if (response.data === "Success") {
          return message.send("[⚜️] ➜ Thành công!");
        } else {
          return message.send("[⚜️] ➜ Thất bại!");
        }
      } catch (error) {
        return message.send("[⚜️] ➜ Lỗi!");
      }
    },
    clear: async (id) => {
      try {
        const response = await axios.get(`${apiUrl}/clear?id=${id}`);
        if (response.data === "Success") {
          return message.send("[⚜️] ➜ Thành công!");
        } else {
          return message.send("[⚜️] ➜ Thất bại!");
        }
      } catch (error) {
        return message.send("[⚜️] ➜ Lỗi");
      }
    },
    check: async (id) => {
      try {
        const response = await axios.get(`${apiUrl}/check?id=${id}`);
        if (response.data === "Fail") {
          return message.send("[⚜️] ➜ Không tồn tại note!");
        } else {
          const noteData = response.data;
          const { text } = noteData; 
          return message.send(`[⚜️] ➜ Note: ${text}`);
        }
      } catch (error) {
        return message.send("[⚜️] ➜ Lỗi!");
      }
    }
  };

  const command = args[0];

  switch (command) {
    case "add":
      const text = args.slice(1).join(" ");
      return await commands.add(targetID, text);
    case "clear":
      return await commands.clear(targetID);
    case "check":
      return await commands.check(targetID);
    default:
      return message.send("[⚜️] Menu Hướng Dẫn [⚜️] \n[⚜️] ➜ add <text> để thêm note\n[⚜️] ➜ clear để làm trống note\n[⚜️] ➜ check để xem nội dung đã note\n[⚜️] ➜ Cám ơn đã sử dụng!");
  }
}

export default {
  config,
  onCall,
};
