export default function ({ message }) {
    global.random(0, 5) === 3 ? message.reply("Bạn bị ngốc hả ¿ >w<") : message.reply("Rất tiếc, chúng ta chỉ là bạn thôi huhu 😔");
}
