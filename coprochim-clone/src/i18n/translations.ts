/**
 * Bilingual UI copy.
 *
 * Every string is a transcription of the original bilingual storefront: Arabic
 * is the default locale and French the alternative. A few strings are truncated
 * or machine-translated at source; those are reproduced verbatim and flagged
 * below so the wording stays faithful rather than silently "improved".
 */
import type { Language } from '../data/types'

/** Arabic copy — the default locale. */
const ar = {
  /* ---------- Navigation ---------- */
  'nav.home': 'الرئيسية',
  'nav.shop': 'متجر',
  'nav.delivery': 'خدمة التوصيل',
  'nav.guide': 'إرشاد وتوجيه',
  'nav.categories': 'الفئات',
  'nav.about': 'من نحن',
  'nav.contact': 'اتصل بنا',
  'nav.account': 'إنشاء حساب',
  'nav.cart': 'عربة',
  'nav.menu': 'القائمة',
  'nav.close': 'إغلاق',
  'nav.language': 'اللغة',
  'nav.callUs': 'اتصل بنا على',

  /* ---------- Hero ---------- */
  'hero.eyebrow': 'وسائل تعليمية',
  'hero.title': 'شريككم في توفير الوسائل التعليمية للمدرسة الجزائرية',
  'hero.body':
    'نرافق المؤسسات التعليمية في اقتناء المنتجات والأدوات التعليمية الإعلام بما يتفق مع برامج التعليم الوطنية ، مع خدمة سريعة وبسيطة وموثوق بها.',
  'hero.ctaProducts': 'اكتشاف منتجاتنا',
  'hero.ctaOrder': 'تحميل نموذج الطلب',
  'hero.imageAlt': 'وسائل تعليمية لمخابر المؤسسات التربوية',

  /* ---------- About / stats ---------- */
  'about.eyebrow': 'من نحن ؟',
  'about.title': 'في خدمة المؤسسات التعليمية والتربوية',
  'about.body':
    'يتكوّن فريقنا من مهنيين مختصين في المجال التربوي، وقد حرص مرة أخرى على بذل كل الجهود لتقديم مجموعة من الوسائل والمنتجات التي تلبي احتياجاتكم. بما أنكم تسعون إلى منح الجانب التجريبي مكانة أكثر أهمية، فإننا نضع بين أيديكم الحلول المناسبة، وندعوكم لاكتشاف بعض مستجداتنا.',
  'about.imageAlt': 'فريقنا في خدمة المؤسسات التعليمية',
  'stats.customers': 'العملاء راضون',
  'stats.sold': 'منتج مُباع',
  'stats.years': 'سنة من الخبرة',

  /* ---------- Categories ---------- */
  'categories.title': 'الفئات',
  'categories.subtitle': 'تصفح مجموعاتنا التعليمية حسب المادة',
  'categories.countSuffix': 'منتج',

  /* ---------- Products ---------- */
  'products.latest': 'أحدث منتجاتنا التعليمية',
  'products.viewAll': 'عرض كل المنتجات',
  'products.addToCart': 'إضافة إلى السلة',
  'products.added': 'تمت الإضافة',

  /* ---------- Feature strip ---------- */
  'features.deliveryTitle': 'خدمة التوصيل',
  'features.deliveryBody': 'خدمة توصيل سريعة ومجانية عبر جميع الولايات',
  'features.satisfactionTitle': 'رضا العملاء',
  // Verbatim from the source site, where the sentence stops mid-phrase.
  'features.satisfactionBody': 'حق العودة في حالة عدم الرضا عن جودة',
  'features.warrantyTitle': 'الضمان',
  'features.warrantyBody': 'البضاعة مضمونة',
  'features.availabilityTitle': 'توافر الوقت',
  // Verbatim: the source site's Arabic here is a garbled machine translation.
  'features.availabilityBody': 'الرصاص للتحقق من توافر يرجى الاتصال على الرقم التالي :',

  /* ---------- Catalogues ---------- */
  'catalogs.eyebrow': 'تحميل كتالوجات',
  'catalogs.title': 'مجموعة كاملة من المنتجات',
  'catalogs.subtitle': 'حمّل كتالوجاتنا للاطلاع على كل المنتجات',
  'catalogs.download': 'تحميل',

  /* ---------- Why us ---------- */
  'why.title': 'لماذا تختاروننا؟',
  'why.subtitle': 'شريك موثوق لتلبية احتياجاتكم التربوية',
  'why.item1Title': 'المنتجات التي تتوافق مع احتياجات المدرسة',
  'why.item1Body':
    'نقترح وسائل تعليمية ملائمة للبرامج التربوية المعتمدة من طرف وزارة التربية الوطنية.',
  'why.item2Title': 'توفير بسيط وسلس',
  'why.item2Body':
    'نسهّل عملية الطلب لفائدة المديرين، والمقتصدين، وأمناء المخازن، ومسؤولي المؤسسات التعليمية.',
  'why.item3Title': 'الدعم الفني',
  'why.item3Body': 'يرافقكم فريقنا المؤهل بالنصح والتوجيه نحو المنتجات الأنسب لاحتياجاتكم.',

  /* ---------- Newsletter ---------- */
  'newsletter.body':
    'اشتركوا في نشرتنا البريدية لتصلكم آخر التحديثات، الأخبار، التحليلات أو العروض الترويجية.',
  'newsletter.name': 'اسم',
  'newsletter.email': 'البريد الإلكتروني',
  'newsletter.submit': 'تسجيل',
  'newsletter.success': 'تم تسجيل اشتراكك بنجاح.',

  /* ---------- Footer ---------- */
  'footer.about': 'شريككم الموثوق في توفير الوسائل التعليمية للمدرسة الجزائرية.',
  'footer.quickLinks': 'روابط سريعة',
  'footer.range': 'مجموعة كاملة من المنتجات',
  'footer.range1': 'المواد التعليمية',
  'footer.range2': 'المنتجات التعليمية',
  'footer.range3': 'الأدوات المدرسية',
  'footer.range4': 'معدات المختبرات المدرسية',
  'footer.contact': 'الحصول على اتصال',
  'footer.rights': 'حقوق الطبع والنشر © 2026، جميع الحقوق محفوظة.',
  'footer.poweredBy': 'بواسطة Cafyb',
  'footer.followUs': 'تابعونا',

  /* ---------- Shop ---------- */
  'shop.title': 'متجر',
  'shop.subtitle': 'تصفح كل منتجاتنا التعليمية',
  'shop.search': 'ابحث عن منتج',
  'shop.sortDefault': 'الترتيب الافتراضي',
  'shop.sortPopularity': 'ترتيب حسب الشهرة',
  'shop.sortLatest': 'ترتيب حسب الأحدث',
  'shop.sortPriceAsc': 'ترتيب حسب: الأدنى سعراً للأعلى',
  'shop.sortPriceDesc': 'ترتيب حسب: الأعلى سعراً للأدنى',
  'shop.results': 'منتج',
  'shop.noResults': 'لا توجد منتجات مطابقة لبحثك.',
  'shop.clear': 'إعادة تعيين',
  'shop.allCategories': 'كل الفئات',
  'shop.categoryFilter': 'الفئة',

  /* ---------- Pagination ---------- */
  'pagination.prev': 'السابق',
  'pagination.next': 'التالي',

  /* ---------- Product ---------- */
  'product.ref': 'المرجع',
  'product.quantity': 'كمية',
  'product.description': 'الوصف',
  'product.noDescription': 'لا يتوفر وصف لهذا المنتج.',
  'product.related': 'منتجات ذات صلة',
  'product.notFound': 'المنتج غير موجود',
  'product.notFoundBody': 'المنتج الذي تبحث عنه غير متوفر أو تم حذفه.',
  'product.backToShop': 'العودة إلى المتجر',
  'product.inCategory': 'الفئة',
  'product.decrease': 'إنقاص الكمية',
  'product.increase': 'زيادة الكمية',

  /* ---------- Trust badges (product page) ---------- */
  'trust.deliveryTitle': 'خدمة التوصيل',
  'trust.deliveryBody': 'توصيل مجاني إلى باب المنزل عبر جميع الولايات',
  'trust.refundTitle': 'رضا العملاء',
  'trust.refundBody': 'حق الإرجاع: راضٍ أو مسترجع لأموالك',
  'trust.warrantyTitle': 'الضمان',
  'trust.warrantyBody': 'بضاعة مضمونة لمدة سنة واحدة',

  /* ---------- Breadcrumb ---------- */
  'breadcrumb.home': 'الرئيسية',

  /* ---------- Delivery page ---------- */
  'delivery.title': 'خدمة التوصيل',
  'delivery.subtitle': 'توصيل مجاني إلى باب المنزل عبر جميع الولايات',
  'delivery.p1':
    'على السادة رؤساء المؤسسات مراقبة العتاد المستلَم وإبلاغ المورّد عن أي خلل أو ملاحظة في أقرب الآجال.',
  'delivery.p2': 'البضاعة مكفولة لمدة 1 سنة ، حق العودة (ضمان المال)',
  'delivery.p3':
    'لمعرفة مدى توفر المنتجات، أو الحصول على آجال التسليم، أو تقديم ومتابعة طلبكم، يرجى الاتصال على الرقم التالي.',
  'delivery.phoneLabel': 'رقم الهاتف',

  /* ---------- Guidance page ---------- */
  'guide.title': 'إرشاد وتوجيه',
  // The live page contains only the placeholder word "text"; this stand-in
  // keeps the route honest instead of shipping a stub.
  'guide.subtitle': 'هذه الصفحة قيد الإعداد.',

  /* ---------- About page ---------- */
  'aboutPage.title': 'من نحن',
  'aboutPage.subtitle': 'تعرّف علينا',

  /* ---------- Contact page ---------- */
  'contact.title': 'اتصل بنا',
  'contact.subtitle': 'الحصول على اتصال',
  'contact.info': 'معلومات الاتصال الخاصة بنا',
  'contact.writeUs': 'راسلونا',
  'contact.name': 'الاسم واللقب',
  'contact.phone': 'رقم الهاتف',
  'contact.subject': 'الموضوع',
  'contact.email': 'البريد الإلكتروني',
  'contact.message': 'الرسالة',
  'contact.send': 'إرسال',
  'contact.sent': 'تم إرسال رسالتك. سنتواصل معك في أقرب وقت.',

  /* ---------- Cart ---------- */
  'cart.title': 'سلة المشتريات',
  'cart.subtitle': 'راجع منتجاتك ثم أكمل الطلب',
  'cart.empty': 'سلتك فارغة حاليا.',
  'cart.emptyCta': 'تصفح المنتجات',
  'cart.product': 'المنتج',
  'cart.unitPrice': 'سعر الوحدة',
  'cart.quantity': 'الكمية',
  'cart.lineTotal': 'المجموع',
  'cart.remove': 'حذف',
  'cart.clear': 'إفراغ السلة',
  'cart.subtotal': 'المجموع الفرعي',
  'cart.total': 'المجموع الإجمالي',
  'cart.items': 'منتج في السلة',
  'cart.continue': 'مواصلة التسوق',
  'cart.checkout': 'إتمام الطلب',

  /* ---------- Checkout ---------- */
  'checkout.title': 'إتمام الطلب',
  'checkout.subtitle': 'أدخل معلوماتك وسنتصل بك لتأكيد الطلب',
  'checkout.customer': 'معلومات العميل',
  'checkout.name': 'الاسم واللقب',
  'checkout.namePlaceholder': 'مثال: أحمد بن علي',
  'checkout.nameHint': 'الاسم الكامل، كما سنستعمله للاتصال بكم',
  'checkout.phone': 'رقم الهاتف',
  'checkout.phoneHint': 'مثال: 0550 12 34 56',
  'checkout.phoneUsage': 'نتصل بهذا الرقم لتأكيد الطلب قبل التسليم.',
  'checkout.wilaya': 'الولاية',
  'checkout.wilayaPlaceholder': 'اختر الولاية',
  'checkout.commune': 'البلدية',
  'checkout.address': 'العنوان الكامل',
  'checkout.addressPlaceholder': 'الحي، الشارع، رقم البناية',
  'checkout.notes': 'ملاحظات (اختياري)',
  'checkout.notesPlaceholder': 'أي تفاصيل إضافية حول الطلب أو التوصيل',
  'checkout.paymentTitle': 'طريقة الدفع',
  'checkout.paymentBody':
    'الدفع عند التسليم. لا يوجد دفع إلكتروني: نتصل بكم أولا لتأكيد الطلب، ثم تدفعون المبلغ عند استلام الطلبية.',
  'checkout.summary': 'ملخص الطلب',
  'checkout.delivery': 'التوصيل',
  'checkout.deliveryNote': 'يُحدّد عند تأكيد الطلب هاتفيا',
  'checkout.submit': 'تأكيد الطلب',
  'checkout.sending': 'جاري الإرسال...',
  'checkout.backToCart': 'العودة إلى السلة',
  'checkout.required': 'يرجى ملء الحقول المطلوبة.',
  'checkout.invalidPhone': 'يرجى إدخال رقم هاتف صحيح.',
  'checkout.error': 'تعذر إرسال الطلب. يرجى المحاولة مرة أخرى أو الاتصال بنا.',
  'checkout.emptyCart': 'سلتك فارغة، أضف منتجات قبل إتمام الطلب.',

  /* ---------- Order confirmation ---------- */
  'order.title': 'تأكيد الطلب',
  'order.thanks': 'شكرا لطلبكم من موقعنا',
  'order.intro':
    'شكرا لثقتكم. سيتصل بكم فريقنا قريباً لتأكيد الطلب قبل التسليم — احتفظوا برقم الطلب أدناه لأنه يتيح متابعة حالة طلبكم.',
  'order.numberLabel': 'رقم طلبكم هو:',
  'order.payOnDelivery': 'الدفع عند التسليم',
  'order.customer': 'العميل',
  'order.callNotice':
    'سنتصل بكم على الرقم المذكور لتأكيد الطلب، ثم تدفعون المبلغ نقدا عند التسليم.',
  'order.offline':
    'ملاحظة: تعذّر الاتصال بخادم الموقع في هذه اللحظة، لذلك سُجّل طلبك على هذا الجهاز فقط. يرجى الاتصال بنا هاتفيا لتأكيده.',
  'order.missingTitle': 'لا يوجد طلب لعرضه',
  'order.missingBody': 'لم نجد أي طلب في هذه الجلسة. إن كنت قد أكملت الطلب للتو، يرجى الاتصال بنا.',

  /* ---------- 404 ---------- */
  'notFound.title': 'الصفحة غير موجودة',
  'notFound.body': 'عذراً، الصفحة التي تبحث عنها غير متوفرة.',
  'notFound.back': 'العودة إلى الرئيسية',
} as const

