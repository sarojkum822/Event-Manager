import mongoose from 'mongoose';
import { UserModel } from '../src/models';
import { config } from '../src/config';
import { UserRole } from '@event-planner/shared';

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ Connected to MongoDB');

        const email = process.argv[2];

        if (!email) {
            console.error('❌ Please provide an email address');
            console.log('Usage: ts-node scripts/create-admin.ts <email>');
            process.exit(1);
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            console.error(`❌ User with email ${email} not found`);
            process.exit(1);
        }

        user.role = UserRole.ADMIN;
        await user.save();

        console.log(`✅ Successfully promoted ${user.name} (${user.email}) to ADMIN`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();
