import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin using Render/Vercel Environment Variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  // This line handles the newline characters in your private key automatically
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

// API Routes
app.get('/api/health', (req, res) => res.json({ status: 'live', database: 'connected' }));

// POST: Save new data (Tickets, Attendance, etc.)
app.post('/api/save', async (req, res) => {
  try {
    const { path, data } = req.body; // e.g., path: "tickets", data: {id: 1, ...}
    const ref = db.ref(path);
    await ref.push(data);
    res.status(201).json({ message: 'Saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Load all data
app.get('/api/load/:path', async (req, res) => {
  try {
    const snapshot = await db.ref(req.params.path).once('value');
    res.json(snapshot.val() || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend live on port ${PORT}`));
