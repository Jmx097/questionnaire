# AI Onboarding Questionnaire

A premium, cinematic onboarding questionnaire built with Next.js 13, featuring intelligent scoring and email capture.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create environment variables
cp env.template .env.local
# Then edit .env.local with your actual values

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_EMAIL_WEBHOOK=https://hook.us1.make.com/your-webhook-id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_APP_URL` to your deployed domain.

## 📦 Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_EMAIL_WEBHOOK
# - NEXT_PUBLIC_APP_URL
```

### Option 2: Vercel Dashboard

1. **Import Repository**

   - Go to https://vercel.com/new
   - Import your Git repository
   - Framework Preset: Next.js

2. **Configure Environment Variables**

   - Add `NEXT_PUBLIC_EMAIL_WEBHOOK`: `https://hook.us1.make.com/your-webhook-id`
   - Add `NEXT_PUBLIC_APP_URL`: `https://your-domain.vercel.app`

3. **Deploy**

   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

4. **Update Environment Variable**
   - After first deploy, update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
   - Redeploy

## 🏗️ Project Structure

```
web/
├── app/
│   ├── page.tsx              # Intro animation
│   ├── layout.tsx            # Root layout
│   ├── start/                # Portal selector
│   └── quiz/
│       ├── layout.tsx        # Progress indicator
│       ├── 1/                # Business type
│       ├── 2/                # Team size
│       ├── 3/                # AI sentiment
│       ├── 3.5/              # Tools (NEW)
│       ├── 4/                # Pain points
│       ├── 5/                # Value + Urgency
│       └── result/           # Results + Email capture
├── components/
│   ├── backgrounds/          # GlobalLightRays
│   ├── bento/                # MagicBento
│   ├── cursor/               # TargetCursor
│   ├── experiences/          # IntroSequence
│   ├── questions/            # Question components
│   ├── results/              # ResultsBento
│   ├── reveal/               # Scroll animations
│   ├── text/                 # SplitTextHey
│   └── ui/                   # ProgressIndicator
├── config/
│   ├── questions.ts          # Segment-specific questions
│   └── scoring.ts            # Scoring algorithm
└── lib/
    ├── store.ts              # Zustand state management
    ├── format.ts             # Formatters
    ├── ids.ts                # ID generation
    ├── urls.ts               # URL builders
    └── utils.ts              # Utilities
```

## ✨ Features

- **6-Step Quiz Flow**: Collects business info, team size, AI sentiment, tools, pain points, value/urgency
- **Intelligent Scoring**: 5-factor algorithm with tiered offers
- **Email Capture**: Integrated with Make.com webhook
- **Progress Indicator**: Visual feedback on completion
- **State Persistence**: Answers saved to localStorage
- **Premium UX**: Cinematic animations, custom cursor, light rays
- **Responsive**: Works on all devices

## 🎯 Scoring Algorithm

### Factors (12 points possible)

- **Identity Maturity** (0-2): Team size
- **Integration Score** (1-3): Tools count or AI usage
- **Pain Intensity** (2): Fixed
- **Budget Score** (0-3): Monthly value estimate
- **Urgency Score** (0-2): Timeline to action

### Tiers

- **0-4 points**: Low → "Plinko Pocket"
- **5-7 points**: Mid → "Playbook Pro"
- **8-12 points**: High → "Playbook Plus"

## 🔧 Customization

### Update Questions

Edit `config/questions.ts` to modify segment-specific pain points.

### Modify Scoring

Edit `config/scoring.ts` to adjust the scoring algorithm.

### Change Skool Link

Edit `lib/urls.ts` → `buildSkoolLink()` function.

### Update Styling

All styles use Tailwind CSS classes. Main theme:

- Background: `bg-black`
- Text: `text-white`, `text-white/70`
- Accents: `bg-white/5`, `bg-white/10`
- CTA: `bg-white text-black`

## 📊 Make.com Webhook Integration

The email capture sends data to your Make.com webhook with these parameters:

```
?lead={leadId}
&segment={segment}
&pain={pain}
&tier={tier}
&offer={offer}
&email={email}
```

Set up your Make.com scenario to:

1. Receive webhook data
2. Store lead info (Airtable/Google Sheets/CRM)
3. Send email with personalized plan
4. Trigger follow-up sequences

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start
```

## 📝 License

Private project - All rights reserved

## 🙋 Support

For issues or questions, contact the development team.

---

**Built with Next.js 13, TypeScript, Tailwind CSS, Zustand, and GSAP**
