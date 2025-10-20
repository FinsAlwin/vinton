# Vinton CMS & Admin Panel

A modern, full-stack content management system built with Next.js 15, MongoDB, and AWS S3.

## Features

### Admin Panel (`/admin`)

- 🔐 **JWT Authentication** - Secure login with access & refresh tokens
- 🎨 **Dark/Light Mode** - Theme switcher with localStorage persistence
- 📱 **Responsive Design** - Mobile-friendly admin interface
- 🗂️ **Generic CMS** - Flexible content management for any content type
- 📁 **Media Library** - Upload, manage, and organize files with AWS S3
- 🔍 **Search & Filters** - Fast content discovery
- 📊 **Dashboard** - Real-time statistics and recent activity
- 🎯 **RESTful API** - Reusable API endpoints for external apps

### Technical Stack

- **Framework**: Next.js 15 with App Router & React Server Components
- **Database**: MongoDB Atlas with Mongoose ODM
- **Storage**: AWS S3 for media files
- **Authentication**: JWT with httpOnly cookies
- **UI**: shadcn/ui components with Tailwind CSS v4
- **Data Fetching**: SWR for client-side caching
- **Validation**: Zod with React Hook Form
- **Deployment**: AWS Amplify ready

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- AWS account with S3 bucket

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vinton
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_atlas_connection_string

   # JWT Secrets (use strong random strings)
   JWT_ACCESS_SECRET=your-secure-access-secret-min-32-chars
   JWT_REFRESH_SECRET=your-secure-refresh-secret-min-32-chars

   # AWS S3
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_S3_BUCKET_NAME=your_bucket_name

   # App Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Create first admin user**

   Before starting the app, create your first admin user by sending a POST request:

   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@vinton.in",
       "password": "your-secure-password",
       "role": "super-admin"
     }'
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000 (placeholder)
   - Admin Panel: http://localhost:3000/admin/login

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing site
│   │   └── page.tsx         # Landing page placeholder
│   ├── admin/               # Admin panel routes
│   │   ├── layout.tsx       # Admin layout with sidebar
│   │   ├── page.tsx         # Dashboard
│   │   ├── login/           # Login page
│   │   ├── content/         # Content management
│   │   ├── media/           # Media library
│   │   └── settings/        # Settings
│   └── api/                 # API routes
│       ├── auth/            # Authentication
│       ├── content/         # Content CRUD
│       ├── media/           # Media upload/delete
│       └── settings/        # Settings
├── components/
│   ├── admin/               # Admin components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Sidebar, Header
│   │   └── theme-provider.tsx
│   └── frontend/            # Frontend components (future)
├── lib/
│   ├── mongodb.ts           # Database connection
│   ├── auth.ts              # JWT utilities
│   ├── s3.ts                # AWS S3 client
│   └── utils.ts             # Helper functions
├── models/                  # Mongoose schemas
│   ├── User.ts
│   ├── Content.ts
│   ├── Media.ts
│   └── Settings.ts
├── hooks/                   # React hooks
│   └── useSWR.ts            # SWR data fetching hooks
├── types/                   # TypeScript types
└── middleware.ts            # Route protection
```

## API Documentation

### Authentication

All admin API endpoints require authentication via:

- Cookie-based auth (for browser)
- Bearer token in Authorization header (for external apps)

**Register User**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Logout**

```http
POST /api/auth/logout
```

**Get Current User**

```http
GET /api/auth/me
Authorization: Bearer {access_token}
```

### Content API

**List Content**

```http
GET /api/content/{type}?page=1&limit=20&search=query&status=published
Authorization: Bearer {access_token}
```

**Get Content by ID**

```http
GET /api/content/{type}/{id}
Authorization: Bearer {access_token}
```

**Get Content by Slug**

```http
GET /api/content/{type}/slug/{slug}
```

**Create Content**

```http
POST /api/content/{type}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Content Title",
  "description": "Description",
  "status": "draft",
  "fields": [],
  "metadata": {
    "seoTitle": "SEO Title",
    "seoDescription": "SEO Description"
  }
}
```

**Update Content**

```http
PUT /api/content/{type}/{id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "published"
}
```

**Delete Content**

```http
DELETE /api/content/{type}/{id}
Authorization: Bearer {access_token}
```

### Media API

**List Media**

```http
GET /api/media?page=1&limit=20&search=query
Authorization: Bearer {access_token}
```

**Upload Media**

```http
POST /api/media/upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

file: [binary]
```

**Delete Media**

```http
DELETE /api/media/{id}
Authorization: Bearer {access_token}
```

## Content Types

The system supports flexible content types. Default types include:

- **blogs** - Blog posts and articles
- **news** - Company news and updates
- **portfolio** - Project showcase
- **team** - Team member profiles
- **services** - Service offerings
- **company** - Company information

You can easily add more content types through the admin interface.

## Deployment

### AWS Amplify

1. Connect your repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - "**/*"
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables in Amplify console
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`
- `NEXT_PUBLIC_API_URL`
- `NODE_ENV=production`

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. Use strong, random secrets for JWT tokens (minimum 32 characters)
3. Enable HTTPS in production
4. Set proper CORS policies for API endpoints
5. Regularly update dependencies
6. Implement rate limiting for API endpoints
7. Use AWS IAM roles with minimum permissions for S3

## Performance Optimizations

- ✅ Server Components for static content
- ✅ Dynamic imports for heavy components
- ✅ Image optimization with next/image
- ✅ SWR for client-side caching
- ✅ MongoDB connection pooling
- ✅ API response compression
- ✅ Lazy loading for media library

## Development

**Run development server**

```bash
npm run dev
```

**Build for production**

```bash
npm run build
```

**Start production server**

```bash
npm start
```

**Lint code**

```bash
npm run lint
```

## Future Enhancements

- [ ] Rich text editor (TipTap integration)
- [ ] Bulk operations for content
- [ ] Content versioning
- [ ] Role-based permissions
- [ ] Email notifications
- [ ] Audit logs
- [ ] Export/Import functionality
- [ ] Multi-language support
- [ ] Advanced analytics

## Support

For issues and questions, please open an issue in the repository.

## License

All Rights Reserved © 2024 Vinton
