# Comprehensive Logging System - Documentation

## ✅ Implementation Complete

A comprehensive activity logging system has been implemented to track all admin panel actions, API calls, changes, access logs, and IP addresses.

---

## 📋 System Overview

The logging system captures:

- **All CRUD operations** on content, media, and settings
- **Authentication events** (login, logout, registration)
- **User information** (email, role)
- **IP addresses** from all requests
- **User agents** (browser/client info)
- **Timestamps** for all activities
- **HTTP status codes** for success/failure tracking
- **Detailed metadata** for each action

---

## 🗄️ Database Model

### ActivityLog Model

**File**: `src/models/ActivityLog.ts`

**Schema Fields**:

```typescript
{
  user: ObjectId (ref: User)     // Who performed the action
  email: String                   // User email for quick access
  action: String                  // Action type enum
  resource: String                // Resource affected (content, media, etc.)
  resourceId: String              // ID of affected resource
  method: String                  // HTTP method (GET, POST, DELETE, etc.)
  path: String                    // API endpoint path
  statusCode: Number              // HTTP response status
  ipAddress: String               // User IP address
  userAgent: String               // Browser/client info
  details: Mixed                  // Additional metadata
  duration: Number                // Request duration in ms (optional)
  timestamp: Date                 // When action occurred
}
```

**Action Types**:

- `CREATE_CONTENT` - Content created
- `UPDATE_CONTENT` - Content updated
- `DELETE_CONTENT` - Content deleted
- `READ_CONTENT` - Content accessed
- `UPLOAD_MEDIA` - Media file uploaded
- `DELETE_MEDIA` - Media file deleted
- `UPDATE_SETTINGS` - Settings changed
- `LOGIN_SUCCESS` - Successful login
- `LOGIN_FAILED` - Failed login attempt
- `LOGOUT` - User logged out
- `REGISTER_USER` - New user registered
- `ERROR` - System error
- `ACCESS_DENIED` - Unauthorized access attempt

**Resource Types**:

- `content` - Content management
- `media` - Media library
- `settings` - Application settings
- `auth` - Authentication
- `user` - User management
- `system` - System operations

**Indexes**:

- Compound index on `user` + `timestamp` (user activity history)
- Single indexes on `action`, `resource`, `timestamp` (filtering/sorting)

---

## 🔧 Logging Utility

### Logger Functions

**File**: `src/lib/logger.ts`

#### Core Functions:

**1. createLog()**

```typescript
createLog(params: LogParams): Promise<void>
```

Creates a log entry in the database. Non-blocking, won't fail the main request if logging fails.

**2. logApiCall()**

```typescript
logApiCall(request: NextRequest, params: Omit<LogParams, 'ipAddress' | 'userAgent'>): Promise<void>
```

Logs API calls with automatic IP and user agent extraction.

**3. logAuthEvent()**

```typescript
logAuthEvent(
  request: NextRequest,
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'REGISTER_USER',
  email: string,
  details?: Record<string, unknown>
): Promise<void>
```

Logs authentication events (login, logout, registration).

**4. logContentChange()**

```typescript
logContentChange(
  request: NextRequest,
  action: 'CREATE_CONTENT' | 'UPDATE_CONTENT' | 'DELETE_CONTENT',
  user: { userId: string; email: string },
  contentId: string,
  contentType: string,
  title: string,
  statusCode: number,
  details?: Record<string, unknown>
): Promise<void>
```

Logs content CRUD operations with full context.

**5. logMediaChange()**

```typescript
logMediaChange(
  request: NextRequest,
  action: 'UPLOAD_MEDIA' | 'DELETE_MEDIA',
  user: { userId: string; email: string },
  mediaId: string,
  filename: string,
  statusCode: number,
  details?: Record<string, unknown>
): Promise<void>
```

Logs media upload and deletion operations.

**6. logSettingsChange()**

```typescript
logSettingsChange(
  request: NextRequest,
  user: { userId: string; email: string },
  settingKey: string,
  category: string,
  statusCode: number,
  details?: Record<string, unknown>
): Promise<void>
```

