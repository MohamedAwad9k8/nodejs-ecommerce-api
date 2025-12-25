import { check } from 'express-validator';

export const idRules = () =>
  check('id').isMongoId().withMessage('Invalid ID format');

export const nameRules = (isRequired = true) =>
  (isRequired
    ? check('name').notEmpty().withMessage('Product name is required')
    : check('name').optional()
  )
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Product name must be at least 3 characters and can't exceed 32 characters"
    );

export const titleRules = (isRequired = true) =>
  (isRequired
    ? check('title').notEmpty().withMessage('Product title is required')
    : check('title').optional()
  )
    .isLength({ min: 3, max: 32 })
    .withMessage(
      "Product title must be at least 3 characters and can't exceed 32 characters"
    );

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
    .withMessage('Invalid category id format');

export const subcategoryRules = () =>
  check('subcategory')
    .optional()
    .isArray()
    .withMessage('Subcategory must be an array of IDs')
    .isMongoId()
    .withMessage('Invalid subcategory id format');

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
