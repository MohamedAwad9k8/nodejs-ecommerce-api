import slugify from 'slugify';
import { check } from 'express-validator';

// Common validation rules
/**
 * Validator for id field in params or in body.
 * Checks if the id is a valid MongoDB ObjectId.
 *
 * [Always Mandatory Field.]
 */
export const idRules = () => [
  check('id').isMongoId().withMessage('Invalid ID format'),
];

/**
 * Validator for "name" / "title" fields.
 * Adds a slug to `req.body.slug` derived from the given field value.
 * @param {boolean} isRequired - Whether the field is required. Default is true.
 * @param {string} fieldName - The name of the field to validate. Values can be 'name' or 'title'. Default is 'name'.
 */
export const nameTitleRules = (isRequired = true, fieldName = 'name') =>
  (isRequired
    ? check(fieldName).notEmpty().withMessage(`${fieldName} is required`)
    : check(fieldName).optional()
  )
    .isLength({ min: 3, max: 32 })
    .withMessage(
      `${fieldName} must be at least 3 characters and can't exceed 32 characters`
    )
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    });

/**
 * Validator for "image" / "profileImg" / "imageCover" fields.
 * This field is always optional.
 * @param {boolean} isRequired - Whether the field is required. Default is true.
 * @param {string} fieldName - The name of the field to validate.
 * Values can be 'image' or 'profileImg' or 'imageCover'. Default is 'image'.
 */
export const imageRules = (isRequired = true, fieldName = 'image') =>
  (isRequired
    ? check(fieldName).notEmpty().withMessage(`${fieldName} is required`)
    : check(fieldName).optional()
  )
    .isString()
    .withMessage(`${fieldName} must be a string`);

/**
 * Validator for "images" / "colors" fields.
 * This field is always optional, it checks for an array of strings.
 * @param {[string]} fieldName - The name of the field to validate. Values can be 'images' or 'colors'. Default is 'images'.
 *
 * [Always Optional Field.]
 */
export const optionalArrayRules = (fieldName = 'images') =>
  check(fieldName)
    .optional()
    .isArray()
    .withMessage(`${fieldName} must be an array of strings`);

/**
 * Validator for optional boolean fields.
 * @param {string} fieldName - The name of the field to validate. Default is 'isActive'.
 *
 * [Always Optional Field.]
 */
export const optionalBooleanRules = (fieldName = 'isActive') =>
  check(fieldName)
    .optional()
    .isBoolean()
    .withMessage(`${fieldName} must be a boolean value`)
    .toBoolean();

/**
 * Validator for description field.
 * This field is always optional, it checks for an array of strings.
 * @param {boolean} isRequired - Whether the field is required. Default is true.
 * @param {string} fieldName - The name of the field to validate. Default is 'description'.
 */
export const descriptionRules = (
  isRequired = true,
  fieldName = 'description'
) =>
  (isRequired
    ? check(fieldName).notEmpty().withMessage(`${fieldName} is required`)
    : check(fieldName).optional()
  )
    .isLength({ min: 20 }, { max: 500 })
    .withMessage(
      `${fieldName} must be at least 20 characters long and can't exceed 500 characters`
    );

/**
 * Validator for quantity fields.
 * Validates that the field is a non-negative integer.
 * @param {boolean} isRequired - Whether the field is required. Default is true.
 * @param {string} fieldName - The name of the field to validate. Values can be 'quantity' or 'sold' or 'ratingsQuantity'. Default is 'quantity'.
 */
export const quantityRules = (isRequired = true, fieldName = 'quantity') =>
  (isRequired
    ? check(fieldName).notEmpty().withMessage(`${fieldName} is required`)
    : check(fieldName).optional()
  )
    .isInt({ min: 0 })
    .withMessage(`${fieldName} must be a non-negative integer`)
    .toInt();

/**
 * Validator for ratings average field.
 * Ensures the value is between 1 and 5.
 * @param {boolean} isRequired - Whether the field is required. Default is true.
 * @param {string} fieldName - The name of the field to validate. Default is 'ratingsAverage'.
 * Values can be "ratingsAverage" or "rating"
 * [Always Optional Field.]
 */
export const ratingsRules = (isRequired = true, fieldName = 'ratingsAverage') =>
  (isRequired
    ? check(fieldName).notEmpty().withMessage('Ratings average is required')
    : check(fieldName).optional()
  )
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings average must be a number between 1 and 5')
    .toFloat();

// Sanitizer to remove product from incoming payload on update
/**
 * Sanitizer to remove specific fields from specific requests.
 * @param {string} fieldName - The name of the field to remove.
 */
export const removeField = (fieldName) =>
  check(fieldName).customSanitizer(() => undefined);
