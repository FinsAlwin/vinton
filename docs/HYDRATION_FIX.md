# Hydration Mismatch Fix

## Problem

React hydration error in the ThemeProvider component:

```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

The issue was specifically with the Switch component in the sidebar showing different states between server and client render.

## Root Cause

The `ThemeProvider` was reading from `localStorage` during the initial render:

```tsx
const [theme, setTheme] = React.useState<Theme>(
  () =>
    (typeof window !== "undefined" &&
      (localStorage.getItem(storageKey) as Theme)) ||
    defaultTheme
);
```

### Why This Caused a Problem:

1. **Server-Side Render (SSR)**:

   - Server doesn't have access to `localStorage`
   - Always renders with `defaultTheme` ("light")
   - Switch is rendered as "unchecked" (light mode)

2. **Client-Side Hydration**:

   - Browser has access to `localStorage`
   - Might have "dark" theme saved
   - Switch tries to hydrate as "checked" (dark mode)

3. **Mismatch**:
   - Server HTML has `data-state="unchecked"`
   - Client expects `data-state="checked"`
   - React throws hydration error ❌

## Solution

Use a **two-step hydration pattern**:

```tsx
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vinton-admin-theme",
  ...props
}: ThemeProviderProps) {
  // Step 1: Always start with defaultTheme (matches server)
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  // Step 2: After mount, read from localStorage
  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored) {
      setTheme(stored);
    }
  }, [storageKey]);

  // Step 3: Only apply theme after mounting
  React.useEffect(() => {
    if (!mounted) return;
    // ... apply theme
  }, [theme, mounted]);
}
```

## How It Works Now

### Initial Render (Server + First Client Render)

```
1. Server renders with defaultTheme="light"
2. Client hydrates with same defaultTheme="light"
3. ✅ No mismatch - both render the same!
```

### After Hydration (Client Only)

```
4. mounted becomes true
5. Read from localStorage
6. Update theme to user's saved preference
7. Apply theme classes
8. ✅ Smooth transition to saved theme
```

## Key Principles

1. **Always match server render on first client render**
   - Don't read browser-only APIs (localStorage, cookies) during initial state
2. **Use useEffect for browser APIs**
   - Effects only run on the client after hydration
3. **Track mounted state**
   - Prevents applying client-only logic during SSR/hydration

## Benefits

✅ No more hydration warnings  
✅ Theme still persists across sessions  
✅ Smooth user experience  
✅ SEO-friendly (no client-side flashing)

## Alternative Solutions

If you see this pattern elsewhere in the codebase, use the same approach:

```tsx
// ❌ Bad - causes hydration mismatch
const [value, setValue] = useState(() =>
  typeof window !== "undefined" ? localStorage.getItem("key") : null
);

// ✅ Good - matches server render
const [value, setValue] = useState(null);
useEffect(() => {
  setValue(localStorage.getItem("key"));
}, []);
```

## References

- [React Hydration Docs](https://react.dev/link/hydration-mismatch)
- [Next.js SSR Patterns](https://nextjs.org/docs/messages/react-hydration-error)
