# S3 Image Access 403 Error Fix

## Problem

Images upload successfully to S3 but return 403 Forbidden when trying to display them:

```
GET https://amzn-vinton-s3-bucket.s3.ap-south-1.amazonaws.com/uploads/... 403
```

## Root Cause

The S3 bucket doesn't have public read permissions, so browsers cannot fetch the uploaded images.

## Solution - Configure S3 Bucket for Public Read Access

### Step 1: Unblock Public Access

1. Go to **AWS S3 Console** → Select your bucket (`amzn-vinton-s3-bucket`)
2. Go to **Permissions** tab
3. Click **Edit** under "Block public access (bucket settings)"
4. **Uncheck** "Block all public access"
5. Click **Save changes**
6. Type `confirm` when prompted

⚠️ **Note**: This allows you to make objects public, but doesn't make them public automatically.

### Step 2: Add Bucket Policy

1. Still in **Permissions** tab, scroll to **Bucket policy**
2. Click **Edit**
3. Paste this policy (replace `YOUR-BUCKET-NAME` with `amzn-vinton-s3-bucket`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::amzn-vinton-s3-bucket/*"
    }
  ]
}
```

4. Click **Save changes**

### Step 3: Update Upload Code to Set Public ACL

Update the S3 upload code to set ACL to public-read:

**File**: `/src/lib/s3.ts`

```typescript
export async function uploadToS3(params: UploadParams): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
    ACL: "public-read", // Add this line
  });

  await s3Client.send(command);

  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.key}`;
}
```

### Step 4: Enable CORS (for Next.js Image Optimization)

1. In S3 bucket, go to **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)**
3. Click **Edit**
4. Paste this CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

5. Click **Save changes**

## Alternative Solution - Using CloudFront (Better for Production)

Instead of making S3 bucket public, use CloudFront CDN:

### Benefits:

- ✅ Better security (S3 stays private)
- ✅ Faster image delivery (CDN caching)
- ✅ Lower bandwidth costs
- ✅ HTTPS by default

### Quick CloudFront Setup:

1. Go to **CloudFront Console** → Create distribution
2. **Origin domain**: Select your S3 bucket
3. **Origin access**: Choose "Origin access control settings (recommended)"
4. Create OAC and update S3 bucket policy (CloudFront will prompt)
5. **Viewer protocol policy**: Redirect HTTP to HTTPS
6. Create distribution (takes ~15 minutes to deploy)
7. Use CloudFront domain in your app instead of S3 URL

### Update Code for CloudFront:

```typescript
// In .env.local
NEXT_PUBLIC_CDN_URL=https://d1234567890.cloudfront.net

// In lib/s3.ts
export async function uploadToS3(params: UploadParams): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
    // No ACL needed with CloudFront
  });

  await s3Client.send(command);

  // Return CloudFront URL instead of S3 URL
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  if (cdnUrl) {
    return `${cdnUrl}/${params.key}`;
  }

  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.key}`;
}
```

## Verify the Fix

After applying the fix:

1. Upload a new image through the admin panel
2. Check if it displays without 403 errors
3. Try accessing the S3 URL directly in browser
4. Should see the image ✅

## For Existing Images

If you have images that were uploaded before the fix:

### Option A: Re-upload them

Delete and re-upload through the admin panel.

### Option B: Update ACL via AWS CLI

```bash
aws s3api put-object-acl \
  --bucket amzn-vinton-s3-bucket \
  --key uploads/1760943648981-2di813kt294.jpg \
  --acl public-read
```

Or update all at once:

```bash
aws s3 cp s3://amzn-vinton-s3-bucket/uploads/ \
  s3://amzn-vinton-s3-bucket/uploads/ \
  --recursive \
  --acl public-read \
  --metadata-directive REPLACE
```

## Security Note

Making S3 objects publicly readable is fine for:

- ✅ Public website images
- ✅ User-uploaded content meant to be public
- ✅ Blog post images, portfolio images, etc.

But NOT for:

- ❌ Private user data
- ❌ Sensitive documents
- ❌ User profile pictures (if app has privacy settings)

For production, consider:

1. Using CloudFront with signed URLs for sensitive content
2. Implementing access control at application level
3. Using S3 presigned URLs for temporary access

## Troubleshooting

### Still getting 403?

- Check bucket policy is saved correctly
- Verify IAM user has s3:PutObjectAcl permission
- Clear browser cache
- Try incognito mode

### CORS errors?

- Make sure CORS configuration is saved
- Check AllowedOrigins includes your domain
- Restart Next.js dev server

### Images uploaded before fix not showing?

- Update their ACL using AWS CLI (see above)
- Or delete and re-upload them
