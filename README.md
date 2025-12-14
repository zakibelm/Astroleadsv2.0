# AstroLeads

> 🚀 Plateforme d'automatisation de prospection B2B propulsée par l'IA

![AstroLeads](https://img.shields.io/badge/version-1.0.0-gold)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)

## ✨ Fonctionnalités

- **🎯 Génération de Leads** - Recherche multi-sources (Google Maps, LinkedIn, Instagram, Facebook)
- **📧 Campagnes Email IA** - Génération automatique de cold emails avec Gemini
- **🤖 Équipe d'Agents IA** - Agents autonomes pour la prospection
- **📊 Analytics** - Tableaux de bord et métriques en temps réel
- **🎨 Interface Premium** - Design "Gold Neon Glass" moderne
- **🔐 Authentification** - Système de connexion avec routes protégées
- **💾 Persistence** - Stockage local + Supabase (optionnel)

## 🛠 Technologies

| Frontend | State | Testing | Styling | Backend |
|----------|-------|---------|---------|---------|
| React 18 | Zustand | Vitest | Tailwind CSS | Supabase |
| TypeScript | React Query | Playwright | PostCSS | Gemini AI |
| Vite | - | Testing Library | - | - |

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/zakibelm/AstroLeads.git
cd AstroLeads

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Configurer les variables d'environnement
# Éditer .env.local avec vos clés API
```

## ⚙️ Configuration

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Gemini AI (requis pour les fonctions IA)
GEMINI_API_KEY=votre_cle_gemini

# Supabase (optionnel - pour la persistence)
VITE_SUPABASE_URL=https://ueoexgznqqynujndvcve.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_supabase
```

## 🚀 Démarrage

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec UI
npm run test:ui

# Coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── ui/          # Composants réutilisables (Button, Card, Modal, etc.)
│   ├── layout/      # Layout (Sidebar, Header)
│   ├── auth/        # Composants d'authentification
│   └── features/    # Composants métier
├── views/           # Pages de l'application
├── stores/          # State management (Zustand)
├── hooks/           # Custom React hooks
├── services/        # Services API (Gemini, Supabase)
├── utils/           # Utilitaires (formatters, validators)
├── types/           # Types TypeScript
├── lib/             # Constantes et configurations
└── tests/           # Configuration des tests
```

## 🔒 Authentification

Comptes de démonstration :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@astroleads.com | demo | Admin |
| demo@astroleads.com | demo | User |

## 🎨 Design System

Le projet utilise un thème **Gold Neon Glass** avec :

- **Couleurs** : `astro-gold` (#FFD700), `astro-900` (#0a0a0a)
- **Typographie** : Inter (Google Fonts)
- **Effets** : Glassmorphism, Neon glow, Animations fluides

### Composants UI

```tsx
import { Button, Card, Input, Modal, Badge, Toast } from '@/components/ui';

// Button variants
<Button variant="primary">Action</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="danger">Supprimer</Button>

// Cards
<Card variant="default" padding="md">Contenu</Card>
<Card variant="featured">Premium</Card>

// Toast notifications
const toast = useToast();
toast.success('Opération réussie!');
toast.error('Erreur', 'Description de l\'erreur');
```

## 📝 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run preview` | Preview du build |
| `npm run lint` | Linting ESLint |
| `npm run format` | Formatage Prettier |
| `npm run typecheck` | Vérification TypeScript |
| `npm run test` | Tests unitaires |
| `npm run test:coverage` | Couverture de tests |

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -am 'Ajout de ma feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Créer une Pull Request

## 📄 License

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

---

Développé avec ❤️ par [@zakibelm](https://github.com/zakibelm)
