<<<<<<< HEAD
# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 🗄️ Database Issues

#### Issue: "MongoDB connection error"
**Symptoms**: Server starts but shows MongoDB connection error in console

**Solutions**:
1. **Check if MongoDB is running locally**:
   ```bash
   # Windows - check if service is running
   sc query MongoDB
   
   # If not running, start it
   net start MongoDB
   ```

2. **Use MongoDB Atlas instead** (Recommended):
   - Follow instructions in `MONGODB_SETUP.md`
   - Update `.env` with your Atlas connection string
   - Restart the server

3. **Check connection string**:
   - Open `.env` file
   - Verify `MONGODB_URI` is correct
   - Make sure no extra spaces or quotes
   - For Atlas, ensure password doesn't have special characters (or encode them)

4. **Firewall/Network**:
   - Check if firewall is blocking port 27017
   - For Atlas, verify IP whitelist in Network Access

---

### 🗺️ Map Issues

#### Issue: Map doesn't load or shows blank tiles
**Symptoms**: Gray screen instead of map, or broken tile images

**Solutions**:
1. **Check Geoapify API Key**:
   ```javascript
   // In .env file
   GEOAPIFY_API_KEY=f9fc4de949a14c169c5b721995c17b54
   ```
   - Verify the key is correct
   - Check if API quota is exceeded at https://myprojects.geoapify.com

2. **Check browser console**:
   - Press F12 to open DevTools
   - Look for CORS or network errors
   - Check if tile URLs are loading

3. **Internet connection**:
   - Map tiles require internet
   - Check your connection
   - Try refreshing the page

#### Issue: "Cannot read property 'coordinates' of undefined"
**Symptoms**: Error when clicking on incidents

**Solutions**:
1. Database schema mismatch - run this to check:
   ```bash
   # Connect to MongoDB
   mongosh incident-reporting
   
   # Check incident structure
   db.incidents.findOne()
   ```

2. Clear the database and restart:
   ```bash
   # In MongoDB shell
   db.incidents.deleteMany({})
   ```

---

### 🔌 Real-time Issues

#### Issue: Incidents don't appear in real-time
**Symptoms**: Need to refresh to see new incidents

**Solutions**:
1. **Check Socket.IO connection**:
   - Open browser console (F12)
   - Look for "Connected to server" message
   - If missing, check server is running

2. **Check server logs**:
   - Should see "New client connected" messages
   - If not, Socket.IO isn't initializing

3. **Port conflict**:
   - Make sure port 3001 isn't blocked
   - Try changing port in `.env`:
     ```
     PORT=3002
     ```

4. **Browser extensions**:
   - Disable ad blockers (they sometimes block WebSockets)
   - Try incognito/private mode

#### Issue: "Socket.IO handshake failed"
**Symptoms**: Console shows WebSocket connection errors

**Solutions**:
1. Clear browser cache
2. Check CORS settings in `server.js`
3. Ensure you're accessing via `http://localhost:3001` (not IP address)

---

### 📍 Geolocation Issues

#### Issue: "My Location" button doesn't work
**Symptoms**: Button clicks but nothing happens, or error message

**Solutions**:
1. **Check browser permissions**:
   - Click the lock icon in address bar
   - Ensure "Location" is set to "Allow"

2. **HTTPS requirement**:
   - Geolocation only works on HTTPS or localhost
   - If using IP address, switch to `localhost`

3. **Browser compatibility**:
   - Use modern browsers (Chrome, Edge, Firefox)
   - Safari sometimes has stricter permissions

4. **Timeout**:
   - If location takes too long, may timeout
   - Try again with better GPS/WiFi signal

---

### 📝 Form Issues

#### Issue: Can't submit incident report
**Symptoms**: Form doesn't submit, validation errors

**Solutions**:
1. **Location not selected**:
   - You MUST click on the map to select location
   - Look for "Location selected!" toast message
   - Temporary marker should appear on map

2. **Missing required fields**:
   - Incident type is required (select from dropdown)
   - Description is required (type something)
   - Both must be filled

3. **Check console errors**:
   - F12 → Console tab
   - Look for JavaScript errors
   - May indicate API issues

#### Issue: Address shows as "Unknown location"
**Symptoms**: Reports show "Unknown location" instead of address

**Solutions**:
1. **Geoapify API issue**:
   - Check API key is correct
   - Verify API quota not exceeded
   - Check internet connection

2. **Invalid coordinates**:
   - Make sure you clicked on actual land (not ocean!)
   - Reverse geocoding works better in populated areas

---

### 🌦️ Weather Issues

#### Issue: Weather data not showing
**Symptoms**: No temperature or weather condition in incident popups

