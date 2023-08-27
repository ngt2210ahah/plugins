const config = {
    name: "tagqtv",
    aliases: ["tqtv","d"],
    description: "",
    usage: "",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "Sleiz",
    extra: {},
  };

  export async function onCall({ message , args }) {
     const { mention, isGroup, senderID, participantIDs } = message;
    const { Users } = global.controllers
    const qtvBox = api.getThreadInfo(threadID).adminIDs
    let id = [];
    for (let i of qtvBox) {
        const admin = i.id;
        const name = (await Users.getData(admin)).name;
        await message.send({
            body,
            mentions: [
              { tag: name, id: admin },
            ]
        })
    }
  }

  export default {
    config,
    onCall
  };