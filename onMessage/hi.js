import { join } from "path";

export const config = {
    name: "hi",
    version: "0.0.1-xaviabot-refactor",
    credits: "Choru tiktokers",
    description: "good night",
};

const higifPath = join(global.assetsPath, "hi.gif");
export async function onLoad() {
    await downloadFile(higifPath, "https://i.ibb.co/8059H1Q/xva213.gif");
}

export async function onCall({ message }) {
    const conditions = [
        "hi",
        "Hi",
        "hello",
        "Hello",
        "chào",
      "Chào",
      "hí",
      "hì",
      "Hí",
      "Hì",
      "helo",
      "Helo",
      "Xin chào",
      "xin chào",
      "chao",
      "xin chao",
      "chao xin"
      
      
        
    ]

    if (conditions.some(c => message.body.toLowerCase().startsWith(c))) {
        message.reply({
            body: "Xin ckao, chúc bạn có 1 ngày tốt lành! <3",
            attachment: global.reader(higifPath)
        })
        message.react("👋")
    }
}