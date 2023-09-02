
import cron from "node-cron";

// learn more about cron time here:
// https://www.npmjs.com/package/node-cron?activeTab=readme
const jobs = [
    {
        time: "0 22 * * *", // every day at 22:00 (10 PM)
        message: () => "Đã 10 giờ rồi, chúc mọi người ngủ ngon! <3",
    },
      {
            time: "0 12 * * *", // này 12h trưa thì phải 
            message: () => "Chúc mọi người buổi trưa vui vẻ! Nhớ bật nút nồi cơm 🐧❤️"
      },
      {
              time: "0 18 * * *", // 18 giờ tối nè
             message: () => "Buổi tối vui vẻ! Cắm cơm nhớ bấm nút ❤️"
       },
      {
              time: "0 7 * * *", // 7 giờ sáng nh 
              message: () => "Chúc mọi người ngày mới tràn đầy năng lượng <3 !"
        }
];

export default function autoSend() {
    const timezone = global.config?.timezone || "Asia/Ho_Chi_Minh";
    if (!timezone) return;

    for (const job of jobs) {
        cron.schedule(
            job.time,
            () => {
                let i = 0;
                for (const tid of job.targetIDs ||
                    Array.from(global.data.threads.keys()) ||
                    []) {
                    setTimeout(() => {
                        global.api.sendMessage(
                            {
                                body: job.message(),
                            },
                            tid
                        );
                    }, i++ * 300);
                }
            },
            {
                timezone: timezone,
            }
        );
    }
}
