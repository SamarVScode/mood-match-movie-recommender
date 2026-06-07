# Vercel Deployment Issue Findings

## Symptoms
When the application is deployed to Vercel, it initially shows a blink of content and then breaks, rendering a blank screen or an error state. This occurs even though `VITE_TMDB_API_KEY` has been correctly configured in the Vercel Environment Variables settings.

## Root Cause
The root cause lies in how Vite handles environment variables during the build process, specifically in `src/App.tsx`.

In the code:
```tsx
const getSavedApiKey = (): string => {
  // ...
  return ((import.meta as any).env.VITE_TMDB_API_KEY || "").trim();
};
```

Vite statically replaces environment variables at build time using exact string matching. It looks specifically for the exact string `import.meta.env.VITE_TMDB_API_KEY`.

Because of the TypeScript cast `(import.meta as any).env`, Vite's regex matcher completely fails to recognize this as an environment variable usage. Consequently, Vite does **not** replace it with the actual key from Vercel's environment during the build step.

At runtime in the browser, `import.meta.env` does not contain `VITE_TMDB_API_KEY` (since it wasn't injected during build), causing it to resolve to `undefined` or an empty string. This causes the API to fail authentication, throwing errors that ultimately crash the React application after its initial blink.

## Solution
To fix this, we need to remove the inline type casting that breaks Vite's static analyzer and instead use the exact string Vite expects.

Change `src/App.tsx`:
```tsx
// Before
return ((import.meta as any).env.VITE_TMDB_API_KEY || "").trim();

// After
return (import.meta.env.VITE_TMDB_API_KEY || "").trim();
```

If TypeScript complains about `import.meta.env` not existing, we should add a `vite-env.d.ts` declaration file or configure `tsconfig.json` so TypeScript natively understands `import.meta.env` types without needing inline `as any` casting.
