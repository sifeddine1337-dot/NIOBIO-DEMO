/**
 * Render smoke test.
 *
 * Renders every route to static markup with `react-dom/server` and asserts that
 * the expected content is present, in both Arabic and French. This catches
 * runtime render errors, bad imports and broken data lookups without needing a
 * browser or an extra test dependency.
 *
 * Usage:  npm run smoke
 * (builds this entry with `vite build --ssr`, then runs the output with Node)
 */
import { clearLastOrder, installStubs, seedLastOrder } from './stubs'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import App from '../../src/App'
import { CartProvider } from '../../src/contexts/CartProvider'
import { LanguageProvider } from '../../src/contexts/LanguageProvider'
import { products } from '../../src/data/catalog'

const language = globalThis as typeof globalThis & {
  __smokeLanguage?: string
  __smokeCartLines?: string
}

function render(path: string, lang: 'ar' | 'fr' = 'ar'): string {
  installStubs(path)
  language.__smokeLanguage = lang
  // The receipt page reads the last order from session storage: seed it so the
  // confirmation screen renders the same way it does after a real checkout.
  if (path === '/commande/confirmation') {
    seedLastOrder({
      number: 'CMD-0042',
      status: 'pending',
      offline: false,
      language: lang,
      customer: { name: 'Client Test', phone: '0550123456', wilaya: '16 — Alger' },
      items: [
        {
          productId: 783,
          slug: 'logiciel-el-djerd',
          ref: 'L001',
          nameFr: 'Logiciel EL DJERD',
          nameAr: 'الجلد',
          price: 5850,
          quantity: 2,
          image: '/images/products/LOG-05-1.jpg',
        },
      ],
      subtotal: 11700,
      total: 11700,
    })
  } else {
    clearLastOrder()
  }
  // Provide a dummy cart line for the checkout page smoke test so it doesn't redirect
  if (path === '/commande') {
    language.__smokeCartLines = JSON.stringify([
      {
        id: 783,
        slug: 'logiciel-el-djerd',
        ref: 'L001',
        nameFr: 'Logiciel EL DJERD',
        nameAr: 'الجلد',
        price: 5850,
        quantity: 1,
        image: '/images/products/LOG-05-1.jpg',
      },
    ])
  } else {
    language.__smokeCartLines = undefined
  }
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

interface Check {
  path: string
  lang?: 'ar' | 'fr'
  expect: string[]
  reject?: string[]
}

// Pick real values out of the generated catalog so the assertions stay honest.
const sampleProduct = products.find((p) => p.categorySlug === 'geologie') ?? products[0]

const checks: Check[] = [
  {
    path: '/',
    expect: [
      'شريككم في توفير الوسائل التعليمية', // hero heading (AR)
      'الفئات', // categories heading
      'مجموعة لدراسة الجيولوجيا', // a category label
      'لماذا تختاروننا؟', // why-us heading
      'تحميل كتالوجات', // catalogue eyebrow
      'logo-header.svg',
    ],
  },
  {
    path: '/',
    lang: 'fr',
    expect: [
      'Votre partenaire en matériel didactique', // hero heading (FR)
      'Catégories',
      'Pourquoi nous choisir',
      'Téléchargement des catalogues',
      'Découvrir nos produits',
    ],
    reject: ['شريككم في توفير الوسائل التعليمية'],
  },
  {
    path: '/boutique',
    expect: ['متجر', 'منتج', 'ابحث عن منتج', 'pcard__add'],
  },
  {
    path: '/boutique',
    lang: 'fr',
    expect: ['Boutique', 'Rechercher un produit', 'produits', 'Ajouter au panier'],
  },
  {
    path: '/product-category/geologie',
    expect: ['GEOLOGIE', 'مجموعة لدراسة الجيولوجيا', 'breadcrumb'],
  },
  {
    path: `/product/${sampleProduct.slug}`,
    expect: [
      sampleProduct.nameAr.slice(0, 10),
      'المرجع',
      sampleProduct.ref,
      sampleProduct.price.toLocaleString('en-US'),
      'الوصف',
      'منتجات ذات صلة',
    ],
  },
  {
    path: `/product/${sampleProduct.slug}`,
    lang: 'fr',
    expect: ['Réf', 'Quantité', 'Description', 'Produits similaires'],
  },
  {
    path: '/livraison',
    expect: ['خدمة التوصيل', '045 62 04 15'],
  },
  {
    path: '/conseil',
    expect: ['إرشاد وتوجيه'],
  },
  {
    path: '/a-propos',
    expect: ['من نحن', 'في خدمة المؤسسات التعليمية والتربوية'],
  },
  {
    path: '/contact',
    expect: [
      'اتصل بنا',
      'contact@example.dz',
      '045 62 03 88',
      'راسلونا',
      'الاسم واللقب',
      'البريد الإلكتروني',
    ],
  },
  {
    path: '/panier',
    expect: ['سلة المشتريات', 'سلتك فارغة حاليا'],
  },
  {
    path: '/panier',
    lang: 'fr',
    expect: ['Panier', 'Votre panier est vide pour le moment'],
  },
  {
    path: '/commande',
    expect: ['إتمام الطلب', 'معلومات العميل'],
  },
  {
    path: '/commande/confirmation',
    expect: [
      'شكرا لطلبكم من موقعنا', // thank-you heading (AR)
      'رقم طلبكم هو:', // order number label
      'CMD-0042', // generated reference
      'الدفع عند التسليم',
    ],
  },
  {
    path: '/commande/confirmation',
    lang: 'fr',
    expect: [
      'Merci pour votre commande',
      'Votre numéro de commande est :',
      'CMD-0042',
      'Client Test',
    ],
  },
  {
    path: '/admin',
    expect: ['لوحة التحكم', 'الدخول إلى لوحة التحكم'],
  },
  {
    path: '/contact',
    lang: 'fr',
    expect: ['Contact', 'Nos coordonnées', 'Nom et prénom', 'Sujet', 'Envoyer'],
  },
  {
    path: '/route-that-does-not-exist',
    expect: ['الصفحة غير موجودة', '404'],
  },
]

let failures = 0
let assertions = 0

for (const check of checks) {
  const label = `${check.path} [${check.lang ?? 'ar'}]`
  let html: string
  try {
    html = render(check.path, check.lang)
  } catch (error) {
    failures += 1
    console.log(`FAIL  ${label} — threw during render: ${(error as Error).message}`)
    continue
  }

  const problems: string[] = []
  for (const needle of check.expect) {
    assertions += 1
    if (!html.includes(needle)) problems.push(`missing ${JSON.stringify(needle)}`)
  }
  for (const needle of check.reject ?? []) {
    assertions += 1
    if (html.includes(needle)) problems.push(`unexpected ${JSON.stringify(needle)}`)
  }

  if (problems.length) {
    failures += problems.length
    console.log(`FAIL  ${label}\n        ${problems.join('\n        ')}`)
    console.log(`--- DUMP HTML for ${label} (first 500 chars) ---`)
    console.log(html.slice(0, 500))
    if (check.path === '/panier' && check.lang === 'fr') {
      console.log('--- HTML DUMP /panier [fr] ---')
      console.log(html.slice(html.indexOf('<main'), html.indexOf('</main>') + 7))
    }
  } else {
    console.log(`ok    ${label}  (${(html.length / 1024).toFixed(0)}KB html)`)
  }
}

console.log(`\n${assertions} assertions across ${checks.length} routes, ${failures} failure(s)`)
if (failures) process.exitCode = 1
