import fs from 'fs';
import os from 'os';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, splat, errors } = winston.format;

// ─── Config ────────────────────────────────────────────────────────────────
const LOG_DIR = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const ENV = process.env.NODE_ENV || 'development';
const SERVICE = process.env.SERVICE_NAME || 'crud-express';
const HOSTNAME = os.hostname();
const PID = process.pid;

const RETENTION_DAYS = parseInt(process.env.LOG_RETENTION_DAYS || '30', 10);
const MAX_SIZE = process.env.LOG_MAX_SIZE || '20m';

// ─── ANSI codes ────────────────────────────────────────────────────────────
const A = {
  R: '\x1b[0m',
  B: '\x1b[1m',
  D: '\x1b[2m',
  RED: '\x1b[91m',
  YEL: '\x1b[93m',
  GRN: '\x1b[92m',
  MAG: '\x1b[95m',
  CYN: '\x1b[96m',
  GRY: '\x1b[90m',
};

// ─── Sensitive-key redaction ───────────────────────────────────────────────
const REDACTED = '[REDACTED]';
const SENSITIVE = [
  'password',
  'pass',
  'passwd',
  'token',
  'secret',
  'key',
  'authorization',
  'auth',
  'cookie',
  'creditcard',
  'cardnumber',
  'cvv',
  'ssn',
  'socialsecurity',
  'api_key',
  'apikey',
  'private_key',
  'privatekey',
  'seed',
  'mnemonic',
];

