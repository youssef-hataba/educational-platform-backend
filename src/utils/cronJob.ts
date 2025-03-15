import User from "../models/UserModel";
import cron from 'node-cron';


// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup job: Deleting inactive users...");

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  // Find and delete users inactive for 3+ months
  const deletedUsers = await User.deleteMany({
    isActive: false,
    deactivatedAt: { $lte: threeMonthsAgo },
  });

  console.log(`Deleted ${deletedUsers.deletedCount} inactive users.`);
});
