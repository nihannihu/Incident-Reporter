# Hyperlocal Real-Time Incident Reporting Map

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14.x%20or%20later-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20or%20Local-blue)](https://www.mongodb.com/)

A powerful civic tech web application that enables users to anonymously report and track local incidents like traffic jams, road closures, waterlogging, and power outages in real-time on an interactive map.

## 🔍 Overview

The Hyperlocal Incident Reporter is a real-time community safety platform that empowers citizens to share and receive immediate updates about local incidents. Built with modern web technologies, this application provides a seamless experience for reporting and tracking various types of incidents in your neighborhood.

## ✨ Key Features

- 🗺️ **Interactive Map**: Live map powered by Leaflet.js and Geoapify
- 📍 **Geolocation**: Automatic user location detection
- ⚡ **Real-time Updates**: Instant incident updates using Socket.IO WebSocket technology
- 🎨 **Beautiful UI**: Modern, responsive design that works on all devices
- 📊 **Incident Types**: Traffic jams, road closures, waterlogging, power outages, accidents, construction, and more
- 🌤️ **Weather Integration**: Automatic weather data for each incident (optional)
- 📍 **Reverse Geocoding**: Automatic address lookup using Geoapify
- 👍 **Confirmations**: Community verification system to validate reports
- 🔔 **Notifications**: Toast notifications for new incidents
- 📱 **Mobile Responsive**: Fully responsive design for mobile and desktop

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla JS)
- Leaflet.js for interactive mapping
- Socket.IO Client for real-time updates
- Geoapify for maps and geocoding services

### Backend
- Node.js & Express.js framework
- Socket.IO for WebSocket connections
- MongoDB with Mongoose (with geospatial indexing)
- Axios for external API calls
- Dotenv for environment configuration

## 🚀 Quick Start

1. **Clone the repository**:
```bash
git clone https://github.com/nihannihu/Incident-Reporter.git
cd Incident-Reporter
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Set your `GEOAPIFY_API_KEY` (get one from [Geoapify](https://www.geoapify.com/))

4. **Start the application**:
```bash
npm start
```

5. **Open your browser**:
```
http://localhost:3001
```

## 📖 How to Use

1. **View Incidents**: The map automatically loads all active incidents in your area
2. **Report Incident**: 
   - Click the "Report Incident" button
   - Click on the map to select location
   - Choose incident type from the dropdown
   - Add a detailed description
   - Submit your report
3. **Confirm Incidents**: Click on any incident marker and press "Confirm" to verify its validity
4. **My Location**: Click "My Location" button to center the map on your current position
5. **Refresh**: Click "Refresh" to reload all incidents

## 💾 Database Backup & Restore

Protect your data with automated backups to MongoDB Atlas cloud!

### Quick Setup (3 minutes):

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
incident-reporter/
├── models/
│   └── Incident.js          # Mongoose schema with GeoJSON support
├── routes/
│   └── incidents.js         # REST API route handlers
├── public/
│   ├── index.html           # Frontend HTML
│   ├── style.css            # Styling
│   └── script.js            # Frontend JavaScript
├── .env                     # Environment variables
├── server.js                # Express server with Socket.IO
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## 🎨 Supported Incident Types

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
- Sign up for a free OpenWeatherMap API key at https://openweathermap.org/api
- Add it to your `.env` file as `OPENWEATHER_API_KEY`

## 🏆 Use Cases

1. **Community Safety**: Residents can report and track local incidents
2. **Traffic Management**: Commuters can avoid traffic jams and road closures
3. **Emergency Response**: First responders can get real-time incident data
4. **City Planning**: Municipalities can analyze incident patterns
5. **Neighborhood Watch**: Community groups can coordinate safety efforts

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Smartphones (iOS and Android)
- Tablets
- Desktop computers
- Laptops

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 🙋‍♂️ Author

**Nihan** - [nihannihu](https://github.com/nihannihu)

## 🙏 Acknowledgments

- Thanks to [Geoapify](https://www.geoapify.com/) for providing map services
- Thanks to the open-source community for the amazing tools and libraries

---

**Built with ❤️ for making communities safer and more connected**

[Report an Issue](https://github.com/nihannihu/Incident-Reporter/issues) · [Request a Feature](https://github.com/nihannihu/Incident-Reporter/issues)