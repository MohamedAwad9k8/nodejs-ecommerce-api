# NodeJS E-Commerce API

A robust, scalable Node.js REST API for an e-commerce platform built with modern
technologies and best practices. This project aims to demonstrates comprehensive
backend development skills, including authentication, payment integration, image
handling, and security implementations.

## 🚀 Features

### Core E-Commerce Functionality

- **User Management**: Registration, authentication, password reset, profile
  management
- **Product Catalog**: CRUD operations, image uploads, categorization, branding
- **Shopping Cart**: Add/remove items, quantity management, coupon application
- **Order Processing**: Cash and online payments via Stripe integration
- **Review System**: Product reviews and ratings with user feedback
- **Wishlist**: Save favorite products for later
- **Address Management**: Multiple delivery addresses per user
- **Coupon System**: Discount codes for orders

### Security & Performance

- **Authentication & Authorization**: JWT-based auth with role-based access
  (User, Admin, Manager)
- **Data Security**: Password hashing, input sanitization, XSS protection, NoSQL
  injection prevention
- **Rate Limiting**: API rate limiting to prevent abuse (100 requests/15min per
  IP)
- **Error Middleware Layer**: Global error handling with custom ApiError class
  and environment-specific responses
- **Validation Layer**: Multi-layer input validation with express-validator,
  custom validation rules, and middleware
- **Image Processing**: Sharp-based image resizing and optimization
- **Input Validation**: Express-validator for robust data validation with custom
  error messages

### Technical Features

- **Payment Integration**: Stripe checkout with webhooks for order fulfillment
- **Email Notifications**: Nodemailer for password reset and notifications
- **File Upload**: Multer for image uploads with Sharp processing
- **Database**: MongoDB with Mongoose ODM
- **API Features**: Advanced querying with pagination, filtering, sorting, and
  search
- **Error Handling**: Comprehensive error middleware with environment-specific
  responses
- **Input Validation**: Multi-layer validation system with express-validator and
  custom rules
- **Environment Management**: Environment-based configuration
- **Docker Support**: Containerized MongoDB setup

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js with ES6+ modules
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Payments**: Stripe API
- **Email**: Nodemailer
- **Image Processing**: Sharp
- **File Upload**: Multer

### Security & Validation

- **Password Hashing**: bcryptjs
- **Input Sanitization**: express-mongo-sanitize, xss-clean
- **Rate Limiting**: express-rate-limit
- **Parameter Pollution Protection**: hpp
- **CORS**: cors middleware
- **Validation**: express-validator

### Development Tools

- **Process Management**: nodemon for development
- **Linting**: ESLint with Airbnb config
- **Code Formatting**: Prettier
- **Containerization**: Docker Compose for database

## API Features

The API includes advanced querying capabilities for efficient data retrieval:

- **Pagination**: Control page size and navigation with `page` and `limit`
  parameters
- **Filtering**: Advanced filtering with operators (`gt`, `gte`, `lt`, `lte`,
  `in`) for numeric fields
- **Sorting**: Multi-field sorting with ascending/descending options
- **Field Selection**: Select specific fields to include/exclude in responses
- **Search**: Full-text search across product titles and descriptions
- **Category/Brand Filtering**: Filter products by categories and brands

Example:
`GET /api/v1/products?page=2&limit=10&price[gte]=100&sort=-price,rating&fields=title,price,images`

## Project Structure

