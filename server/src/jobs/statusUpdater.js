import cron from "node-cron";
import Session from "../models/Session.js";

export const sessionsStatusUpdater = () => {
  // This cron job will run everyhour to update the staus
  cron.schedule("0 * * * *", async () => {
    try {
      // every hr-  0 * * * *
      console.log("running a task every hour");

      // Usecase-1 update the status

      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      let currentTime = `${hrs}:${mins}`;

      console.log("now", now);
      const currentDate = new Date(now);
      console.log("currentDate", currentDate);

      const result = await Session.updateMany(
        {
          status: {
            $nin: ["COMPLETED", "CANCELLED"],
          },
          $or: [
            {
              eventDate: {
                $lt: currentDate,
              },
            },
            {
              $and: [
                {
                  eventDate: {
                    $lte: currentDate,
                  },
                },
                {
                  endTime: {
                    $lt: currentTime,
                  },
                },
              ],
            },
          ],
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