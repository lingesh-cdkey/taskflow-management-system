import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './backend/app.js';
import { connectDB, getDatabaseMode } from './backend/config/db.js';

async function startServer() {
  try {
    // Connect to database (with fallback integration)
    await connectDB();
    const dbMode = getDatabaseMode();

    const PORT = 3000;

    // Vite Integration for development / static serving
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚡ [SYSTEM] Launching Vite Dev Middleware...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      console.log('📦 [SYSTEM] Launching Static Distribution Server...');
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`===================================================`);
      console.log(`🔥 [SYSTEM] Full Stack TaskFlow Application is Online!`);
      console.log(`🔗 [SYSTEM] URL: http://localhost:${PORT}`);
      console.log(`🗄️  [SYSTEM] Active Database: ${dbMode}`);
      console.log(`===================================================`);
    });
  } catch (error: any) {
    console.error(`❌ [SYSTEM] Boot crash: ${error.message}`);
    process.exit(1);
  }
}

startServer();
