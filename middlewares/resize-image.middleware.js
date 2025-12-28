import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import asyncHandler from 'express-async-handler';

// Separate middlewares are used for better customization

// Middleware to resize mix of uploaded images for products and save to server
export const resizeImagesForProducts = asyncHandler(async (req, res, next) => {
  // Image processing for Image Cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 98 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image imageCoverFileName to DB
    req.body.imageCover = imageCoverFileName;
  }

  // Image processing for Images
  if (req.files.images && req.files.images.length > 0) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 98 })
          .toFile(`uploads/products/${imageName}`);

        // Save image imageName to DB
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// Middleware to resize of uploaded category image and saving to server
export const resizeImagesForCategories = asyncHandler(
  async (req, res, next) => {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${fileName}`);

      // Save image filename to DB
      req.body.image = fileName;
    }
    next();
  }
);

// Middleware to resize of uploaded brand image and saving to server
export const resizeImagesForBrands = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 98 })
      .toFile(`uploads/brands/${fileName}`);

    // Save image filename to DB
    req.body.image = fileName;
  }
  next();
});

// Middleware to resize of uploaded user image and saving to server
export const resizeImagesForUsers = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 98 })
      .toFile(`uploads/users/${fileName}`);

    // Save profile image filename to DB
    req.body.profileImg = fileName;
  }
  next();
});
