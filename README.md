# 🚀 SoloVault - Base de Données de Projets Solo à Succès

**SoloVault** est une plateforme qui présente une collection exclusive de 50+ projets SaaS développés par des solopreneurs générant plus de 10K€/mois. Analysez leurs stratégies, technologies et chemins vers le succès.

![SoloVault](https://img.shields.io/badge/version-1.0.0-orange.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Déploiement](#-déploiement)
- [Contact](#-contact)

## ✨ Fonctionnalités

### 🎯 Principales

- **📊 Base de données de 50+ projets** : Projets solo détaillés avec revenues, stratégies, et technologies
- **🔍 Filtres avancés** : Par revenue (1M+, 500K-1M, 100K-500K), MVP speed, status solo
- **🔎 Recherche en temps réel** : Recherche par nom, industrie, problème ou solution
- **📧 Email Gate** : Capture d'emails pour accès gratuit aux 10 premiers projets
- **💳 Intégration Stripe** : Vente de la base complète à 19€
- **📨 Demandes de devis** : Pour des projets similaires
- **🔒 Dashboard Admin** : Upload Excel pour mise à jour des données
- **🌓 Mode Dark/Light** : Interface moderne et responsive

### 💼 Admin Features

- Upload de fichiers Excel (.xlsx)
- Backup automatique des données
- Statistiques en temps réel
- Authentification par code PIN

## 🛠 Technologies

- **Frontend** : Next.js 14, React 18, TypeScript 5
- **Styling** : TailwindCSS 3.4, Lucide React Icons
- **Backend** : Next.js API Routes (serverless)
- **Services** : EmailJS (emails), Stripe (paiements), XLSX (parsing Excel)
- **Hosting** : Vercel

## 📦 Installation

### Prérequis

- Node.js 18+ et npm
- Compte GitHub
- Comptes EmailJS et Stripe (optionnel pour production)

### Étapes d'installation

```bash
# 1. Cloner le repository
git clone https://github.com/MattJeff/SoloVault.git
cd solovault-mvp

# 2. Installer les dépendances
npm install

# 3. Copier et configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID=your_quote_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# App
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_CODE=1234

# Admin Email
NEXT_PUBLIC_ADMIN_EMAIL=mhiguinen235@gmail.com
```

### Configuration EmailJS

1. Créer un compte sur [EmailJS](https://www.emailjs.com)
2. Ajouter un service email (Gmail recommandé)
3. Créer 2 templates :
   - **Email Gate** : Pour la capture d'emails
   - **Quote Request** : Pour les demandes de devis
4. Récupérer les IDs et les ajouter dans `.env.local`

### Configuration Stripe

1. Créer un compte sur [Stripe](https://stripe.com)
2. Récupérer les clés API depuis le Dashboard
3. Pour les tests, utiliser les clés de test (pk_test_... et sk_test_...)

## 🚀 Utilisation

### Lancer en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Build de production

```bash
npm run build
npm run start
```

### Accès Admin

1. Aller sur [http://localhost:3000/admin](http://localhost:3000/admin)
2. Entrer le code PIN : `1234` (configurable dans `.env.local`)
3. Upload un fichier Excel pour mettre à jour les projets

## 📁 Structure du Projet

```
solovault-mvp/
├── app/                    # Pages et routes Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── admin/             # Dashboard admin
│   ├── success/           # Page de succès après paiement
│   └── api/               # API Routes
├── components/            # Composants React
│   ├── EmailGate.tsx     # Modal de capture d'email
│   ├── FilterBar.tsx     # Barre de filtres
│   ├── ProjectCard.tsx   # Carte de projet
│   └── ProjectModal.tsx  # Modal détails projet
├── lib/                   # Utilitaires et types
│   ├── types.ts          # Types TypeScript
│   ├── filters.ts        # Logique de filtrage
│   └── constants.ts      # Constantes
├── data/                  # Données JSON
│   └── projects.json     # Base de données projets
└── public/                # Assets publics
```

## 📡 API Documentation

### POST `/api/create-checkout`
Crée une session de paiement Stripe

**Body** :
```json
{
  "email": "user@example.com"
}
```

### POST `/api/quote-request`
Envoie une demande de devis

**Body** :
```json
{
  "email": "user@example.com",
  "projectReference": "Nom du projet",
  "message": "Description du projet"
}
```

### POST `/api/admin/update-projects`
Met à jour la base de données (Admin uniquement)

**Body** :
```json
{
  "projects": [...]
}
```

## 🌐 Déploiement

### Déployer sur Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MattJeff/SoloVault)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

N'oubliez pas d'ajouter les variables d'environnement dans le dashboard Vercel.

## 🎯 Objectifs MVP

- ✅ Capturer 100 emails
- ✅ Générer 5 ventes (95€)
- ✅ Obtenir 3 demandes de devis qualifiées

## 📧 Contact

**Admin** : mhiguinen235@gmail.com  
**GitHub** : [MattJeff/SoloVault](https://github.com/MattJeff/SoloVault)

## 📝 License

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- Next.js team pour le framework
- Vercel pour l'hébergement
- Tous les solopreneurs dont les projets sont présentés

---

Fait avec ❤️ par [Mathis Higuinen](https://github.com/MattJeff)
