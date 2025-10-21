# Vinton CMS - Public API Documentation

## Overview

This document describes all public APIs available for frontend consumption. These APIs **do not require authentication** and return only published content.

**Base URL**: `http://localhost:3000` (development) or your production URL

## Authentication

❌ **No authentication required** for public APIs  
✅ All admin APIs require JWT authentication

---

## Content APIs

### 1. Get Content by Type

Retrieve a list of content items of a specific type.

**Endpoint**: `GET /api/public/content/{type}`

**Supported Types**:

- `homepage` - Homepage sections and content
- `portfolio` - Portfolio items
- `services` - Service offerings
- `team` - Team members
- `projects` - Projects
- `clients` - Client companies
- `testimonials` - Client testimonials
- `blogs` - Blog posts

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 20 | Items per page (max 100) |
| `search` | string | - | Search in title and description |
| `category` | string | - | Filter by category (for portfolio) |
| `featured` | boolean | - | Get only featured items (services, testimonials) |
| `sortBy` | string | `createdAt` | Field to sort by |
| `sortOrder` | string | `desc` | Sort order (`asc` or `desc`) |

**Example Request**:

```bash
GET /api/public/content/portfolio?category=Facade%20%26%20Cladding&limit=10&page=1
```

**Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "contentType": "portfolio",
      "title": "Modern Office Facade",
      "slug": "modern-office-facade",
      "description": "Contemporary facade design...",
      "fields": [
        { "key": "category", "value": "Facade & Cladding", "type": "select" },
        { "key": "location", "value": "Mumbai, India", "type": "text" },
        { "key": "year", "value": 2023, "type": "number" }
      ],
      "status": "published",
      "metadata": {
        "featuredImage": "https://..."
      },
      "media": [...],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

### 2. Get Content by Slug

Retrieve a single content item by its slug.

**Endpoint**: `GET /api/public/content/{type}/{slug}`

**Example Request**:

