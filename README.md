# Event Services Booking Platform 🎉

A production-ready event services booking platform built with Next.js, TypeScript, Material UI, and Express. Book premium vendors for weddings, birthdays, corporate events, and more.

![Platform Status](https://img.shields.io/badge/status-in%20development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Material UI](https://img.shields.io/badge/Material%20UI-7.3-007FFF)

## ✨ Features

### For Customers
- 🔍 **Smart Search**: Find vendors by category, city, date, and rating
- ✅ **Verified Vendors**: All vendors are verified and reviewed
- 📅 **Real-time Availability**: Check and book available dates instantly
- 💳 **Secure Payments**: Razorpay integration with advance/full payment options
- ⭐ **Reviews & Ratings**: Read authentic reviews from verified customers
- 📱 **Responsive Design**: Beautiful UI on all devices

### For Vendors
- 📝 **Easy Onboarding**: Illustrated multi-step registration process
- 📦 **Package Management**: Create and manage service packages
- 📅 **Availability Control**: Set your available dates and time slots
- 💰 **Booking Management**: Track bookings and payments
- 📊 **Dashboard**: Comprehensive vendor dashboard

### For Admins
- ✅ **Vendor Verification**: Approve/reject vendor applications
- 🔍 **Dispute Management**: Handle customer-vendor disputes
- 💸 **Payout Exports**: Generate payout reports
- 📈 **Analytics**: Platform analytics and insights

## 🏗️ Architecture

### Monorepo Structure
```
event-planner/
├── apps/
│   ├── frontend/          # Next.js 16 + TypeScript + Material UI
│   └── backend/           # Express + TypeScript + MongoDB
├── packages/
│   └── shared/            # Shared types, schemas, constants
├── BRANDING.md            # Design system & branding guidelines
├── DECISIONS.md           # Technical decisions log
└── pnpm-workspace.yaml    # Workspace configuration
```

### Tech Stack

#### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: Material UI 7
- **Styling**: Tailwind CSS + Material UI Theme
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Auth**: Firebase Auth (Phone/Email OTP)
- **State**: React Context (planned)

#### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Auth**: Firebase Admin SDK + JWT
- **Payments**: Razorpay
- **File Storage**: Cloudinary
- **Validation**: Zod

#### Shared
- **Types**: TypeScript interfaces
- **Validation**: Zod schemas
- **Constants**: Shared enums and configs

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- MongoDB Atlas account
- Firebase project
- Razorpay account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd event-planner
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Build shared package**
```bash
pnpm --filter @event-planner/shared build
```

4. **Setup environment variables**

**Frontend** (`apps/frontend/.env.local`):
```env
# Copy from apps/frontend/env.example
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend** (`apps/backend/.env`):
```env
# Copy from apps/backend/.env.example
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-planner
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. **Run development servers**

**All services** (recommended):
```bash
pnpm dev
```

**Frontend only**:
```bash
pnpm --filter frontend dev
```

**Backend only**:
```bash
pnpm --filter backend dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📱 Screenshots

### Landing Page
The landing page features a stunning gradient hero section with glassmorphism design, animated features, and clear CTAs.

![Hero Section](/.gemini/antigravity/brain/a4a84e37-5880-4d8c-afee-14402d4ddd43/landing_hero_1764089950821.png)

![Features Section](/.gemini/antigravity/brain/a4a84e37-5880-4d8c-afee-14402d4ddd43/landing_features_1764089957335.png)

![How It Works](/.gemini/antigravity/brain/a4a84e37-5880-4d8c-afee-14402d4ddd43/landing_how_it_works_1764089963801.png)

## 🎨 Design System

See [BRANDING.md](./BRANDING.md) for complete design guidelines including:
- Color palette (Violet + Pink gradient)
- Typography (Inter, Poppins, DM Sans)
- Spacing system
- Component styles
- Animation guidelines
- Illustration usage

### Key Design Principles
- **Glassmorphism**: Modern, premium aesthetic
- **Soft Gradients**: Violet to pink for warmth and elegance
- **Smooth Animations**: Framer Motion for delightful interactions
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 AA compliant

## 📚 Documentation

- [BRANDING.md](./BRANDING.md) - Design system and branding guidelines
- [DECISIONS.md](./DECISIONS.md) - Technical decisions and rationale
- [task.md](/.gemini/antigravity/brain/a4a84e37-5880-4d8c-afee-14402d4ddd43/task.md) - Project task tracker

## 🔧 Development

### Project Structure

```
apps/frontend/
├── app/                   # Next.js app directory
│   ├── layout.tsx        # Root layout with theme
│   └── page.tsx          # Landing page
├── lib/                  # Utilities
│   └── firebase.ts       # Firebase config
└── theme/                # Material UI theme
    └── index.ts          # Theme configuration

apps/backend/
├── src/
│   ├── config/           # Configuration files
│   ├── models/           # Mongoose models
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes (planned)
│   ├── controllers/      # Route controllers (planned)
│   ├── services/         # Business logic (planned)
│   └── index.ts          # Server entry point

packages/shared/
├── src/
│   ├── types/            # TypeScript interfaces
│   ├── schemas/          # Zod validation schemas
│   └── constants/        # Shared constants
```

### Available Scripts

```bash
# Development
pnpm dev                  # Run all services
pnpm --filter frontend dev    # Frontend only
pnpm --filter backend dev     # Backend only

# Build
pnpm build                # Build all packages
pnpm --filter shared build    # Build shared package

# Lint
pnpm lint                 # Lint all packages
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Verso/Railway)
1. Connect repository
2. Set environment variables
3. Deploy with automatic builds

## 🔐 Security

- Firebase Auth for secure authentication
- JWT tokens for API authorization
- Razorpay for PCI-compliant payments
- Environment variables for secrets
- CORS configuration
- Helmet.js for security headers
- Rate limiting (planned)

## 📝 API Documentation

API documentation will be available via:
- Postman collection (planned)
- OpenAPI/Swagger docs (planned)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Material UI for the component library
- Storyset & unDraw for illustrations
- Firebase for authentication
- Razorpay for payments
- Cloudinary for image management

## 📞 Support

For support, email support@eventplanner.com or open an issue.

---

**Built with ❤️ for the event planning community**