/** Every key the Arabic dictionary defines; `fr` must match it exactly. */
export type TranslationKey = keyof typeof ar

/** French copy. */
const fr: Record<TranslationKey, string> = {
  /* ---------- Navigation ---------- */
  'nav.home': 'Accueil',
  'nav.shop': 'Boutique',
  'nav.delivery': 'Livraison',
  'nav.guide': 'Conseil',
  'nav.categories': 'Catégories',
  'nav.about': 'A propos',
  'nav.contact': 'Contact',
  'nav.account': 'Créé un compte',
  'nav.cart': 'Cart',
  'nav.menu': 'Menu',
  'nav.close': 'Fermer',
  'nav.language': 'Langue',
  'nav.callUs': 'Appelez-nous au',

  /* ---------- Hero ---------- */
  'hero.eyebrow': 'Matériel didactique',
  'hero.title': 'Votre partenaire en matériel didactique pour l’école algérienne',
  'hero.body':
    'Nous accompagnons les établissements scolaires dans l’acquisition de produits, instruments et supports pédagogiques conformes aux programmes de l’Éducation nationale, avec un service rapide, simple et fiable.',
  'hero.ctaProducts': 'Découvrir nos produits',
  'hero.ctaOrder': 'Télécharger bon de commande',
  'hero.imageAlt': 'Matériel didactique pour les laboratoires scolaires',

  /* ---------- About / stats ---------- */
  'about.eyebrow': 'Qui sommes-nous ?',
  'about.title': 'Au service des établissements scolaires',
  'about.body':
    'Notre équipe est composée de professionnels de la pédagogie, a une nouvelle fois tout mis en oeuvre pour vous proposer une gamme de matériels et produits répondant à vos besoins. Sachant que vous souhaitez donner à l’expérimental une place de plus en plus importante, nous vous en apportons la réponse et vous invitons à découvrir quelques nouveautés.',
  'about.imageAlt': 'Notre équipe au service des établissements scolaires',
  'stats.customers': 'Client satisfait',
  'stats.sold': 'Produit vendu',
  'stats.years': "Années d'expérience",

  /* ---------- Categories ---------- */
  'categories.title': 'Catégories',
  'categories.subtitle': 'Parcourez nos gammes pédagogiques par matière',
  'categories.countSuffix': 'produits',

  /* ---------- Products ---------- */
  'products.latest': 'Nos derniers produits didactiques',
  'products.viewAll': 'Voir tous les produits',
  'products.addToCart': 'Ajouter au panier',
  'products.added': 'Ajouté',

  /* ---------- Feature strip ---------- */
  'features.deliveryTitle': 'Livraison',
  'features.deliveryBody': 'Livraison rapide et gratuite dans tous les états',
  'features.satisfactionTitle': 'Satisfaction client',
  // Verbatim from the source site, where the sentence stops mid-phrase.
  'features.satisfactionBody':
    "Droit de retour en cas d'insatisfaction quant à la qualité",
  'features.warrantyTitle': 'Garantie',
  'features.warrantyBody': 'Les marchandises sont garanties',
  'features.availabilityTitle': 'Disponibilité et délai',
  'features.availabilityBody':
    'Pour vérifier la disponibilité veuillez appeller au numéro suivant :',

  /* ---------- Catalogues ---------- */
  'catalogs.eyebrow': 'Téléchargement des catalogues',
  'catalogs.title': 'Gamme complète de produits',
  'catalogs.subtitle': 'Téléchargez nos catalogues pour découvrir tous les produits',
  'catalogs.download': 'Télécharger',

  /* ---------- Why us ---------- */
  'why.title': 'Pourquoi nous choisir ?',
  'why.subtitle': 'Un partenaire fiable pour vos besoins pédagogiques',
  'why.item1Title': 'Produits conformes aux besoins scolaires',
  'why.item1Body':
    'Nous proposons du matériel adapté aux programmes pédagogiques définis par l’Éducation nationale.',
  'why.item2Title': 'Approvisionnement simple',
  'why.item2Body':
    'Nous facilitons le processus de commande pour les directeurs, intendants, magasiniers et responsables d’établissements.',
  'why.item3Title': 'Accompagnement professionnel',
  'why.item3Body':
    'Notre équipe qualifiée vous conseille et vous oriente vers les produits les plus adaptés à vos besoins.',

  /* ---------- Newsletter ---------- */
  'newsletter.body':
    'Inscrivez-vous à notre newsletter pour recevoir des mises à jour, des actualités, des analyses ou des promotions.',
  'newsletter.name': 'Nom',
  'newsletter.email': 'Email',
  'newsletter.submit': "S'inscrire",
  'newsletter.success': 'Votre inscription a bien été enregistrée.',

  /* ---------- Footer ---------- */
  'footer.about':
    'Votre partenaire fiable en matériel didactique pour l’école algérienne.',
  'footer.quickLinks': 'Liens rapides',
  'footer.range': 'Gamme complète',
  'footer.range1': 'Matériel didactique',
  'footer.range2': 'Produits pédagogiques',
  'footer.range3': 'Instruments scolaires',
  'footer.range4': 'Équipements pour laboratoires scolaires',
  'footer.contact': 'Entrer en contact',
  'footer.rights': 'Copyright © 2026, All rights reserved.',
  'footer.poweredBy': 'Powered by Cafyb',
  'footer.followUs': 'Suivez-nous',

  /* ---------- Shop ---------- */
  'shop.title': 'Boutique',
  'shop.subtitle': 'Parcourez tous nos produits didactiques',
  'shop.search': 'Rechercher un produit',
  'shop.sortDefault': 'Tri par défaut',
  'shop.sortPopularity': 'Tri par popularité',
  'shop.sortLatest': 'Tri par nouveauté',
  'shop.sortPriceAsc': 'Tri par prix croissant',
  'shop.sortPriceDesc': 'Tri par prix décroissant',
  'shop.results': 'produits',
  'shop.noResults': 'Aucun produit ne correspond à votre recherche.',
  'shop.clear': 'Réinitialiser',
  'shop.allCategories': 'Toutes les catégories',
  'shop.categoryFilter': 'Catégorie',

  /* ---------- Pagination ---------- */
  'pagination.prev': 'Précédent',
  'pagination.next': 'Suivant',

  /* ---------- Product ---------- */
  'product.ref': 'Réf',
  'product.quantity': 'Quantité',
  'product.description': 'Description',
  'product.noDescription': 'Aucune description disponible pour ce produit.',
  'product.related': 'Produits similaires',
  'product.notFound': 'Produit introuvable',
  'product.notFoundBody': 'Le produit recherché est indisponible ou a été supprimé.',
  'product.backToShop': 'Retour à la boutique',
  'product.inCategory': 'Catégorie',
  'product.decrease': 'Diminuer la quantité',
  'product.increase': 'Augmenter la quantité',

  /* ---------- Trust badges (product page) ---------- */
  'trust.deliveryTitle': 'Livraison',
  'trust.deliveryBody':
    'Livraisons gratuites et à domicile pour toutes les wilayas',
  'trust.refundTitle': 'Satisfaction client',
  'trust.refundBody': 'Droit de retour : satisfait ou remboursé',
  'trust.warrantyTitle': 'Garantie',
  'trust.warrantyBody': 'Marchandise garantie pendant 1 an',

  /* ---------- Breadcrumb ---------- */
  'breadcrumb.home': 'Accueil',

  /* ---------- Delivery page ---------- */
  'delivery.title': 'Livraison',
  'delivery.subtitle':
    'Livraisons gratuites et à domicile pour toutes les wilayas',
  'delivery.p1':
    'Messieurs les chefs d’établissement doivent contrôler le matériel livré et informer le fournisseur pour toute anomalie dans les meilleurs délais.',
  'delivery.p2':
    'Marchandise garantie pendant 1 an, le droit de retour (Satisfait ou remboursé)',
  'delivery.p3':
    'Pour connaitre la disponibilité des articles, obtenir un délai de livraison, passer et suivre votre commande, demandez le numéro suivant',
  'delivery.phoneLabel': 'Numéro de téléphone',

  /* ---------- Guidance page ---------- */
  'guide.title': 'Conseil',
  'guide.subtitle': 'Cette page est en cours de rédaction.',

  /* ---------- About page ---------- */
  'aboutPage.title': 'A propos',
  'aboutPage.subtitle': 'Découvrir notre activité',

  /* ---------- Contact page ---------- */
  'contact.title': 'Contact',
  'contact.subtitle': 'Entrer en contact',
  'contact.info': 'Nos coordonnées',
  'contact.writeUs': 'Écrivez-nous',
  'contact.name': 'Nom et prénom',
  'contact.phone': 'Téléphone',
  'contact.subject': 'Sujet',
  'contact.email': 'Email',
  'contact.message': 'Message',
  'contact.send': 'Envoyer',
  'contact.sent': 'Votre message a été envoyé. Nous vous répondrons rapidement.',

  /* ---------- Cart ---------- */
  'cart.title': 'Panier',
  'cart.subtitle': 'Vérifiez vos articles puis validez la commande',
  'cart.empty': 'Votre panier est vide pour le moment.',
  'cart.emptyCta': 'Parcourir les produits',
  'cart.product': 'Produit',
  'cart.unitPrice': 'Prix unitaire',
  'cart.quantity': 'Quantité',
  'cart.lineTotal': 'Total',
  'cart.remove': 'Retirer',
  'cart.clear': 'Vider le panier',
  'cart.subtotal': 'Sous-total',
  'cart.total': 'Total de la commande',
  'cart.items': 'article(s) dans le panier',
  'cart.continue': 'Continuer mes achats',
  'cart.checkout': 'Passer la commande',

  /* ---------- Checkout ---------- */
  'checkout.title': 'Valider la commande',
  'checkout.subtitle':
    'Renseignez vos coordonnées, nous vous appelons pour confirmer la commande',
  'checkout.customer': 'Informations client',
  'checkout.name': 'Nom et prénom',
  'checkout.namePlaceholder': 'Ex : Ahmed Benali',
  'checkout.nameHint': 'Nom complet, tel que nous vous appellerons',
  'checkout.phone': 'Téléphone',
  'checkout.phoneHint': 'Ex : 0550 12 34 56',
  'checkout.phoneUsage':
    'Nous appelons ce numéro pour confirmer la commande avant livraison.',
  'checkout.wilaya': 'Wilaya',
  'checkout.wilayaPlaceholder': 'Choisissez la wilaya',
  'checkout.commune': 'Commune',
  'checkout.address': 'Adresse complète',
  'checkout.addressPlaceholder': 'Quartier, rue, numéro',
  'checkout.notes': 'Remarques (facultatif)',
  'checkout.notesPlaceholder': 'Tout détail utile sur la commande ou la livraison',
  'checkout.paymentTitle': 'Mode de paiement',
  'checkout.paymentBody':
    "Paiement à la livraison. Aucun paiement en ligne : nous vous appelons d'abord pour confirmer la commande, puis vous réglez le montant à la réception.",
  'checkout.summary': 'Récapitulatif de la commande',
  'checkout.delivery': 'Livraison',
  'checkout.deliveryNote': 'Confirmée par téléphone',
  'checkout.submit': 'Confirmer la commande',
  'checkout.sending': 'Envoi en cours...',
  'checkout.backToCart': 'Retour au panier',
  'checkout.required': 'Merci de remplir les champs obligatoires.',
  'checkout.invalidPhone': 'Merci de saisir un numéro de téléphone valide.',
  'checkout.error':
    "L'envoi de la commande a échoué. Merci de réessayer ou de nous appeler.",
  'checkout.emptyCart':
    'Votre panier est vide : ajoutez des produits avant de valider la commande.',

  /* ---------- Order confirmation ---------- */
  'order.title': 'Confirmation de commande',
  'order.thanks': 'Merci pour votre commande',
  'order.intro':
    'Merci d’avoir commandé sur notre site. Notre équipe vous contacte très bientôt pour confirmer la commande avant la livraison — conservez le numéro ci-dessous : il permet de suivre l’état de votre commande.',
  'order.numberLabel': 'Votre numéro de commande est :',
  'order.payOnDelivery': 'Paiement à la livraison',
  'order.customer': 'Client',
  'order.callNotice':
    'Nous vous appelons au numéro indiqué pour confirmer la commande, puis vous réglez le montant en espèces à la livraison.',
  'order.offline':
    "Remarque : le serveur est momentanément injoignable ; votre commande n'a été enregistrée que sur cet appareil. Merci de nous appeler pour la confirmer.",
  'order.missingTitle': 'Aucune commande à afficher',
  'order.missingBody':
    "Nous n'avons trouvé aucune commande dans cette session. Si vous venez de commander, merci de nous appeler.",


  /* ---------- 404 ---------- */
  'notFound.title': 'Page introuvable',
  'notFound.body': 'Désolé, la page que vous recherchez est introuvable.',
  'notFound.back': "Retour à l'accueil",
}

export const translations: Record<Language, Record<TranslationKey, string>> = { ar, fr }



