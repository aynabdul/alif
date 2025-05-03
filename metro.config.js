// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add any custom config here
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json']; // Make sure all these extensions are included

module.exports = config; 