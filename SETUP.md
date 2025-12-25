# Setup Instructions

Follow these steps to get the BGN→EUR Shop Calculator running on your machine.

## Prerequisites

Make sure you have the following installed:

- **Node.js** version 18 or higher
- **npm** (comes with Node.js) or **yarn**

Check your versions:
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

## Quick Start

### 1. Navigate to Project Directory

```bash
cd euro-bgn-calculator
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- lucide-react icons
- next-themes
- All required dependencies

### 3. Start Development Server

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

The app will start on [http://localhost:3000](http://localhost:3000)

### 4. Open in Browser

Navigate to `http://localhost:3000` and you should see the calculator!

## Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

Or with yarn:
```bash
yarn build
yarn start
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Next.js will automatically try 3001, 3002, etc.

Or specify a different port:
```bash
npm run dev -- -p 3001
```

### Module Not Found Errors

Make sure you've run `npm install` and all dependencies are installed:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### TypeScript Errors

The project uses strict TypeScript. If you see type errors:
1. Make sure you're using TypeScript 5.x
2. Check that `tsconfig.json` is present
3. Restart your IDE/editor

### Styling Issues

If Tailwind styles aren't loading:
1. Make sure `tailwind.config.ts` is present
2. Check that `globals.css` is imported in `app/layout.tsx`
3. Restart the dev server

## IDE Setup

### VS Code (Recommended)

Install these extensions for the best experience:
- **ESLint** - JavaScript/TypeScript linting
- **Tailwind CSS IntelliSense** - Autocomplete for Tailwind classes
- **Prettier** - Code formatting

### Settings

Add to your `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## File Structure Overview

After installation, your project should look like this:

```
euro-bgn-calculator/
├── node_modules/          # Dependencies (created after npm install)
├── app/                   # Next.js app directory
├── components/            # React components
├── lib/                   # Utility functions and types
├── styles/                # Global CSS
├── public/                # Static assets (create if needed)
├── .next/                 # Next.js build output (created on dev/build)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── next.config.js         # Next.js configuration
└── README.md              # Documentation
```

## First Run Checklist

After starting the dev server, verify:

- ✅ Page loads at `http://localhost:3000`
- ✅ No console errors in browser DevTools
- ✅ Exchange rate shows 1.95583 by default
- ✅ Can add unit items
- ✅ Can add weight items
- ✅ Totals calculate correctly
- ✅ Language toggle works (BG/EN)
- ✅ Theme toggle works (light/dark)
- ✅ Items persist after page refresh

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint

# Clean install
rm -rf node_modules .next
npm install
npm run dev
```

## Environment Variables

This app doesn't require environment variables by default. Everything is client-side.

If you want to add custom configuration:
1. Create `.env.local` in the root directory
2. Add your variables (prefixed with `NEXT_PUBLIC_` for client-side)
3. Access via `process.env.NEXT_PUBLIC_YOUR_VAR`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (automatic configuration for Next.js)

### Other Platforms

The app works on any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Your own server with Node.js

Build command: `npm run build`
Output directory: `.next`
Start command: `npm start`

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review the code comments in each file
- Open an issue on GitHub

---

Happy coding! 🎉

