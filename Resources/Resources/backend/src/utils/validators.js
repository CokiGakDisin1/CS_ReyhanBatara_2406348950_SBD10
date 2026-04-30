const { body, param, query } = require('express-validator');

// TODO: Buat pola regex untuk validasi berikut (jangan gunakan pola yang diberikan di completed_backend).
// Email: harus valid (misal: user@domain.com).
// Password: minimal 10 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter spesial.
// Username: hanya boleh mengandung huruf, angka, dan underscore (3-20 karakter).
// Phone: format internasional (opsional, dapat dimulai dengan +, diikuti digit, spasi, atau strip).
// Description: opsional, bebas tetapi batasi panjang (misal maksimal 500 karakter).

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const phoneRegex = /^(?:\+?\d{1,3}[\s-]?)?(?:\d[\s-]?){7,14}\d$/;

// Validation rules
const userRegistrationValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .matches(usernameRegex).withMessage('Username hanya boleh mengandung huruf, angka, dan underscore'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .matches(emailRegex).withMessage('Pola email tidak valid (harus user@domain.com dsb)'),
  body('phone')
    .optional()
    .trim()
    .matches(phoneRegex).withMessage('Pola nomor telepon harus dalam format internasional yang valid'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .matches(passwordRegex).withMessage('Password minimal 10 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter spesial'),
];

const userUpdateValidation = [
  body('id')
    .isInt().withMessage('User ID must be an integer'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .matches(usernameRegex).withMessage('Username hanya boleh mengandung huruf, angka, dan underscore'),
  body('email')
    .optional()
    .trim()
    .matches(emailRegex).withMessage('Pola email tidak valid (harus user@domain.com dsb)'),
  body('phone')
    .optional()
    .trim()
    .matches(phoneRegex).withMessage('Pola nomor telepon harus dalam format internasional yang valid'),
  body('password')
    .optional()
    .trim()
    .matches(passwordRegex).withMessage('Password minimal 10 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter spesial'),
  body('balance')
    .optional()
    .isInt({ min: 0 }).withMessage('Balance must be a non-negative integer'),
];

const transactionCreationValidation = [
  body('user_id')
    .isInt().withMessage('User ID must be an integer'),
  body('item_id')
    .isInt().withMessage('Item ID must be an integer'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be at most 500 characters'),
];

const transactionIdValidation = [
  param('id')
    .isInt().withMessage('Transaction ID must be an integer'),
];

const validate = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      payload: null,
    });
  }
  next();
};

module.exports = {
  // emailRegex, passwordRegex, phoneRegex dihapus
  userRegistrationValidation,
  userUpdateValidation,
  transactionCreationValidation,
  transactionIdValidation,
  validate,
};