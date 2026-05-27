# Landing Page CV — Carlos Alberto Figueroa Martínez

Premium executive personal landing page built with Angular 21+, featuring glassmorphism design, GSAP animations, and a serverless contact form backed by Neon PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21+ (standalone components, signals, SSR) |
| Styling | SCSS design tokens + TailwindCSS |
| Animations | GSAP + Intersection Observer |
| Icons | Lucide Angular |
| Fonts | Google Fonts (Inter + Bricolage Grotesque) |
| Backend | Vercel Serverless Functions (@vercel/node) |
| Database | Neon PostgreSQL (serverless) |
| Deployment | Vercel |

## Local Development

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Start development server
ng serve
```

The app will be available at `http://localhost:4200`.

### Build

```bash
# Production build with SSR
ng build

# Serve SSR locally
npm run serve:ssr:landing-page-cv
```

## Deployment to Vercel

### 1. Connect Repository

1. Go to [vercel.com](https://vercel.com) and create a new project.
2. Import your GitHub/GitLab repository.
3. Vercel will auto-detect the Angular framework from `vercel.json`.

### 2. Configure Environment Variables

In the Vercel project dashboard, go to **Settings → Environment Variables** and add:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require` |

### 3. Deploy

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from CLI
vercel

# Deploy to production
vercel --prod
```

Or simply push to your main branch — Vercel will auto-deploy.

## Neon Database Setup

### 1. Create a Neon Project

1. Sign up at [neon.tech](https://neon.tech).
2. Create a new project (free tier available).
3. Copy the connection string from the dashboard.

### 2. Run the Schema

Execute the SQL schema in the Neon SQL Editor or via `psql`:

```bash
psql "postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require" -f neon-schema.sql
```

### 3. Schema Reference

The `leads` table stores contact form submissions:

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  empresa VARCHAR(100),
  email VARCHAR(150) NOT NULL,
  motivo VARCHAR(50) NOT NULL CHECK (motivo IN ('Consultoría', 'Colaboración', 'Docencia', 'Otro')),
  mensaje TEXT NOT NULL CHECK (char_length(mensaje) <= 1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash VARCHAR(64) NOT NULL
);

CREATE INDEX idx_leads_ip_hash_created ON leads (ip_hash, created_at DESC);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);
```

**Rate limiting**: The API enforces a maximum of 3 submissions per IP address per rolling hour, tracked via `ip_hash` and `created_at`.

## Project Structure

```
src/
├── app/
│   ├── components/       # Standalone section components
│   ├── directives/       # Typewriter, CountUp, IntersectionObserver
│   ├── services/         # Animation, Scroll, Contact, Theme
│   └── models/           # TypeScript interfaces
├── styles/               # SCSS tokens, mixins, global styles
└── assets/               # Images, documents (CV PDF)
api/
├── contact.ts            # Serverless contact form handler
└── _utils/               # Validation, rate-limiter, DB utilities
vercel.json               # Vercel deployment configuration
neon-schema.sql           # Database schema
```

## License

All rights reserved © 2025 Carlos Alberto Figueroa Martínez.
