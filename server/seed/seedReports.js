// server/seed/seedReports.js
// P2 — run with: node seed/seedReports.js
// Wipes existing reports and inserts sample data so the app has something to show.

require('dotenv').config();
const mongoose = require('mongoose');
const Report = require('../models/Report');

const sampleReports = [
  {
    area: 'Nugegoda, Colombo',
    date: new Date('2026-08-20'),
    caseCount: 14,
    notes: 'Cluster near the canal area, stagnant water reported after recent rain.',
    verified: true,
  },
  {
    area: 'Dehiwala, Colombo',
    date: new Date('2026-08-22'),
    caseCount: 6,
    notes: 'Cases mostly among schoolchildren in the same neighborhood.',
    verified: false,
  },
  {
    area: 'Kaduwela, Colombo',
    date: new Date('2026-08-25'),
    caseCount: 21,
    notes: 'Sharp rise this week; PHI has flagged for fogging.',
    verified: true,
  },
  {
    area: 'Kandy Town, Kandy',
    date: new Date('2026-08-18'),
    caseCount: 9,
    notes: 'Isolated cases, no confirmed common source yet.',
    verified: false,
  },
  {
    area: 'Negombo, Gampaha',
    date: new Date('2026-08-27'),
    caseCount: 17,
    notes: 'Coastal area, reports concentrated near construction sites with standing water.',
    verified: false,
  },
  {
    area: 'Matara Town, Matara',
    date: new Date('2026-08-15'),
    caseCount: 4,
    notes: 'Low case count, included for southern coverage.',
    verified: true,
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