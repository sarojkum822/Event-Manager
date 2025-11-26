import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { VendorModel } from '../models/Vendor.model';
import { UserModel } from '../models/User.model';
import { EventCategory, UserRole, VendorStatus } from '@event-planner/shared';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);
}

const sampleVendors = [
    {
        businessName: 'Royal Palace Venue',
        email: 'royal@palace.com',
        phone: '+919876543210',
        categories: [EventCategory.WEDDING, EventCategory.ENGAGEMENT],
        description: 'A luxurious venue for your grand weddings and events. Capacity of 1000 guests.',
        price: 500000,
        rating: 4.8,
        reviewCount: 120,
        gallery: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'],
        address: {
            street: '123, GT Karnal Road',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110033',
            country: 'India'
        },
        serviceAreas: ['Delhi', 'Noida', 'Gurgaon'],
        status: VendorStatus.VERIFIED,
        availability: [],
        packages: [
            {
                name: 'Gold Package',
                description: 'Includes venue, decoration, and basic catering',
                price: 500000,
                features: ['Venue Rental', 'Basic Decor', 'Buffet for 500'],
                isActive: true
            }
        ]
    },
    {
        businessName: 'Lens Magic Photography',
        email: 'lens@magic.com',
        phone: '+919876543211',
        categories: [EventCategory.WEDDING, EventCategory.BIRTHDAY],
        description: 'Capturing your precious moments with artistic flair. Award-winning wedding photographers.',
        price: 50000,
        rating: 4.9,
        reviewCount: 85,
        gallery: ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800'],
        address: {
            street: '45, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400050',
            country: 'India'
        },
        serviceAreas: ['Mumbai', 'Pune'],
        status: VendorStatus.VERIFIED,
        availability: [],
        packages: [
            {
                name: 'Candid Photography',
                description: '2 days of candid photography coverage',
                price: 50000,
                features: ['Candid Shots', 'Digital Album', 'Teaser Video'],
                isActive: true
            }
        ]
    },
    {
        businessName: 'Glamour Touch Makeup',
        email: 'glamour@touch.com',
        phone: '+919876543212',
        categories: [EventCategory.WEDDING, EventCategory.ENGAGEMENT],
        description: 'Professional bridal makeup artist with 5 years of experience.',
        price: 15000,
        rating: 4.7,
        reviewCount: 45,
        gallery: ['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800'],
        address: {
            street: '78, Indiranagar',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560038',
            country: 'India'
        },
        serviceAreas: ['Bangalore'],
        status: VendorStatus.VERIFIED,
        availability: [],
        packages: [
            {
                name: 'Bridal HD Makeup',
                description: 'High definition makeup for the bride',
                price: 15000,
                features: ['HD Makeup', 'Hairstyling', 'Draping'],
                isActive: true
            }
        ]
    },
    {
        businessName: 'Delicious Bites Catering',
        email: 'delicious@bites.com',
        phone: '+919876543213',
        categories: [EventCategory.WEDDING, EventCategory.CORPORATE],
        description: 'Exquisite multi-cuisine catering for all occasions.',
        price: 1200,
        rating: 4.6,
        reviewCount: 200,
        gallery: ['https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800'],
        address: {
            street: '12, Lajpat Nagar',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110024',
            country: 'India'
        },
        serviceAreas: ['Delhi', 'Noida'],
        status: VendorStatus.VERIFIED,
        availability: [],
        packages: [
            {
                name: 'Premium Buffet',
                description: 'Per plate cost for premium menu',
                price: 1200,
                features: ['3 Starters', '5 Main Course', '3 Desserts'],
                isActive: true
            }
        ]
    },
    {
        businessName: 'Elegant Decorators',
        email: 'elegant@decor.com',
        phone: '+919876543214',
        categories: [EventCategory.WEDDING, EventCategory.ANNIVERSARY],
        description: 'Transforming spaces into dream venues.',
        price: 100000,
        rating: 4.5,
        reviewCount: 60,
        gallery: ['https://images.unsplash.com/photo-1519225468359-2996bc01c34c?auto=format&fit=crop&q=80&w=800'],
        address: {
            street: '89, Juhu',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400049',
            country: 'India'
        },
        serviceAreas: ['Mumbai'],
        status: VendorStatus.VERIFIED,
        availability: [],
        packages: [
            {
                name: 'Floral Theme',
                description: 'Complete floral decoration for wedding hall',
                price: 100000,
                features: ['Stage Decor', 'Entrance Arch', 'Table Centerpieces'],
                isActive: true
            }
        ]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop all indexes on Vendor collection
        try {
            await VendorModel.collection.dropIndexes();
            console.log('Dropped existing indexes');
        } catch (e) {
            console.log('No indexes to drop or collection does not exist');
        }

        // Clear existing data
        await VendorModel.deleteMany({});
        await UserModel.deleteMany({ email: { $in: sampleVendors.map(v => v.email) } });
        console.log('Cleared existing data');

        // Create Vendors
        for (const vendorData of sampleVendors) {
            // Create associated user account for vendor
            const user = await UserModel.create({
                email: vendorData.email,
                phone: vendorData.phone,
                name: vendorData.businessName,
                role: UserRole.VENDOR,
                firebaseUid: `seed_${vendorData.email}`, // Mock UID
                isEmailVerified: true,
                isPhoneVerified: true,
            });

            // Create vendor profile
            await VendorModel.create({
                userId: user._id,
                ...vendorData
            });
        }

        console.log(`Seeded ${sampleVendors.length} vendors successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
