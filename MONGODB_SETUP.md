# MongoDB Atlas Setup Guide

If you don't have MongoDB installed locally, follow these steps to set up a FREE cloud database with MongoDB Atlas:

## Steps:

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas/register
- Sign up for a free account (no credit card required)

### 2. Create a New Cluster
- Click "Build a Database"
- Choose the **FREE** tier (M0 Sandbox)
- Select a cloud provider and region closest to you
- Click "Create Cluster"

### 3. Set Up Database Access
- In the left sidebar, click "Database Access"
- Click "Add New Database User"
- Choose "Password" authentication
- Create a username and password (save these!)
- Set privileges to "Atlas Admin"
- Click "Add User"

### 4. Set Up Network Access
- In the left sidebar, click "Network Access"
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Or add your current IP address
- Click "Confirm"

### 5. Get Your Connection String
- Go back to "Database" in the sidebar
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)

### 6. Update Your .env File
Replace the MONGODB_URI in your `.env` file:

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/incident-reporting?retryWrites=true&w=majority
```

**Important**: Replace:
- `YOUR_USERNAME` with your database username
- `YOUR_PASSWORD` with your database password
- The cluster URL with your actual cluster URL

### 7. Restart Your Server
Stop the server (Ctrl+C) and run:
```bash
npm start
```

## Example Connection String:
```
MONGODB_URI=mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/incident-reporting?retryWrites=true&w=majority
```

## Troubleshooting:

### "Authentication failed"
- Double-check your username and password
- Make sure you replaced `<password>` with your actual password (no angle brackets!)

### "Connection timeout"
- Check that you added your IP address in Network Access
- Try "Allow Access from Anywhere" temporarily

### "Database not connecting"
- Make sure you have internet connection
- Verify the connection string format is correct
- Check for any extra spaces in the .env file

---

**Note**: The free tier gives you:
- 512 MB storage
- Shared RAM
- Perfect for development and hackathons!
