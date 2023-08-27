const config = {
    name: "trai",
    aliases: ["boy","nam"],
    credits: "XaviaTeam"
}

function onCall({ message }) {
    global.GET(`https://api.tuanthichdaobit.repl.co/images/trai`)
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
