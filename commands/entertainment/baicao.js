
const config = {
  name: 'baicao',
  aliases: ["bc", "3la"],
  description: 'Chơi bài cào với bot',
  usage: '',
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

const calculatePoint = (card) => {
  if (['A', 'J', 'Q', 'K'].includes(card)) {
    return 10;
  }
  return parseInt(card);
};

const shuffleCards = (cards) => {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
};

const playBaicao = () => {
  const suits = ['♠', '♣', '♥', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const allCards = [];

  for (const suit of suits) {
    for (const value of values) {
      allCards.push(value + suit);
    }
  }

  shuffleCards(allCards);

  const userCards = allCards.slice(0, 3);
  const botCards = allCards.slice(3, 6);

  const userPoints = userCards.reduce((sum, card) => sum + calculatePoint(card[0]), 0) % 10;
  const botPoints = botCards.reduce((sum, card) => sum + calculatePoint(card[0]), 0) % 10;

  return {
    userCards,
    botCards,
    userPoints,
    botPoints,
  };
};

const determineWinner = (userPoints, botPoints) => {
  if (userPoints > botPoints) {
    return "[⚜️] ➜ Bạn thắng!";
  } else if (userPoints < botPoints) {
    return "[⚜️] ➜ Bạn thua!";
  } else {
    return "[⚜️] ➜ Hòa!";
  }
};

const onCall = async ({ message, args }) => {
  const { Users } = global.controllers;
  const targetID = message.senderID;
  const userMoney = await Users.getMoney(targetID);

  if (userMoney < 10000) {
    return message.reply("[⚜️] ➜ Bạn cần 10000 tiền để chơi.");
  }

  await Users.decreaseMoney(targetID, 10000);

  const result = playBaicao();
  const userCardString = result.userCards.join(', ');
  const botCardString = result.botCards.join(', ');

  let winAmount = 0;

  if (result.userPoints > result.botPoints) {
    winAmount = 20000;
  } else if (result.userPoints === result.botPoints) {
    winAmount = 10000;
  } 

  await Users.increaseMoney(targetID, winAmount);

  const newMoney = userMoney - 10000 + winAmount;
  const reply = `[⚜️] ➜ Bạn: ${userCardString} - (Điểm: ${result.userPoints})\n[⚜️] ➜ Bot: ${botCardString} - (Điểm: ${result.botPoints})\n${determineWinner(result.userPoints, result.botPoints)}\n[⚜️] ➜ Số tiền hiện tại: ${newMoney}`;

  message.reply(reply);
};

export default {
  config,
  onCall,
};