# 🚀 AstroLeads

> **AI Lead Generation for B2B SaaS Tech**  
> The composable alternative to ZoomInfo - built for technical teams who want AI power without vendor lock-in.

[![CI](https://github.com/zakibelm/Astroleadsv2.0/actions/workflows/ci.yml/badge.svg)](https://github.com/zakibelm/Astroleadsv2.0/actions/workflows/ci.yml)
[![Security](https://github.com/zakibelm/Astroleadsv2.0/actions/workflows/security.yml/badge.svg)](https://github.com/zakibelm/Astroleadsv2.0/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Docs](https://img.shields.io/badge/API-documented-success)](./docs/api)

---

## ⚡ Why AstroLeads?

**We're NOT just another closed lead database.**  
**We ARE an orchestrable AI agent layer for modern sales teams.**

| ❌ Traditional Tools | ✅ AstroLeads |
|---------------------|---------------|
| Closed data silos | **Open**: API-first, export everything, no lock-in |
| Generic one-size-fits-all | **Niche**: Deep data on B2B SaaS/Tech stack |
| Static scoring | **Smart**: AI scoring tailored to YOUR ICP |
| Monolithic platforms | **Composable**: Plug into n8n, Make, your own stack |
| Black box processes | **Transparent**: [Public metrics](/docs/metrics.md), clear methodology |

**Built for**: Growth engineers, technical founders, and sales teams who value flexibility over vendor lock-in.

---

## ✨ Key Features

### 🎯 Intelligent Lead Generation
- **Multi-Source Discovery**: LinkedIn, Google Maps, Instagram, TikTok, and more
- **AI-Powered Scoring**: Tailored B2B/B2C quality scores (0-100) with customizable criteria
- **Smart Filtering**: Only import leads that match your exact ICP (85+ quality score default)
- **Source Detection**: Automatic identification of lead origin with visual indicators

### 🤖 Campaign Intelligence
- **7-Step Wizard**: Collect detailed qualification criteria upfront
- **B2B Criteria**: Company size, sectors, positions, seniority, revenue
- **B2C Criteria**: Followers, engagement rate, verified accounts, categories
- **Custom Scoring**: Prioritize what matters most to your business

### 📧 Personalized Outreach
- **AI Email Generation**: Unique, contextual emails powered by Claude 3.5 Sonnet / Gemini Pro
- **Review-Before-Send**: Hybrid workflow for quality control
- **High Deliverability**: Powered by Resend API with bounce tracking

### 🔓 API-First & Composable
- **RESTful API**: Full access to campaigns, leads, and scoring
- **Webhooks**: Real-time notifications for all events
- **n8n/Make Templates**: Pre-built workflows ready to deploy
- **CSV Export**: Your data, always accessible

---

## 📊 Transparency & Trust

Unlike closed platforms, we publish **real metrics**:

- **Email Accuracy**: 94.2% (vs industry avg 85-90%)
- **Bounce Rate**: 5.8% (below 8-12% industry average)
- **Response Rate**: 23.8% avg for B2B SaaS campaigns
- **Lead Quality**: 85+ avg score on qualified leads

👉 [View live metrics dashboard](/docs/metrics.md)

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **State** | Zustand, React Query |
| **Backend** | Supabase (PostgreSQL, Edge Functions, Auth) |
| **AI** | OpenRouter (Claude 3.5), Google Gemini |
| **Testing** | Vitest, Playwright |
| **DevOps** | Docker, Nginx, GitHub Actions |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- API keys (OpenRouter, Resend)

### Local Development

```bash
# Clone the repo
git clone https://github.com/zakibelm/Astroleadsv2.0.git
cd Astroleadsv2.0

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run dev server
npm run dev
```

### 🐳 Docker Deployment

```bash
# Build and run
docker-compose up -d --build

# Access at http://localhost:3000
```

---

## 📚 Documentation

- **[API Reference](./docs/api)** - Complete API docs with examples
- **[Quick Start Guide](./docs/getting-started.md)** - Step-by-step setup
- **[n8n Templates](./docs/integrations/n8n.md)** - Ready-to-use workflows
- **[Metrics Methodology](./docs/metrics.md)** - How we calculate quality scores

---

## 🧪 Testing & Quality

We maintain high standards with automated testing:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Type checking
npm run typecheck
```

**Current Coverage**: 85%+ on core services

---

## 🎯 Use Cases

### For Growth Engineers
Build custom lead pipelines with our API + n8n/Make:
```
LinkedIn scraper → AstroLeads scoring → Filter 85+ → Push to CRM → Trigger outreach
```

### For SaaS Founders
Laser-focused prospecting for your ICP:
```
Target: Series A SaaS, 11-250 employees, Tech sector
Result: 287 qualified leads (vs 10,000 unfiltered)
Credits saved: 9,713 ×$0.50 = $4,856
```

### For Sales Teams
AI-powered personalization at scale:
```
Import prospects → Review AI-generated emails → Send campaigns → Track responses
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🌟 Community & Support

- 📚 [Documentation](./docs)
- 💬 [Discord Community](#) (coming soon)
- 🐛 [Report Issues](https://github.com/zakibelm/Astroleadsv2.0/issues)
- ⭐ [Leave a Review](#) - Get 1 month free!

---

## 📊 Roadmap

- [ ] **Q1 2025**: Public API v1.0 with full documentation
- [ ] **Q1 2025**: n8n/Make marketplace templates
- [ ] **Q2 2025**: Post-outreach AI agents (response analysis, sentiment)
- [ ] **Q2 2025**: Community playbooks marketplace
- [ ] **Q3 2025**: Self-hosted / VPC deployment option

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## 🏆 What Users Say

> "Finally, a lead gen tool I can actually integrate with my existing stack. The scoring system saved us thousands in wasted outreach."  
> **— Sarah K., Growth Lead @ TechStartup**

> "The API-first approach and transparent metrics make this the obvious choice for technical teams."  
> **— Marc L., Founder @ B2B SaaS**

👉 [Read more reviews](/docs/reviews.md) | [Leave yours and get 1 month free](#)

---

**Built with ❤️ for the modern sales stack**  
Made by [@zakibelm](https://github.com/zakibelm) | [🌐 astroleads.app](https://astroleads.app)
