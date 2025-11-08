# ARTF Building Management System

A comprehensive web-based system for managing intelligent building infrastructure, equipment, and documentation for the ARTF (Autorité de Régulation des Transferts de Fonds du Congo) building project.

## Features

### 1. Documentation Management
- Structured technical documentation with collapsible sections
- Searchable content for quick reference
- PDF-based information presentation
- Copy-protection to secure sensitive technical data

### 2. Equipment Planning & Management
- Floor-by-floor equipment inventory
- Detailed equipment specifications tracking:
  - Type, Brand, Model, Serial Number
  - Power consumption and voltage
  - Floor and room location
  - Supported protocols (SNMP, MODBUS, BACnet, KNX, MQTT, ONVIF)
  - Installation dates and warranty information
  - Operational status tracking

### 3. AI-Powered Technical Assistant
- Integration with DeepSeek AI
- Context-aware responses about building infrastructure
- Specialized knowledge about:
  - NOC (Network Operations Center)
  - Data Center operations
  - CTI (Centre de Traitement et d'Intégration)
  - Smart Building systems
  - Energy management
  - Network architecture

### 4. Real-Time Collaboration
- WebSocket-based live updates
- Multi-user synchronization
- Instant equipment status changes

### 5. File Management
- Upload and attach documents to equipment
- Support for multiple file types
- Organized file storage per equipment

### 6. Reporting & Analytics
- Excel export functionality
- JSON data export
- Floor-by-floor equipment distribution
- Power consumption analytics
- Visual dashboards and statistics

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Real-time:** Socket.IO
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **AI Integration:** DeepSeek API
- **File Handling:** Multer
- **Export:** ExcelJS

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- Docker & Docker Compose (optional)

### Option 1: Manual Setup

1. Clone the repository:
```bash
git clone https://github.com/lautrelui/artf-building-system.git
cd artf-building-system
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
- Database credentials
- DeepSeek API key
- Session secret

4. Initialize the database:
```bash
mysql -u root -p < database/init.sql
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Option 2: Docker Setup

1. Build and start containers:
```bash
npm run docker:up
```

2. Stop containers:
```bash
npm run docker:down
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=mysql
DB_PORT=3306
DB_USER=artf_user
DB_PASSWORD=your_password
DB_NAME=artf_building

# Security
SESSION_SECRET=your_session_secret

# AI Integration
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### DeepSeek API Setup

1. Sign up at [DeepSeek](https://www.deepseek.com)
2. Obtain your API key
3. Add the key to your `.env` file

## Usage

### Accessing the Application

Navigate to `http://localhost:3000` in your web browser.

### Main Sections

1. **Dashboard** - Overview of the system with statistics and recent activity
2. **Documentation** - Technical documentation organized by categories
3. **Equipment** - Manage building equipment inventory
4. **Assistant IA** - Ask questions about the building infrastructure
5. **Reports** - Generate and export data

### Adding Equipment

1. Navigate to Equipment > Add Equipment tab
2. Fill in the required fields:
   - Equipment type
   - Brand and model
   - Floor and room location
   - Power consumption
   - Supported protocols
3. Click "Ajouter l'Équipement"

### Using the AI Assistant

1. Navigate to the Assistant section
2. Type your question in the chat input
3. The AI will provide context-aware answers about the ARTF building infrastructure

### Exporting Data

1. Go to Reports section
2. Select export format (Excel or JSON)
3. Apply filters if needed
4. Click the export button

## Security Features

- Copy/paste protection on documentation
- Session-based authentication
- Input validation and sanitization
- Helmet.js for HTTP security headers
- CORS configuration
- SQL injection prevention through parameterized queries

## Database Schema

### Equipment Table
- `id` (UUID) - Primary key
- `type` - Equipment type
- `brand` - Manufacturer
- `model` - Model number
- `serial_number` - Serial number
- `floor` - Floor number
- `room` - Room/location identifier
- `power_consumption` - Power usage in Watts
- `voltage` - Operating voltage
- `connectivity` - Network connectivity info
- `protocols` - Supported protocols (JSON)
- `installation_date` - Installation date
- `warranty_until` - Warranty expiration
- `status` - Operational status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Files Table
- `id` (UUID) - Primary key
- `equipment_id` - Foreign key to equipment
- `original_name` - Original filename
- `stored_name` - Stored filename
- `file_path` - Storage path
- `file_size` - File size in bytes
- `mime_type` - MIME type
- `description` - File description
- `uploaded_at` - Upload timestamp

## API Endpoints

### Equipment
- `GET /api/equipment/list` - Get all equipment
- `POST /api/equipment/add` - Add new equipment
- `PUT /api/equipment/update/:id` - Update equipment
- `DELETE /api/equipment/delete/:id` - Delete equipment
- `GET /api/equipment/count` - Get equipment count
- `GET /api/equipment/floors/summary` - Get floor summary

### Documentation
- `GET /api/document/sections` - Get all sections
- `GET /api/document/section/:id` - Get specific section
- `GET /api/document/search?q=query` - Search documentation

### Chat/AI
- `POST /api/chat/ask` - Ask AI assistant a question

### File Upload
- `POST /api/upload/equipment/:id` - Upload file for equipment
- `GET /api/upload/equipment/:id` - Get files for equipment
- `DELETE /api/upload/delete/:id` - Delete file
- `GET /api/upload/download/:id` - Download file

### Export
- `GET /api/export/equipment/excel` - Export to Excel
- `GET /api/export/equipment/json` - Export to JSON

## Development

### Project Structure
```
artf-building-system/
├── config/           # Configuration files
├── data/            # Data files (document content)
├── database/        # Database initialization scripts
├── middleware/      # Express middleware
├── models/          # Database models
├── public/          # Static files
│   ├── css/        # Stylesheets
│   └── js/         # Client-side JavaScript
├── routes/          # API routes
├── uploads/         # File uploads (gitignored)
├── .env             # Environment variables (gitignored)
├── .gitignore       # Git ignore file
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
└── server.js        # Main application file
```

### Running Tests

```bash
npm test
```

### Building for Production

1. Set `NODE_ENV=production` in `.env`
2. Ensure all security credentials are properly set
3. Run: `npm start`

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists and user has proper permissions

### DeepSeek API Issues
- Verify API key is correct
- Check internet connectivity
- The system has fallback responses if API is unavailable

### File Upload Issues
- Check `uploads/` directory exists and has write permissions
- Verify `MAX_FILE_SIZE` setting in `.env`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Proprietary - ARTF (Autorité de Régulation des Transferts de Fonds du Congo)

## Support

For technical support or questions, please contact the system administrator.

## Changelog

### Version 1.0.0
- Initial release
- Equipment management system
- Documentation viewer
- AI assistant integration
- Real-time updates via WebSocket
- Export functionality (Excel, JSON)
- File management system

## Acknowledgments

- Built for ARTF (Autorité de Régulation des Transferts de Fonds du Congo)
- Technical specifications based on ARTF technical report
- AI integration powered by DeepSeek
