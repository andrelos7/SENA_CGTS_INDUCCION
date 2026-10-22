import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple in-memory storage for demonstration
const instructorKeys = new Map<string, string>(); // Email -> Key

async function startServer() {
  const app = express();
  app.use(express.json());

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  // API route for instructor access
  app.post('/api/request-instructor-access', (req, res) => {
    const { name, documentId, email } = req.body;
    
    // Server-side key generation (same formula, but hidden)
    const cleanNameLetters = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase();
    const firstTwoLetters = cleanNameLetters.slice(0, 2);

    const cleanDocNumbers = documentId.replace(/\D/g, '');
    const lastTwoDigits = cleanDocNumbers.slice(-2);

    const generatedKey = `${firstTwoLetters}${lastTwoDigits}`;

    // Store key
    instructorKeys.set(email, generatedKey);

    console.log(`[SECURE] Sending email to ${email} for instructor ${name} with key: ${generatedKey}`);
    
    res.json({ success: true, message: 'La clave ha sido enviada a tu correo.' });
  });

  // Verification endpoint
  app.post('/api/verify-instructor-pin', (req, res) => {
    const { email, pin } = req.body;
    const storedKey = instructorKeys.get(email);

    if (storedKey && pin.toUpperCase() === storedKey) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Clave no válida.' });
    }
  });

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer();
