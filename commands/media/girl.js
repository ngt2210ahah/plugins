const config = {
    name: "girl",
    aliases: ["gai","gái"],
    credits: "XaviaTeam"
}

function onCall({ message }) {
    global.GET(`https://api.tuanthichdaobit.repl.co/images/girl`)
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
