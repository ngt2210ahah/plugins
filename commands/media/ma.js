const config = {
    name: "ma",
    aliases: ["ghost","malol"],
    credits: "XaviaTeam"
}

function onCall({ message }) {
    global.GET(`https://api.tuanthichdaobit.repl.co/image/ma`)
        .then(async res => {
            try {
                let imgStream = await global.getStream(res.data.url);
                message.reply({
                    body: res.data.url,
                    attachment: imgStream
                });
            } catch {
                message.reply("Error!");
            }
        })
        .catch(_ => message.reply("Error!"));
}

export default {
    config,
    onCall
}
