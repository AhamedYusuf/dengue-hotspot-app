const mongoose = require('mongoose');
const Report = require('../models/Report');

const fallbackReports = [
  { area: 'Nugegoda, Colombo', date: new Date('2026-08-20'), caseCount: 14, notes: 'Cluster near the canal area.', status: 'verified', verified: true, latitude: 6.8728, longitude: 79.8880 },
  { area: 'Dehiwala, Colombo', date: new Date('2026-08-22'), caseCount: 6, notes: 'Cases reported in the same neighborhood.', status: 'pending', verified: false, latitude: 6.8497, longitude: 79.8654 },
  { area: 'Kaduwela, Colombo', date: new Date('2026-08-25'), caseCount: 21, notes: 'Sharp rise this week.', status: 'verified', verified: true, latitude: 6.9281, longitude: 79.9889 },
  { area: 'Kandy Town, Kandy', date: new Date('2026-08-18'), caseCount: 9, notes: 'Isolated cases.', status: 'pending', verified: false, latitude: 7.2906, longitude: 80.6337 },
  { area: 'Galle City, Galle', date: new Date('2026-08-30'), caseCount: 52, notes: 'Large outbreak near the old town area.', status: 'verified', verified: true, latitude: 6.0535, longitude: 80.2210 },
].map((report) => ({ ...report, _id: new mongoose.Types.ObjectId().toString(), createdAt: new Date() }));

let memoryReports = [...fallbackReports];
let mongoReady = false;

function setMongoReady(value) {
  mongoReady = value;
}

function isMongoReady() {
  return mongoReady && mongoose.connection.readyState === 1;
}

function sortNewest(reports) {
  return reports.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function listReports(filters = {}) {
  if (isMongoReady()) {
    const query = {};
    if (filters.search) query.area = { $regex: filters.search, $options: 'i' };
    if (filters.from || filters.to) {
      query.date = {};
      if (filters.from) query.date.$gte = new Date(filters.from);
      if (filters.to) {
        const toDate = new Date(filters.to);
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }
    }
    if (filters.verified !== undefined) query.verified = filters.verified;
    if (filters.minCases !== undefined) query.caseCount = { $gte: Number(filters.minCases) };
    return Report.find(query).sort({ date: -1 });
  }

  return sortNewest(memoryReports.filter((report) => {
    if (filters.search && !report.area.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.from && new Date(report.date) < new Date(filters.from)) return false;
    if (filters.to) {
      const end = new Date(filters.to);
      end.setHours(23, 59, 59, 999);
      if (new Date(report.date) > end) return false;
    }
    if (filters.verified !== undefined && report.verified !== filters.verified) return false;
    if (filters.minCases !== undefined && report.caseCount < Number(filters.minCases)) return false;
    return true;
  }));
}

async function createReport(data) {
  if (isMongoReady()) return new Report(data).save();
  const report = { ...data, _id: new mongoose.Types.ObjectId().toString(), createdAt: new Date() };
  memoryReports.push(report);
  return report;
}

async function verifyReport(id) {
  if (isMongoReady()) return Report.findByIdAndUpdate(id, { verified: true }, { new: true });
  const report = memoryReports.find((item) => item._id === id);
  if (report) report.verified = true;
  return report || null;
}

async function getAnalytics() {
  const reports = await listReports();
  const byDayMap = new Map();
  reports.filter((report) => new Date(report.date) >= new Date(Date.now() - 30 * 86400000)).forEach((report) => {
    const date = new Date(report.date).toISOString().slice(0, 10);
    const entry = byDayMap.get(date) || { date, reportCount: 0, totalCases: 0 };
    entry.reportCount += 1;
    entry.totalCases += report.caseCount;
    byDayMap.set(date, entry);
  });
  const areas = new Map();
  reports.forEach((report) => {
    const entry = areas.get(report.area) || { area: report.area, totalCases: 0, reportCount: 0 };
    entry.totalCases += report.caseCount;
    entry.reportCount += 1;
    areas.set(report.area, entry);
  });
  return {
    byDay: [...byDayMap.values()].sort((a, b) => a.date.localeCompare(b.date)),
    byArea: [...areas.values()].sort((a, b) => b.totalCases - a.totalCases).slice(0, 10),
    summary: {
      totalReports: reports.length,
      totalCases: reports.reduce((total, report) => total + report.caseCount, 0),
      verifiedCount: reports.filter((report) => report.verified).length,
    },
  };
}

module.exports = { setMongoReady, isMongoReady, listReports, createReport, verifyReport, getAnalytics };
