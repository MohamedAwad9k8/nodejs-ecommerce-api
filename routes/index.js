import { CategoryRouter } from './category.routes.js';
import { SubCategoryRouter } from './subCategory.routes.js';
import { BrandRouter } from './brand.routes.js';
import { ProductRouter } from './product.routes.js';
import { UserRouter, AdminRouter } from './user.routes.js';
import { AuthRouter } from './auth.routes.js';
import { ReviewRouter } from './review.routes.js';
import { WishlistRouter } from './wishlist.routes.js';
import { AddressRouter } from './address.routes.js';
import { CouponRouter } from './coupon.routes.js';
import { CartRouter } from './cart.routes.js';
import { OrderRouter } from './order.routes.js';

export const mountRoutes = (app) => {
  app.use('/api/v1/categories', CategoryRouter);
  app.use('/api/v1/subcategories', SubCategoryRouter);
  app.use('/api/v1/brands', BrandRouter);
  app.use('/api/v1/products', ProductRouter);
  app.use('/api/v1/users', UserRouter);
  app.use('/api/v1/admin/users', AdminRouter);
  app.use('/api/v1/auth', AuthRouter);
  app.use('/api/v1/reviews', ReviewRouter);
  app.use('/api/v1/wishlist', WishlistRouter);
  app.use('/api/v1/addresses', AddressRouter);
  app.use('/api/v1/coupons', CouponRouter);
  app.use('/api/v1/cart', CartRouter);
  app.use('/api/v1/orders', OrderRouter);
};
