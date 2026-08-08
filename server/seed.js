// Optional: populate the database with two demo profiles so /matches has
// something to show right after you deploy. Run with `npm run seed` from
// inside /server (make sure MONGODB_URI is set in your .env first).
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const demoUsers = [
  {
    fullname: 'Asha Mehta',
    email: 'asha@example.com',
    password: 'password123',
    personalInfo: {
      department: 'Computer Science',
      yearOfStudy: 2,
      phone: '9990001111',
      gender: 'Female',
      dob: new Date('2004-03-12'),
      district: 'Mohali',
      state: 'Punjab',
    },
    roomPreferences: {
      accommodationType: 'PG',
      preferredLocation: 'Sector 20',
      rentBudget: 8000,
      numRoommates: 1,
      bhk: 2,
      amenities: ['WiFi', 'Furnished'],
    },
    roommatePreferences: {
      department: 'Computer Science',
      yearOfStudy: 2,
      sleepSchedule: 'Night owl',
      gender: 'Female',
      state: 'Punjab',
    },
    profile: {
      introduction: 'CS sophomore, quiet during the day, codes at night. Clean and tidy.',
    },
    onboardingComplete: true,
  },
  {
    fullname: 'Rohan Verma',
    email: 'rohan@example.com',
    password: 'password123',
    personalInfo: {
      department: 'Mechanical Engineering',
      yearOfStudy: 3,
      phone: '9990002222',
      gender: 'Male',
      dob: new Date('2003-07-01'),
      district: 'Ludhiana',
      state: 'Punjab',
    },
    roomPreferences: {
      accommodationType: 'Apartment',
      preferredLocation: 'Sector 20',
      rentBudget: 9000,
      numRoommates: 2,
      bhk: 3,
      amenities: ['WiFi', 'Parking'],
    },
    roommatePreferences: {
      department: 'Mechanical Engineering',
      yearOfStudy: 3,
      sleepSchedule: 'Early bird',
      gender: 'Any',
      state: 'Punjab',
    },
    profile: {
      introduction: 'Early riser, gym every morning, easygoing.',
    },
    onboardingComplete: true,
  },
];

async function seed() {
  await connectDB();

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`Skipping ${u.email} — already exists`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log(`Created demo user: ${u.email}`);
  }

  console.log('\nSeed complete. Demo login password for all seeded users: password123');
  process.exit(0);
}

seed();
