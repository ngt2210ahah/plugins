const config = {
    name: "sv",
    aliases: ["sver", "server"],
    description: "Show source code of bot"
}

const langData = {
    "en_US": {
        "details": "Api chat voi nguoi la seems working good 😎:\n{source}"
    },
    "vi_VN": {
        "details": "Api chat với người lạ có vẻ chạy vẫn tốt 😎:\n{source}"
    },
    "ar_SY": {
        "details": "يبدو أن واجهة برمجة تطبيقات الدردشة مع الغرباء تعمل بشكل جيد \n{source}"
    }
}

const source = "cvnl.me";
function onCall({ message, getLang }) {
    message.reply(getLang("details", { source }));
}

export default {
    config,
    langData,
    onCall
}