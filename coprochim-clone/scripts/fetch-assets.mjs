/**
 * Downloads the curated image/PDF assets used by the site shell (hero, "why us"
 * artwork, catalogue covers, order form and the 12 category card images) into
 * `public/images/`.
 *
 * Usage:  ASSET_CDN=<uploads-base-url> node scripts/fetch-assets.mjs
 *
 * The header/footer marks are authored SVGs committed to the repo, so they are
 * deliberately absent from this list. Safe to re-run: files that already exist
 * are skipped.
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'images')

/**
 * Base URL the curated assets are served from. Override with the ASSET_CDN
 * environment variable; the placeholder host is only contacted when this script
 * is actually run.
 */
const CDN = process.env.ASSET_CDN ?? 'https://example.invalid/wp-content/uploads/'

/** Curated shell assets: [localName, remoteFile] */
const SHELL_ASSETS = [
  ['hero.png', 'ChatGPT-Image-3-juin-2026-00_54_26-1-600x732.png'],
  ['why-us.webp', 'ChatGPT-Image-3-juin-2026-01_27_57-e1780443659784-1024x682.webp'],
  ['catalogue-2023-2024.png', 'Catalogue-2023-2024-06-10-2026_02_27_PM-1.png'],
  ['catalogue-covid-2021-2022.png', 'Catalogue-COVID-2021-2022-06-10-2026_02_26_PM-1.png'],
  ['bon-de-commande.pdf', 'ilovepdf_merged_compressed.pdf'],
]

/**
 * The 12 category cards on the home page are sourced from page scans numbered
 * 01..09 + 11..13, rendered in the same order as the WooCommerce category
 * list (verified by walking the live HTML in document order).
 */
const CATEGORY_PAGES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13']
const CATEGORY_ASSETS = CATEGORY_PAGES.map((page, i) => {
  const suffix = page === '13' ? '-2' : ''
  const local = `cat-${String(i + 1).padStart(2, '0')}.jpg`
  return [local, `${page}_page-0001${suffix}-700x700.jpg`]
})

const exists = async (p) => access(p).then(() => true, () => false)

async function download(remotefile, localName) {
  const dest = join(OUT, localName)
  if (await exists(dest)) return 'skip'
  const res = await fetch(CDN + remotefile, { redirect: 'follow' })
  if (!res.ok) return `FAIL ${res.status}`
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 100) return 'FAIL empty'
  await writeFile(dest, buf)
  return `ok ${(buf.length / 1024).toFixed(0)}KB`
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const all = [...SHELL_ASSETS, ...CATEGORY_ASSETS]
  let failed = 0
  for (const [local, remote] of all) {
    try {
      const status = await download(remote, local)
      if (status.startsWith('FAIL')) failed++
      console.log(`${status.padEnd(10)} ${local}`)
    } catch (err) {
      failed++
      console.log(`ERROR      ${local} -> ${err.message}`)
    }
  }
  console.log(`\n${all.length - failed}/${all.length} assets ready in public/images/`)
  if (failed) process.exitCode = 1
}

main()
