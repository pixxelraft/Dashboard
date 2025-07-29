# Meomni AI Dashboard - Chrome New Tab Extension

A futuristic, minimalist Chrome new tab extension featuring a 3D animated background with a rotating Earth, dynamic day-night cycle, weather widget, customizable shortcuts, and more.

## ✨ Features

### 🌍 3D Background
- **Rotating Earth**: Realistic 3D Earth with day and night textures
- **Dynamic Day-Night Cycle**: Automatic transition between day and night
- **Starry Background**: 15,000 animated stars in 3D space
- **Shooting Stars**: Periodic shooting star animations
- **Moon**: Small moon orbiting in the background

### ⏰ Time & Date
- **Real-time Clock**: Large, elegant time display
- **Current Date**: Full date with day of the week
- **Auto-updating**: Updates every second

### 🔍 Search Integration
- **Google Search**: Integrated search bar with Google
- **Auto-focus**: Search bar automatically focused on page load
- **Keyboard Shortcuts**: Enter to search, Escape to clear

### 🌤️ Weather Widget
- **Current Weather**: Temperature, conditions, and location
- **Auto-location**: Uses browser geolocation
- **Weather Icons**: Dynamic icons based on weather conditions
- **Auto-refresh**: Updates every 5 minutes

### 💬 Motivational Quotes
- **Daily Quotes**: Random inspirational quotes
- **Auto-refresh**: New quote every 10 minutes
- **Fallback**: Default quote if API is unavailable

### 🔗 Customizable Shortcuts
- **Default Shortcuts**: Gmail, YouTube, GitHub, Reddit, Twitter, Spotify
- **Add/Remove**: Easy shortcut management
- **Right-click Delete**: Right-click to remove shortcuts
- **Local Storage**: Shortcuts saved locally
- **Smart Icons**: Automatic icon detection for popular sites

### 🎨 Design
- **Dark Theme**: Futuristic dark interface
- **Glass Morphism**: Translucent elements with blur effects
- **Smooth Animations**: Fade-in animations and hover effects
- **Responsive**: Works on all screen sizes
- **Minimalist**: Clean, uncluttered design

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Recommended)

1. **Download the Files**
   - Download all files from this repository
   - Keep them in a folder together

2. **Get Weather API Key** (Optional)
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Replace `YOUR_OPENWEATHER_API_KEY` in `script.js` line 108

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the folder containing your extension files

4. **Test the Extension**
   - Open a new tab to see your dashboard
   - The extension will replace the default new tab page

### Method 2: Create Extension Icons (Optional)

For a complete extension, create icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

Place them in the same folder as your other files.

## ⚙️ Configuration

### Weather API Setup
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key
4. Open `script.js`
5. Find line 108: `const apiKey = 'YOUR_OPENWEATHER_API_KEY';`
6. Replace with your actual API key

### Customizing Shortcuts
- **Add Shortcuts**: Click the "+" button next to shortcuts
- **Remove Shortcuts**: Right-click on any shortcut
- **Default Shortcuts**: Gmail, YouTube, GitHub, Reddit, Twitter, Spotify

### Browser Permissions
The extension requires:
- **Geolocation**: For weather location
- **Storage**: For saving shortcuts
- **Host Permissions**: For weather and quote APIs

## 🛠️ File Structure

```
my-dashboard/
├── manifest.json          # Extension configuration
├── index.html            # Main dashboard page
├── style.css             # Styling and animations
├── script.js             # All functionality
├── README.md             # This file
└── icon*.png             # Extension icons (optional)
```

## 🎯 Usage

### Basic Navigation
- **Search**: Type in the search bar and press Enter
- **Shortcuts**: Click any shortcut to open the website
- **Add Shortcut**: Click the "+" button
- **Remove Shortcut**: Right-click on a shortcut

### Features
- **Weather**: Automatically shows your local weather
- **Quotes**: Inspirational quotes that change automatically
- **Time**: Always shows current time and date
- **Background**: 3D Earth rotates continuously

## 🔧 Troubleshooting

### Weather Not Showing
- Check if you have location permissions enabled
- Verify your OpenWeatherMap API key is correct
- Check browser console for error messages

### Extension Not Loading
- Ensure all files are in the same folder
- Check that `manifest.json` is properly formatted
- Try reloading the extension in Chrome

### Performance Issues
- The 3D background uses WebGL - ensure your browser supports it
- Close other tabs to improve performance
- Update your graphics drivers if needed

## 🌟 Customization

### Changing Colors
Edit `style.css` to modify:
- Background colors
- Text colors
- Glow effects
- Border colors

### Adding Features
The modular JavaScript structure makes it easy to add:
- New widgets
- Different weather APIs
- Additional shortcuts
- Custom animations

## 📱 Browser Compatibility

- **Chrome**: Full support (recommended)
- **Edge**: Full support
- **Firefox**: May require manifest v2 conversion
- **Safari**: Not supported (Chrome extension format)

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve the design

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Three.js**: 3D graphics library
- **Font Awesome**: Icons
- **OpenWeatherMap**: Weather data
- **Quotable**: Quote API

---

**Enjoy your new futuristic dashboard!** 🚀 