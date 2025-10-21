# Vinton Admin Panel - Setup Guide

## 🚀 Quick Setup Steps

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vinton?retryWrites=true&w=majority

# JWT Secrets (Generate strong random strings)
# You can use: openssl rand -base64 32
JWT_ACCESS_SECRET=your-32-char-random-string-for-access-token
JWT_REFRESH_SECRET=your-32-char-random-string-for-refresh-token

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=your-bucket-name

# Application URL
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Generate JWT Secrets

Run these commands to generate secure secrets:

```bash
# For JWT_ACCESS_SECRET
openssl rand -base64 32

# For JWT_REFRESH_SECRET
openssl rand -base64 32
```

### 3. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

### 4. AWS S3 Setup

1. Create an S3 bucket in AWS Console
2. Enable public access (or configure CloudFront for better performance)
3. Create an IAM user with S3 permissions
4. Add the credentials to `.env.local`

**Required S3 Bucket Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

**Required IAM Policy for User:**

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
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Create First Admin User

Start the development server:

```bash
npm run dev
```

Then create your first admin user using curl or Postman:

**Using curl:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vinton.in",
    "password": "YourSecurePassword123!",
    "role": "super-admin"
  }'
```

**Using Postman:**

- Method: POST
- URL: http://localhost:3000/api/auth/register
- Headers: Content-Type: application/json
- Body (raw JSON):
  ```json
  {
    "email": "admin@vinton.in",
    "password": "YourSecurePassword123!",
    "role": "super-admin"
  }
  ```

### 7. Access the Admin Panel

1. Navigate to: http://localhost:3000/admin/login
2. Login with your credentials
3. Start managing content!

## 📋 Post-Setup Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection successful
- [ ] AWS S3 bucket created and configured
- [ ] First admin user created
- [ ] Successfully logged into admin panel
- [ ] Can upload media files
- [ ] Can create content

## 🎨 Content Types Available

The system comes with these pre-configured content types:

- **Blogs** - Blog posts and articles
- **News** - Company news and updates
- **Portfolio** - Project showcase
- **Team** - Team member profiles
- **Services** - Service offerings
- **Company** - Company information

You can manage all of these at `/admin/content`

## 🔐 Security Notes

1. **Never commit `.env.local`** to Git
2. Use strong passwords (min 8 characters, mix of letters, numbers, symbols)
3. In production, use environment-specific secrets
4. Regularly rotate JWT secrets
5. Enable 2FA for AWS and MongoDB accounts

## 🐛 Troubleshooting

### MongoDB Connection Failed

- Check if your IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

### S3 Upload Failed

- Verify AWS credentials are correct
- Check bucket permissions
- Ensure bucket policy allows uploads
- Verify IAM user has required permissions

### JWT Token Errors

- Ensure JWT secrets are at least 32 characters
- Clear browser cookies and try again
- Check if secrets match between server restarts

### Build Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear Next.js cache: `rm -rf .next`

## 📞 Need Help?

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Review the main README.md for detailed documentation
4. Check MongoDB and AWS service status

## 🚀 Next Steps

After successful setup:

1. Explore the admin dashboard at `/admin`
2. Upload some media files at `/admin/media`
3. Create your first content at `/admin/content`
4. Customize the frontend at `/` when UI/UX is ready
5. Deploy to AWS Amplify for production

## 📝 Environment Variables Reference

| Variable              | Required | Description                           |
| --------------------- | -------- | ------------------------------------- |
| MONGODB_URI           | Yes      | MongoDB Atlas connection string       |
| JWT_ACCESS_SECRET     | Yes      | Secret for access tokens (32+ chars)  |
| JWT_REFRESH_SECRET    | Yes      | Secret for refresh tokens (32+ chars) |
| AWS_REGION            | Yes      | AWS region (e.g., us-east-1)          |
| AWS_ACCESS_KEY_ID     | Yes      | AWS IAM user access key               |
| AWS_SECRET_ACCESS_KEY | Yes      | AWS IAM user secret key               |
| AWS_S3_BUCKET_NAME    | Yes      | S3 bucket name                        |
| NEXT_PUBLIC_API_URL   | Yes      | Application URL                       |
| NODE_ENV              | Yes      | Environment (development/production)  |

---

**Ready to build something amazing! 🎉**
