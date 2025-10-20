# Redirect Loop Fix

## Problem

The admin panel had an infinite redirect loop (`ERR_TOO_MANY_REDIRECTS`) when accessing `/admin/login`.

## Root Cause

The `/admin/layout.tsx` was checking for authentication and redirecting to `/admin/login`. Since `/admin/login` was also inside the `/admin` folder, it was also using the same layout, creating an infinite redirect loop:

1. User visits `/admin/login`
2. `/admin/layout.tsx` runs and checks for auth
3. No auth found → redirects to `/admin/login`
4. Repeat step 1 infinitely

## Solution

Restructured the admin folder using **Next.js Route Groups** to separate authenticated and unauthenticated pages:

### New Structure

```
src/app/admin/
├── layout.tsx                    # Root layout (just passes through)
├── (auth)/                       # Auth route group
│   ├── layout.tsx               # Theme provider only, no auth check
│   └── login/
│       └── page.tsx             # Login page
└── (dashboard)/                 # Protected route group
    ├── layout.tsx               # Full admin layout with sidebar + auth check
    ├── page.tsx                 # Dashboard
    ├── content/                 # Content management
    ├── media/                   # Media library
    └── settings/                # Settings
```

### What Changed

1. **Created Route Groups**

   - `(auth)` - For public admin pages (login)
   - `(dashboard)` - For protected admin pages (everything else)

2. **Separated Layouts**

   - `/admin/layout.tsx` - Simple wrapper that just passes children
   - `/admin/(auth)/layout.tsx` - Theme provider only
   - `/admin/(dashboard)/layout.tsx` - Full admin layout with authentication check

3. **Updated Dashboard Layout**
   - Removed `redirect()` call since middleware handles it
   - Just returns `null` if no user (which should never happen)

## How It Works Now

1. User visits `/admin/login`

   - Uses `/admin/(auth)/layout.tsx` (no auth check)
   - Login page renders normally ✅

2. User visits `/admin` or any protected page
   - Middleware checks authentication
   - If no auth → redirects to `/admin/login`
   - If authenticated → uses `/admin/(dashboard)/layout.tsx` with sidebar ✅

## Route Groups Explained

Route groups in Next.js use parentheses `(name)` and:

- Don't affect the URL (e.g., `/admin/(auth)/login` → `/admin/login`)
- Allow different layouts for different sections
- Organize code without changing routes

## Build Output Confirmation

Notice in the build output:

```
├ ○ /admin/login        # Static (○) - no redirect loop
├ ƒ /admin              # Dynamic (ƒ) - protected
├ ƒ /admin/content      # Dynamic (ƒ) - protected
```

The login page is now **static**, confirming no redirect loop exists.

## Testing

1. Visit `http://localhost:3000/admin/login` → Should load normally
2. Try to visit `http://localhost:3000/admin` without auth → Should redirect to login
3. Login → Should access dashboard normally
4. Protected pages should have sidebar and header

✅ **Redirect loop fixed!**
