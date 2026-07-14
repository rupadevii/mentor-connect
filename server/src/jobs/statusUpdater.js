import cron from "node-cron";
import Session from "../models/Session.js";

export const sessionsStatusUpdater = () => {
    cron.schedule("0 * * * *", async () => {
        try {
            console.log("running a task every hour");

            const currentDate = new Date();
            console.log("currentDate", currentDate);

            const result = await Session.updateMany(
                {
                    status: {
                        $nin: ["COMPLETED", "CANCELLED"],
                    },
                    endTime: { $lt: currentDate },
                },
                {
                    status: "COMPLETED",
                },
            );

            //   sendMail(
            //     `[CRON SUCCESS]: Total ${result.modifiedCount}s of session status got updated to COMPLETED`,
            //   );
            //usercase-2, send a reminder mail for the session before 30 mins
        } catch (error) {
            console.error("[CRON ERROR]:" + error.message);
        }
  });
};