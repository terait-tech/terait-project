import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { config } from '../config.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();
const auth = admin.auth();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Get user from database
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
    
    if (!snapshot.exists()) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userData = snapshot.val();
    const userId = Object.keys(userData);
    const user = userData[userId];

    // Basic password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    // Check if user exists
    const usersRef = db.ref('users');
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');

    if (snapshot.exists()) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUserRef = usersRef.push();
    const userId = newUserRef.key;

    await newUserRef.set({
      email,
      password, // In production, hash this!
      name,
      role: role || 'user',
      createdAt: new Date().toISOString()
    });

    // Generate token
    const token = jwt.sign(
      { userId, email, role: role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { id: userId, email, name, role: role || 'user' }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all employees (protected)
app.get('/api/employees', verifyToken, async (req, res) => {
  try {
    const employeesRef = db.ref('employees');
    const snapshot = await employeesRef.once('value');
    
    if (!snapshot.exists()) {
      return res.json([]);
    }

    const employees = [];
    snapshot.forEach(childSnapshot => {
      employees.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Create employee
app.post('/api/employees', verifyToken, async (req, res) => {
  try {
    const { name, email, role, department } = req.body;

    const newEmployeeRef = db.ref('employees').push();
    await newEmployeeRef.set({
      name,
      email,
      role,
      department,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      id: newEmployeeRef.key,
      message: 'Employee created'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
app.put('/api/employees/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await db.ref(`employees/${id}`).update(updateData);

    res.json({ success: true, message: 'Employee updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
app.delete('/api/employees/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.ref(`employees/${id}`).remove();

    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Get attendance
app.get('/api/attendance/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendanceRef = db.ref(`attendance/${employeeId}`);
    const snapshot = await attendanceRef.once('value');

    if (!snapshot.exists()) {
      return res.json([]);
    }

    const attendance = [];
    snapshot.forEach(childSnapshot => {
      attendance.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Log attendance
app.post('/api/attendance/login', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const dateKey = now.toISOString().split('T');
    const timeKey = now.toISOString();

    await db.ref(`attendance/${employeeId}/${dateKey}`).set({
      loginTime: timeKey,
      status: 'present'
    });

    res.json({ success: true, message: 'Login recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log attendance' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
