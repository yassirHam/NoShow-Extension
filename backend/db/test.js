const db = require('./database');

async function testConnection() {
  try {
    await db.authenticate();
    console.log('MySQL connection successful!');
    
    const [results] = await db.query('SELECT NOW() AS current_time');
    console.log('Current MySQL time:', results[0].current_time);
  } catch (error) {
    console.error('MySQL connection failed:', error);
  } finally {
    await db.close();
  }
}

testConnection();