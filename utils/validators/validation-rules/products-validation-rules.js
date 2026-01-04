import { check } from 'express-validator';
import { CategoryModel } from '../../../models/category.model.js';
import { SubCategoryModel } from '../../../models/subCategory.model.js';

/**
 * Validator for product price.
 * @param {boolean} isRequired - Whether the field is required. Default is true.
 */
export const priceRules = (isRequired = true) =>
  (isRequired
    ? check('price').notEmpty().withMessage('Product price is required')
    : check('price').optional()
  )
    .isFloat({ min: 0, max: 500000 })
    .withMessage('Product price must be a non-negative number, maximum 500000')
    .toFloat();

/**
 * Validator for product price after discount.
 * Makes Sure that priceAfterDiscount is less than original price.
 *
 * [Always Optional Field.]
 */
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

/**
 * Validator for category field.
 * @param {boolean} isRequired - Whether the field is required. Default is true.
 */
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

/**
 * Validator for subcategories field.
 * Validates that each subcategory ID is valid and belongs to the specified category.
 *
 * [Always Optional Field.]
 */
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

/**
 * Validator for brand field.
 * Validates the brand ID format.
 *
 * [Always Optional Field.]
 */
export const brandRules = () =>
  check('brand').optional().isMongoId().withMessage('Invalid brand id format');