Logs settings updates with key and category.

**7. logError()**

```typescript
logError(
  request: NextRequest,
  error: Error | string,
  user?: { userId: string; email: string },
  statusCode = 500
): Promise<void>
```

Logs system errors with stack traces.

#### Helper Functions:

**getClientIP()**

```typescript
getClientIP(request: NextRequest): string
```

Extracts client IP from headers (x-forwarded-for, x-real-ip).

**getUserAgent()**

```typescript
getUserAgent(request: NextRequest): string
```

Extracts user agent from request headers.

---

## 🌐 API Endpoint

### GET /api/logs

**File**: `src/app/api/logs/route.ts`

**Authentication**: Required (admin only)

**Query Parameters**:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `search` - Search in email, resource, or path
- `action` - Filter by action type
- `resource` - Filter by resource type
- `startDate` - Filter from date (ISO string)
- `endDate` - Filter to date (ISO string)
- `userId` - Filter by specific user ID

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "user": { "_id": "...", "email": "..." },
      "email": "admin@example.com",
      "action": "CREATE_CONTENT",
      "resource": "content",
      "resourceId": "...",
      "method": "POST",
      "path": "/api/content/blogs",
      "statusCode": 201,
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "details": { "title": "...", "slug": "..." },
      "timestamp": "2025-01-21T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
