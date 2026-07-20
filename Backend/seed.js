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
        const exampleUserEmail = 'user@example.com';
        const exampleCaptainEmail = 'captain@example.com';
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

        const existingExampleUser = await userModel.findOne({ email: exampleUserEmail });
        if (!existingExampleUser) {
            await userModel.create({
                fullname: { firstname: 'John', lastname: 'Example' },
                email: exampleUserEmail,
                password: hashedPassword
            });
            console.log(`Created User: ${exampleUserEmail}`);
        } else {
            console.log(`User ${exampleUserEmail} already exists`);
        }

        // Seed Captain (Car)
        const existingCaptain = await captainModel.findOne({ email: testCaptainEmail });
        if (!existingCaptain) {
            await captainModel.create({
                fullname: { firstname: 'Captain', lastname: 'Car' },
                email: testCaptainEmail,
                password: hashedPassword,
                vehicle: {
                    color: 'White',
                    plate: 'MH-12-CAR-1111',
                    capacity: 4,
                    vehicleType: 'car'
                }
            });
            console.log(`Created Captain (Car): ${testCaptainEmail}`);
        } else {
            console.log(`Captain (Car) ${testCaptainEmail} already exists`);
        }

        const existingExampleCaptain = await captainModel.findOne({ email: exampleCaptainEmail });
        if (!existingExampleCaptain) {
            await captainModel.create({
                fullname: { firstname: 'Captain', lastname: 'ExampleCar' },
                email: exampleCaptainEmail,
                password: hashedPassword,
                vehicle: {
                    color: 'Black',
                    plate: 'MH-12-CAR-2222',
                    capacity: 4,
                    vehicleType: 'car'
                }
            });
            console.log(`Created Captain (Car): ${exampleCaptainEmail}`);
        } else {
            console.log(`Captain (Car) ${exampleCaptainEmail} already exists`);
        }

        // Seed Captain (Auto)
        const autoCaptainEmail = 'captain-auto@example.com';
        const existingAutoCaptain = await captainModel.findOne({ email: autoCaptainEmail });
        if (!existingAutoCaptain) {
            await captainModel.create({
                fullname: { firstname: 'Captain', lastname: 'Auto' },
                email: autoCaptainEmail,
                password: hashedPassword,
                vehicle: {
                    color: 'Yellow',
                    plate: 'MH-12-AUTO-3333',
                    capacity: 3,
                    vehicleType: 'auto'
                }
            });
            console.log(`Created Captain (Auto): ${autoCaptainEmail}`);
        } else {
            console.log(`Captain (Auto) ${autoCaptainEmail} already exists`);
        }

        // Seed Captain (Moto)
        const motoCaptainEmail = 'captain-moto@example.com';
        const existingMotoCaptain = await captainModel.findOne({ email: motoCaptainEmail });
        if (!existingMotoCaptain) {
            await captainModel.create({
                fullname: { firstname: 'Captain', lastname: 'Moto' },
                email: motoCaptainEmail,
                password: hashedPassword,
                vehicle: {
                    color: 'Red',
                    plate: 'MH-12-MOTO-4444',
                    capacity: 1,
                    vehicleType: 'moto'
                }
            });
            console.log(`Created Captain (Moto): ${motoCaptainEmail}`);
        } else {
            console.log(`Captain (Moto) ${motoCaptainEmail} already exists`);
        }

        console.log('\n======================================');
        console.log('TEST CREDENTIALS REGISTERED SUCCESSFULLY');
        console.log('======================================');
        console.log(`Passenger Emails : ${testUserEmail} , ${exampleUserEmail}`);
        console.log(`Captain (Car)    : ${testCaptainEmail} , ${exampleCaptainEmail}`);
        console.log(`Captain (Auto)   : ${autoCaptainEmail}`);
        console.log(`Captain (Moto)   : ${motoCaptainEmail}`);
        console.log(`Password         : ${rawPassword}`);
        console.log('======================================\n');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

run();
