import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bizai.app',
  appName: 'BizAI',
  webDir: 'frontend/dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#1F2937'
    }
  },
  server: {
    androidScheme: 'https',
    hostname: 'localhost'
  }
};

export default config;
