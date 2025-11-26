# Event Planner Backend

Production-ready backend API for the Event Services Booking Platform built with Express, TypeScript, MongoDB, and Firebase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- MongoDB Atlas account
- Firebase project
- Cloudinary account
- Razorpay account (optional for development)

### Installation

1. **Run setup script** (recommended):
```bash
chmod +x setup.sh
./setup.sh
```

2. **Manual setup**:
```bash
# Install dependencies
pnpm install

# Build shared package
cd ../../packages/shared && pnpm build && cd ../../apps/backend

# Copy environment file
cp .env.example .env

# Update .env with your credentials
```

3. **Start development server**:
```bash
pnpm dev
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
src/
├── config/          # Configuration (DB, Firebase, Razorpay, Cloudinary)
├── controllers/     # Request handlers
│   ├── admin.controller.ts
│   ├── booking.controller.ts
│   ├── payment.controller.ts
│   ├── review.controller.ts
│   ├── user.controller.ts
│   └── vendor.controller.ts
├── middleware/      # Express middleware
│   ├── auth.middleware.ts
│   ├── authorize.middleware.ts
│   ├── error.middleware.ts
│   ├── upload.middleware.ts
│   └── validate.middleware.ts
├── models/          # Mongoose models
│   ├── Booking.model.ts
│   ├── Payment.model.ts
│   ├── Review.model.ts
│   ├── User.model.ts
│   └── Vendor.model.ts
├── routes/          # API routes
│   ├── admin.routes.ts
│   ├── auth.routes.ts
│   ├── booking.routes.ts
│   ├── payment.routes.ts
│   ├── review.routes.ts
│   ├── user.routes.ts
│   └── vendor.routes.ts
├── schemas/         # Validation schemas
│   └── validation.schemas.ts
├── services/        # Business logic services
│   ├── analytics.service.ts
│   └── cloudinary.service.ts
├── utils/           # Utility functions
│   └── test-helpers.ts
└── index.ts         # Application entry point
```

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-planner

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Razorpay (optional for development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

### Endpoints

#### Authentication
- `POST /auth/login` - Login/register with Firebase token

#### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/avatar` - Upload avatar

#### Vendors
- `GET /vendors/search` - Search vendors
- `GET /vendors/:id` - Get vendor details
- `POST /vendors` - Create vendor profile
- `PUT /vendors/:id` - Update vendor
- `GET /vendors/my/profile` - Get own profile
- `POST /vendors/upload` - Upload images

#### Bookings
- `POST /bookings` - Create booking
- `POST /bookings/verify` - Verify payment
- `GET /bookings/user` - Get user bookings
- `GET /bookings/vendor` - Get vendor bookings

#### Reviews
- `POST /reviews` - Create review
- `GET /reviews/vendor/:id` - Get vendor reviews
- `POST /reviews/:id/response` - Respond to review

#### Payments
- `POST /payments/webhook` - Razorpay webhook
- `GET /payments/history` - Payment history

#### Admin
- `GET /admin/vendors/pending` - Pending vendors
- `PUT /admin/vendors/:id/verify` - Verify vendor
- `GET /admin/analytics` - Platform analytics
- `GET /admin/bookings` - All bookings

See [API_TESTING.md](./API_TESTING.md) for detailed examples.

## 🧪 Testing

### Manual Testing
```bash
# See API_TESTING.md for curl examples
cat API_TESTING.md
```

### Test Utilities
```typescript
import { mockAuth, mockUser, authenticatedRequest } from './utils/test-helpers';
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Role-based authorization (CUSTOMER, VENDOR, ADMIN)
- ✅ Firebase token verification
- ✅ Razorpay webhook signature verification
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Request validation with Zod
- ✅ File upload validation

## 📦 Available Scripts

```bash
pnpm dev      # Start development server with hot reload
pnpm build    # Build for production
pnpm start    # Start production server
pnpm seed     # Seed database with sample data
pnpm clean    # Clean build directory
```

## 🚢 Deployment

### Railway / Render
1. Connect your repository
2. Set environment variables
3. Deploy automatically

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Use production Firebase credentials
- Set secure `JWT_SECRET`
- Configure Razorpay production keys
- Set production `FRONTEND_URL`

## 🔧 Development

### Adding New Endpoints

1. **Create controller** in `src/controllers/`
2. **Create route** in `src/routes/`
3. **Add validation schema** in `src/schemas/`
4. **Wire up route** in `src/index.ts`
5. **Update API documentation**

### Adding Validation

```typescript
import { validateBody } from './middleware/validate.middleware';
import { createBookingSchema } from './schemas/validation.schemas';

router.post('/bookings', authenticate, validateBody(createBookingSchema), createBooking);
```

## 📊 Features

- ✅ User authentication & profile management
- ✅ Vendor profile creation & management
- ✅ Booking system with payment integration
- ✅ Review & rating system
- ✅ Admin vendor verification
- ✅ Platform analytics
- ✅ Image uploads to Cloudinary
- ✅ Payment webhooks
- ✅ Role-based access control

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas network access
- Ensure IP is whitelisted

### Firebase Authentication Error
- Verify Firebase credentials in `.env`
- Check private key format (must include `\n`)
- Ensure service account has proper permissions

### Cloudinary Upload Error
- Verify Cloudinary credentials
- Check file size limits (5MB max)
- Ensure file type is supported (JPEG, PNG, WebP)

### Razorpay Payment Error
- For development, mock keys are used
- For production, set proper Razorpay keys
- Verify webhook secret for production

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for the event planning community**
