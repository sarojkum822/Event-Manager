export interface Review {
    _id: string;
    bookingId: string;
    customerId: string;
    vendorId: string;
    rating: number; // 1-5
    comment: string;
    images?: string[]; // Cloudinary URLs
    response?: {
        text: string;
        respondedAt: Date;
    };
    isVerified: boolean; // Only customers who completed booking can review
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateReviewDto {
    bookingId: string;
    vendorId: string;
    rating: number;
    comment: string;
    images?: string[];
}

export interface UpdateReviewDto {
    rating?: number;
    comment?: string;
    images?: string[];
}

export interface VendorResponseDto {
    reviewId: string;
    response: string;
}
