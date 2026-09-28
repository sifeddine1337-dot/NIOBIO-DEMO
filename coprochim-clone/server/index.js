/**
 * Admin + storefront API server.
 *
 * Runs alongside Vite in development (Vite proxies `/api` and `/uploads` here)
 * and serves the built `dist/` folder in production, so a single Node process
 * hosts both the storefront and the control panel's backend.
 *
 *   npm run server      # API only (dev)
 *   npm run dev:all     # Vite + API together (dev)
 *   npm run start       # build + serve dist/ + API (production)
 */
import { existsSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import express from 'express'
import multer from 'multer'
import { checkPassword, issueToken, requireAuth, revokeToken, usingDefaultPassword } from './auth.js'
import { buildSeed } from './seed.js'
import { UPLOAD_DIR, getStore, initStore, saveStore } from './storage.js'

const here = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 4000
const DIST_DIR = join(here, '..', 'dist')

initStore(buildSeed)

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(UPLOAD_DIR))

/* ------------------------------------------------------------------ helpers */

const slugify = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const asTrimmedString = (value, fallback = '') =>
  typeof value === 'string' ? value.trim() : fallback

const asNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const nextId = (items) => items.reduce((max, item) => Math.max(max, asNumber(item.id)), 0) + 1

/** Normalises an incoming product payload; `existing` keeps unchanged values. */
function sanitizeProduct(body, existing = {}) {
  const nameFr = asTrimmedString(body.nameFr, existing.nameFr ?? '')
  return {
    id: asNumber(body.id, existing.id),
    slug: asTrimmedString(body.slug) || existing.slug || slugify(nameFr) || `produit-${Date.now()}`,
    ref: asTrimmedString(body.ref, existing.ref ?? ''),
    nameFr,
    nameAr: asTrimmedString(body.nameAr, existing.nameAr ?? ''),
    price: Math.max(0, Math.round(asNumber(body.price, existing.price ?? 0))),
    categorySlug: asTrimmedString(body.categorySlug, existing.categorySlug ?? ''),
    image: asTrimmedString(body.image, existing.image ?? ''),
  }
}

/** Normalises an incoming category payload. */
function sanitizeCategory(body, existing = {}) {
  const nameFr = asTrimmedString(body.nameFr, existing.nameFr ?? '')
  return {
    id: asNumber(body.id, existing.id),
    slug: asTrimmedString(body.slug) || existing.slug || slugify(nameFr) || `categorie-${Date.now()}`,
    nameFr,
    nameAr: asTrimmedString(body.nameAr, existing.nameAr ?? ''),
    count: Math.max(0, Math.round(asNumber(body.count, existing.count ?? 0))),
    image: asTrimmedString(body.image, existing.image ?? ''),
  }
}

const ORDER_STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled']

/** Normalises an incoming order payload coming from the public checkout. */
function sanitizeOrder(body) {
  const items = Array.isArray(body.items) ? body.items : []
  const normalizedItems = items.map((item) => ({
    productId: asNumber(item.productId, 0),
    slug: asTrimmedString(item.slug),
    ref: asTrimmedString(item.ref),
    nameFr: asTrimmedString(item.nameFr),
    nameAr: asTrimmedString(item.nameAr),
    price: Math.max(0, asNumber(item.price, 0)),
    quantity: Math.max(1, Math.round(asNumber(item.quantity, 1))),
    image: asTrimmedString(item.image),
  }))

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    status: 'pending',
    language: body.language === 'fr' ? 'fr' : 'ar',
    customer: {
      name: asTrimmedString(body.customer?.name),
      phone: asTrimmedString(body.customer?.phone),
      wilaya: asTrimmedString(body.customer?.wilaya),
      commune: asTrimmedString(body.customer?.commune),
      address: asTrimmedString(body.customer?.address),
      notes: asTrimmedString(body.customer?.notes),
    },
    items: normalizedItems,
    subtotal,
    total: subtotal,
  }
}

