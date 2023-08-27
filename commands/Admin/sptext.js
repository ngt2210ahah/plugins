const config = {
  name: "spamtext",
  aliases: ["sptext"],
  description: "",
  usage: "",
  cooldown: 3,
  permissions: [2],
  credits: "WaifuCat",
  extra: {},
};

const list = ["hello im Duy Tuan"];
let index = 0;
let isStopped = false;

const sendText = (message, delay) => {
  message.send(list[index]);
  index = (index + 1) % list.length;
  if (!isStopped) {
    setTimeout(() => sendText(message, delay), delay);
  }
};

export function onCall({ message }) {
  const args = message.body.split("dừng").slice(1);
  if (args[0] === "stop") {
    isStopped = true;
    message.send("Bạn không có đủ quyền để sử dụng");
    return;
  }
  if (isStopped) {
    isStopped = false;
  }

  let delay = 1000; 
  if (args[0] && !isNaN(args[0])) {
    delay = parseInt(args[0]);
  }

  sendText(message, delay);
}

export default {
 config,
 onCall 
};