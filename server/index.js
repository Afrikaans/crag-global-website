import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import * as Sentry from '@sentry/node'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import path from "path"
import { fileURLToPath } from "url"
import compression from 'compression'

dotenv.config()

const app = express()

const isProd = process.env.NODE_ENV === 'production'

/* Sentry initialization (compatible with v7 and v10) */
const SENTRY_DSN = process.env.SENTRY_DSN || ''

// Optional CPU profiling (only if @sentry/profiling-node is installed)
let profilingIntegrationInstance = null
try {
  const mod = await import('@sentry/profiling-node')
  if (mod && typeof mod.nodeProfilingIntegration === 'function') {
    profilingIntegrationInstance = mod.nodeProfilingIntegration()
  }
} catch {
  // profiling package not installed; skip
}

// Build integrations list depending on available SDK APIs
const sentryIntegrations = []
if (typeof Sentry.httpIntegration === 'function') {
  // v10+
  sentryIntegrations.push(Sentry.httpIntegration())
}
if (typeof Sentry.expressIntegration === 'function') {
  // v10+
  sentryIntegrations.push(Sentry.expressIntegration())
} else {
  // v7 fallbacks
  if (Sentry.Integrations?.Http) {
    sentryIntegrations.push(new Sentry.Integrations.Http({ tracing: true }))
  }
  try {
    const Tracing = await import('@sentry/tracing')
    if (Tracing?.Integrations?.Express) {
      sentryIntegrations.push(new Tracing.Integrations.Express({ app }))
    }
  } catch {
    // @sentry/tracing not installed or not needed on v10+
  }
}

Sentry.init({
  dsn: SENTRY_DSN || undefined,
  integrations: [
    ...sentryIntegrations,
    ...(profilingIntegrationInstance ? [profilingIntegrationInstance] : []),
  ],
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? (isProd ? 0.2 : 1.0)),
  profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? (isProd ? 0.1 : 1.0)),
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
})

// The request handler must be the first middleware
if (typeof Sentry.expressRequestMiddleware === 'function') {
  // v10+
  app.use(Sentry.expressRequestMiddleware())
} else if (Sentry.Handlers?.requestHandler) {
  // v7
  app.use(Sentry.Handlers.requestHandler())
  if (Sentry.Handlers?.tracingHandler) {
    app.use(Sentry.Handlers.tracingHandler())
  }
} else {
  console.warn('[sentry] No compatible request middleware found; continuing without Sentry request handler')
}

// In production, trust the first proxy (for correct protocol/IP and secure cookies behind proxies)
if (isProd) {
  app.set('trust proxy', 1)
}

// Apply security headers
app.use(helmet({
  // Send HSTS only in production (meaningful only over HTTPS behind your proxy)
  hsts: isProd ? { maxAge: 15552000, includeSubDomains: true, preload: false } : false,
  contentSecurityPolicy: isProd
    ? {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          // Allow GA + GTM + Sentry CDN for scripts; keep inline scripts disallowed
          scriptSrc: ["'self'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://browser.sentry-cdn.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
          fontSrc: ["'self'", "data:", "https://cdnjs.cloudflare.com"],
          imgSrc: ["'self'", "data:", "https:"],
          // Allow analytics and sentry reporting endpoints if enabled
          connectSrc: ["'self'", "https://www.google-analytics.com", "https://sentry.io", "https://*.sentry.io"],
          frameAncestors: ["'self'"],
        },
      }
    : false,
}))
// Remove HSTS on non-TLS requests (e.g., localhost). Browsers ignore HSTS over HTTP,
// but we strip it for clarity when not behind TLS (requires app.set('trust proxy', 1)).
if (isProd) {
  app.use((req, res, next) => {
    if (!req.secure) {
      res.removeHeader('Strict-Transport-Security')
    }
    next()
  })
}

// Enable gzip compression in production
if (isProd) {
  app.use(compression())
}

app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (origin === ALLOWED_ORIGIN) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}
app.use(cors(corsOptions))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false })
app.use(limiter)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 })

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crag_global'
mongoose.set('strictQuery', true)
mongoose.connect(mongoUri).then(() => {
  console.log('Mongo connected')
}).catch((e) => {
  console.error('Mongo connection error', e)
})

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

const companySchema = new mongoose.Schema({
  name: { type: String, default: 'Crag Global Ltd' },
  tagline: { type: String, default: "Thrive in today's dynamic environment" },
  email: { type: String, default: 'info@example.com' },
  phone: { type: String, default: '' },
  addressLines: { type: [String], default: [] },
  social: {
    instagram: { type: String, default: '#' },
    facebook: { type: String, default: '#' },
    linkedin: { type: String, default: '#' },
  },
}, { timestamps: true })

const Company = mongoose.model('Company', companySchema)

app.get('/api/health', (_, res) => {
  res.json({ ok: true })
})

app.get('/debug-sentry', (_req, _res) => {
  throw new Error('Sentry test error!')
})

// Auth helpers
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
const COOKIE_NAME = 'crag_token'

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  })
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME]
  if (!token) return res.status(401).json({ error: 'unauthorized' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'unauthorized' })
  }
}

// Seed admin (DEV ONLY)
if (!isProd) app.post('/api/dev/seed-admin', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const exists = await User.findOne({ email })
  if (exists) return res.json({ ok: true })
  const passwordHash = await bcrypt.hash(password, 12)
  await User.create({ email, passwordHash })
  res.json({ ok: true })
})

// Auth routes
const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) })
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid payload' })
  const { email, password } = parsed.data
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'invalid credentials' })
  setAuthCookie(res, { id: user._id, role: user.role })
  res.json({ ok: true })
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  res.json({ ok: true })
})

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

// Company content routes
app.get('/api/company', async (_req, res) => {
  let doc = await Company.findOne()
  if (!doc) doc = await Company.create({})
  res.json(doc)
})

const CompanySchema = z.object({
  name: z.string().min(1).max(20).optional(),
  tagline: z.string().max(30).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(25).optional(),
  addressLines: z.array(z.string().max(20)).optional(),
  social: z
    .object({
      instagram: z.string().max(30).optional(),
      facebook: z.string().max(30).optional(),
      linkedin: z.string().max(30).optional(),
    })
    .optional(),
})

app.put('/api/company', requireAuth, async (req, res) => {
  const parsed = CompanySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'invalid payload' })
  const update = parsed.data
  let doc = await Company.findOne()
  if (!doc) doc = await Company.create({})
  Object.assign(doc, update)
  await doc.save()
  res.json(doc)
})

if (typeof Sentry.expressErrorHandler === 'function') {
  // v10+
  app.use(Sentry.expressErrorHandler())
} else if (Sentry.Handlers?.errorHandler) {
  // v7
  app.use(Sentry.Handlers.errorHandler())
} else {
  console.warn('[sentry] No compatible error middleware found; continuing without Sentry error handler')
}

/* --------------------------------------------------
   NEW: serve React build in production
-------------------------------------------------- */
if (isProd) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname  = path.dirname(__filename)

  // 1. static assets (JS, CSS, images)
  app.use(express.static(path.join(__dirname, '../dist')))

  // 2. SPA fallback: return index.html for every other route
  // Use a catch-all middleware for SPA fallback (Express v5-safe)
  app.use((_req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

/* === Start server === */
const port = process.env.PORT || 4000
app.listen(port, () => console.log(`API + Frontend listening on :${port}`))