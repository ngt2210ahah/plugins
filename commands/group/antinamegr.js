const config = {
  name: "atgr",
  aliases: ["antinamegr","antigr","agr"],
  description: "Chống đổi tên nhóm",
  usage: "on|off",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "WaifuCat"
};

const langData = {
  "vi_VN": {
    "notGroup": "Lệnh này chỉ có thể được sử dụng trong nhóm!",
    "success": "Đã thay đổi cài đặt thành công",
    "alreadyOn": "Chức năng đã được bật sẵn!",
    "alreadyOff": "Chức năng đã được tắt sẵn!",
    "invalidCommand": "Lệnh không hợp lệ. Sử dụng lệnh `on` hoặc `off`."
  }
};

async function onCall({ message, getLang, data }) {
  if (!data?.thread?.info || !data.thread.info.isGroup) return message.reply(getLang("notGroup"));

  const [input] = message.body.split(" ").slice(1);
  if (!['on', 'off'].includes(input)) return message.reply(getLang("invalidCommand"));

  const _THREAD_DATA_ANTI_SETTINGS = { ...(data.thread.data?.antiSettings || {}) };

  switch (input) {
    case 'on':
      if (_THREAD_DATA_ANTI_SETTINGS.antiChangeGroupName) return message.reply(getLang("alreadyOn"));
      _THREAD_DATA_ANTI_SETTINGS.antiChangeGroupName = true;
      await global.controllers.Threads.updateData(message.threadID, { antiSettings: _THREAD_DATA_ANTI_SETTINGS });
      return message.reply(getLang("success"));
    case 'off':
      if (!_THREAD_DATA_ANTI_SETTINGS.antiChangeGroupName) return message.reply(getLang("alreadyOff"));
      _THREAD_DATA_ANTI_SETTINGS.antiChangeGroupName = false;
      await global.controllers.Threads.updateData(message.threadID, { antiSettings: _THREAD_DATA_ANTI_SETTINGS });
      return message.reply(getLang("success"));
    default:
      return message.reply(getLang("invalidCommand"));
  }
}

export default {
  config,
  langData,
  onCall
};