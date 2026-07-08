// ─── Bootstrap: load .env BEFORE any module evaluates ───────────────────────
// This MUST be imported first in server.js. ESM imports are evaluated in
// dependency order, so importing this before logger.js ensures process.env
// is populated when the logger reads env vars at module-evaluation time.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });
