// Custom startup script for Expo
const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.REACT_NATIVE_PACKAGER_HOSTNAME = '192.168.228.123';
process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS = '0.0.0.0';

console.log('Starting Expo with custom IP configuration:');
console.log(`REACT_NATIVE_PACKAGER_HOSTNAME=${process.env.REACT_NATIVE_PACKAGER_HOSTNAME}`);

// Start Expo
const expo = spawn('npx', ['expo', 'start', '--clear', '--lan'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

expo.on('error', (error) => {
  console.error('Failed to start Expo:', error);
}); 