**Solutions**:
1. **This is OPTIONAL** - app works without it
2. **To enable**:
   - Sign up at https://openweathermap.org/api
   - Get free API key
   - Add to `.env`:
     ```
     OPENWEATHER_API_KEY=your_key_here
     ```
   - Restart server

3. **If configured but not working**:
   - Check API key is correct
   - Verify free tier quota not exceeded (60 calls/minute)
   - Check server logs for weather API errors

---

### 🚀 Server Issues

#### Issue: "Port 3001 already in use"
**Symptoms**: Server won't start, says port is in use

**Solutions**:
1. **Change port in `.env`**:
   ```
   PORT=3002
   ```

2. **Kill process using port 3001**:
   ```bash
   # Windows PowerShell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
   
   # Or use Task Manager:
   # Ctrl+Shift+Esc → Find Node.js → End Task
   ```

3. **Use different port entirely**:
   - Try 8080, 3002, 4000, etc.
   - Update `.env` and restart

#### Issue: Server crashes on startup
**Symptoms**: Server starts then immediately exits

**Solutions**:
1. **Check Node.js version**:
   ```bash
   node --version
   # Should be v14+ (recommend v18+)
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check for syntax errors**:
   ```bash
   node -c server.js
   ```

---

### 🎨 UI Issues

#### Issue: Styles not loading
**Symptoms**: Page looks unstyled, plain HTML

**Solutions**:
1. **Check file paths**:
   - Verify `public/style.css` exists
   - Check browser console for 404 errors

2. **Server static files**:
   - Ensure `app.use(express.static('public'))` in server.js
   - Restart server

3. **Browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear cache in DevTools

#### Issue: Icons not showing (Font Awesome)
**Symptoms**: Boxes or missing icons

**Solutions**:
1. **Check CDN connection**:
   - Verify internet connection
   - Font Awesome CDN may be down (rare)

2. **Load from different CDN**:
   ```html
   <!-- In index.html, replace Font Awesome link with: -->
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
   ```

---

### 🔍 Debugging Tips

#### Check Server Logs
Always monitor the terminal where server is running:
```bash
npm start
# Watch for errors, warnings, or connection messages
```

#### Check Browser Console
Press F12 and look for:
- Red errors
- Network tab for failed requests
- Console tab for JavaScript errors
- Application tab for Socket.IO status

#### Test API Endpoints Manually
Use PowerShell or browser:
```bash
# Test GET incidents
curl http://localhost:3001/api/incidents

# Test POST incident (create test.json file first)
curl -X POST http://localhost:3001/api/incidents -H "Content-Type: application/json" -d '{\"latitude\":28.6139,\"longitude\":77.2090,\"incidentType\":\"traffic_jam\",\"description\":\"Test\"}'
```

#### Check Database
Connect to MongoDB to verify data:
```bash
# Start MongoDB shell
mongosh incident-reporting

# View all incidents
db.incidents.find()

# Count incidents
db.incidents.countDocuments()

