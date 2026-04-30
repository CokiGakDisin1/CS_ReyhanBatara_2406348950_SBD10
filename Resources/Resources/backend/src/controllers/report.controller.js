const Report = require('../models/report.model');

class ReportController {
  static async getTopUsers(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const data = await Report.getTopUsers(limit);
      res.status(200).json({
        success: true,
        message: 'Top users retrieved successfully',
        payload: data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getItemsSold(req, res, next) {
    try {
      const data = await Report.getItemsSold();
      res.status(200).json({
        success: true,
        message: 'Items sold retrieved successfully',
        payload: data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlySales(req, res, next) {
    try {
      const year = parseInt(req.query.year, 10) || new Date().getFullYear();
      const data = await Report.getMonthlySales(year);
      res.status(200).json({
        success: true,
        message: `Monthly sales for year ${year} retrieved successfully`,
        payload: data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;