import { body, validationResult } from "express-validator";
import userModel from "../features/user/user.schema.js";

export const signUpFormValidate = async (req, res, next) => {

  const rules = [
    body('type').notEmpty()
      .isIn(['customer', 'seller']).withMessage('User type must be either customer or seller'),
    body('name')
      .isLength({ min: 5, max: 25 })
      .withMessage('Name must be between 5 to 25 characters')
      .custom((value, { req }) => {
        return !/\d/.test(value) && !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);
      })
      .withMessage("Name Doesn't contain Special Character and digit"),
    body('email')
      .isEmail().withMessage('Enter a valid email')
      .custom(async (value) => {
        const existingUser = await userModel.findOne({ email: value });
        if (existingUser) {
          throw new Error('Email is already registered');
        }
        return true;
      }),
    body('password')
      .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/).withMessage('Password must contain at least one digit')
      .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/).withMessage('Password must contain at least one special character'),

    body("profileImage")
      .custom((value, { req }) => {
        if (req.file.mimetype === "image/gif" || req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg") {
          return true;
        } else {
          return false;
        }
      }).withMessage("please upload  an image gif, Jpg, Jpeg, Png")
  ];

  for (const rule of rules) {
    await rule.run(req);
  }

  //3. check if there are any errors after running the rules.

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ success: false, msg:'validation Failed', errors: errors });
};


export const addProductFormValidate = async (req, res, next) => {
  console.log(req.body);
  const rules = [
    body('name')
      .notEmpty()
      .withMessage('Name is required'),
    body('price')
      .notEmpty()
      .isNumeric()
      .withMessage('Price must be a number'),
    body('category')
      .isArray()
      .withMessage('Category must be an array of strings')
      .custom((value, { req }) => {
        const allowedCategories = ['electronics', 'jewellery', 'shirt', 'men-s-wear', 'women-s-wear']; // Add your enum values here
        const invalidCategories = value.filter(cat => !allowedCategories.includes(cat));
        return invalidCategories.length === 0;
      })
      .withMessage('Category should select from given option'),
    body('sizes')
      .optional()
      .isArray()
      .withMessage('Sizes must be an array'),
    body('desc')
      .notEmpty()
      .withMessage('Description is required'),
    body('stocks')
      .notEmpty()
      .isNumeric()
      .withMessage('Stocks must be a number'),
    body('imageurl')
      .custom((value, { req }) => {
        if (req.file.mimetype === "image/gif" || req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg") {
          return true;
        } else {
          return false;
        }
      }).withMessage("please upload  an image gif, Jpg, Jpeg, Png"),
  ];


  for (const rule of rules) {
    await rule.run(req);
  }

  //3. check if there are any errors after running the rules.

  const errors = validationResult(req);
  // console.log(errors);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ success: false, msg:'validation Failed', errors: errors });
};