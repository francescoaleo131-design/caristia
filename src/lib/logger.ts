import fs from 'fs';
import path from 'path';

/**
 * Utility per loggare errori su un file locale.
 * Utile per debuggare fallimenti del database in ambienti dove
 * l'accesso ai log di console potrebbe essere limitato o per persistenza locale.
 */
export function logError(context: string, error: any) {
  const timestamp = new Date().toISOString();
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'error.log');

  try {
    // Crea la cartella logs se non esiste
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const errorMessage = typeof error === 'object' ? JSON.stringify(error, null, 2) : error;
    const logEntry = `[${timestamp}] [${context}] ERROR: ${errorMessage}\n\n`;

    fs.appendFileSync(logFile, logEntry);
    console.log(`✅ Errore loggato in: ${logFile}`);
  } catch (err) {
    console.error('❌ Impossibile scrivere il file di log:', err);
  }
}
