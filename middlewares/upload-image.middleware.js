import multer from 'multer';
import { ApiError, HttpStatusCode } from '../utils/api-error.js';

const multerOptions = () => {
  // Disk Storage Configuration for Multer Not Used Currently but kept for reference
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/categories');
  //   },
  //   filename: function (req, file, cb) {
  //     // Unique Naming Convention: CategoryName-$id-$timestamp-extension
  //     const ext = file.mimetype.split('/')[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   },
  // });

  // Memory Storage Configuration for Multer to process images before saving using Sharp
  const multerStorage = multer.memoryStorage();

  // File Filter to allow only images
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(
        new ApiError('Only Images Allowed.', HttpStatusCode.BAD_REQUEST),
        false
      );
    }
  };

  // Configure multer for file uploads
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

export const uploadSingleImage = (fieldName) => {
  const upload = multerOptions();
  return upload.single(fieldName);
};

export const uploadMixOfImages = (arrayOfFields) => {
  const upload = multerOptions();
  return upload.fields(arrayOfFields);
};
