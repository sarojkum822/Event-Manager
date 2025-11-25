# Technical Decisions Log

## Architecture Decisions

### 1. Monorepo Structure with pnpm Workspaces
**Decision**: Use pnpm workspaces for monorepo management
**Rationale**: 
- Efficient disk space usage with hard links
- Fast installation and builds
- Better dependency management than npm/yarn
- Native workspace support
- Excellent for TypeScript projects with shared code

**Alternatives Considered**:
- Turborepo: More complex setup, overkill for current scope
- Lerna: Older, less maintained
- Nx: Too opinionated, steeper learning curve

**Status**: ✅ Implemented

---

### 2. Material UI vs shadcn/ui
**Decision**: Use Material UI for component library
**Rationale**:
- User specifically requested Material UI
- Production-ready components out of the box
- Excellent TypeScript support
- Comprehensive theming system
- Large ecosystem and community
- Better for rapid development

**Alternatives Considered**:
- shadcn/ui: More modern, but requires more setup
- Ant Design: Good, but Material UI has better customization
- Chakra UI: Less comprehensive component library

**Status**: ✅ Implemented

---

### 3. Mongoose vs Prisma for MongoDB
**Decision**: Use Mongoose for MongoDB ODM
**Rationale**:
- Native MongoDB support with rich schema features
- Middleware hooks for business logic
- Virtual properties and population
- Better for complex data relationships
- Mature ecosystem with extensive plugins
- Easier atomic operations for availability locking

**Alternatives Considered**:
- Prisma: Better TypeScript support, but MongoDB support is still experimental
- Native MongoDB Driver: Too low-level, requires more boilerplate
- TypeORM: Better for SQL, not optimized for MongoDB

**Status**: ✅ Implemented

---

### 4. Firebase Auth + JWT Backend Tokens
**Decision**: Use Firebase for client-side auth, generate JWT on backend
**Rationale**:
- Firebase handles OTP delivery (phone/email)
- Secure authentication without managing credentials
- JWT gives us control over session management
- Can add custom claims and permissions
- Reduces backend auth complexity

**Flow**:
1. Client authenticates with Firebase (phone/email OTP)
2. Client sends Firebase token to backend
3. Backend verifies Firebase token
4. Backend generates JWT with custom claims
5. Client uses JWT for subsequent API calls

**Status**: ✅ Implemented

---

### 5. Tailwind CSS + Material UI Theming
**Decision**: Use both Tailwind and Material UI theme system
**Rationale**:
- Material UI for components
- Tailwind for utility classes and rapid styling
- Material UI theme provides consistent design tokens
- Tailwind for responsive design and custom layouts
- Best of both worlds

**Status**: ✅ Implemented

---

### 6. Framer Motion for Animations
**Decision**: Use Framer Motion for animations
**Rationale**:
- Declarative API perfect for React
- Excellent performance
- Rich animation features (scroll, gestures, variants)
- TypeScript support
- Production-ready and battle-tested

**Alternatives Considered**:
- React Spring: More complex API
- GSAP: Requires licensing for commercial use
- CSS animations: Limited capabilities

**Status**: ✅ Implemented

---

### 7. React Icons for SVG Icons
**Decision**: Use React Icons library
**Rationale**:
- User specifically requested it
- Comprehensive icon sets (Feather, Material, etc.)
- Tree-shakeable
- Consistent API across icon sets
- Zero configuration

**Status**: ✅ Implemented

---

## Design Decisions

### 8. Glassmorphism Design Language
**Decision**: Use glassmorphism for premium feel
**Rationale**:
- Modern, premium aesthetic
- Perfect for event/wedding platform
- Creates depth and visual interest
- Works well with gradient backgrounds
- Aligns with user's "premium look" requirement

**Implementation**:
- `background: rgba(255, 255, 255, 0.7)`
- `backdrop-filter: blur(10px)`
- Soft shadows with brand color tints

**Status**: ✅ Implemented

---

### 9. Color Palette: Violet + Pink Gradient
**Decision**: Primary: Violet (#8B5CF6), Secondary: Pink (#EC4899)
**Rationale**:
- Violet/purple associated with luxury and elegance
- Pink adds warmth and celebration
- Gradient creates modern, dynamic feel
- Perfect for wedding/event industry
- High contrast with white backgrounds

**Status**: ✅ Implemented

---

### 10. Typography: Inter + Poppins + DM Sans
**Decision**: Use three complementary fonts
**Rationale**:
- Inter: Clean, readable body text
- Poppins: Friendly, modern headings
- DM Sans: Display text for special elements
- All from Google Fonts (free, fast CDN)
- Excellent readability on all devices

**Status**: ✅ Implemented

---

## Infrastructure Decisions

### 11. Deployment Strategy
**Decision**: Vercel for frontend, Verso/Railway for backend
**Rationale**:
- Vercel: Best Next.js hosting, automatic deployments
- Verso/Railway: Easy Node.js deployment, good free tier
- Separate deployments allow independent scaling
- CI/CD built-in

**Status**: ⏳ Pending (infrastructure setup)

---

### 12. Environment Variables Strategy
**Decision**: Separate .env files for frontend and backend
**Rationale**:
- Clear separation of concerns
- Frontend: NEXT_PUBLIC_ prefix for client-side vars
- Backend: Server-only secrets
- .env.example files for documentation

**Status**: ✅ Implemented

---

## Payment & Security Decisions

### 13. Razorpay Payment Flow
**Decision**: Create order on backend, verify on webhook
**Rationale**:
- Backend creates Razorpay order (secure)
- Frontend initiates payment with order ID
- Webhook updates booking status (atomic)
- Prevents payment manipulation
- Supports advance/full payment options

**Flow**:
1. User selects package and date
2. Backend creates booking (status: PENDING)
3. Backend creates Razorpay order
4. Frontend shows Razorpay checkout
5. User completes payment
6. Razorpay webhook hits backend
7. Backend verifies signature
8. Backend updates booking status (CONFIRMED)

**Status**: ⏳ Pending (implementation)

---

### 14. Availability Locking Strategy
**Decision**: Use MongoDB transactions for atomic booking
**Rationale**:
- Prevents double-booking
- Check availability + create booking in single transaction
- Rollback on failure
- Vendor availability array updated atomically

**Status**: ⏳ Pending (implementation)

---

## Future Considerations

### 15. Redis Caching (Later)
**Decision**: Defer Redis implementation to v2
**Rationale**:
- Not critical for MVP
- Can add later for:
  - Search result caching
  - Session storage
  - Rate limiting
- Focus on core features first

**Status**: 📋 Deferred

---

### 16. Image Optimization
**Decision**: Use Cloudinary for all images
**Rationale**:
- Automatic optimization and resizing
- CDN delivery
- Transformation API
- Free tier sufficient for MVP
- Next.js Image component integration

**Status**: ⏳ Pending (implementation)

---

## Notes

- All decisions are documented here for future reference
- Alternatives are listed to show consideration
- Status indicators: ✅ Implemented, ⏳ Pending, 📋 Deferred, ❌ Rejected
- This document will be updated as the project evolves
