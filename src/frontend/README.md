This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


```
├── app // Each page in app is in a folder (App router in NextJS), file page.tsx is the entry point of each page, only import components from corresponding feature. App is root url (/) of website, auth is /auth, products is /products, etc. Inside each page folder, layout.tsx is the layout of the page and (children pages inside this folder), page.tsx is the content of the page
│   ├── admin
│   ├── products
│   ├── sign-in
│   ├── layout.tsx
│   ├── page.tsx
│   └── global.css // global styles, define reusable styles
|
├── components // Shared components
│   ├── ui // element ui components (button, input, etc)
│   ├── search-bar // shared components
│   └── ... // shared components
├── context // shared context (React context)
├── features  // Each feature is a separate module, representing for 1 page in app 
│   ├── product // each feature has its own folder, containing components, hooks, services types,
│   │   ├── components // Only render UI
│   │   ├── hooks // manage state, side effects, etc
│   │   ├── services // manage api calls
│   │   └── types // Types, interfaces, etc
│   └── ...
├── hooks // Shared hooks
└── lib // Shared utils, custom api client, etc
```