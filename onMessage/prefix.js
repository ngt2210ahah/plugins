const langData = {
    "en_US": {
        "prefix.get": "Hello, i'm NDT's bot"
    },
    "vi_VN": {
        "prefix.call": "Xin chào, tớ là bot của Duy Tuấn"
    }
}
                         
function onCall({ message, getLang, data }) {
    //const newPrefix = args[0];
    if (message.body == global.config.PREFIX && message.senderID != global.botID) {
        message.reply(getLang("prefix.call", {
            prefix: data?.thread?.data?.prefix || global.config.PREFIX  
        }));
    }

    return;
}

export default {
    langData,
    onCall
}
