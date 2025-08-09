import TokenBlacklist from '@models/TokenBlacklist';
import cron from 'node-cron';

export const initializeTokenCleanup = () => {
  // Run every day at midnight
  const job = cron.schedule('0 0 * * *', async () => {
    try {
      const result = await TokenBlacklist.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      console.log(`Cleaned up ${result.deletedCount} expired tokens`);
    } catch (err) {
      console.error('Token cleanup error:', err);
    }
  });

  // Return function to stop the job if needed
  return () => job.stop();
};