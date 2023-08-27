import { join } from 'path';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import moment from 'moment-timezone';

const items = [
  { name: 'Bình máu', price: 50, image: 'mau.jpg' },
  { name: 'Kiếm', price: 250, image: 'kiem.jpg' },
{ name: 'Liềm đoạt mệnh ', price: 150, image: 'liemdm.jpg' },
  { name: 'Giáp 1', price: 150, image: 'giap1.jpg' },
{ name: 'Giáp 2', price: 200, image: 'giap2.jpg' },
  { name: 'Giáp 3', price: 300, image: 'giap3.jpg' },
  { name: 'Giáp chống nổ', price: 500, image: 'giap4.jpg' },
  { name: 'Giáp hộ mệnh', price: 150, image: 'giaphm.jpg' },
{ name: 'Giáp thống khổ', price: 150, image: 'armor.jpg' },
  { name: 'MP40', price: 1650, image: 'mp40.jpg' },
{ name: 'AK47', price: 1500, image: 'ak47.jpg' },
{ name: 'M1014', price: 1000, image: 'm1014.jpg' },
{ name: 'Phantom', price: 1300, image: 'phantom.jpg' },
{ name: 'MAC-7', price: 1200, image: 'mac7.jpg' },
{ name: 'MAC-10', price: 1500, image: 'armor.jpg' },
  { name: 'Lửa trại', price: 200, image: 'luatrai.jpg' },
{ name: 'Lựu đạn', price: 200, image: 'luudan.jpg' },
{ name: 'Xu hồi sinh', price: 400, image: 'hs.jpg' },
{ name: 'Xu hồi sinh siêu cấp', price: 600, image: 'hssc.jpg' },
{ name: 'Nhiệm vụ kêu hùng cứu đội', price: 0, image: 'armor.jpg' },
{ name: 'Bom keo', price: 300, image: 'https://i.ibb.co/YDPd1Gz/xva213.jpg' },
{ name: 'Lựu băng', price: 300, image: 'armor.jpg' },
{ name: 'Lựu phá hủy', price: 150, image: 'luuphahuy.jpg' },
{ name: 'Nguyễn Duy Tuấn', price: 999999999, image: 'dtuan.jpg' },

  // Add more items here
];

const config = {
  name: 'shop',
  description: 'A virtual shop where you can buy items!',
  usage: 'Use it to see available items and buy them.',
  cooldown: 5,
};

async function onCall({ message, args }) {
  try {
    const { senderID } = message;
    const PATH = join(global.assetsPath, 'inventory.json');
    const { Users } = global.controllers;

    const userItems = existsSync(PATH) ? JSON.parse(readFileSync(PATH, 'utf-8')) : {};
    userItems[senderID] = userItems[senderID] || [];

    if (args[0] === 'menu') {
      return message.reply(
        'Shop Menu:\n' +
        '- `list`: Xem các mặt hàng có sẵn.\n' +
        '- `buy [item name]`: Mua vật phẩm ở cửa hàng\n' +
        '- `inventory`: Kiểm tra hòm đồ của bạn.'
      );
    }

    if (args[0] === 'list') {
      const itemList = items.map(item => `${item.name} - $${item.price}`);
      const itemListString = itemList.join('\n');
      return message.reply(`Những vật phẩm còn hàng:\n${itemListString}`);
    }

    if (args[0] === 'buy') {
      const itemName = args.slice(1).join(' ');
      const selectedItem = items.find(item => item.name.toLowerCase() === itemName.toLowerCase());

      if (!selectedItem) {
        return message.reply('Không thấy vật phẩm.');
      }

      const userMoney = await Users.getMoney(senderID);

      if (userMoney < selectedItem.price) {
        return message.reply('Bạn không có đủ tiền để mua.');
      }

      userItems[senderID].push(selectedItem);
      writeFileSync(PATH, JSON.stringify(userItems, null, 4), 'utf-8');
      await Users.decreaseMoney(senderID, selectedItem.price);

      return message.reply(`Bạn đã mua thành công ${selectedItem.name} với giá $${selectedItem.price}.`);
    }

    if (args[0] === 'inventory') {
      const userInventory = userItems[senderID];
      if (!userInventory || userInventory.length === 0) {
        return message.reply('Hòm đồ của bạn không có gì ¿');
      }
      const inventoryList = userInventory.map(item => item.name);
      const inventoryListString = inventoryList.join('\n');
      return message.reply(`Hòm đồ của bạn:\n${inventoryListString}`);
    }

    return message.reply('Lệnh bạn dùng không đúng, sử dụng `menu` để xem chi tiết.');
  } catch (e) {
    message.send('Error:', e);
    console.error(e);
  }
}

export default {
  config,
  onCall,
};