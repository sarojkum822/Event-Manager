import { Address, EventCategory, VendorStatus } from './common.types';

export interface Package {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration?: string;
    features: string[];
    isActive: boolean;
}

export interface Availability {
    date: Date;
    isAvailable: boolean;
    slots?: string[];
}

export interface Vendor {
    _id: string;
    userId: string;
    businessName: string;
    description: string;
    categories: EventCategory[];
    address: Address;
    serviceAreas: string[]; // Cities where they provide service
    packages: Package[];
    gallery: string[]; // Cloudinary URLs
    availability: Availability[];
    rating: number;
    reviewCount: number;
    status: VendorStatus;
    documents: {
        businessLicense?: string;
        taxId?: string;
        insurance?: string;
    };
    bankDetails?: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateVendorDto {
    userId: string;
    businessName: string;
    description: string;
    categories: EventCategory[];
    address: Address;
    serviceAreas: string[];
}

export interface UpdateVendorDto {
    businessName?: string;
    description?: string;
    categories?: EventCategory[];
    address?: Address;
    serviceAreas?: string[];
}

export interface CreatePackageDto {
    name: string;
    description: string;
    price: number;
    duration?: string;
    features: string[];
}

export interface UpdatePackageDto {
    name?: string;
    description?: string;
    price?: number;
    duration?: string;
    features?: string[];
    isActive?: boolean;
}

export interface SearchVendorsDto {
    city?: string;
    category?: EventCategory;
    date?: Date;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}
