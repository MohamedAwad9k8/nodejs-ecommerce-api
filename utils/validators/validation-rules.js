import slugify from 'slugify';
import bcrypt from 'bcryptjs';
import { check } from 'express-validator';
import { CategoryModel } from '../../models/category.model.js';
import { SubCategoryModel } from '../../models/subCategory.model.js';
import { UserModel } from '../../models/user.model.js';

// Common validation rules
export const idRules = () => [
  check('id').isMongoId().withMessage('Invalid ID format'),
];

export const nameRules = (isRequired = true) =>
  (isRequired
    ? check('name').notEmpty().withMessage('Product name is required')
    : check('name').optional()
  )
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Product name must be at least 3 characters and can't exceed 32 characters"
    )
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    });

export const imageRules = () =>
  check('image').optional().isString().withMessage('Image must be a string');

// Product validation rules
export const titleRules = (isRequired = true) =>
  (isRequired
    ? check('title').notEmpty().withMessage('Product title is required')
    : check('title').optional()
  )
    .isLength({ min: 3, max: 64 })
    .withMessage(
      "Product title must be at least 3 characters and can't exceed 64 characters"
    )
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    });

export const descriptionRules = (isRequired = true) =>
  (isRequired
    ? check('description')
        .notEmpty()
        .withMessage('Product description is required')
    : check('description').optional()
  )
    .isLength({ min: 20 }, { max: 500 })
    .withMessage(
      "Product description must be at least 20 characters long and can't exceed 500 characters"
    );

export const quantityRules = (isRequired = true) =>
  (isRequired
    ? check('quantity').notEmpty().withMessage('Product quantity is required')
    : check('quantity').optional()
  )
    .isInt({ min: 0 })
    .withMessage('Product quantity must be a non-negative integer')
    .toInt();

export const soldRules = (isRequired = false) =>
  (isRequired
    ? check('sold').notEmpty().withMessage('Product sold is required')
    : check('sold').optional()
  )
    .isInt({ min: 0 })
    .withMessage('Product sold must be a non-negative integer')
    .toInt();

export const priceRules = (isRequired = true) =>
  (isRequired
    ? check('price').notEmpty().withMessage('Product price is required')
    : check('price').optional()
  )
    .isFloat({ min: 0, max: 500000 })
    .withMessage('Product price must be a non-negative number, maximum 500000')
    .toFloat();

export const priceAfterDiscountRules = () =>
  check('priceAfterDiscount')
    .optional()
    .isFloat({ min: 0, max: 500000 })
    .withMessage('Product price must be a non-negative number, maximum 500000')
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error(
          'Price after discount must be lower than the original price'
        );
      }
      return true;
    });

export const colorsRules = () =>
  check('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array of strings');

export const imageCoverRules = (isRequired = true) =>
  (isRequired
    ? check('imageCover')
        .notEmpty()
        .withMessage('Product image cover is required')
    : check('imageCover').optional()
  )
    .isString()
    .withMessage('Product image cover must be a string');

export const imagesRules = () =>
  check('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of strings');

export const categoryRules = (isRequired = true) =>
  (isRequired
    ? check('category')
        .notEmpty()
        .withMessage('Product must belong to a category')
    : check('category').optional()
  )
    .isMongoId()
    .withMessage('Invalid category id format')
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No Category for this ID: ${categoryId}`)
          );
        }
      })
    );

export const subcategoryRules = () =>
  check('subcategories')
    .optional()
    .isArray()
    .withMessage('Subcategory must be an array of IDs')
    .isMongoId()
    .withMessage('Invalid subcategory id format')
    .custom((subcategoriesIds) =>
      SubCategoryModel.find({
        _id: { $exists: true, $in: subcategoriesIds },
      }).then((result) => {
        if (result.length < 1 || result.length !== subcategoriesIds.length) {
          return Promise.reject(
            new Error(
              `One or more of the entered SubCategories IDs are Invalid`
            )
          );
        }
      })
    )
    .custom((subcategoriesIds, { req }) =>
      SubCategoryModel.find({ category: req.body.category }).then(
        (subcategories) => {
          const subcategoriesIdsInDB = [];
          subcategories.forEach((subcategory) => {
            subcategoriesIdsInDB.push(subcategory._id.toString());
          });
          console.log(subcategoriesIdsInDB);
          const isBelong = subcategoriesIds.every((subcategoryId) =>
            subcategoriesIdsInDB.includes(subcategoryId)
          );
          if (!isBelong) {
            return Promise.reject(
              new Error(
                `One or more of the entered Subcategories don't belong to this Category`
              )
            );
          }
        }
      )
    );

export const brandRules = () =>
  check('brand').optional().isMongoId().withMessage('Invalid brand id format');

export const ratingsAverageRules = () =>
  check('ratingsAverage')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings average must be a number between 1 and 5')
    .toFloat();

export const ratingsQuantityRules = () =>
  check('ratingsQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Ratings quantity must be a non-negative integer');

// User validation rules
export const emailRules = (isRequired = true, isLogin = false) => {
  let validator = (
    isRequired
      ? check('email').notEmpty().withMessage('Email is required')
      : check('email').optional()
  )
    .isEmail()
    .withMessage('Invalid email address');

  if (!isLogin) {
    validator = validator.custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already exists'));
        }
      })
    );
  }

  return validator;
};

export const passwordRules = (isLogin = false) => {
  let validator = check('password')
    .notEmpty()
    .withMessage('Password is required');
  if (!isLogin) {
    validator = validator
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters');
  }
  return validator;
};

export const passwordConfirmRules = () =>
  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      // verify password confirmation
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    });

export const currentPasswordRules = () =>
  check('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .custom(async (value, { req }) => {
      // verify user id exists
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error('User not found');
      }
      // verify current password
      const isMatch = await bcrypt.compare(value, user.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }
      return true;
    });

export const phoneRules = () =>
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA', 'en-US'])
    .withMessage('Invalid phone number');

export const roleRules = () =>
  check('role')
    .optional()
    .isIn(['user', 'admin', 'manager'])
    .withMessage('Role must be either user, admin or manager');

export const profileImgRules = () =>
  check('profileImg')
    .optional()
    .isString()
    .withMessage('Profile image must be a string');

export const isActiveRules = () =>
  check('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
    .toBoolean();
