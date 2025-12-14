
# 🚀 AstroLeads v2.0 - Enterprise Edition

> **Plateforme d'automatisation de prospection B2B propulsée par l'IA**  
> *Génération de leads, Emailing intelligent etCRM intégré.*

[![CI/CD](https://github.com/zakibelm/Astroleadsv2.0/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/zakibelm/Astroleadsv2.0/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Image](https://img.shields.io/badge/docker-ready-blue)](https://github.com/zakibelm/Astroleadsv2.0/pkgs/container/astroleads)
[![Vite](https://img.shields.io/badge/vite-5.0-purple)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-18.2-blue)](https://react.dev/)

---

## ✨ Fonctionnalités Clés

### 🎯 Prospections & Leads
- **Multi-Source** : Recherche intelligente via Google Maps, LinkedIn, et Réseaux sociaux.
- **Enrichissement IA** : Qualification automatique des prospects par Claude 3.5 Sonnet / Gemini Pro.
- **Lead Board** : Tableau de bord interactif pour suivre le statut de chaque prospect (Contacté, Réponse, Converti).

### 📧 Emailing Intelligent
- **Personnalisation Extrême** : Chaque email est unique, généré par l'IA en fonction du contexte du prospect.
- **Mode Hybride** : Workflow "Review-before-send" pour valider chaque message.
- **Délivrabilité Maximale** : Gestion des envois via Resend API (avec Mode Test sécurisé).

### 🛡️ Sécurité & Performance (Enterprise Grade)
- **Architecture Sécurisée** : Headers HTTP stricts (CSP, HSTS), Pas de secrets exposés (tout via env vars).
- **Docker Ready** : Image optimisée multi-stage (< 50MB) avec Nginx hardenisé.
- **Monitoring 360°** :
  - **Sentry** : Tracking d'erreurs temps réel.
  - **Analytics** : PostHog / Mixpanel intégrés.
  - **Perf** : Core Web Vitals monitoring.

---

## 🛠 Stack Technique

| Sayer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **State** | Zustand, React Query |
| **Testing** | Vitest, Playwright, Testing Library |
| **Backend** | Supabase (PostgreSQL, Edge Functions, Auth) |
| **AI Engine** | OpenRouter (Claude 3.5), Google Gemini |
| **DevOps** | Docker, Nginx, GitHub Actions (CI/CD) |

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Docker (optionnel)
- Clés API (OpenRouter, Supabase, Resend)

### Installation Locale

```bash
# 1. Cloner le projet
git clone https://github.com/zakibelm/Astroleadsv2.0.git
cd Astroleadsv2.0

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# -> Éditez .env.local avec vos clés

# 4. Lancer le serveur de dev
npm run dev
```

### 🐳 Déploiement Docker

Le projet inclut une configuration Docker "Production-Ready".

```bash
# Lancer toute la stack (App + Monitoring si activé)
docker-compose up -d --build

# Accéder à l'application
# http://localhost:3000
```

---

## 🧪 Tests & Qualité

Nous maintenons un haut standard de qualité via notre pipeline CI/CD.

```bash
# Tests Unitaires (Vitest)
npm run test

# Coverage
npm run test:coverage

# Tests End-to-End (Playwright)
npm run test:e2e

# Linting & Format
npm run lint
npm run typecheck
```

---

## 📁 Structure du Projet

```
src/
├── components/      # UI Kit (Boutons, Cards, Inputs...)
├── services/        # Logique métier & API (Email, AI, DB)
├── stores/          # Gestion d'état global (Zustand)
├── views/           # Pages de l'application
├── lib/             # Configuration (Axios, Utils, Constants)
├── hooks/           # Custom React Hooks
└── tests/           # Configuration des tests
```

---

## 🤝 Contribuer

Les Pull Requests sont les bienvenues !
1.  Forkez le projet
2.  Créez votre branche (`git checkout -b feature/AmazingFeature`)
3.  Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4.  Poussez (`git push origin feature/AmazingFeature`)
5.  Ouvrez une Pull Request

---

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

**Développé avec ❤️ par @zakibelm**
