export const config = {
    name: "setname",
    version: "0.0.1-xaviaBot-port",
    credits: "Mirai Team",
    description: "Đổi biệt danh ai đó",
    usage: "[name]",
    cooldowns: 3
};

export async function onCall({ message, args }) {
    const name = args.join(" ")
const { threadID, messageID, senderID, mentions, type, messageReply } = message;
  const { Threads, Users } = global.controllers;
  const mention = Object.keys(mentions)[0];
    if (type == 'message_reply') {
       var targetID = messageReply.senderID
     return global.api.changeNickname(`${name}`, threadID, targetID);
    } else if (Object.keys(mentions).length > 0) {
       var targetID = Object.keys(mentions)[0];
      return global.api.changeNickname(`${name.replace(mentions[mention], "")}`, threadID, targetID);
    } else {
  return global.api.changeNickname(`${name}`, threadID, senderID);
    }
}