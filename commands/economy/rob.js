const config = {
  name: "rob",
  aliases: ["steal","cuop","trom"],
  description: "Steal money from a mentioned user",
  usage: "<mention>",
  cooldown: 600,
  credits: "WaifuCat",
}

const langData = {
  'en_US': {
    'noMoney': 'They have no money, you feel sorry for attempting to rob them.',
    'success': 'You successfully stole {amount} XC from {user}!',
    'error': 'An error occurred, please try again later'
  },
  'vi_VN': {
    'noMoney': 'Người này quá nghèo họ không có tiền.Trộm được cái nịt!',
    'success': 'Bạn vừa trộm được {amount} XC từ {user}!',
    'error': 'Đã xảy ra lỗi, vui lòng thử lại sau'
  },
  'ar_SY': {
    'noMoney': 'لا يملكون المال ، فأنت تشعر بالأسف لمحاولتك السرقة.',
    'success': 'لقد سرقت بنجاح {amount} XC من {user}!',
    'error': 'لقد حدث خطأ، رجاء أعد المحاولة لاحقا'
  }
}

async function onCall({ message, args, getLang }) {
  const { mentions, senderID, reply } = message;
  
  if (Object.keys(mentions).length === 0) return;
  const { Users } = global.controllers;
  const targetID = Object.keys(mentions)[0];
  const targetMoney = await Users.getMoney(targetID);
  
  if (targetMoney === null) return reply(getLang('error'));
  
  if (targetMoney === 0) {
    return reply(getLang('noMoney'));
  } else {
    const amount = Math.floor(Math.random() * 951) + 50; 
    await Users.decreaseMoney(targetID, amount);
    await Users.increaseMoney(senderID, amount);
    const targetUser = mentions[targetID].replace(/@/g, '');
    const successMessage = getLang('success', { amount: addCommas(amount), user: targetUser });
    return reply(successMessage);
  }
}

export default {
  config,
  langData,
  onCall
}