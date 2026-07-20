const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true },
        lastname: { type: String }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true },
        lastname: { type: String }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vehicle: {
        color: { type: String, required: true },
        plate: { type: String, required: true },
        capacity: { type: Number, required: true },
        vehicleType: { type: String, required: true }
    }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
const captainModel = mongoose.models.captain || mongoose.model('captain', captainSchema);

async function run() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to Database');

        const testUserEmail = 'user@test.com';
        const testCaptainEmail = 'captain@test.com';
        const rawPassword = 'password123';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // Seed User
        const existingUser = await userModel.findOne({ email: testUserEmail });
        if (!existingUser) {
            await userModel.create({
                fullname: { firstname: 'John', lastname: 'Doe' },
                email: testUserEmail,
                password: hashedPassword
            });
            console.log(`Created User: ${testUserEmail}`);
        } else {
            console.log(`User ${testUserEmail} already exists`);
        }

        // Seed Captain
        const existingCaptain = await captainModel.findOne({ email: testCaptainEmail });
        if (!existingCaptain) {
            await captainModel.create({
                fullname: { firstname: 'Captain', lastname: 'Jack' },
                email: testCaptainEmail,
                password: hashedPassword,
                vehicle: {
                    color: 'White',
                    plate: 'MH-12-AB-1234',
                    capacity: 4,
                    vehicleType: 'car'
                }
            });
            console.log(`Created Captain: ${testCaptainEmail}`);
        } else {
            console.log(`Captain ${testCaptainEmail} already exists`);
        }

        console.log('\n======================================');
        console.log('TEST CREDENTIALS REGISTERED SUCCESSFULLY');
        console.log('======================================');
        console.log(`Passenger Email : ${testUserEmail}`);
        console.log(`Captain Email   : ${testCaptainEmail}`);
        console.log(`Password        : ${rawPassword}`);
        console.log('======================================\n');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

run();
