require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const { z } = require('zod');
const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined });
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json({ limit: '10kb' }));
app.use('/api/', rateLimit({ windowMs: 900000, limit: 30 }));
const schema = z.object({
  vehicle: z.string().trim().min(1).max(80),
  title: z.string().max(10).optional().default(''),
  firstName: z.string().trim().min(2).max(60),
  middleName: z.string().max(60).optional().default(''),
  lastName: z.string().trim().min(1).max(60),
  mobile: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(120),
  date: z.string().date(),
  time: z.string().min(1).max(40),
  dealer: z.string().min(1).max(100),
  address: z.string().max(300).optional().default(''),
  sameAddress: z.boolean().optional().default(false)
});
app.get('/health', (_req, res) => res.json({ ok: true }));
app.post('/api/test-drive-requests', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Please check the submitted fields.' });
  const d = parsed.data;
  if (!d.sameAddress && !d.address) return res.status(400).json({ error: 'Address is required.' });
  try {
    const result = await pool.query('INSERT INTO test_drive_requests (vehicle,title,first_name,middle_name,last_name,mobile,email,preferred_date,preferred_time,dealer,address,same_address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id', [d.vehicle,d.title,d.firstName,d.middleName,d.lastName,d.mobile,d.email,d.date,d.time,d.dealer,d.sameAddress ? null : d.address,d.sameAddress]);
    return res.status(201).json({ requestId: result.rows[0].id });
  } catch (err) {
 console.error('Database insert failed:', err.code, err.message);
 return res.status(500).json({ error: 'Unable to submit right now.' });
}
});
app.listen(process.env.PORT || 3000, () => console.log('API started'));