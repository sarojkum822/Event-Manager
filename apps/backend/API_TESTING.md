/**
 * API Testing Guide
 * 
 * This file contains example requests for testing all API endpoints.
 * Use with Postman, curl, or any HTTP client.
 */

## Environment Variables
```
BASE_URL=http://localhost:5000/api
JWT_TOKEN=your-jwt-token-here
```

---

## 1. Authentication

### Login/Register
```bash
curl -X POST ${BASE_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "token": "firebase-id-token"
  }'
```

---

## 2. User Management

### Get Profile
```bash
curl -X GET ${BASE_URL}/users/profile \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### Update Profile
```bash
curl -X PUT ${BASE_URL}/users/profile \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "+1234567890"
  }'
```

### Upload Avatar
```bash
curl -X POST ${BASE_URL}/users/avatar \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -F "image=@/path/to/avatar.jpg"
```

---

## 3. Vendor Management

### Search Vendors
```bash
curl -X GET "${BASE_URL}/vendors/search?city=Mumbai&category=WEDDING"
```

### Get Vendor by ID
```bash
curl -X GET ${BASE_URL}/vendors/VENDOR_ID
```

### Create Vendor Profile
```bash
curl -X POST ${BASE_URL}/vendors \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Elite Events",
    "description": "Premium event planning services",
    "categories": ["WEDDING", "CORPORATE"],
    "address": {
      "street": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "serviceAreas": ["Mumbai", "Pune"],
    "packages": [
      {
        "name": "Premium Package",
        "description": "Complete event planning",
        "price": 50000,
        "features": ["Venue", "Catering", "Decoration"]
      }
    ]
  }'
```

### Update Vendor Profile
```bash
curl -X PUT ${BASE_URL}/vendors/VENDOR_ID \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "packages": [...]
  }'
```

### Get My Vendor Profile
```bash
curl -X GET ${BASE_URL}/vendors/my/profile \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### Upload Vendor Images
```bash
curl -X POST ${BASE_URL}/vendors/upload \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

## 4. Bookings

### Create Booking
```bash
curl -X POST ${BASE_URL}/bookings \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "VENDOR_ID",
    "packageId": "PACKAGE_ID",
    "date": "2024-12-25",
    "guestCount": 150,
    "amount": 50000
  }'
```

### Verify Payment
```bash
curl -X POST ${BASE_URL}/bookings/verify \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_xxx",
    "razorpay_payment_id": "pay_xxx",
    "razorpay_signature": "signature_xxx"
  }'
```

### Get User Bookings
```bash
curl -X GET ${BASE_URL}/bookings/user \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### Get Vendor Bookings
```bash
curl -X GET ${BASE_URL}/bookings/vendor \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

---

## 5. Reviews

### Create Review
```bash
curl -X POST ${BASE_URL}/reviews \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "BOOKING_ID",
    "vendorId": "VENDOR_ID",
    "rating": 5,
    "comment": "Excellent service! Highly recommended.",
    "images": ["https://image-url-1.jpg"]
  }'
```

### Get Vendor Reviews
```bash
curl -X GET "${BASE_URL}/reviews/vendor/VENDOR_ID?page=1&limit=10"
```

### Respond to Review
```bash
curl -X POST ${BASE_URL}/reviews/REVIEW_ID/response \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Thank you for your wonderful feedback!"
  }'
```

---

## 6. Payments

### Get Payment History
```bash
curl -X GET ${BASE_URL}/payments/history \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

---

## 7. Admin

### Get Pending Vendors
```bash
curl -X GET ${BASE_URL}/admin/vendors/pending \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### Verify Vendor
```bash
curl -X PUT ${BASE_URL}/admin/vendors/VENDOR_ID/verify \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "verified"
  }'
```

### Reject Vendor
```bash
curl -X PUT ${BASE_URL}/admin/vendors/VENDOR_ID/verify \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "rejected",
    "rejectionReason": "Incomplete documentation"
  }'
```

### Get Analytics
```bash
curl -X GET ${BASE_URL}/admin/analytics \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### Get All Bookings
```bash
curl -X GET "${BASE_URL}/admin/bookings?status=CONFIRMED&page=1&limit=20" \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

---

## Testing Flow

### 1. Complete Booking Flow
1. Login/Register → Get JWT token
2. Search vendors → Get vendor ID
3. Create booking → Get order ID
4. Complete Razorpay payment
5. Verify payment → Booking confirmed
6. Get user bookings → Verify booking status

### 2. Review Flow
1. Complete booking (status: COMPLETED)
2. Create review
3. Get vendor reviews → Verify review appears
4. Vendor responds to review

### 3. Vendor Onboarding Flow
1. Login as user
2. Create vendor profile → Status: pending
3. Admin login
4. Get pending vendors
5. Verify vendor → Status: verified
6. Vendor can now receive bookings

---

## Error Testing

### Invalid Token
```bash
curl -X GET ${BASE_URL}/users/profile \
  -H "Authorization: Bearer invalid-token"
# Expected: 401 Unauthorized
```

### Missing Required Fields
```bash
curl -X POST ${BASE_URL}/bookings \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "VENDOR_ID"
  }'
# Expected: 400 Bad Request with validation errors
```

### Unauthorized Access
```bash
curl -X GET ${BASE_URL}/admin/analytics \
  -H "Authorization: Bearer ${CUSTOMER_JWT_TOKEN}"
# Expected: 403 Forbidden
```

---

## Notes

- Replace `VENDOR_ID`, `BOOKING_ID`, `REVIEW_ID` with actual IDs
- JWT tokens expire based on configuration (default: 7 days)
- File uploads require multipart/form-data
- All timestamps are in ISO 8601 format
- Amounts are in INR (paise for Razorpay)
