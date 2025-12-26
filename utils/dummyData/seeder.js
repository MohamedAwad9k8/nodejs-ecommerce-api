/* eslint-disable n/no-process-exit */
import * as fs from 'fs';
import 'colors';
import dotenv from 'dotenv';

import { ProductModel } from '../../models/product.model.js';
import { dbConnect } from '../../config/database.js';

dotenv.config({ path: '../../config.env' });

// connect to DB
dbConnect(process.env.MONGODB_URI);

// Read data
const products = JSON.parse(fs.readFileSync('./products.json'));

// Insert data into DB
const insertData = async () => {
  try {
    await ProductModel.create(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await ProductModel.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -i  => insert data
// node seeder.js -d  => delete data
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
