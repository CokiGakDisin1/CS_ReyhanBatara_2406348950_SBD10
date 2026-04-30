const db = require('../config/database');

class Report {
  static async getTopUsers(limit) {
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.username,
        COALESCE(SUM(t.total), 0) AS total_pengeluaran,
        RANK() OVER (ORDER BY COALESCE(SUM(t.total), 0) DESC) as peringkat
      FROM users u
      LEFT JOIN transactions t ON u.id = t.user_id AND t.status = 'paid'
      GROUP BY u.id, u.name, u.username
      ORDER BY peringkat ASC
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  static async getItemsSold() {
    const query = `
      SELECT 
        i.id, 
        i.name, 
        i.price,
        COALESCE(SUM(t.quantity), 0) AS total_quantity_sold,
        COALESCE(SUM(t.total), 0) AS total_revenue
      FROM items i
      LEFT JOIN transactions t ON i.id = t.item_id AND t.status = 'paid'
      GROUP BY i.id, i.name, i.price
      ORDER BY total_revenue DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getMonthlySales(year) {
    const query = `
      SELECT 
        date_trunc('month', created_at) AS month,
        SUM(total) AS total_sales,
        COUNT(id) AS total_transactions
      FROM transactions
      WHERE extract(year from created_at) = $1 AND status = 'paid'
      GROUP BY month
      ORDER BY month ASC
    `;
    const result = await db.query(query, [year]);
    return result.rows;
  }
}

module.exports = Report;