```
├── config/
│   └── database.js              # MongoDB connection configuration
├── middlewares/
│   ├── error.middleware.js      # Global error handling
│   ├── upload-image.middleware.js # File upload handling
│   ├── resize-image.middleware.js # Image processing
│   ├── validator.middleware.js  # Input validation
│   └── ...
├── models/
│   ├── user.model.js            # User schema with authentication
│   ├── product.model.js         # Product catalog schema
│   ├── order.model.js           # Order management schema
│   ├── cart.model.js            # Shopping cart schema
│   ├── review.model.js          # Product reviews schema
│   └── ...
├── routes/
│   ├── index.js                 # Route mounting
│   ├── auth.routes.js           # Authentication endpoints
│   ├── product.routes.js        # Product CRUD operations
│   ├── order.routes.js          # Order management
│   └── ...
├── services/
│   ├── auth.service.js          # Authentication logic
│   ├── product.service.js       # Product business logic
│   ├── order.service.js         # Order processing & payments
│   ├── handlers/
│   │   └── handlers-factory.js  # Generic CRUD handlers
│   └── ...
├── utils/
│   ├── api-error.js             # Custom error classes
│   ├── api-features.js          # Query features (filtering, sorting, pagination)
│   ├── send-email.js            # Email utility
│   ├── validators/              # Input validation rules
│   └── ...
├── uploads/                     # Static file storage
├── server.js                    # Application entry point
├── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Docker (optional, for containerized database)

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
BASE_URL=http://localhost:8000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/MohamedAwad9k8/nodejs-ecommerce-api.git
   cd nodejs-ecommerce-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start MongoDB**
   - Using Docker:
     ```bash
     docker-compose up -d
     ```
   - Or use local/cloud MongoDB instance

4. **Run the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

The API provides comprehensive endpoints for all e-commerce operations including
user management, product catalog, shopping cart, orders, reviews, and
administrative functions.

### Key Endpoints Overview

- **Authentication**: `/api/v1/auth/*` - Signup, login, password reset
- **Products**: `/api/v1/products/*` - CRUD operations with advanced filtering
- **Orders**: `/api/v1/orders/*` - Order management and Stripe payment
  integration
- **Cart**: `/api/v1/cart/*` - Shopping cart operations
- **Reviews**: `/api/v1/reviews/*` - Product review system
- **Users**: `/api/v1/users/*` - User profile management
- **Admin**: `/api/v1/admin/users/*` - Administrative functions for users
  resource

### Interactive Documentation

For detailed API documentation with request/response examples and interactive
testing, visit:

- **Swagger UI**: `http://localhost:8000/api-docs` (when running locally)
- **Open API Specs File**: Available in the repository under `api-docs/`

All endpoints support advanced features including pagination, filtering,
sorting, and search as described in the API Features section above.

## Payment Integration

### Stripe Integration

- **Checkout Sessions**: Secure payment processing
- **Webhooks**: Automatic order fulfillment on payment completion
- **Currency Support**: Configurable currency (currently EGP)
- **Order Tracking**: Payment status updates and order management

### Supported Payment Methods

- **Cash on Delivery**: Traditional payment method
- **Credit/Debit Cards**: Via Stripe secure checkout
- **Future Extensions**: Ready for additional payment gateways

## 📧 Email System

- **Password Reset**: Secure password recovery flow
- **Transactional Emails**: Order confirmations and notifications
- **SMTP Configuration**: Flexible email provider setup
- **Template Support**: HTML email templates

## 🖼️ Image Management

- **Multiple Uploads**: Support for product galleries
- **Image Optimization**: Sharp-based resizing and compression
- **Format Support**: JPEG, PNG, WebP conversion
- **Storage**: Local file system with URL generation
- **CDN Ready**: Architecture supports cloud storage integration

## 🧪 Testing & Development

### Available Scripts

```bash
# Development server with auto-reload
npm run start:dev

# Production server
npm run start:prod
```

### Database Seeding

```bash
# Navigate to dummy data directory
cd utils/dummyData

# Insert sample products
node seeder.js -i

# Remove sample data
node seeder.js -d
```

## What's Next / Next Steps

This Node.js/Express project was built as part of my learning journey in backend engineering. While it’s fully functional for core e-commerce operations, the next steps include:

- Migrating the API to **NestJS + TypeScript** for a more modular and maintainable architecture
- Deploying the project on **AWS ECS** for cloud-based production readiness
- Integrating **PostgreSQL** in place of MongoDB for relational data handling
- Adding **Redis caching** for improved performance
- Enhancing **security and input validation** with updated libraries and practices
- Building a **modular microservices-ready architecture** to support future extensions (notifications, payment service, etc.)
