require('dotenv').config({ override: true });
const app = require('./src/app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Test database connection
if (process.env.NODE_ENV !== 'production') {
  db.query('SELECT NOW()')
    .then(() => {
      console.log('Database connected successfully');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed:', err);
    });
}

module.exports = app;