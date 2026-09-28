/**
 * Minimal browser stubs so the app can be rendered with `react-dom/server`.
 * Imported before the app modules, so it runs first.
 *
 * Only the APIs touched during render (not inside effects) need stubbing:
 * `LanguageProvider` reads `location.pathname` and `localStorage` while
 * initialising its state.
 */

interface StubGlobal {
  __smokeLanguage?: string
  __smokeCartLines?: string
}

const stubs = globalThis as typeof globalThis & StubGlobal

const store = new Map<string, string>()

const localStorageStub = {
  getItem: (key: string) => {
    if (key === 'site:language') return stubs.__smokeLanguage ?? null
    if (key === 'site:cart') return stubs.__smokeCartLines ?? null
    if (key === 'admin:lang') return stubs.__smokeLanguage ?? null
    return store.get(key) ?? null
  },
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
  key: (index: number) => [...store.keys()][index] ?? null,
  get length() {
    return store.size
  },
}

const sessionStorageStub = {
  getItem: (key: string) => store.get(`session:${key}`) ?? null,
  setItem: (key: string, value: string) => store.set(`session:${key}`, value),
  removeItem: (key: string) => store.delete(`session:${key}`),
  clear: () => store.clear(),
  key: (index: number) => [...store.keys()][index] ?? null,
  get length() {
    return store.size
  },
}

/** Pre-loads the receipt read by `/commande/confirmation`. */
export function seedLastOrder(order: unknown): void {
  store.set('session:site:lastOrder', JSON.stringify(order))
}

/** Drops the seeded receipt so other routes start from a clean slate. */
export function clearLastOrder(): void {
  store.delete('session:site:lastOrder')
}

export function installStubs(pathname: string) {
  const win = {
    location: { pathname, search: '', hash: '' },
    localStorage: localStorageStub,
    sessionStorage: sessionStorageStub,
    scrollTo: () => {},
    setTimeout: () => 0,
    clearTimeout: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  }

  Object.assign(globalThis, {
    window: win,
    localStorage: localStorageStub,
    sessionStorage: sessionStorageStub,
    location: win.location,
  })
}

installStubs('/')
