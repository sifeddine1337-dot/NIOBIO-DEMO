/**
 * JSON-file persistence for the admin backend.
 *
 * The whole store (catalog, site settings and orders) lives in a single
 * `server/data/store.json` file. Reads/writes are synchronous and the file is
 * replaced atomically (temp file + rename) so a crash mid-write cannot corrupt
 * the data. This keeps the project free of a database dependency while still
 * giving the control panel real, server-side persistence.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

/**
 * Where the JSON store and uploaded images live (git-ignored).
 *
 * `DATA_DIR` / `UPLOAD_DIR` env vars override the defaults — the automated
 * test-suite points them at a throwaway folder so running the tests never
 * touches the live store.
 */
export const DATA_DIR = process.env.DATA_DIR || join(here, 'data')
export const UPLOAD_DIR = process.env.UPLOAD_DIR || join(here, 'uploads')
const STORE_FILE = join(DATA_DIR, 'store.json')
const TEMP_FILE = join(DATA_DIR, 'store.json.tmp')

let store = null

function ensureDirs() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true })
}

/**
 * Loads the store from disk, seeding it on first boot. Missing top-level keys
 * are back-filled from the seed so a store created by an older version keeps
 * working after an upgrade.
 */
export function initStore(seed) {
  ensureDirs()

  if (existsSync(STORE_FILE)) {
    store = JSON.parse(readFileSync(STORE_FILE, 'utf8'))
    const defaults = seed()
    for (const key of Object.keys(defaults)) {
      if (store[key] === undefined) store[key] = defaults[key]
    }
  } else {
    store = seed()
    saveStore()
  }

  return store
}

/** Current in-memory store. Throws if `initStore` has not run yet. */
export function getStore() {
  if (!store) throw new Error('Store not initialised — call initStore() first')
  return store
}

/** Persists the in-memory store to disk atomically. */
export function saveStore() {
  ensureDirs()
  store.meta = { ...(store.meta ?? {}), updatedAt: new Date().toISOString() }
  writeFileSync(TEMP_FILE, JSON.stringify(store, null, 2))
  renameSync(TEMP_FILE, STORE_FILE)
  return store
}