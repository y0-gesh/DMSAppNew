# DMS App - Document Management System

A comprehensive mobile application built with React Native and Expo for managing, organizing, and searching documents with advanced categorization and tagging capabilities.

## 📱 Overview

DMS App is a cross-platform document management solution that allows users to:
- **Upload** documents with detailed metadata and categorization
- **Search** through documents using multiple criteria
- **Organize** documents with hierarchical classification and tags
- **Secure** access with OTP-based authentication
- **Preview** and download documents
- **Export** multiple documents as ZIP files

## 🚀 Features

### 🔐 Authentication
- **OTP-based Login**: Secure mobile number verification with one-time password
- **Token Management**: JWT-based session management with secure storage
- **Auto-login**: Persistent authentication across app sessions

### 📤 Document Upload
- **File Selection**: Choose from device storage or capture photos
- **Metadata Management**: 
  - Major categories (Personal/Professional)
  - Minor subcategories (John, Tom, Emily for Personal; Accounts, HR, IT, Finance for Professional)
  - Document date selection
  - Custom remarks
  - Tag-based organization
- **Supported Formats**: Images (JPG, PNG, GIF) and PDFs
- **Smart Tagging**: Auto-suggestions based on existing tags

### 🔍 Advanced Search
- **Multi-criteria Search**:
  - Major and minor category filters
  - Date range selection (from/to)
  - Tag-based filtering
- **Real-time Results**: Instant search with loading indicators
- **Preview Support**: View images and PDFs directly in the app
- **Download Options**: Individual file download or bulk ZIP export

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with Material Design components
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Responsive Layout**: Optimized for both mobile and tablet devices
- **Smooth Animations**: Enhanced user experience with React Native Reanimated

## 🛠️ Technical Stack

### Frontend
- **React Native 0.79.6**: Cross-platform mobile development
- **Expo SDK 53**: Development platform and tools
- **TypeScript**: Type-safe development
- **React Navigation 7**: Navigation and routing

### UI Components
- **React Native Paper**: Material Design components
- **Expo Vector Icons**: Icon library
- **React Native Reanimated**: Smooth animations
- **Expo Blur**: Visual effects

### File Management
- **Expo Document Picker**: File selection
- **Expo Image Picker**: Camera integration
- **Expo File System**: File operations
- **Expo Sharing**: File sharing capabilities
- **JSZip**: ZIP file creation

### State Management
- **React Context**: Authentication state management
- **Expo Secure Store**: Secure token storage

## 📱 Platform Support

- **iOS**: Native support with tablet optimization
- **Android**: Edge-to-edge design with adaptive icons
- **Web**: Responsive web application
- **Cross-platform**: Unified codebase for all platforms

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/y0-gesh/DMSAppNew
   cd dms-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go
   - **Web**: Press `w` in the terminal

### Development Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Lint code
npm run lint

# Reset project (removes example code)
npm run reset-project
```

## 🏗️ Project Structure

```
dms-app/
├── app/                    # Main application screens
│   ├── (main)/            # Main tab navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── upload.tsx     # Document upload
│   │   ├── search.tsx     # Document search
│   │   └── explore.tsx    # App exploration
│   ├── login.tsx          # Authentication screen
│   └── _layout.tsx        # Root layout
├── components/             # Reusable UI components
│   ├── ui/                # UI-specific components
│   ├── Collapsible.tsx    # Collapsible sections
│   ├── HelloWave.tsx      # Animated components
│   └── ThemedText.tsx     # Themed text components
├── context/                # React Context providers
│   └── AuthContext.tsx    # Authentication context
├── services/               # API services
│   └── api.js             # Backend API integration
├── constants/              # App constants
│   └── Colors.ts          # Color definitions
├── hooks/                  # Custom React hooks
├── assets/                 # Static assets
│   ├── images/            # App images and icons
│   └── fonts/             # Custom fonts
└── scripts/                # Build and utility scripts
```

## 🔌 API Integration

The app integrates with a backend API for document management operations:

### Base URL
```
https://apis.allsoft.co/api/documentManagement/
```

### Endpoints
- `POST /generateOTP` - Generate OTP for mobile verification
- `POST /validateOTP` - Validate OTP and authenticate user
- `POST /documentTags` - Get tag suggestions
- `POST /saveDocumentEntry` - Upload and save documents
- `POST /searchDocumentEntry` - Search documents with filters

### Authentication
All API calls (except OTP generation) require a valid token in the request headers.

## 🎯 Key Components

### Authentication Flow
1. User enters mobile number
2. OTP is sent to the mobile number
3. User enters OTP for verification
4. Upon successful verification, JWT token is stored securely
5. User is redirected to main app

### Document Upload Process
1. User selects file or captures photo
2. Fills in metadata (category, date, remarks)
3. Adds relevant tags
4. Submits document to backend
5. Document is categorized and stored

### Search and Retrieval
1. User sets search criteria (category, date range, tags)
2. App queries backend with filters
3. Results are displayed with preview options
4. User can download individual files or export as ZIP

## 🔧 Configuration

### Environment Variables
The app uses the following configuration:
- **API Base URL**: Configured in `services/api.js`
- **Supported File Types**: Images and PDFs
- **Authentication**: OTP-based with secure token storage

### Platform-Specific Settings
- **iOS**: Tablet support enabled
- **Android**: Edge-to-edge design with adaptive icons
- **Web**: Static output with Metro bundler

## 🚀 Deployment

### Building for Production
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Build for web
npx expo build:web
```

### App Store Deployment
1. Configure app.json with production settings
2. Build production binaries
3. Submit to respective app stores (iOS App Store, Google Play Store)

## 🧪 Testing

### Development Testing
- Use Expo Go app for quick testing
- iOS Simulator for iOS-specific features
- Android Emulator for Android-specific features

### Testing Features
- Authentication flow
- File upload with various formats
- Search functionality with different criteria
- Cross-platform compatibility

## 🐛 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Permission errors**: Ensure camera and file access permissions
3. **API connection**: Verify backend service availability
4. **Build failures**: Check Node.js version compatibility

### Debug Mode
Enable debug mode by shaking the device or pressing `Cmd+D` (iOS) / `Cmd+M` (Android) in development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical support or questions:
- Check the [Expo documentation](https://docs.expo.dev/)
- Review [React Native documentation](https://reactnative.dev/)
- Contact the development team

## 🔄 Version History

- **v1.0.0**: Initial release with core DMS functionality
  - Authentication system
  - Document upload and management
  - Advanced search capabilities
  - Cross-platform support

---

**Built using React Native and Expo**
