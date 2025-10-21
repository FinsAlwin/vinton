# AWS S3 Setup - Step by Step Guide

## 🎯 Quick Fix for 403 Error

Follow these steps in order:

---

## Step 1: Enable Public Access on S3 Bucket

1. Go to **AWS Console** → **S3**
2. Click on bucket: `amzn-vinton-s3-bucket`
3. Go to **Permissions** tab
4. Under "Block public access (bucket settings)", click **Edit**
5. **Uncheck** ☐ Block all public access
6. Click **Save changes**
7. Type `confirm` and click **Confirm**

✅ This allows you to make objects public

---

## Step 2: Add Bucket Policy

1. Still in **Permissions** tab
2. Scroll down to **Bucket policy**
3. Click **Edit**
4. Paste this policy:

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

5. Click **Save changes**

✅ This makes all objects in the bucket publicly readable

---

## Step 3: Update IAM User Permissions

Your IAM user needs permission to set ACL on objects.

1. Go to **AWS Console** → **IAM**
2. Click **Users** → Find your user
3. Click **Add permissions** → **Attach policies directly**
4. Click **Create policy**
5. Choose **JSON** tab
6. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::amzn-vinton-s3-bucket",
        "arn:aws:s3:::amzn-vinton-s3-bucket/*"
      ]
    }
  ]
}
```

7. Click **Next**
8. Name it: `VintonS3FullAccess`
9. Click **Create policy**
10. Go back to your user and attach this policy

✅ Your app can now set public-read ACL on uploads

---

## Step 4: Enable CORS (Optional but Recommended)

1. In S3 bucket, **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)**
3. Click **Edit**
4. Paste:

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

✅ Allows Next.js Image component to fetch images

---

## Step 5: Test the Fix

1. **Restart your dev server**:

   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Upload a new image** through admin panel

3. **Check if it displays** without 403 errors

4. **Test in browser**: Copy the S3 URL and open directly
   - Should see the image ✅
   - Not a 403 error ❌

---

## Fix Existing Images (Already Uploaded)

If you have images uploaded before this fix, they still have private ACL.

### Option 1: Re-upload (Easiest)

Just delete and re-upload them through the admin panel.

### Option 2: Update ACL via AWS Console

1. Go to S3 bucket → `uploads/` folder
2. Select the image
3. Click **Actions** → **Make public using ACL**
4. Click **Make public**

### Option 3: AWS CLI (For Many Files)

```bash
aws s3 cp s3://amzn-vinton-s3-bucket/uploads/ \
  s3://amzn-vinton-s3-bucket/uploads/ \
  --recursive \
  --acl public-read \
  --metadata-directive REPLACE
```

---

## Verify Your Configuration

### Check Bucket Policy

```bash
aws s3api get-bucket-policy --bucket amzn-vinton-s3-bucket
```

### Check Public Access Settings

```bash
aws s3api get-public-access-block --bucket amzn-vinton-s3-bucket
```

### Test Image Access

```bash
curl -I https://amzn-vinton-s3-bucket.s3.ap-south-1.amazonaws.com/uploads/YOUR-IMAGE.jpg
```

Should return `200 OK` not `403 Forbidden`

---

## Common Issues

### Still getting 403?

- ✓ Bucket policy saved correctly?
- ✓ IAM user has PutObjectAcl permission?
- ✓ Restarted dev server?
- ✓ Testing with NEW upload (not old one)?

### "Access Denied" when uploading?

- Check IAM credentials in `.env.local`
- Verify IAM user has correct permissions
- Make sure AWS_REGION matches bucket region

### Images work directly but not in Next.js?

- Check CORS configuration
- Verify image domain in `next.config.ts`:
  ```ts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  }
  ```

---

## Security Considerations

✅ **Safe for**:

- Public website images
- Blog posts, portfolio items
- Marketing materials
- Product images

⚠️ **Not safe for**:

- User private data
- Confidential documents
- Files requiring authentication

For sensitive files, use:

- S3 presigned URLs (temporary access)
- CloudFront with signed URLs
- Application-level access control

---

## Next Steps (Optional - Production)

For production, consider using **CloudFront CDN**:

### Benefits:

- 🚀 Faster image delivery worldwide
- 💰 Lower bandwidth costs
- 🔒 Better security (S3 stays private)
- 🌐 Custom domain support

### Quick Setup:

1. Create CloudFront distribution pointing to S3
2. Update code to use CloudFront URL
3. Set up Origin Access Control (OAC)
4. Remove public bucket policy
5. Much better performance! 🎉

See: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html

---

## ✅ Checklist

Before you start:

- [ ] AWS Console access
- [ ] S3 bucket name: `amzn-vinton-s3-bucket`
- [ ] IAM user credentials in `.env.local`

After setup:

- [ ] Public access enabled
- [ ] Bucket policy added
- [ ] IAM permissions updated
- [ ] CORS configured
- [ ] Code updated (already done ✅)
- [ ] Dev server restarted
- [ ] Test upload successful
- [ ] Images display without 403

**Everything should work now!** 🎉
