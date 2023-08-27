export default function ({ message }) {
    let timeStart = Date.now();
    message.send('').catch(_ => {
        let timeEnd = Date.now();
        message.reply(`Xem trạng thái bot và API của tớ ở đâyy: demo-cc.lon999999.repl.co`);
    })
}