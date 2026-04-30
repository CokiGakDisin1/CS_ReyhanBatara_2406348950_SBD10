const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');

class UserService {
  static async register({ name, username, email, phone, password }) {
    // Check if user already exists by email
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 400);
    }
    // Note: username uniqueness is enforced by database constraint

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
    });

    return user;
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return { 
      user: { id: user.id, name: user.name, username: user.username, email: user.email, phone: user.phone, balance: user.balance },
      token
    };
  }

  static async updateProfile(id, updateData) {
    // No password hashing
    const updatedUser = await User.update(id, updateData);
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }
    return updatedUser;
  }

  static async getTransactionHistory(userId) {
    // Simple query without JOIN (just return raw transactions)
    const transactions = await User.getTransactions(userId);
    return transactions;
  }

  static async getTotalSpent(userId) {
    // Simple total without aggregate
    const transactions = await User.getTransactions(userId);
    const total = transactions.reduce((sum, t) => sum + t.total, 0);
    return total;
  }
}

module.exports = UserService;