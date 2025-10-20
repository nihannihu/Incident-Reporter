# 🚨 Hyperlocal Real-Time Incident Reporting Map

A powerful civic tech web application that enables users to anonymously report and track local incidents like traffic jams, road closures, waterlogging, and power outages in real-time on an interactive map.

## ✨ Features

- 🗺️ **Interactive Map**: Live map powered by Leaflet.js and Geoapify
- 📍 **Geolocation**: Automatic user location detection
- ⚡ **Real-time Updates**: Instant incident updates using Socket.IO
- 🎨 **Beautiful UI**: Modern, responsive design
- 📊 **Incident Types**: Traffic jams, road closures, waterlogging, power outages, accidents, construction, and more
- 🌤️ **Weather Integration**: Automatic weather data for each incident (optional)
- 📍 **Reverse Geocoding**: Automatic address lookup using Geoapify
- 👍 **Confirmations**: Community verification system
- 🔔 **Notifications**: Toast notifications for new incidents
- 📱 **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla JS)
- Leaflet.js for mapping
- Socket.IO Client for real-time updates
- Geoapify for maps and geocoding

### Backend
- Node.js & Express.js
- Socket.IO for WebSocket connections
- MongoDB with Mongoose (with geospatial indexing)
- Axios for API calls
- Dotenv for environment configuration

## 📦 Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies** (already done):
```bash
npm install
```

3. **Set up MongoDB**:
   
   Option A - Local MongoDB:
   - Install MongoDB from https://www.mongodb.com/try/download/community
   - Start MongoDB service
   - The app will connect to `mongodb://localhost:27017/incident-reporting`

   Option B - MongoDB Atlas (Cloud - Recommended):
   - Create a free account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Get your connection string
   - Update the `MONGODB_URI` in the `.env` file

4. **Configure Environment Variables**:
   
   Edit the `.env` file:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: Server port (default: 3001)
   - `GEOAPIFY_API_KEY`: Already configured with your key
   - `OPENWEATHER_API_KEY`: (Optional) Get free key from https://openweathermap.org/api

## 🚀 Running the Application

1. **Start the server**:
```bash
npm start
```

2. **Open your browser**:
```
http://localhost:3001
```

3. **Start reporting incidents!** 🎉

## 📖 How to Use

1. **View Incidents**: The map loads all active incidents in your area
2. **Report Incident**: 
   - Click the "Report Incident" button
   - Click on the map to select location
   - Choose incident type
   - Add description
   - Submit
3. **Confirm Incidents**: Click on any incident marker and press "Confirm" to verify
4. **My Location**: Click "My Location" button to center the map on your current position
5. **Refresh**: Click "Refresh" to reload all incidents

## 💾 Database Backup & Restore

Protect your data with automated backups to MongoDB Atlas cloud!

### Quick Start (3 minutes):

1. **Setup MongoDB Atlas** (free):
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create free cluster (M0)
   - Get connection string
   - Add to `.env` as `MONGODB_ATLAS_URI`

2. **Backup to Cloud**:
```bash
npm run backup:atlas
```

3. **Automated Daily Backups**:
```bash
npm run backup:scheduler
```

### All Backup Commands:

```bash
# Backup
npm run backup              # Local file backup
npm run backup:atlas        # Cloud backup to Atlas
npm run backup:list         # List all backups

# Restore
npm run restore             # Restore from local backup
npm run restore:atlas       # Restore from Atlas cloud

# Automated
npm run backup:scheduler    # Run automated backups (24/7)
```

### 📚 Complete Documentation:
- **[BACKUP_QUICK_START.md](./BACKUP_QUICK_START.md)** - 3-minute setup
- **[BACKUP_COMMANDS.md](./BACKUP_COMMANDS.md)** - Command cheat sheet
- **[BACKUP_GUIDE.md](./BACKUP_GUIDE.md)** - Full documentation
- **[TEST_BACKUP.md](./TEST_BACKUP.md)** - Testing procedures

## 🎯 API Endpoints

- `GET /api/incidents` - Fetch all active incidents
- `POST /api/incidents` - Create new incident
- `POST /api/incidents/:id/confirm` - Confirm an incident
- `DELETE /api/incidents/:id` - Mark incident as inactive

## 🔄 Real-time Events

- `new-incident` - Emitted when a new incident is reported
- `incident-confirmed` - Emitted when an incident is confirmed
- `incident-removed` - Emitted when an incident is removed

## 📁 Project Structure

```
reporting-map/
├── models/
│   └── Incident.js          # Mongoose schema with GeoJSON
├── routes/
│   └── incidents.js         # API route handlers
├── public/
│   ├── index.html           # Frontend HTML
│   ├── style.css            # Styling
│   └── script.js            # Frontend JavaScript
├── .env                     # Environment variables
├── server.js                # Express server with Socket.IO
├── package.json             # Dependencies
└── README.md                # This file
```

## 🎨 Incident Types

- 🚗 Traffic Jam
- 🚧 Road Closure
- 💧 Waterlogging
- ⚡ Power Outage
- 🚑 Accident
- 🏗️ Construction
- 📝 Other

## 🔧 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running locally, or
- Use MongoDB Atlas cloud database (free tier available)
- Check your connection string in `.env`

### Port Already in Use
- The app uses port 3001 by default
- Change the PORT in `.env` to use a different port

### Geolocation Not Working
- Make sure you're using HTTPS or localhost
- Allow location permissions in your browser

### Weather Data Not Showing
- Sign up for a free OpenWeatherMap API key
- Add it to your `.env` file

## 🏆 Hackathon Tips

1. **Demo Flow**:
   - Show the live map
   - Report an incident on one device
   - Show it appearing in real-time on another device
   - Demonstrate the confirmation feature

2. **Talking Points**:
   - Solves real community problems
   - Full-stack implementation
   - Real-time WebSocket communication
   - Geospatial database queries
   - Mobile-responsive design

3. **Extensions** (if you have time):
   - Add user authentication
   - Implement incident categories filtering
   - Add heatmap visualization
   - Push notifications
   - Admin dashboard

## 📝 License

MIT License - Feel free to use this project for your hackathon!

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

---

**Built with ❤️ for making communities safer and more connected**

Good luck with your hackathon! 🚀
