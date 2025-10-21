# Shadow Implementation Guide - TailAdmin Style

## ✅ Shadows Applied Throughout Admin Panel

Shadows have been strategically applied to match the TailAdmin design, providing depth and visual hierarchy.

---

## 📍 Where Shadows Are Applied

### 1. **Stats Cards** ✅

**Location**: Dashboard statistics cards

**File**: `src/components/admin/ui/stats-card.tsx`

**Shadow Applied**:

```tsx
<div className="admin-card admin-card-hover p-6 admin-transition shadow-sm">
```

**Effect**:

- **Dark Mode**: Subtle shadow `0 1px 3px 0 rgb(0 0 0 / 0.2)`
- **Light Mode**: Soft shadow `0 1px 3px 0 rgb(0 0 0 / 0.1)`
- **On Hover**: Elevated shadow (lifts up)

**Result**: Cards appear to float slightly above the background

---

### 2. **All Cards (Default)** ✅

**Location**: Any component using `.admin-card` class

**File**: `src/app/admin/admin.css`

**Shadows**:

#### Dark Mode:

```css
.admin-card {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.2);
}
```

#### Light Mode:

```css
[data-theme="light"] .admin-card {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}
```

**Applied To**:

- Content cards
- Media cards
- Settings cards
- Filter cards
- Form cards
- Recent logs widget

---

### 3. **Card Hover Effect** ✅

**Location**: Cards with `hover="lift"` or `.admin-card-hover`

**Shadows on Hover**:

#### Dark Mode:

```css
.admin-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgb(0 0 0 / 0.3), 0 4px 8px -4px rgb(0 0 0 / 0.2);
}
```

#### Light Mode:

```css
[data-theme="light"] .admin-card-hover:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

**Effect**: Card lifts up with enhanced shadow on hover

---

### 4. **Header** ✅

**Location**: Top navigation bar

**File**: `src/components/admin/layout/header.tsx`

**Shadow Applied**:

```tsx
<header className="...shadow-md">
```

**Effect**: `shadow-md` = `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`

**Result**: Header appears elevated above content area

---

### 5. **Sidebar (Light Mode)** ✅

**Location**: Left navigation sidebar

**File**: `src/app/admin/admin.css`

**Shadow Applied**:

```css
[data-theme="light"] .admin-sidebar-bg {
  background-color: #ffffff;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
}
```

**Effect**: Subtle right-side shadow separating sidebar from content

**Note**: Dark mode sidebar has no shadow (blends with background)

---

### 6. **Login Card** ✅

**Location**: Login page card

**File**: `src/app/admin/(auth)/login/page.tsx`

**Shadow Applied**:

```tsx
<Card className="admin-card shadow-2xl">
```

**Effect**: `shadow-2xl` = Large prominent shadow for emphasis

**Result**: Login card stands out prominently on the page

---

### 7. **Mobile Menu Button** ✅

**Location**: Hamburger menu button on mobile

**File**: `src/components/admin/layout/sidebar.tsx`

**Shadow Applied**:

```tsx
<button className="...shadow-lg">
```

**Effect**: Button floats above content

---

### 8. **Modals/Dialogs** ✅

**Location**: Popup dialogs and modals

**Shadow**: Built into dialog component

**Effect**: Modals appear to float over backdrop

---

## 🎨 Shadow Levels (TailAdmin Style)

### Tailwind Shadow Classes

**shadow-sm** - Subtle shadow for cards:

```css
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
```

**Used on**: Stats cards, default cards

**shadow-md** - Medium shadow for headers:

```css
box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
```

**Used on**: Header bar

**shadow-lg** - Large shadow for floating elements:

```css
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

**Used on**: Mobile menu button, elevated cards

**shadow-xl** - Extra large for modals:

```css
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

**Used on**: Dialogs, important modals

**shadow-2xl** - Emphasis shadows:

```css
box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

**Used on**: Login card

---

## 📋 Custom Admin Shadows

### Dark Mode Shadows

More pronounced for visibility on dark backgrounds:

```css
/* Default card */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.2);

/* Hover card */
box-shadow: 0 10px 20px -5px rgb(0 0 0 / 0.3), 0 4px 8px -4px rgb(0 0 0 / 0.2);
```

### Light Mode Shadows

Softer for cleaner look on light backgrounds:

```css
/* Default card */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Hover card */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

---

## 🎯 Visual Hierarchy

### Shadow Depth Order (Bottom to Top):

1. **No Shadow**: Background, body
2. **Subtle (shadow-sm)**: Default cards, content cards
3. **Medium (shadow-md)**: Header, important sections
4. **Large (shadow-lg)**: Floating buttons, dropdowns
5. **Extra Large (shadow-xl)**: Modals, overlays
6. **Emphasis (shadow-2xl)**: Login, critical dialogs

---

## 💡 How to Add Shadows

### Method 1: Using Tailwind Classes

Add directly to component className:

```tsx
// Stats card
<Card className="shadow-sm">

// Header
<header className="shadow-md">

// Modal
<Dialog className="shadow-xl">
```

### Method 2: Using Admin Card Classes

Use built-in admin classes:

```tsx
// Default card (has shadow)
<div className="admin-card">

