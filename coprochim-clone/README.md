# Materiel Didactique — Site, Boutique et Panneau d'Administration

Site bilingue (Arabe par défaut / Français) : vitrine, catalogue de 170 produits,
panier et prise de commande **sans paiement en ligne** (paiement à la livraison
après confirmation téléphonique), plus un **panneau d'administration** complet.

## Démarrage

```bash
npm install
npm run dev:all      # Vite (5173) + API Express (4000) en parallèle
```

Vite proxifie `/api` et `/uploads` vers `http://localhost:4000` : le site et le
panneau d'administration fonctionnent sans configuration supplémentaire.

### Autres commandes

| Commande | Rôle |
 | --- | --- |
| `npm run dev` | Frontend seul (le site reste utilisable sans backend : catalogue embarqué) |
| `npm run server` | API seule (port 4000, ou `PORT`) |
| `npm run build` | Compilation TypeScript + Vite dans `dist/` |
| `npm run start` | Build, puis sert `dist/` **et** l'API depuis le même processus (production) |
| `npm run lint` | ESLint |
| `npm run smoke` | Vérification SSR de 17 routes |
| `npm test` | Test de bout en bout de l'API (magasin jetable) |

## Panneau d'administration — `/admin`

Mot de passe : variable d'environnement `ADMIN_PASSWORD`. Sans cette variable, le
serveur utilise le mot de passe de développement **`admin123`** et affiche un
avertissement au démarrage. À changer avant la mise en ligne :

```bash
# PowerShell
$env:ADMIN_PASSWORD = "mot-de-passe-solide"; npm run start

# bash
ADMIN_PASSWORD="mot-de-passe-solide" npm run start
```

Le fichier `.env.example` liste ces variables (port, mot de passe, dossiers de
données) : copiez ses valeurs dans votre environnement d'hébergement. Le serveur
lit les variables d'environnement réelles et ne charge pas lui-même le fichier.

Écrans disponibles :

1. **Tableau de bord** — compteurs (produits, catégories, commandes en attente),
   dernières commandes et raccourcis.
2. **Produits** — recherche, filtre par catégorie, pagination ; création,
   modification (libellés FR/AR, référence, prix, catégorie) et suppression ;
   image par téléversement ou par URL.
3. **Catégories** — même principe (nom FR/AR, image, slug). Renommer une
   catégorie re-pointe automatiquement ses produits.
4. **Commandes** — liste filtrable par statut, fiche détaillée (client, téléphone
   avec appel/copie, articles, wilaya, adresse, notes) et changement de statut
   `en attente → confirmée → livrée / annulée`.
5. **Paramètres** — téléphones, fax, e-mail, adresse, réseaux sociaux, catalogues
   PDF, et remplacement des images du site (logo, hero, à-propos).

Les modifications enregistrées via `/admin` sont visibles **immédiatement** sur la
boutique : le store mémoire du front se recharge depuis l'API.

## Panier et commande

- Le panier est stocké côté client (`localStorage`) : `src/contexts/CartProvider.tsx`.
- `/panier` — lignes, quantités, suppression, sous-total en DZD.
- `/commande` — nom, **téléphone algérien obligatoire** (validation `0X…` /
  `+213…`), wilaya (58 wilayas), commune, adresse, notes. Aucun champ de paiement :
  la page rappelle que le règlement se fait à la livraison.
- `/commande/confirmation` — numéro de commande, récapitulatif et rappel de la
  confirmation téléphonique.
- Si l'API est injoignable, la commande est conservée localement et la page de
  confirmation demande explicitement au client d'appeler.

## Backend et données

```text
server/
  index.js      routes Express (catalogue, produits, catégories, réglages, commandes, upload)
  storage.js    lecture/écriture atomique de server/data/store.json
  seed.js       amorçage : relit src/data/catalog.generated.ts (12 catégories, 170 produits)
  auth.js       mot de passe → jeton bearer (12 h)
  data/         store.json (généré, ignoré par git)
  uploads/      images et PDF téléversés (ignorés par git)
```

Les routes `POST`/`PUT`/`DELETE` (produits, catégories, réglages, commandes)
exigent `Authorization: Bearer <token>`. `POST /api/orders` reste public : c'est la
prise de commande du client.

**En production sur un hébergeur statique**, le backend ne tourne pas : le site
continue de s'afficher avec le catalogue embarqué et le panier fonctionne, mais les
commandes et l'administration ne sont pas partagées. Il faut un hébergeur capable
d'exécuter Node (Render, Railway, VPS…) et y lancer `npm run start`.

## Vérification

```bash
npm run build && npm run lint && npm run smoke
npm test
```

`scripts/test-full-flow.mjs` démarre l'API sur un port de test et vérifie le cycle
complet : santé, catalogue, refus de mauvais mot de passe, connexion, création et
modification d'un produit, passation d'une commande (total vérifié), lecture admin,
changement de statut, modification des réglages, puis nettoyage. Les tests
s'exécutent sur un magasin jetable (`DATA_DIR`/`UPLOAD_DIR` temporaires) : votre
`server/data/store.json` n'est jamais modifié par la suite de tests.