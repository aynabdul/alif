// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

// Set environment variable for hostname
process.env.REACT_NATIVE_PACKAGER_HOSTNAME = '192.168.228.123';

const config = getDefaultConfig(__dirname);

// Debug: Confirm this file is being loaded
console.log('Loading metro.config.js with host: 192.168.228.123');

// Set the IP address and port for Metro
config.server = {
  host: '192.168.228.123', // Your machine's current IP
  port: 8081, // Ensure this matches the default port
};

// Ensure all relevant file extensions are included
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];

module.exports = config;