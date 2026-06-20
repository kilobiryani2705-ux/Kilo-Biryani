import cron from 'node-cron';
import Order from '../models/Order';

const FOUR_MONTHS_MS = 4 * 30 * 24 * 60 * 60 * 1000; // approx. 4 months

export const cleanupOldOrders = async () => {
  try {
    const cutoffDate = new Date(Date.now() - FOUR_MONTHS_MS);

    const result = await Order.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Cleanup: deleted ${result.deletedCount} order(s) older than ${cutoffDate.toDateString()}`);
    } else {
      console.log('🧹 Cleanup: no old orders to delete');
    }
  } catch (err) {
    console.error('❌ Order cleanup failed:', err);
  }
};

// Runs once every day at 3:00 AM server time.
// Render free tier sleeps after 15 min idle — but since UptimeRobot
// pings the server every 5 min to keep it awake, this scheduled job
// will reliably fire as long as the daily ping cycle includes 3 AM.
export const startOrderCleanupJob = () => {
  cron.schedule('32 20 * * *', () => {
    console.log('🧹 Running scheduled order cleanup...');
    cleanupOldOrders();
  });

  console.log('🧹 Order cleanup job scheduled (daily at 3:00 AM)');
};