// functions/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Configuration, OpenAIApi } from 'openai';
import admin from 'firebase-admin';

import { initializeApp as initializeFirebaseAdmin } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeFirebaseAdmin();
const db = getFirestore();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
import { Server as SocketIOServer } from 'socket.io';
const io = new SocketIOServer(server, { cors: { origin: '*' } });

// Socket.io: simple namespace
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join', (room) => {
    socket.join(room);
  });
  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});

// Health
app.get('/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Emergency alert: create & broadcast
app.post('/api/alerts/emergency', async (req, res) => {
  try {
    const { userId, payload } = req.body;
    const docRef = await db.collection('alerts').add({
      type: 'emergency',
      user: userId,
      payload: payload || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      handled: false,
    });
    const alertId = docRef.id;
    // Broadcast to all connected clients (or to a room e.g., 'doctors')
    io.emit('alert:emergency', { id: alertId, user: userId, payload });
    return res.json({ ok: true, id: alertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'alert_failed' });
  }
});

// Auto-schedule appointment: naive earliest-slot algorithm
app.post('/api/appointments/auto', async (req, res) => {
  try {
    const { userId, title, preferredWindowStart, preferredWindowEnd } = req.body;
    // Simplest approach: find earliest slot from now to next 7 days that doesn't conflict
    const now = new Date();
    const endWindow = new Date();
    endWindow.setDate(now.getDate() + 7);

    // load all appointments for this user (or all if scheduling with doctor)
    const snaps = await db.collection('appointments')
      .where('user', '==', userId)
      .get();
    const busy = new Set(snaps.docs.map(d => d.data().when));

    // check hourly slots between now and +7 days
    const slot = findFirstFreeSlot(now, endWindow, busy);
    if (!slot) return res.status(400).json({ error: 'no_slot' });

    const doc = await db.collection('appointments').add({
      title: title || 'Auto-scheduled appointment',
      when: slot.toISOString(),
      user: userId,
      status: 'scheduled',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ ok: true, id: doc.id, when: slot.toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'auto_schedule_failed' });
  }
});

function findFirstFreeSlot(start, end, busySet) {
  // start at the next hour
  const s = new Date(start);
  s.setMinutes(0,0,0);
  if (start.getMinutes() > 0) s.setHours(s.getHours()+1);
  for (let d = new Date(s); d <= end; d.setHours(d.getHours()+1)) {
    const iso = new Date(d).toISOString();
    if (!busySet.has(iso)) return new Date(d);
  }
  return null;
}

// Triager (OpenAI) — server-side proxy
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

app.post('/api/triage', async (req, res) => {
  try {
    const { symptoms, age, sex } = req.body;
    const prompt = `
You are a conservative clinical triage assistant. Return ONLY valid JSON with keys:
severity (1-10), summary, recommendedSpecialty, redFlags (array), advice (array).

Symptoms: ${symptoms}
Age: ${age}
Sex: ${sex}

Be conservative: when in doubt advise "see a doctor".
`;
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini', // adjust if unavailable
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.0,
    });

    // try parse JSON from assistant content
    const raw = completion.data.choices?.[0]?.message?.content || '{}';
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { raw }; }
    res.json({ ok: true, result: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'triage_failed' });
  }
});

// Start server
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5001;
server.listen(PORT, () => console.log(`Functions listening on http://localhost:${PORT}`));