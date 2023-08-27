import axios from 'axios';

const config = {
  name: 'profile',
  aliases: ["fl", "thongtin", "tt","info"],
  description: 'Check Info',
  usage: '<Sử dụng lệnh để hiện menu>',
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

export async function onCall({ message, args }) {
  const targetID = message.senderID;
  const { Users } = global.controllers;
  const apiUrl = 'https://info.apibasic2023.repl.co';

  const command = args[0].toLowerCase();
  
  switch (command) {
    case 'clear':
      if (args.length === 2) {
        const key = args[1].toLowerCase();
        if (['ten', 'bietdanh', 'gioitinh', 'ngaysinh', 'quequan', 'moiqhe', 'sothich', 'ghichu'].includes(key)) {
          try {
            await axios.get(`${apiUrl}/clear?id=${targetID}&${key}`);
            message.send('✔️ Thông tin đã được xóa thành công.');
          } catch (error) {
            message.send('❌ Có lỗi xảy ra khi xóa thông tin.');
          }
        } else {
          message.send('❌ Lệnh không hợp lệ.');
        }
      } else {
        message.send('❌ Sai cú pháp. Sử dụng: `clear <case>`');
      }
      break;

    case 'add':
      if (args.length >= 3) {
        const key = args[1].toLowerCase();
        const content = args.slice(2).join(" ");
        
        if (['ten', 'bietdanh', 'gioitinh', 'ngaysinh', 'quequan', 'moiqhe', 'sothich', 'ghichu'].includes(key)) {
          try {
            await axios.get(`${apiUrl}/add?id=${targetID}&${key}=${content}`);
            message.send('✔️ Thông tin đã được cập nhật thành công.');
          } catch (error) {
            message.send('❌ Có lỗi xảy ra khi cập nhật thông tin.');
          }
        } else {
          message.send('❌ Lệnh không hợp lệ.');
        }
      } else {
        message.send('❌ Sai cú pháp. Sử dụng: `add <case> <nội dung>`');
      }
      break;

    case 'info':
      try {
        const response = await axios.get(`${apiUrl}/info?id=${targetID}`);
        const info = response.data;

        const { ten = 'không có thông tin', bietdanh = 'không có thông tin', gioitinh = 'không có thông tin', ngaysinh = 'không có thông tin', quequan = 'không có thông tin', moiqhe = 'không có thông tin', sothich = 'không có thông tin', ghichu = 'không có thông tin' } = info;

        const infoText =
          `👤 Tên: ${ten}\n` +
          `🏷️ Biệt danh: ${bietdanh}\n` +
          `⚤ Giới tính: ${gioitinh}\n` +
          `📅 Ngày sinh: ${ngaysinh}\n` +
          `🏠 Quê quán: ${quequan}\n` +
          `💑 Mối quan hệ: ${moiqhe}\n` +
          `🎯 Sở thích: ${sothich}\n` +
          `📝 Ghi chú: ${ghichu}`;

        message.send(infoText);
      } catch (error) {
        message.send('❌ Có lỗi xảy ra khi tải thông tin.');
      }
      break;

    default:
      const menu = 
        `[⚜️] Hướng Dẫn Sử Dụng [⚜️]\n` +
        `[⚜️] ➜ Dùng lệnh kèm add <case> <nội dung> để thêm nội dung\n` +
        `[⚜️] ➜ Dùng lệnh kèm clear <case> để xóa nội dung\n` +
        `[⚜️] ➜ Dùng lệnh kèm info để xem info bản thân\n` +
        `[⚜️] ➜ Các case hỗ trợ : ten,bietdanh,gioitinh,ngaysinh,quequan,moiqhe,sothich,ghichu\n`;

      message.send(menu);
      break;
  }
}

export default {
  config,
  onCall,
};