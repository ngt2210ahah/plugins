import { join } from "path";

export const config = {
    name: "good-morning",
    version: "0.0.1-xaviabot-refactor",
    credits: "Choru tiktokers",
    description: "great morning"
};

const gmgifPath = join(global.assetsPath, "gm.gif");
export async function onLoad() {
    await downloadFile(gmgifPath, "https://i.ibb.co/T1FhMcq/good-morning.gif");
}

export async function onCall({ message }) {
    const conditions = [
        "good morning",
        "good gm",
        "morning",
        "bago paka gising",
        "magandang araw",
        "Chào buổi sáng",
        "chào buổi sáng",
        "Buổi sáng vui vẻ",
        "buổi sáng vui vẻ",
        "sáng rồi dậy đi",
        "Sáng rồi dậy đi",
        
    ]

    if (conditions.some(c => message.body.toLowerCase().startsWith(c))) {
        message.reply({
            body: "Chào buổi sáng, chúc bạn có 1 ngày tươi vui và tràn đầy năng lượng <3",
            attachment: global.reader(gmgifPath)
        })
        message.react("🌇")
    }
}