# Check indexes
db.incidents.getIndexes()
```

---

### 🆘 Still Having Issues?

1. **Check all files exist**:
   ```
   ├── models/Incident.js
   ├── routes/incidents.js
   ├── public/
   │   ├── index.html
   │   ├── style.css
   │   └── script.js
   ├── .env
   ├── server.js
   └── package.json
   ```

2. **Verify .env configuration**:
   ```
   MONGODB_URI=mongodb://localhost:27017/incident-reporting
   PORT=3001
   GEOAPIFY_API_KEY=f9fc4de949a14c169c5b721995c17b54
   OPENWEATHER_API_KEY=your_key_here  # Optional
   ```

3. **Restart everything**:
   ```bash
   # Stop server (Ctrl+C)
   # Clear node cache
   npm cache clean --force
   # Reinstall
   npm install
   # Restart
   npm start
   ```

4. **Check system requirements**:
   - Node.js v14+ installed
   - MongoDB running (local or Atlas)
   - Modern browser (Chrome, Edge, Firefox)
   - Internet connection for CDNs and APIs

---

### 📞 Quick Diagnostics Checklist

Run through this checklist:
- [ ] Node.js installed: `node --version`
- [ ] Dependencies installed: `npm install` completed
- [ ] MongoDB running: Check service or Atlas connection
- [ ] Port available: 3001 not in use
- [ ] .env file exists and configured
- [ ] Geoapify API key valid
- [ ] Server starts without errors: `npm start`
- [ ] Browser can access: http://localhost:3001
- [ ] Map loads on page
- [ ] Console shows no errors (F12)
- [ ] Socket.IO connects: "Connected to server" in console

If all checked ✅, app should work perfectly!

---

**Remember**: Most issues are configuration or connection related. Check logs, check console, check connections! 🔍
=======
# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 🗄️ Database Issues

#### Issue: "MongoDB connection error"
**Symptoms**: Server starts but shows MongoDB connection error in console

**Solutions**:
1. **Check if MongoDB is running locally**:
   ```bash
   # Windows - check if service is running
   sc query MongoDB
   
   # If not running, start it
   net start MongoDB
   ```

2. **Use MongoDB Atlas instead** (Recommended):
   - Follow instructions in `MONGODB_SETUP.md`
   - Update `.env` with your Atlas connection string
   - Restart the server

3. **Check connection string**:
   - Open `.env` file
   - Verify `MONGODB_URI` is correct
   - Make sure no extra spaces or quotes
   - For Atlas, ensure password doesn't have special characters (or encode them)

4. **Firewall/Network**:
   - Check if firewall is blocking port 27017
   - For Atlas, verify IP whitelist in Network Access

---

### 🗺️ Map Issues

#### Issue: Map doesn't load or shows blank tiles
**Symptoms**: Gray screen instead of map, or broken tile images

**Solutions**:
1. **Check Geoapify API Key**:
   ```javascript
   // In .env file
   GEOAPIFY_API_KEY=f9fc4de949a14c169c5b721995c17b54
   ```
   - Verify the key is correct
   - Check if API quota is exceeded at https://myprojects.geoapify.com

2. **Check browser console**:
   - Press F12 to open DevTools
   - Look for CORS or network errors
   - Check if tile URLs are loading

3. **Internet connection**:
   - Map tiles require internet
   - Check your connection
   - Try refreshing the page

#### Issue: "Cannot read property 'coordinates' of undefined"
**Symptoms**: Error when clicking on incidents

**Solutions**:
1. Database schema mismatch - run this to check:
   ```bash
   # Connect to MongoDB
   mongosh incident-reporting
   
   # Check incident structure
   db.incidents.findOne()
   ```

2. Clear the database and restart:
   ```bash
   # In MongoDB shell
   db.incidents.deleteMany({})
   ```

---

### 🔌 Real-time Issues

#### Issue: Incidents don't appear in real-time
**Symptoms**: Need to refresh to see new incidents

**Solutions**:
1. **Check Socket.IO connection**:
   - Open browser console (F12)
   - Look for "Connected to server" message
   - If missing, check server is running

2. **Check server logs**:
   - Should see "New client connected" messages
   - If not, Socket.IO isn't initializing

3. **Port conflict**:
   - Make sure port 3001 isn't blocked
   - Try changing port in `.env`:
     ```
     PORT=3002
     ```

4. **Browser extensions**:
   - Disable ad blockers (they sometimes block WebSockets)
   - Try incognito/private mode

#### Issue: "Socket.IO handshake failed"
**Symptoms**: Console shows WebSocket connection errors

**Solutions**:
1. Clear browser cache
2. Check CORS settings in `server.js`
3. Ensure you're accessing via `http://localhost:3001` (not IP address)

---

### 📍 Geolocation Issues

#### Issue: "My Location" button doesn't work
**Symptoms**: Button clicks but nothing happens, or error message

**Solutions**:
1. **Check browser permissions**:
   - Click the lock icon in address bar
   - Ensure "Location" is set to "Allow"

2. **HTTPS requirement**:
   - Geolocation only works on HTTPS or localhost
   - If using IP address, switch to `localhost`

3. **Browser compatibility**:
   - Use modern browsers (Chrome, Edge, Firefox)
   - Safari sometimes has stricter permissions

4. **Timeout**:
   - If location takes too long, may timeout
   - Try again with better GPS/WiFi signal

---

### 📝 Form Issues

#### Issue: Can't submit incident report
**Symptoms**: Form doesn't submit, validation errors

**Solutions**:
1. **Location not selected**:
   - You MUST click on the map to select location
   - Look for "Location selected!" toast message
   - Temporary marker should appear on map

2. **Missing required fields**:
   - Incident type is required (select from dropdown)
   - Description is required (type something)
   - Both must be filled

3. **Check console errors**:
   - F12 → Console tab
   - Look for JavaScript errors
   - May indicate API issues

#### Issue: Address shows as "Unknown location"
**Symptoms**: Reports show "Unknown location" instead of address

**Solutions**:
1. **Geoapify API issue**:
   - Check API key is correct
   - Verify API quota not exceeded
   - Check internet connection

2. **Invalid coordinates**:
   - Make sure you clicked on actual land (not ocean!)
   - Reverse geocoding works better in populated areas

---

### 🌦️ Weather Issues

#### Issue: Weather data not showing
**Symptoms**: No temperature or weather condition in incident popups

