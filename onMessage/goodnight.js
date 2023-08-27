import { join } from "path";

export const config = {
    name: "good-night",
    version: "0.0.1-xaviabot-refactor",
    credits: "Choru tiktokers",
    description: "good night",
};

const gngifPath = join(global.assetsPath, "gn.gif");
export async function onLoad() {
    await downloadFile(gngifPath, "https://i.ibb.co/V90WrN0/f9f6b9fb33c2c998a456ad845a966d82.gif");
}

export async function onCall({ message }) {
    const conditions = [
        "good eve",
        "evening",
        "ngủ ngon",
        "Ngủ ngon",
        "nngon",
        "Nngon",
        "Ngủ",
        "ngủ",
        "sleep",
        "Sleep",
        "đi ngủ",
        "Đi ngủ",
        "Good eve",
        "Evening"
  
        
        
    ]

    if (conditions.some(c => message.body.toLowerCase().startsWith(c))) {
        message.reply({
            body: "Chúc bạn 1 buổi tối vui vẻ và ngủ ngon zZz <3",
            attachment: global.reader(gngifPath)
        })
        message.react("🌃")
    }
}