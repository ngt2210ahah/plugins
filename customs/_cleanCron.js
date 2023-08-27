import cron from 'node-cron';

export default function onCall() {
  cron.getTasks().forEach(task => task.stop());
}