// Card with hover effect (shadow enhances on hover)
<div className="admin-card admin-card-hover">

// Elevated card
<div className="admin-card admin-card-elevated">
```

### Method 3: Using Card Component Variants

```tsx
// Default variant (has shadow)
<Card>

// With hover lift
<Card hover="lift">

// Elevated variant
<Card variant="elevated">
```

---

## 📱 Responsive Shadow Behavior

### Mobile

- Shadows remain consistent
- Helps with touch feedback
- Clear separation of elements

### Desktop

- Shadows provide depth
- Enhance hover states
- Visual hierarchy maintained

---

## 🎨 TailAdmin Shadow Pattern

Based on [TailAdmin demo](https://nextjs-demo.tailadmin.com/):

### Dashboard Cards

- **Default**: Subtle shadow
- **Hover**: Lifts with enhanced shadow
- **Active**: Maintains hover shadow

### Header

- **Always**: Medium shadow for separation
- **Sticky**: Shadow persists when scrolling

### Sidebar

- **Dark Mode**: No shadow (blends)
- **Light Mode**: Right-side shadow (separation)

### Content Cards

- **Default**: Subtle shadow
- **Interactive**: Hover shadow
- **Forms**: No additional shadow (uses card shadow)

---

## 🔧 Shadow Customization

### Adjusting Shadow Intensity

**Make Darker** (increase opacity):

```css
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3); /* 0.3 instead of 0.2 */
```

**Make Lighter** (decrease opacity):

```css
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); /* 0.1 instead of 0.2 */
```

**Make Larger** (increase blur and spread):

```css
box-shadow: 0 2px 6px 0 rgb(0 0 0 / 0.2); /* 2px offset, 6px blur */
```

---

## ✅ Where Shadows Are Now Applied

### Dashboard Page (`/admin`)

- [x] Stats cards (all 4) - `shadow-sm` + hover effect
- [x] Recent logs widget - `admin-card` with shadow
- [x] Header bar - `shadow-md`

### Content Pages (`/admin/content/*`)

- [x] Content type selection cards - `hover="lift"` with shadow
- [x] Content list card - `admin-card` with shadow
- [x] Filter cards - `admin-card` with shadow

### Media Page (`/admin/media`)

- [x] Search/filter card - `admin-card` with shadow
- [x] Media grid items - `hover="lift"` with shadow
- [x] Media list card - `admin-card` with shadow

### Settings Page (`/admin/settings`)

- [x] Tab navigation card - `admin-card` with shadow
- [x] Settings form card - `hover="lift"` with shadow

### Logs Page (`/admin/logs`)

- [x] Filter card - `admin-card` with shadow
- [x] Logs table card - `hover="lift"` with shadow

### Layout

- [x] Header - `shadow-md`
- [x] Sidebar (light mode only) - Right shadow
- [x] Mobile menu button - `shadow-lg`

### Auth Pages

- [x] Login card - `shadow-2xl`

---

## 🎊 Final Shadow Configuration

### Summary of Shadow Applications:

| Element           | Shadow Class | When Applied    | Effect                     |
| ----------------- | ------------ | --------------- | -------------------------- |
| **Stats Cards**   | `shadow-sm`  | Always          | Subtle elevation           |
| **Content Cards** | `admin-card` | Always          | Default shadow             |
| **Hover Cards**   | Enhanced     | On hover        | Lifts with stronger shadow |
| **Header**        | `shadow-md`  | Always          | Separates from content     |
| **Sidebar**       | Custom       | Light mode only | Right-side shadow          |
| **Login Card**    | `shadow-2xl` | Always          | Prominent emphasis         |
| **Mobile Button** | `shadow-lg`  | Always          | Floats above content       |
| **Modals**        | Built-in     | When open       | Strong shadow              |

---

## 🚀 Build Status

```
✅ Build: SUCCESSFUL
✅ Shadows applied to all cards
✅ Dark mode: Stronger shadows
✅ Light mode: Softer shadows
✅ Hover effects: Enhanced shadows
✅ Header: Medium shadow
✅ Sidebar: Light mode shadow only
```

---

## 💡 Quick Guide

**Want to add shadow to a card?**

Option 1:

```tsx
<Card className="shadow-sm">
```

Option 2:

```tsx
<Card hover="lift">  {/* Has shadow + hover effect */}
```

Option 3:

```tsx
<div className="admin-card">  {/* Has default shadow */}
```

**Want stronger shadow?**

```tsx
<Card className="shadow-md">  or  shadow-lg  or  shadow-xl
```

**Want shadow on hover only?**

```tsx
<Card className="hover:shadow-lg transition-shadow">
```

---

## 🎨 Visual Result

### Before

- Flat appearance
- Less depth
- Generic shadows

### After (TailAdmin Style)

- ✅ Cards have subtle default shadows
- ✅ Hover increases shadow (lift effect)
- ✅ Header has medium shadow
- ✅ Sidebar has shadow in light mode
- ✅ Login card has prominent shadow
- ✅ Different shadow intensities for dark/light modes
- ✅ Professional depth and hierarchy

---

**Status**: ✅ **SHADOWS APPLIED THROUGHOUT**

All cards and elements now have appropriate shadows matching TailAdmin design!
