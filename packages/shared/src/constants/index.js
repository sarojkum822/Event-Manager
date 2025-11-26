"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_CONFIG = exports.PAGINATION_DEFAULTS = exports.PAYMENT_CONFIG = exports.EVENT_CATEGORIES_DISPLAY = exports.INDIAN_CITIES = void 0;
exports.INDIAN_CITIES = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara',
    'Ghaziabad',
    'Ludhiana',
    'Agra',
    'Nashik',
    'Faridabad',
    'Meerut',
    'Rajkot',
    'Kalyan-Dombivali',
    'Vasai-Virar',
    'Varanasi',
];
exports.EVENT_CATEGORIES_DISPLAY = {
    wedding: 'Wedding',
    birthday: 'Birthday Party',
    corporate: 'Corporate Event',
    anniversary: 'Anniversary',
    engagement: 'Engagement',
    baby_shower: 'Baby Shower',
    other: 'Other',
};
exports.PAYMENT_CONFIG = {
    ADVANCE_PERCENTAGE: 30, // 30% advance payment
    CURRENCY: 'INR',
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
};
exports.PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 20,
    MAX_LIMIT: 100,
};
exports.CLOUDINARY_CONFIG = {
    FOLDER_VENDOR_GALLERY: 'vendors/gallery',
    FOLDER_VENDOR_DOCUMENTS: 'vendors/documents',
    FOLDER_REVIEW_IMAGES: 'reviews',
    FOLDER_USER_AVATARS: 'users/avatars',
};
