const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
console.log('Loading metro.config.js with host: 192.168.0.108');

// Set the IP address and port for Metro and Expo CLI
config.server = {
  host: '192.168.0.108', // Your machine's current IP
  port: 8081, // Ensure this matches the default port
};

// Ensure all relevant file extensions are included
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

module.exports = config;