**Solutions**:
1. **This is OPTIONAL** - app works without it
2. **To enable**:
   - Sign up at https://openweathermap.org/api
   - Get free API key
   - Add to `.env`:
     ```
     OPENWEATHER_API_KEY=your_key_here
     ```
   - Restart server

3. **If configured but not working**:
   - Check API key is correct
   - Verify free tier quota not exceeded (60 calls/minute)
   - Check server logs for weather API errors

---

### 🚀 Server Issues

#### Issue: "Port 3001 already in use"
**Symptoms**: Server won't start, says port is in use

**Solutions**:
1. **Change port in `.env`**:
   ```
   PORT=3002
   ```

2. **Kill process using port 3001**:
   ```bash
   # Windows PowerShell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
   
   # Or use Task Manager:
   # Ctrl+Shift+Esc → Find Node.js → End Task
   ```

3. **Use different port entirely**:
   - Try 8080, 3002, 4000, etc.
   - Update `.env` and restart

#### Issue: Server crashes on startup
**Symptoms**: Server starts then immediately exits

**Solutions**:
1. **Check Node.js version**:
   ```bash
   node --version
   # Should be v14+ (recommend v18+)
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check for syntax errors**:
   ```bash
   node -c server.js
   ```

---

### 🎨 UI Issues

#### Issue: Styles not loading
**Symptoms**: Page looks unstyled, plain HTML

**Solutions**:
1. **Check file paths**:
   - Verify `public/style.css` exists
   - Check browser console for 404 errors

2. **Server static files**:
   - Ensure `app.use(express.static('public'))` in server.js
   - Restart server

3. **Browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear cache in DevTools

#### Issue: Icons not showing (Font Awesome)
**Symptoms**: Boxes or missing icons

**Solutions**:
1. **Check CDN connection**:
   - Verify internet connection
   - Font Awesome CDN may be down (rare)

2. **Load from different CDN**:
   ```html
   <!-- In index.html, replace Font Awesome link with: -->
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
   ```

---

### 🔍 Debugging Tips

#### Check Server Logs
Always monitor the terminal where server is running:
```bash
npm start
# Watch for errors, warnings, or connection messages
```

#### Check Browser Console
Press F12 and look for:
- Red errors
- Network tab for failed requests
- Console tab for JavaScript errors
- Application tab for Socket.IO status

#### Test API Endpoints Manually
Use PowerShell or browser:
```bash
# Test GET incidents
curl http://localhost:3001/api/incidents

# Test POST incident (create test.json file first)
curl -X POST http://localhost:3001/api/incidents -H "Content-Type: application/json" -d '{\"latitude\":28.6139,\"longitude\":77.2090,\"incidentType\":\"traffic_jam\",\"description\":\"Test\"}'
```

#### Check Database
Connect to MongoDB to verify data:
```bash
# Start MongoDB shell
mongosh incident-reporting

# View all incidents
db.incidents.find()

# Count incidents
db.incidents.countDocuments()

# Check indexes
db.incidents.getIndexes()
```

---

### 🆘 Still Having Issues?

1. **Check all files exist**:
   ```
   ├── models/Incident.js
   ├── routes/incidents.js
   ├── public/
   │   ├── index.html
   │   ├── style.css
   │   └── script.js
   ├── .env
   ├── server.js
   └── package.json
   ```

2. **Verify .env configuration**:
   ```
   MONGODB_URI=mongodb://localhost:27017/incident-reporting
   PORT=3001
   GEOAPIFY_API_KEY=f9fc4de949a14c169c5b721995c17b54
   OPENWEATHER_API_KEY=your_key_here  # Optional
   ```

3. **Restart everything**:
   ```bash
   # Stop server (Ctrl+C)
   # Clear node cache
   npm cache clean --force
   # Reinstall
   npm install
   # Restart
   npm start
   ```

4. **Check system requirements**:
   - Node.js v14+ installed
   - MongoDB running (local or Atlas)
   - Modern browser (Chrome, Edge, Firefox)
   - Internet connection for CDNs and APIs

---

### 📞 Quick Diagnostics Checklist

Run through this checklist:
- [ ] Node.js installed: `node --version`
- [ ] Dependencies installed: `npm install` completed
- [ ] MongoDB running: Check service or Atlas connection
- [ ] Port available: 3001 not in use
- [ ] .env file exists and configured
- [ ] Geoapify API key valid
- [ ] Server starts without errors: `npm start`
- [ ] Browser can access: http://localhost:3001
- [ ] Map loads on page
- [ ] Console shows no errors (F12)
- [ ] Socket.IO connects: "Connected to server" in console

If all checked ✅, app should work perfectly!

---

**Remember**: Most issues are configuration or connection related. Check logs, check console, check connections! 🔍
>>>>>>> 3594f9b0a4c1213d5d284c22708b57a3782e9956
