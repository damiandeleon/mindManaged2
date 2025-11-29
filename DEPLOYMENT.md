# Deployment Guide

## Server Deployment (Heroku)

### Your server is already deployed at:

**URL:** https://mind-managed2-6fd05c1cf98f.herokuapp.com

### To update the server:

```bash
# From project root
git subtree split --prefix server -b heroku-server
git push heroku heroku-server:main --force
git branch -D heroku-server
```

### Environment Variables on Heroku:

Make sure these are set in Heroku dashboard:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `NODE_ENV` - production
- `CORS_ORIGIN` - Your Amplify frontend URL (add after Amplify deployment)

---

## Client Deployment (AWS Amplify)

### Step 1: Go to AWS Amplify Console

1. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"

### Step 2: Connect Repository

1. Choose "GitHub" as source
2. Authenticate with GitHub
3. Select repository: `damiandeleon/mindManaged2`
4. Select branch: `main`

### Step 3: Configure Build Settings

The build will automatically detect the `amplify.yml` file.

Verify it shows:

- **Build command:** `npm run build`
- **Base directory:** `client`
- **Output directory:** `client/build`

### Step 4: Add Environment Variables

In Amplify Console → Environment variables, add:

- `REACT_APP_API_URL` = `https://mind-managed2-6fd05c1cf98f.herokuapp.com`

### Step 5: Deploy

1. Click "Save and deploy"
2. Wait for build to complete (5-10 minutes)
3. You'll get a URL like: `https://main.xxxxxx.amplifyapp.com`

### Step 6: Update Heroku CORS

Once you have your Amplify URL:

1. Go to Heroku dashboard
2. Settings → Config Vars
3. Update `CORS_ORIGIN` to your Amplify URL

---

## Post-Deployment

### Update Backend CORS (server/server.js is already configured)

The server uses `process.env.CORS_ORIGIN` which you set in Heroku config vars.

### Test the Application

1. Visit your Amplify URL
2. Register a new account
3. Test all features:
   - Task management
   - Journal entries
   - Mood check-ins
   - Medication lookup

---

## Continuous Deployment

### Automatic Deployments:

- **Client (Amplify):** Automatically deploys when you push to `main` branch
- **Server (Heroku):** Run the deployment command manually or set up GitHub Actions

### Manual Updates:

```bash
# Update client - just push to GitHub
git add .
git commit -m "Update message"
git push origin main

# Update server
git subtree split --prefix server -b heroku-server
git push heroku heroku-server:main --force
git branch -D heroku-server
```

---

## Monitoring

### Check Server Logs:

```bash
heroku logs --tail -a mind-managed2
```

### Check Client Logs:

AWS Amplify Console → Your App → Deployment details

---

## Troubleshooting

### If client can't connect to server:

1. Check CORS_ORIGIN is set correctly in Heroku
2. Verify REACT_APP_API_URL in Amplify environment variables
3. Check network tab in browser DevTools

### If server has errors:

```bash
heroku logs --tail -a mind-managed2
```

### If MongoDB connection fails:

1. Check MONGODB_URI in Heroku config vars
2. Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