function redact(obj, depth = 0) {
  if (depth > 5) return '[MAX_DEPTH]';
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (obj instanceof Error) return { message: obj.message, stack: obj.stack };
  if (Array.isArray(obj)) return obj.map((v) => redact(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = SENSITIVE.some((p) => k.toLowerCase().includes(p)) ? REDACTED : redact(v, depth + 1);
  }
  return out;
}

// ─── Strip ANSI ────────────────────────────────────────────────────────────
function strip(s) {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

// ─── Level meta ────────────────────────────────────────────────────────────
const LVL = {
  error: { color: A.RED, icon: '✗', label: 'ERROR' },
  warn: { color: A.YEL, icon: '⚠', label: 'WARN ' },
  info: { color: A.GRN, icon: 'ℹ', label: 'INFO ' },
  http: { color: A.MAG, icon: '⇄', label: 'HTTP ' },
  debug: { color: A.CYN, icon: '⚙', label: 'DEBUG' },
};

// ─── Console format: fully colorized via raw ANSI ──────────────────────────
const consoleFmt = printf((info) => {
  const { level, message, timestamp: ts, stack } = info;
  const { statusCode, method, url, requestId, duration, ...meta } = info;
  const l = LVL[level] || { color: '', icon: '?', label: level };

  // Collect clean metadata
  const clean = {};
  for (const [k, v] of Object.entries(meta)) {
    if (!['level', 'timestamp', 'message', 'service', 'env', 'hostname', 'pid'].includes(k)) {
      clean[k] = v;
    }
  }
  const r = redact(clean);

  // Status color
  let status = '';
  if (statusCode) {
    const c =
      statusCode >= 500 ? A.RED : statusCode >= 400 ? A.YEL : statusCode >= 300 ? A.CYN : A.GRN;
    status = ` ${c}[${statusCode}]${A.R}`;
  }

  const route = method && url ? ` ${A.CYN}${method}${A.R} ${A.GRY}${url}${A.R}` : '';
  const dur = duration ? ` ${A.GRY}(${duration})${A.R}` : '';
  const reqId = requestId ? ` ${A.GRY}[${requestId.slice(0, 8)}]${A.R}` : '';
  const body = stack ? `${A.RED}${strip(stack)}${A.R}` : message;

  let metaStr = '';
  if (Object.keys(r).length > 0) {
    metaStr = `\n        ${A.GRY}${JSON.stringify(r, null, 2).replace(/\n/g, '\n        ')}${A.R}`;
  }

  return `${A.GRY}${ts}${A.R} ${l.color}${l.icon} ${l.label}${A.R}${status}${route}${dur}${reqId}\n  ${body}${metaStr}`;
});

// ─── File format: clean human-readable (ANSI stripped) ─────────────────────
const fileFmt = printf((info) => {
  const { level, message, timestamp: ts, stack } = info;
  const { statusCode, method, url, requestId, duration, ...meta } = info;

  const clean = {};
  for (const [k, v] of Object.entries(meta)) {
    if (!['level', 'timestamp', 'message', 'service', 'env', 'hostname', 'pid'].includes(k)) {
      clean[k] = v;
    }
  }
  const r = redact(clean);

  const lvl = `[${level.toUpperCase()}]`.padEnd(7);
  const stat = statusCode ? ` [${statusCode}]` : '';
  const route = method && url ? ` ${method} ${url}` : '';
  const dur = duration ? ` (${duration})` : '';
  const reqId = requestId ? ` [${requestId}]` : '';
  const body = stack || message;

  let metaStr = '';
  if (Object.keys(r).length > 0) metaStr = ` ${JSON.stringify(r)}`;

  return `${ts} ${lvl}${stat}${route}${dur}${reqId} | ${body}${metaStr}`;
});

// ─── Structured JSON (for ELK / Datadog / CloudWatch) ──────────────────────
const jsonFmt = printf((info) => {
  const out = {
    ts: info.timestamp,
    level: info.level,
    service: SERVICE,
    env: ENV,
    hostname: HOSTNAME,
    pid: PID,
    msg: info.message,
  };
  if (info.stack) out.stack = info.stack;
  if (info.statusCode) out.statusCode = info.statusCode;
  if (info.method) out.method = info.method;
  if (info.url) out.url = info.url;
  if (info.requestId) out.requestId = info.requestId;
  if (info.duration) out.duration = info.duration;
  if (info.ip) out.ip = info.ip;

  const skip = new Set([
    'timestamp',
    'level',
    'message',
    'stack',
    'statusCode',
    'method',
    'url',
    'requestId',
    'duration',
    'ip',
    'service',
    'env',
    'hostname',
    'pid',
  ]);
  const extra = {};
  for (const [k, v] of Object.entries(info)) {
    if (!skip.has(k)) extra[k] = v;
  }
  if (Object.keys(extra).length) out.meta = redact(extra);

  return JSON.stringify(out);
});

// ─── Build logger ──────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: ENV === 'production' ? 'info' : 'debug',
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  defaultMeta: { service: SERVICE, env: ENV, hostname: HOSTNAME, pid: PID },
  exitOnError: false,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    errors({ stack: true }),
    splat(),
  ),
  transports: [
    new winston.transports.Console({
      level: ENV === 'production' ? 'info' : 'debug',
      format: consoleFmt,
    }),
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: MAX_SIZE,
      maxFiles: 10,
      level: 'info',
      format: fileFmt,
    }),
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: MAX_SIZE,
      maxFiles: 10,
      level: 'error',
      format: fileFmt,
    }),
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'structured-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: MAX_SIZE,
      maxFiles: 10,
      level: 'debug',
      format: jsonFmt,
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: MAX_SIZE,
      maxFiles: 10,
      format: fileFmt,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(LOG_DIR, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: MAX_SIZE,
      maxFiles: 10,
      format: fileFmt,
    }),
  ],
});

// ─── HTTP request logging middleware ───────────────────────────────────────
export const httpLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    logger.http('', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${ms}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      requestId: req.id,
    });
  });
  next();
};

// ─── Retention enforcement (safety net beyond DailyRotateFile maxFiles) ────
let cleanupScheduled = false;

function enforceRetention() {
  try {
    const cutoff = Date.now() - RETENTION_DAYS * 86400000;
    let cleaned = 0;
    for (const file of fs.readdirSync(LOG_DIR)) {
      const fp = path.join(LOG_DIR, file);
      if (fs.statSync(fp).mtimeMs < cutoff && /\.(log|gz)$/.test(file)) {
        fs.rmSync(fp);
        cleaned++;
      }
    }
    if (cleaned > 0) logger.info(`Log retention: removed ${cleaned} expired file(s)`);
  } catch (err) {
    console.error('[logger] retention cleanup failed:', err.message);
  }
}

if (!cleanupScheduled) {
  // eslint-disable-next-line no-useless-assignment
  cleanupScheduled = true;
  setTimeout(() => {
    enforceRetention();
    setInterval(enforceRetention, 86400000);
  }, 5000);
}

export { enforceRetention, MAX_SIZE, redact, RETENTION_DAYS };
export default logger;
