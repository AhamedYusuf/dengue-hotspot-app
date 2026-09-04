const test = require('node:test');
const assert = require('node:assert/strict');

const Report = require('./server/models/Report');
const { verifyReport } = require('./server/routes/verifyReport');

async function makeResponse() {
  return {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
    send(data) {
      this.payload = data;
      return this;
    }
  };
}

test('invalid MongoDB ID returns 400', async () => {
  const req = { params: { id: 'not-a-valid-id' } };
  const res = await makeResponse();

  await verifyReport(req, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { message: 'Invalid report ID' });
});

test('missing report returns 404', async () => {
  const original = Report.findById;
  Report.findById = async () => null;

  try {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = await makeResponse();

    await verifyReport(req, res);

    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.payload, { message: 'Report not found' });
  } finally {
    Report.findById = original;
  }
});

test('successful verification sets verified true', async () => {
  const original = Report.findById;
  Report.findById = async () => ({
    verified: false,
    save: async function () {
      this.verified = true;
      return this;
    }
  });

  try {
    const req = { params: { id: '507f1f77bcf86cd799439011' } };
    const res = await makeResponse();

    await verifyReport(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.verified, true);
  } finally {
    Report.findById = original;
  }
});
