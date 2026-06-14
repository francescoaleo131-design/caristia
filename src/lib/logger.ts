import fs from 'fs';
import path from 'path';

export function logError(context: string, error: any) {
  const timestamp = new Date().toISOString();
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'error.log');

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const errorMessage = typeof error === 'object' ? JSON.stringify(error, null, 2) : error;
    const logEntry = `[${timestamp}] [${context}] ERROR: ${errorMessage}\n\n`;

    fs.appendFileSync(logFile, logEntry);
  } catch (err) {
    console.error('❌ Impossibile scrivere il file di log:', err);
  }
}
