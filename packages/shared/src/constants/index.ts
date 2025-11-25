export const INDIAN_CITIES = [
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

export const EVENT_CATEGORIES_DISPLAY = {
    wedding: 'Wedding',
    birthday: 'Birthday Party',
    corporate: 'Corporate Event',
    anniversary: 'Anniversary',
    engagement: 'Engagement',
    baby_shower: 'Baby Shower',
    other: 'Other',
};

export const PAYMENT_CONFIG = {
    ADVANCE_PERCENTAGE: 30, // 30% advance payment
    CURRENCY: 'INR',
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
};

export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 20,
    MAX_LIMIT: 100,
};

export const CLOUDINARY_CONFIG = {
    FOLDER_VENDOR_GALLERY: 'vendors/gallery',
    FOLDER_VENDOR_DOCUMENTS: 'vendors/documents',
    FOLDER_REVIEW_IMAGES: 'reviews',
    FOLDER_USER_AVATARS: 'users/avatars',
};