```

---

## 🎯 API Routes with Logging

### Content APIs

**Files**: `src/app/api/content/[type]/route.ts` & `[id]/route.ts`

- ✅ `POST /api/content/[type]` - Logs CREATE_CONTENT
- ✅ `PUT /api/content/[type]/[id]` - Logs UPDATE_CONTENT
- ✅ `DELETE /api/content/[type]/[id]` - Logs DELETE_CONTENT

**Logged Details**:

- Content type, title, slug, status
- Updated fields (for updates)

### Media APIs

**Files**: `src/app/api/media/upload/route.ts` & `[id]/route.ts`

- ✅ `POST /api/media/upload` - Logs UPLOAD_MEDIA
- ✅ `DELETE /api/media/[id]` - Logs DELETE_MEDIA

**Logged Details**:

- Filename, size, MIME type
- Image dimensions (if applicable)
- S3 key

### Settings API

**File**: `src/app/api/settings/route.ts`

- ✅ `POST /api/settings` - Logs UPDATE_SETTINGS

**Logged Details**:

- Setting key, category, description

### Auth APIs

**Files**: `src/app/api/auth/*/route.ts`

- ✅ `POST /api/auth/login` - Logs LOGIN_SUCCESS or LOGIN_FAILED
- ✅ `POST /api/auth/logout` - Logs LOGOUT
- ✅ `POST /api/auth/register` - Logs REGISTER_USER

**Logged Details**:

- User role
- Failure reason (for failed logins)

---

## 📊 Dashboard Widget

### Recent Logs Widget

**File**: `src/components/admin/dashboard/recent-logs.tsx`

**Location**: Admin Dashboard (`/admin`)

**Features**:

- Displays last 10 activity logs
- Color-coded by action type
- Icons for each action
- Time ago format (e.g., "5 min ago")
- IP address display
- Status indicator (green dot for success, red for error)
- Link to full logs page
- Responsive design

**Action Colors**:

- 🟢 **Green**: CREATE_CONTENT, LOGIN_SUCCESS
- 🔵 **Blue**: UPDATE_CONTENT, REGISTER_USER
- 🔴 **Red**: DELETE_CONTENT, DELETE_MEDIA, LOGIN_FAILED, ERROR
- 🟣 **Purple**: UPLOAD_MEDIA
- 🟠 **Orange**: UPDATE_SETTINGS
- ⚫ **Gray**: LOGOUT

---

## 📄 Dedicated Logs Page

### System Logs Page

**File**: `src/app/admin/(dashboard)/logs/page.tsx`

**Route**: `/admin/logs`

**Features**:

#### 1. Header Section

- Page title: "System Logs"
- Description
- Export button (placeholder for future)

#### 2. Filters Card

- **Search**: Search by email, resource, or path
- **Action Filter**: Dropdown to filter by action type
- **Resource Filter**: Dropdown to filter by resource
- **Date Range**: From/to date pickers (future enhancement)
- **Clear Filters**: Reset all filters

#### 3. Logs Table

Columns:

- Timestamp (date + time)
- User (email)
- Action (with icon and badge)
- Resource (content, media, settings, auth)
- IP Address (hidden on mobile/tablet)
- Status (HTTP status code badge)
- Details (view button)

**Mobile Responsive**:

- Stack columns on mobile
- Hide IP on tablet/mobile
- Horizontal scroll if needed

#### 4. Log Details Modal

- Opens when clicking "Details" button
- Shows all log information
- JSON formatted metadata
- Copy button to copy full log as JSON
- Close button

**Pagination**:

- 50 items per page
- Previous/Next buttons
- Shows total count
- Disabled states

**Empty States**:

- Shows when no logs found
- Clear message
- Helpful icon

---

## 📱 Mobile Responsiveness

### Recent Logs Widget

- Compact layout on mobile
- Stacks information vertically
- Touch-friendly buttons

### Logs Page

- Responsive table
- Hide non-essential columns on small screens
- Full-width filters on mobile
- Readable on all screen sizes

---

## 🎨 Visual Design

### Color Coding

All actions are color-coded for quick identification:

```
CREATE_CONTENT    → Green   (Success/Creation)
UPDATE_CONTENT    → Blue    (Modification)
DELETE_CONTENT    → Red     (Deletion)
UPLOAD_MEDIA      → Purple  (Upload)
DELETE_MEDIA      → Red     (Deletion)
UPDATE_SETTINGS   → Orange  (Configuration)
LOGIN_SUCCESS     → Green   (Success)
LOGIN_FAILED      → Red     (Error)
LOGOUT            → Gray    (Neutral)
REGISTER_USER     → Blue    (Creation)
ERROR             → Red     (Error)
```

### Badge Styling

- Success actions: `admin-badge-success`
- Info actions: `admin-badge-info`
- Warning actions: `admin-badge-warning`
- Danger actions: `admin-badge-danger`

### Icons

Each action has a specific icon:

- FileText: Content operations
- Upload: Media uploads
- Trash2: Deletions
- Settings: Settings changes
- LogIn/LogOut: Authentication
- UserPlus: Registration
- AlertCircle: Errors
- Activity: General activity

---

## 🚀 Usage Examples

### Automatic Logging

All logging happens automatically when actions are performed. No manual intervention needed.

**Content Creation**:

```typescript
// In your API route
const content = await Content.create({...});

// Logging happens automatically
await logContentChange(
  request,
  "CREATE_CONTENT",
  currentUser,
  content._id.toString(),
  type,
  title,
  201,
  { slug, status }
);
```

**Login Attempt**:

```typescript
// Success
await logAuthEvent(request, "LOGIN_SUCCESS", email, { role });

// Failure
await logAuthEvent(request, "LOGIN_FAILED", email, {
  reason: "Invalid password",
});
```

### Viewing Logs

**Dashboard Widget**:

- Automatically shows last 10 logs
- Auto-refreshes every 30 seconds
- Click "View All" to see full logs page

**Logs Page** (`/admin/logs`):

1. Navigate to Logs from sidebar
2. Use search to find specific logs
3. Filter by action or resource
4. Click details button to see full information
5. Copy log data as JSON if needed

---

## 🔍 Search & Filtering

### Search Capabilities

Searches across:

- User email
- Resource type
- API path

### Filter Options

**By Action**:

- All Actions
- Create Content
- Update Content
- Delete Content
- Upload Media
- Delete Media
- Update Settings
- Login Success
- Login Failed
- Logout

**By Resource**:

- All Resources
- Content
- Media
- Settings
- Authentication
- User

**By Date** (future enhancement):

- Start date
- End date
- Date range picker

**By User** (API supports it):

- Filter by specific user ID

---

## 📈 What Gets Logged

### Content Operations

**CREATE_CONTENT**:

- Who created it
- Content type (blogs, portfolio, etc.)
- Title and slug
- Status (draft/published)
- IP address
- Timestamp

**UPDATE_CONTENT**:

- Who updated it
- What fields were changed
- New status
- IP address
- Timestamp

**DELETE_CONTENT**:

- Who deleted it
- Content type and title
- Slug (for reference)
- IP address
- Timestamp

### Media Operations

**UPLOAD_MEDIA**:

- Who uploaded
- Filename
- File size and MIME type
- Image dimensions (if image)
- S3 key
- IP address
- Timestamp

**DELETE_MEDIA**:

- Who deleted
- Filename
- File details
- IP address
- Timestamp

### Settings Changes

**UPDATE_SETTINGS**:

- Who changed the setting
- Setting key
- Category
- Description
- IP address
- Timestamp

### Authentication Events

**LOGIN_SUCCESS**:

- User email
- Role
- IP address
- Timestamp

**LOGIN_FAILED**:

- Email attempted
- Failure reason
- IP address
- Timestamp

**LOGOUT**:

- User email
- IP address
- Timestamp

**REGISTER_USER**:

- New user email
- Assigned role
- IP address
- Timestamp

---

## 🛡️ Security & Privacy

### What's Logged

✅ **DO Log**:

- User identifiers (email, ID)
- Action types
- Resource identifiers
- Timestamps
- IP addresses
- HTTP status codes
- Success/failure indicators
- Non-sensitive metadata

❌ **DON'T Log**:

- Passwords (never logged)
- Access tokens
- Refresh tokens
- Sensitive personal data
- Full request bodies with sensitive info

### Access Control

- Only authenticated admins can view logs
- Logs API requires authentication
- Future: Super-admins can view all logs, regular admins their own

### IP Address Handling

- Extracted from request headers
- Handles proxy scenarios (x-forwarded-for)
- Falls back gracefully if unavailable
- GDPR compliant (can be anonymized if needed)

### Error Handling

- Logging failures don't break the application
- Errors logged to console
- Graceful degradation

---

## 📱 User Interface

### Sidebar Navigation

Added "Logs" menu item:

- Position: After Settings
- Icon: ScrollText
- Route: `/admin/logs`

### Dashboard Widget

**Recent Activity** section shows:

- Last 10 logs
- Time ago format
- User and action
- Color-coded badges
- Status indicators
- IP addresses
- "View All" button

### Logs Page

**Full-featured interface**:

- Advanced search
- Multiple filters
- Sortable table
- Pagination
- Expandable details
- Mobile responsive

---

## 🎯 Benefits

### 1. Security Monitoring

- Track all admin actions
- Detect unauthorized access attempts
- Monitor failed login attempts
- Identify suspicious patterns

### 2. Audit Trail

- Complete history of all changes
- Who did what and when
- Track content lifecycle
- Compliance ready

### 3. Debugging

- Error tracking
- User behavior analysis
- API call monitoring
- Performance insights (with duration)

### 4. Accountability

- Clear attribution of all actions
- Timestamped records
- Immutable log entries
- User activity history

### 5. Analytics

- Most active users
- Popular actions
- Error rates
- Usage patterns

---

## 🔄 Log Lifecycle

### Creation

1. User performs action (create content, upload media, etc.)
2. API route executes
3. Log entry created asynchronously
4. Log saved to MongoDB
5. Request continues normally

### Storage

- Stored in MongoDB `activitylogs` collection
- Indexed for fast queries
- Efficient storage with proper data types

### Retrieval

- Query via `/api/logs` endpoint
- Filtered and paginated
- Populated with user details
- Sorted by timestamp (newest first)

### Display

- Dashboard widget (last 10)
- Logs page (filterable table)
- Details modal (full information)

### Retention

- Optional TTL index for auto-cleanup (90 days)
- Can be configured per requirements
- Archive critical logs before deletion

---

## 💻 Technical Implementation

### Files Created (6):

1. `src/models/ActivityLog.ts` - Database model
2. `src/lib/logger.ts` - Logging utilities
3. `src/app/api/logs/route.ts` - API endpoint
4. `src/components/admin/dashboard/recent-logs.tsx` - Dashboard widget
5. `src/app/admin/(dashboard)/logs/page.tsx` - Logs page
6. `src/hooks/useLogs.ts` - SWR hooks for fetching logs

### Files Modified (10):

1. `src/app/api/auth/login/route.ts` - Added login logging
2. `src/app/api/auth/logout/route.ts` - Added logout logging
3. `src/app/api/auth/register/route.ts` - Added registration logging
4. `src/app/api/content/[type]/route.ts` - Added create content logging
5. `src/app/api/content/[type]/[id]/route.ts` - Added update/delete logging
6. `src/app/api/media/upload/route.ts` - Added upload logging
7. `src/app/api/media/[id]/route.ts` - Added delete logging
8. `src/app/api/settings/route.ts` - Added settings logging
9. `src/components/admin/layout/sidebar.tsx` - Added logs menu item
10. `src/app/admin/(dashboard)/page.tsx` - Added recent logs widget
11. `src/types/index.ts` - Added ActivityLog types

---

## 🚀 Build Status

```
✅ Build: SUCCESSFUL
✅ TypeScript: NO ERRORS
✅ Linting: NO WARNINGS
✅ New Routes:
   - /admin/logs (13.7 kB)
   - /api/logs (0 B API)
✅ Dashboard: Updated with logs widget
✅ Sidebar: Logs menu item added
```

---

## 📖 Usage Guide

### For Admins

**View Recent Activity**:

1. Visit Dashboard (`/admin`)
2. Scroll to "Recent Activity" section
3. See last 10 actions

**View All Logs**:

1. Click "Logs" in sidebar
2. See paginated table of all logs
3. Use filters to narrow down
4. Click details button for more info

**Search Logs**:

1. Go to Logs page
2. Type in search box (email, path, resource)
3. Results filter automatically
4. Clear search when done

**Filter Logs**:

1. Select action type (Create, Update, Delete, etc.)
2. Select resource (Content, Media, Settings, etc.)
3. Logs update automatically
4. Click "Clear Filters" to reset

**View Log Details**:

1. Find log in table
2. Click details button (chevron icon)
3. Modal opens with full information
4. Copy JSON if needed
5. Close modal

---

## 🎨 UI Components

### Recent Logs Widget

- Card with "Recent Activity" title
- Activity icon
- List of logs with icons and badges
- Time ago format
- Color-coded dots for status
- "View All" button
- Hover effects

### Logs Table

- Professional table design
- Sortable columns
- Color-coded badges
- Status indicators
- Responsive layout
- Pagination controls

### Details Modal

- Grid layout for key info
- JSON formatted metadata
- Copy functionality
- Clean admin theme styling

---

## 🔮 Future Enhancements

Possible additions:

- [ ] Export logs to CSV/JSON
- [ ] Date range picker
- [ ] Real-time log streaming (WebSocket)
- [ ] Log analytics dashboard
- [ ] Email alerts for critical events
- [ ] Log retention policy UI
- [ ] Automatic log archiving
- [ ] Advanced search with RegEx
- [ ] User-specific log views
- [ ] System metrics and performance monitoring

---

## ✨ Summary

The logging system provides:

- **Complete visibility** into all admin actions
- **Security monitoring** with IP tracking
- **Audit trail** for compliance
- **User-friendly interface** for viewing logs
- **Powerful filtering** for finding specific events
- **Mobile responsive** design
- **Professional appearance** with TailAdmin theme
- **Production ready** with error handling

---

**Status**: ✅ **COMPLETE & PRODUCTION READY**

Comprehensive logging system successfully implemented!
