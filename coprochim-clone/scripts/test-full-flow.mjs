import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const PORT = 4099

// Run the server against a throwaway data/uploads folder so the live
// `server/data/store.json` is never modified by the test suite.
const testDir = mkdtempSync(join(tmpdir(), 'store-test-'))

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  console.log('[test] Starting test server on port', PORT)
  const server = spawn('node', ['server/index.js'], {
    cwd: root,
    env: {
      ...process.env,
      PORT: String(PORT),
      ADMIN_PASSWORD: 'admin-test-pass',
      DATA_DIR: join(testDir, 'data'),
      UPLOAD_DIR: join(testDir, 'uploads'),
    },
    stdio: 'pipe',
  })

  server.stdout.on('data', (d) => process.stdout.write(`  [server:out] ${d}`))
  server.stderr.on('data', (d) => process.stderr.write(`  [server:err] ${d}`))

  let serverExited = false
  server.on('exit', (code) => {
    serverExited = true
    console.log('[server] exited with code', code)
  })

  try {
    // Wait for server to boot
    let ready = false
    for (let i = 0; i < 30; i++) {
      await sleep(200)
      try {
        const res = await fetch(`http://localhost:${PORT}/api/health`)
        if (res.ok) {
          ready = true
          break
        }
      } catch {
        // retry
      }
    }

    if (!ready) {
      throw new Error('Server did not boot in time')
    }
    console.log('[test] Server is ready!')

    // 1. Health check
    const health = await (await fetch(`http://localhost:${PORT}/api/health`)).json()
    console.log('[test] /api/health:', health)
    if (!health.ok) throw new Error('Health check failed')

    // 2. Initial catalog fetch
    const catalog = await (await fetch(`http://localhost:${PORT}/api/catalog`)).json()
    console.log(
      `[test] /api/catalog: ${catalog.categories.length} categories, ${catalog.products.length} products`,
    )
    if (catalog.categories.length === 0 || catalog.products.length === 0) {
      throw new Error('Catalog is empty')
    }

    // 3. Login to admin
    const badLogin = await fetch(`http://localhost:${PORT}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong' }),
    })
    if (badLogin.status !== 401) throw new Error('Expected 401 on wrong password')

    const loginRes = await fetch(`http://localhost:${PORT}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'admin-test-pass' }),
    })
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`)
    const { token } = await loginRes.json()
    console.log('[test] Admin logged in, token received (len=' + token.length + ')')
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    // 4. Create a test product
    const newProdRes = await fetch(`http://localhost:${PORT}/api/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        nameFr: 'Produit Test Automatise',
        nameAr: 'منتج تجريبي آلي',
        ref: 'AUTO-01',
        price: 4500,
        categorySlug: catalog.categories[0].slug,
        image: '/images/products/test.jpg',
      }),
    })
    if (!newProdRes.ok) throw new Error(`Create product failed: ${newProdRes.status}`)
    const createdProduct = await newProdRes.json()
    console.log('[test] Created product id:', createdProduct.id, createdProduct.slug)

    // 5. Update the product (price change)
    const updateProdRes = await fetch(`http://localhost:${PORT}/api/products/${createdProduct.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        price: 5200,
        nameFr: 'Produit Test Automatise Modifie',
      }),
    })
    if (!updateProdRes.ok) throw new Error(`Update product failed: ${updateProdRes.status}`)
    const updatedProduct = await updateProdRes.json()
    if (updatedProduct.price !== 5200) throw new Error('Product price was not updated')
    console.log('[test] Updated product price to:', updatedProduct.price)

    // 6. Public customer places an order
    const orderPayload = {
      language: 'ar',
      customer: {
        name: 'كريم بلقاسم',
        phone: '0555123456',
        wilaya: '16 - الجزائر',
        commune: 'باب الزوار',
        address: 'حي 5 جويلية عمارة 12',
        notes: 'يرجى الاتصال في الصباح',
      },
      items: [
        {
          productId: updatedProduct.id,
          slug: updatedProduct.slug,
          ref: updatedProduct.ref,
          nameFr: updatedProduct.nameFr,
          nameAr: updatedProduct.nameAr,
          price: updatedProduct.price,
          quantity: 2,
          image: updatedProduct.image,
        },
      ],
    }

    const orderRes = await fetch(`http://localhost:${PORT}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })
    if (!orderRes.ok) throw new Error(`Order placement failed: ${orderRes.status}`)
    const createdOrder = await orderRes.json()
    console.log(
      `[test] Placed order #${createdOrder.number} (id=${createdOrder.id}) total=${createdOrder.total} status=${createdOrder.status}`,
    )
    if (createdOrder.total !== 10400) {
      throw new Error(`Expected total 10400, got ${createdOrder.total}`)
    }

    // 7. Admin fetches orders list
    const ordersListRes = await fetch(`http://localhost:${PORT}/api/orders`, {
      headers: authHeaders,
    })
    if (!ordersListRes.ok) throw new Error(`Admin orders fetch failed: ${ordersListRes.status}`)
    const ordersList = await ordersListRes.json()
    const foundOrder = ordersList.find((o) => o.id === createdOrder.id)
    if (!foundOrder) throw new Error('Placed order not found in admin list')
    console.log('[test] Order found in admin list, status:', foundOrder.status)

    // 8. Admin updates order status (e.g. confirms it)
    const updateOrderRes = await fetch(`http://localhost:${PORT}/api/orders/${createdOrder.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: 'confirmed' }),
    })
    if (!updateOrderRes.ok) throw new Error(`Order status update failed: ${updateOrderRes.status}`)
    const updatedOrder = await updateOrderRes.json()
    if (updatedOrder.status !== 'confirmed') throw new Error('Order status was not updated')
    console.log('[test] Order status updated to:', updatedOrder.status)

    // 9. Update settings
    const settingsRes = await fetch(`http://localhost:${PORT}/api/settings`, {
      headers: authHeaders,
    })
    const currentSettings = await settingsRes.json()
    const newEmail = 'info-admin@coprochim.dz'
    const saveSettingsRes = await fetch(`http://localhost:${PORT}/api/settings`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        site: {
          ...currentSettings.site,
          email: newEmail,
        },
      }),
    })
    if (!saveSettingsRes.ok) throw new Error('Settings save failed')
    const savedSettings = await saveSettingsRes.json()
    if (savedSettings.site.email !== newEmail) throw new Error('Settings email not updated')
    console.log('[test] Site settings email updated to:', savedSettings.site.email)

    // 10. Clean up: delete test product and order
    await fetch(`http://localhost:${PORT}/api/products/${createdProduct.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    await fetch(`http://localhost:${PORT}/api/orders/${createdOrder.id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    console.log('[test] Cleaned up test product and test order.')

    console.log('\n=======================================')
    console.log(' ALL END-TO-END TESTS PASSED PROPERLY! ')
    console.log('=======================================\n')
  } finally {
    server.kill('SIGTERM')
    rmSync(testDir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error('[test] FAILED:', err)
  process.exit(1)
})