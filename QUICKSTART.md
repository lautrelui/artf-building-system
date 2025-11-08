# ARTF Building System - Quick Start Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **MySQL** v8 or higher ([Download](https://dev.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))
- **DeepSeek API Key** ([Sign up](https://www.deepseek.com))

## Installation Steps

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/lautrelui/artf-building-system.git
cd artf-building-system

# Run the setup script
chmod +x setup.sh
./setup.sh
```

### Step 2: Configure Environment

Edit the `.env` file with your configuration:

```bash
nano .env  # or use your preferred editor
```

**Important settings to configure:**

```env
# Database - Update these with your MySQL credentials
DB_HOST=localhost  # Use 'mysql' for Docker
DB_USER=artf_user
DB_PASSWORD=your_secure_password  # Change this!

# DeepSeek AI - Add your API key
DEEPSEEK_API_KEY=sk-your-actual-api-key-here

# Security - Change this for production!
SESSION_SECRET=your_random_secret_here
```

### Step 3: Database Setup

#### Option A: Using MySQL Directly

```bash
# Login to MySQL
mysql -u root -p

# Create the database and user
source database/init.sql

# Exit MySQL
exit

# Load sample data (optional but recommended for testing)
mysql -u artf_user -p artf_building < database/sample-data.sql
```

#### Option B: Using Docker

```bash
# Start MySQL container
npm run docker:up

# Wait 30 seconds for MySQL to initialize, then load sample data
sleep 30
docker exec -i artf-building-mysql mysql -u artf_user -partf_password artf_building < database/sample-data.sql
```

### Step 4: Start the Application

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

#### Docker Mode (Complete Stack)

```bash
npm run docker:up
```

### Step 5: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## First Steps

### 1. Explore the Dashboard

The dashboard shows:
- Total equipment count
- Power consumption statistics
- Floor distribution
- Recent equipment additions

### 2. Browse Documentation

Click on **Documentation** to:
- View technical specifications
- Search for specific information
- Learn about NOC, Data Center, CTI, and Smart Building systems

### 3. Add Your First Equipment

1. Go to **Equipment** → **Add Equipment**
2. Fill in the details:
   - Type (Serveur, Switch, UPS, etc.)
   - Brand and Model
   - Floor and Room location
   - Power consumption
   - Supported protocols
3. Click **Add Equipment**

### 4. Try the AI Assistant

1. Navigate to **Assistant IA**
2. Ask questions like:
   - "Quelles sont les spécifications du Data Center ?"
   - "Comment fonctionne la redondance électrique ?"
   - "Quels protocoles sont supportés par le système GTB ?"

### 5. Export Your Data

Go to **Reports** and export:
- Excel file with detailed equipment inventory
- JSON format for API integration

## Sample Data

If you loaded the sample data, you'll find:
- **25+ sample equipment items** across different floors
- **Servers, Switches, UPS, PDU, CCTV cameras**
- **Climate control and IoT sensors**
- Different statuses: Operational, Installed, Planned

## Common Tasks

### Add Equipment to a Specific Floor

1. Equipment → Add Equipment
2. Select floor from dropdown:
   - `-1`: Basement
   - `0`: Ground floor
   - `3`: NOC/Data Center floor
   - `10`: Roof

### Attach Files to Equipment

1. Equipment → Files tab
2. Select equipment from dropdown
3. Choose file to upload
4. Add description (optional)
5. Click Upload

### Filter Equipment

Use the toolbar filters to view:
- Equipment by floor
- Equipment by type
- Equipment by status

### Export Filtered Data

1. Apply filters
2. Go to Reports
3. Select filters in Export section
4. Click Export Excel or Export JSON

## Troubleshooting

### Cannot Connect to Database

```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Test connection
mysql -u artf_user -p -h localhost artf_building
```

### Port 3000 Already in Use

Edit `.env` and change:
```env
PORT=3001  # or any available port
```

### DeepSeek API Not Working

The system has fallback responses if the API fails. Check:
1. API key is correct in `.env`
2. Internet connectivity
3. DeepSeek service status

### WebSocket Connection Issues

If real-time updates aren't working:
1. Check browser console for errors
2. Ensure port 3000 is accessible
3. Check firewall settings

## Security Notes

### For Production Deployment

1. **Change default passwords** in `.env`
2. **Use strong SESSION_SECRET**
3. **Enable HTTPS** using a reverse proxy (nginx/Apache)
4. **Update database credentials**
5. **Set NODE_ENV=production**
6. **Configure firewall** to restrict database access
7. **Regular backups** of database

### Copy Protection

The system includes:
- Right-click disabled on documentation
- Copy/paste prevention on sensitive text
- User selection disabled on documentation pages

Note: Input fields (forms, chat) still allow copy/paste for usability.

## Getting Help

### Log Files

Application logs are displayed in the console. For production, redirect to file:

```bash
npm start > app.log 2>&1 &
```

### Database Issues

Check database logs:
```bash
# Docker
docker logs artf-building-mysql

# System MySQL
sudo tail -f /var/log/mysql/error.log
```

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
```

## Next Steps

1. **Customize** the equipment types in `public/index.html`
2. **Add more documentation** sections in `data/document-data.js`
3. **Configure backup** schedule for database
4. **Set up monitoring** for equipment status
5. **Train users** on the system features

## Useful Commands

```bash
# View all equipment in database
mysql -u artf_user -p artf_building -e "SELECT type, brand, model, floor FROM equipment;"

# Check application status
curl http://localhost:3000/health

# Stop Docker containers
npm run docker:down

# View application logs (Docker)
docker logs artf-building-app

# Rebuild Docker containers
npm run docker:build
```

## Support

For issues or questions:
- Check the main [README.md](README.md)
- Review error messages in console
- Verify database connectivity
- Check `.env` configuration

---

**Congratulations!** You're now ready to use the ARTF Building Management System. 🎉
