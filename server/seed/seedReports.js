// server/seed/seedReports.js
// Run with: node seed/seedReports.js
// Wipes existing reports and inserts sample data with real Sri Lankan coordinates.

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Report = require('../models/Report');

const sampleReports = [
  {
    area: 'Nugegoda, Colombo',
    date: new Date('2026-08-20'),
    caseCount: 14,
    notes: 'Cluster near the canal area, stagnant water reported after recent rain.',
    verified: true,
    latitude: 6.8728,
    longitude: 79.8880,
  },
  {
    area: 'Dehiwala, Colombo',
    date: new Date('2026-08-22'),
    caseCount: 6,
    notes: 'Cases mostly among schoolchildren in the same neighborhood.',
    verified: false,
    latitude: 6.8497,
    longitude: 79.8654,
  },
  {
    area: 'Kaduwela, Colombo',
    date: new Date('2026-08-25'),
    caseCount: 21,
    notes: 'Sharp rise this week; PHI has flagged for fogging.',
    verified: true,
    latitude: 6.9281,
    longitude: 79.9889,
  },
  {
    area: 'Kandy Town, Kandy',
    date: new Date('2026-08-18'),
    caseCount: 9,
    notes: 'Isolated cases, no confirmed common source yet.',
    verified: false,
    latitude: 7.2906,
    longitude: 80.6337,
  },
  {
    area: 'Negombo, Gampaha',
    date: new Date('2026-08-27'),
    caseCount: 17,
    notes: 'Coastal area, reports concentrated near construction sites with standing water.',
    verified: false,
    latitude: 7.2097,
    longitude: 79.8359,
  },
  {
    area: 'Matara Town, Matara',
    date: new Date('2026-08-15'),
    caseCount: 4,
    notes: 'Low case count, included for southern coverage.',
    verified: true,
    latitude: 5.9549,
    longitude: 80.5550,
  },
  {
    area: 'Galle City, Galle',
    date: new Date('2026-08-30'),
    caseCount: 52,
    notes: 'Large outbreak near the old town area; fogging underway.',
    verified: true,
    latitude: 6.0535,
    longitude: 80.2210,
  },
  {
    area: 'Jaffna Town, Jaffna',
    date: new Date('2026-08-28'),
    caseCount: 31,
    notes: 'Northern outbreak — community health workers deployed.',
    verified: false,
    latitude: 9.6615,
    longitude: 80.0255,
  },
  {
    area: 'Batticaloa, Eastern Province',
    date: new Date('2026-08-24'),
    caseCount: 19,
    notes: 'Multiple clusters reported across the lagoon area.',
    verified: false,
    latitude: 7.7167,
    longitude: 81.7000,
  },
  {
    area: 'Ratnapura, Sabaragamuwa',
    date: new Date('2026-08-21'),
    caseCount: 11,
    notes: 'Cases linked to gem-mining pits with stagnant water.',
    verified: true,
    latitude: 6.6805,
    longitude: 80.3994,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Report.deleteMany({});
    console.log('Cleared existing reports');

    const inserted = await Report.insertMany(sampleReports);
    console.log(`Inserted ${inserted.length} sample reports`);

    await mongoose.disconnect();
    console.log('Done. Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();