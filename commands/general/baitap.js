const config = {
  name: "baitap",
  aliases: ["btap","bt"],
  description: "Tính toán đơn giản",
  usage: "<số> <phép tính> <số>",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "WaifuCat",
  extra: {},
};

async function onCall({ message, args }) {
  const content = args.join(" ").toLowerCase();
  const parts = content.split(" ");
  
  if (parts.length !== 3) {
    return message.send("[⚜️] ➜ Vui lòng nhập theo dạng: <số> <phép tính> <số>");
  }

  const number1 = parseFloat(parts[0]);
  const operator = parts[1];
  const number2 = parseFloat(parts[2]);

  let result;

  switch (operator) {
    case "+":
      result = number1 + number2;
      break;
    case "-":
      result = number1 - number2;
      break;
    case "x":
      result = number1 * number2;
      break;
    case ":":
      result = number1 / number2;
      break;
    default:
      return message.send("[⚜️] ➜ Phép tính không hợp lệ. Hỗ trợ: +, -, x, :");
  }

  return message.send(`[⚜️] ➜ Kết quả: ${result}`);
}

export default {
  config,
  onCall,
};