```bash
GET /api/public/content/blogs/architectural-metalworks-guide
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "65abc456...",
    "contentType": "blogs",
    "title": "Guide to Architectural Metalworks",
    "slug": "architectural-metalworks-guide",
    "description": "Comprehensive guide...",
    "fields": [
      { "key": "content", "value": "<p>Full article content...</p>", "type": "richtext" },
      { "key": "author", "value": "John Doe", "type": "text" },
      { "key": "publish_date", "value": "2024-01-15", "type": "date" }
    ],
    "status": "published",
    "metadata": {
      "featuredImage": "https://...",
      "seoTitle": "...",
      "seoDescription": "..."
    },
    "media": [...],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Statistics API

### Get Site Statistics

Get automatically calculated site statistics.

**Endpoint**: `GET /api/public/stats`

**Example Request**:

```bash
GET /api/public/stats
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "teamCount": 90,
    "clientsCount": 50,
    "projectsCount": 500,
    "citiesCount": 70
  }
}
```

**Statistics Calculation**:

- `teamCount`: Count of published team members
- `clientsCount`: Count of published clients
- `projectsCount`: Count of published projects
- `citiesCount`: Count of unique cities from projects and team locations

**Cache**: Statistics are cached for 5 minutes

---

## Settings API

### Get Public Settings

Get public site settings (excludes sensitive data).

**Endpoint**: `GET /api/public/settings`

**Example Request**:

```bash
GET /api/public/settings
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "site_name": "Vinton",
    "site_tagline": "Architectural Metalworks",
    "site_logo": "https://...",
    "site_favicon": "https://...",
    "contact_email": "info@vinton.in",
    "contact_phone": "+91 9746399288",
    "contact_address": "Kutti Sahib Road, South Chittoor\nKochi - 682027. Kerala, India.",
    "social_facebook": "https://facebook.com/vinton",
    "social_twitter": "https://twitter.com/vinton",
    "social_instagram": "https://instagram.com/vinton",
    "social_linkedin": "https://linkedin.com/company/vinton",
    "social_youtube": "https://youtube.com/@vinton",
    "social_github": "https://github.com/vinton",
    "seo_default_title": "Vinton - Architectural Metalworks",
    "seo_default_description": "...",
    "seo_default_keywords": "architecture, metalworks, facade",
    "seo_default_og_image": "https://...",
    "seo_google_analytics_id": "G-XXXXXXXXXX"
  }
}
```

**Excluded Settings** (Not returned in public API):

- SMTP email credentials
- Maintenance mode status
- Admin-only configuration

**Cache**: Settings are cached for 60 seconds

---

## Content Type Structures

### Homepage Content

**Type**: `homepage`

**Key Fields**:

```typescript
{
  hero_title: string
  hero_subtitle: string
  hero_cta_text: string
  hero_cta_link: string
  hero_background: string (image URL)
  about_heading: string
  about_description: string (HTML)
  about_images: string[] (image URLs)
  services_heading: string
  services_description: string
  stats_auto_calculate: boolean
  testimonials: Array<{
    name: string
    company: string
    quote: string
    avatar: string (image URL)
  }>
  cta_heading: string
  cta_description: string
  cta_button_text: string
  cta_button_link: string
  partners_logos: string[] (image URLs)
}
```

---

### Portfolio Item

**Type**: `portfolio`

**Categories**:

- Facade & Cladding
- Structural Elements
- Art Installation & Sculpture
- Partition & Screen
- Stairway & Railing
- Light Fixture & Signage
- Furniture & Accessories
- Doors & Windows

**Key Fields**:

```typescript
{
  title: string
  category: string
  description: string (HTML)
  location: string
  year: number
  client_name: string
  tags: string[]
  featuredImage: string (in metadata)
  gallery: Media[] (in media array)
}
```

---

### Service

**Type**: `services`

**Key Fields**:

```typescript
{
  service_name: string;
  description: string(HTML);
  icon_image: string;
  order: number;
  featured_homepage: boolean;
}
```

---

### Team Member

**Type**: `team`

**Key Fields**:

```typescript
{
  name: string
  position: string
  bio: string (HTML)
  photo: string
  email: string
  linkedin: string
  join_date: string (ISO date)
  location: string
}
```

---

### Project

**Type**: `projects`

**Status Values**: `completed`, `ongoing`, `upcoming`

**Key Fields**:

```typescript
{
  project_name: string
  client: string (reference to client ID)
  location: string (city name)
  start_date: string (ISO date)
  end_date: string (ISO date)
  status: string
  portfolio_items: string[] (references to portfolio IDs)
  value: string
}
```

---

### Client

**Type**: `clients`

**Key Fields**:

```typescript
{
  company_name: string
  logo: string
  website: string
  first_project_date: string (ISO date)
}
```

---

### Testimonial

**Type**: `testimonials`

**Key Fields**:

```typescript
{
  client_name: string
  company: string
  position: string
  quote: string
  avatar: string
  rating: number (1-5)
  featured_homepage: boolean
  project_reference: string (reference to project ID)
}
```

---

### Blog Post

**Type**: `blogs`

**Key Fields**:

```typescript
{
  title: string
  content: string (HTML)
  excerpt: string
  author: string
  publish_date: string (ISO date)
  tags: string[]
  featuredImage: string (in metadata)
}
```

---

## Error Responses

All APIs use consistent error response format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes**:

- `200` - Success
- `404` - Resource not found
- `500` - Internal server error

---

## Usage Examples

### React/Next.js Frontend

```typescript
// Fetch homepage content
const getHomepage = async () => {
  const res = await fetch("/api/public/content/homepage");
  const data = await res.json();
  return data.data[0]; // Homepage is typically a single item
};

// Fetch portfolio items with filters
const getPortfolio = async (category?: string) => {
  const params = new URLSearchParams({
    limit: "12",
    ...(category && { category }),
  });
  const res = await fetch(`/api/public/content/portfolio?${params}`);
  const data = await res.json();
  return data.data;
};

// Fetch statistics
const getStats = async () => {
  const res = await fetch("/api/public/stats");
  const data = await res.json();
  return data.data;
};

// Fetch settings
const getSettings = async () => {
  const res = await fetch("/api/public/settings");
  const data = await res.json();
  return data.data;
};
```

---

## Rate Limiting

Currently, there is no rate limiting on public APIs. This may be added in future versions.

---

## Caching

- **Settings API**: Cached for 60 seconds
- **Statistics API**: Cached for 5 minutes (300 seconds)
- **Content APIs**: No caching (real-time data)

---

## Notes

1. All content returned is **published only** (`status: "published"`)
2. Draft content is never exposed through public APIs
3. All date fields are returned in ISO 8601 format
4. Image URLs are absolute URLs (S3 or configured storage)
5. HTML content in `richtext` fields is sanitized
6. Reference fields return IDs only (need separate API calls to fetch related content)

---

## Support

For API issues or questions, contact:

- **Email**: hr@vinton.in
- **Phone**: +91 96330 30093

---

**Last Updated**: October 21, 2025  
**API Version**: 1.0
