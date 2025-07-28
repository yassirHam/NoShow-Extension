const { exec } = require('child_process');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const backupDir = path.join(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

cron.schedule('0 2 * * *', () => { // Daily at 2 AM
  const date = new Date().toISOString().slice(0, 10);
  const backupFile = path.join(backupDir, `backup-${date}.sql`);
  
  exec(
    `mysqldump -u${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${backupFile}`,
    (error) => {
      if (error) {
        console.error('Backup failed:', error);
      } else {
        console.log(`Backup created: ${backupFile}`);
        // Rotate backups (keep last 7 days)
        fs.readdir(backupDir, (err, files) => {
          if (err) return;
          files.filter(f => f.startsWith('backup-'))
            .sort()
            .slice(0, -7)
            .forEach(f => fs.unlinkSync(path.join(backupDir, f)));
        });
      }
    }
  );
});

console.log('Backup scheduler running...');