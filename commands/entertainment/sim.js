const config = {
  name: "simsimi",
  aliases: ["sim"],
  description: "ask Simisi",
  credits: "Xavia Team [API Dung]",
  cooldown: 5
};

const LangData = {
  "vi_VN": {
    "answer": "{answer}",
    "error": "{answer}",
    "missingInput": "Vui lòng nhập nội dung cần trò chuyện với Simisi",
    "notFound": "Không tìm thấy kết quả."
  },
  "en_US": {
    "answer": "{answer}",
    "error": "{answer}",
    "missingInput": "Please enter the content to chat with Simisi",
    "notFound": "No results were found"
  },
  "ar_SY": {
    "answer": "{answer}",
    "error": "{answer}",
    "missingInput": "الرجاء إدخال المحتوى للدردشة مع Simisi",
    "notFound": "No results were found"
  }
};

async function onCall({ message, args, getLang }) {
  try {
    const input = args.join(" ").toLowerCase();
    if (!input) return message.reply(getLang("missingInput"));
    const encodedInput = encodeURIComponent(input);
    const url = `https://sumiproject.space/sim?type=ask&ask=${encodedInput}`;
    const res = await global.GET(url);
    const answerData = res.data;

    if (!answerData || answerData.length === 0) {
      return message.reply(getLang("notFound"));
    }

    const response = getLang("answer", {
      answer: answerData[0].answer
    });

    return message.reply(response);
  } catch (e) {
    console.error(e);
    return message.reply(getLang("error"));
  }
}

export default {
  config,
  LangData,
  onCall
};