/* --------------------------------------------------------------------- auth */

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, usingDefaultPassword: usingDefaultPassword() })
})

app.post('/api/login', (req, res) => {
  if (!checkPassword(req.body?.password)) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }
  res.json(issueToken())
})

app.post('/api/logout', (req, res) => {
  const header = req.get('authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (token) revokeToken(token)
  res.json({ ok: true })
})

/* ------------------------------------------------------------------ catalog */

app.get('/api/catalog', (_req, res) => {
  const store = getStore()
  res.json({
    categories: store.categories,
    products: store.products,
    settings: store.settings,
    updatedAt: store.meta?.updatedAt ?? null,
  })
})

app.get('/api/products', (req, res) => {
  const store = getStore()
  const { q = '', categorySlug = '', sort = 'default' } = req.query
  const page = Math.max(1, asNumber(req.query.page, 1))
  const perPage = Math.min(200, Math.max(1, asNumber(req.query.perPage, 30)))

  const needle = String(q).trim().toLowerCase()
  let items = store.products.filter((product) => {
    if (categorySlug && product.categorySlug !== categorySlug) return false
    if (!needle) return true
    return [product.nameFr, product.nameAr, product.ref].some((field) =>
      String(field).toLowerCase().includes(needle),
    )
  })

  if (sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price)

  const total = items.length
  const start = (page - 1) * perPage

  res.json({ items: items.slice(start, start + perPage), total, page, perPage })
})

app.get('/api/products/:id', (req, res) => {
  const store = getStore()
  const product = store.products.find((item) => item.id === asNumber(req.params.id))
  if (!product) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json(product)
})

app.post('/api/products', requireAuth, (req, res) => {
  const store = getStore()
  const product = sanitizeProduct(req.body)
  product.id = nextId(store.products)
  store.products.push(product)
  saveStore()
  res.status(201).json(product)
})

app.put('/api/products/:id', requireAuth, (req, res) => {
  const store = getStore()
  const id = asNumber(req.params.id)
  const index = store.products.findIndex((item) => item.id === id)
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  const product = sanitizeProduct({ ...req.body, id }, store.products[index])
  store.products[index] = product
  saveStore()
  res.json(product)
})

app.delete('/api/products/:id', requireAuth, (req, res) => {
  const store = getStore()
  const id = asNumber(req.params.id)
  const index = store.products.findIndex((item) => item.id === id)
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  store.products.splice(index, 1)
  saveStore()
  res.json({ ok: true })
})

/* --------------------------------------------------------------- categories */

app.get('/api/categories', (_req, res) => {
  res.json(getStore().categories)
})

app.post('/api/categories', requireAuth, (req, res) => {
  const store = getStore()
  const category = sanitizeCategory(req.body)
  category.id = nextId(store.categories)
  store.categories.push(category)
  saveStore()
  res.status(201).json(category)
})

app.put('/api/categories/:id', requireAuth, (req, res) => {
  const store = getStore()
  const id = asNumber(req.params.id)
  const index = store.categories.findIndex((item) => item.id === id)
  if (index === -1) {
    res.status(404).json({ error: 'Category not found' })
    return
  }
  const previousSlug = store.categories[index].slug
  const category = sanitizeCategory({ ...req.body, id }, store.categories[index])
  store.categories[index] = category

  // Keep products pointing at the renamed category.
  if (category.slug !== previousSlug) {
    for (const product of store.products) {
      if (product.categorySlug === previousSlug) product.categorySlug = category.slug
    }
  }

  saveStore()
  res.json(category)
})

app.delete('/api/categories/:id', requireAuth, (req, res) => {
  const store = getStore()
  const id = asNumber(req.params.id)
  const index = store.categories.findIndex((item) => item.id === id)
  if (index === -1) {
    res.status(404).json({ error: 'Category not found' })
    return
  }
  store.categories.splice(index, 1)
  saveStore()
  res.json({ ok: true })
})

/* ----------------------------------------------------------------- settings */

app.get('/api/settings', (_req, res) => {
  res.json(getStore().settings)
})

app.put('/api/settings', requireAuth, (req, res) => {
  const store = getStore()
  const { site, catalogues } = req.body ?? {}
  store.settings = {
    site: site ?? store.settings.site,
    catalogues: Array.isArray(catalogues) ? catalogues : store.settings.catalogues,
  }
  saveStore()
  res.json(store.settings)
})

/* ------------------------------------------------------------------- orders */

app.get('/api/orders', requireAuth, (req, res) => {
  const store = getStore()
  const status = asTrimmedString(req.query.status)
  const orders = status ? store.orders.filter((order) => order.status === status) : store.orders
  // Newest first.
  res.json([...orders].sort((a, b) => b.id - a.id))
})

app.get('/api/orders/:id', requireAuth, (req, res) => {
  const order = getStore().orders.find((item) => item.id === asNumber(req.params.id))
  if (!order) {
    res.status(404).json({ error: 'Order not found' })
    return
  }
  res.json(order)
})

app.post('/api/orders', (req, res) => {
  const store = getStore()
  const order = sanitizeOrder(req.body ?? {})

  if (!order.customer.name || !order.customer.phone) {
    res.status(400).json({ error: 'Name and phone number are required' })
    return
  }
  if (order.items.length === 0) {
    res.status(400).json({ error: 'The order is empty' })
    return
  }

  order.id = nextId(store.orders)
  order.number = `CMD-${String(order.id).padStart(4, '0')}`
  order.createdAt = new Date().toISOString()
  order.updatedAt = order.createdAt
  store.orders.push(order)
  saveStore()

  res.status(201).json(order)
})

app.put('/api/orders/:id', requireAuth, (req, res) => {
  const store = getStore()
  const order = store.orders.find((item) => item.id === asNumber(req.params.id))
  if (!order) {
    res.status(404).json({ error: 'Order not found' })
    return
  }
  if (req.body?.status) {
    if (!ORDER_STATUSES.includes(req.body.status)) {
      res.status(400).json({ error: 'Unknown status' })
      return
    }
    order.status = req.body.status
  }
  if (req.body?.customer) {
    order.customer = { ...order.customer, ...req.body.customer }
  }
  order.updatedAt = new Date().toISOString()
  saveStore()
  res.json(order)
})

app.delete('/api/orders/:id', requireAuth, (req, res) => {
  const store = getStore()
  const index = store.orders.findIndex((item) => item.id === asNumber(req.params.id))
  if (index === -1) {
    res.status(404).json({ error: 'Order not found' })
    return
  }
  store.orders.splice(index, 1)
  saveStore()
  res.json({ ok: true })
})

/* ------------------------------------------------------------------- upload */

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.jfif',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.pdf',
  '.avif',
  '.bmp',
])

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const extension = extname(file.originalname).toLowerCase()
      const base = slugify(file.originalname.replace(/\.[^.]+$/, '')) || 'image'
      cb(null, `${Date.now()}-${base}${extension}`)
    },
  }),
  limits: { fileSize: 16 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extension = extname(file.originalname).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      cb(new Error(`Unsupported file type: ${extension || 'unknown'}`))
      return
    }
    cb(null, true)
  },
})

app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file received' })
    return
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

/* --------------------------------------------------- production static site */

if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      next()
      return
    }
    res.sendFile(join(DIST_DIR, 'index.html'))
  })
}

/* ------------------------------------------------------------ error handler */

app.use((err, _req, res, _next) => {
  const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 500)
  res.status(status).json({ error: err.message || 'Server error' })
})

app.listen(PORT, () => {
  const mode = existsSync(DIST_DIR) ? 'dist + API' : 'API only (run Vite separately)'
  console.log(`[server] listening on http://localhost:${PORT} — ${mode}`)
  if (usingDefaultPassword()) {
    console.warn('[server] ADMIN_PASSWORD not set — using the default "admin123". Change it before going live.')
  }
})