/**
 * Mobile App Configuration Handler
 * Manages native mobile features and optimizations
 */

export class MobileConfig {
  /**
   * Initialize all mobile features
   */
  static async init() {
    if (!window.Capacitor) {
      console.warn('Capacitor not available - running in web mode');
      return;
    }

    console.log('Initializing mobile configuration...');
    this.initAppLifecycle();
    this.initNetworkStatus();
  }

  /**
   * Handle app lifecycle events
   */
  private static initAppLifecycle() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
        const App = window.Capacitor.Plugins.App;
        
        App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });

        App.addListener('pause', () => {
          console.log('App paused');
        });

        App.addListener('resume', () => {
          console.log('App resumed');
        });
      }
      
      console.log('App lifecycle handlers initialized');
    } catch (err) {
      console.warn('App lifecycle error:', err);
    }
  }

  /**
   * Monitor network status
   */
  private static initNetworkStatus() {
    try {
      window.addEventListener('online', () => {
        console.log('Network: Online');
        document.body.classList.remove('offline');
        document.body.classList.add('online');
      });

      window.addEventListener('offline', () => {
        console.log('Network: Offline');
        document.body.classList.remove('online');
        document.body.classList.add('offline');
      });
      
      console.log('Network status handler initialized');
    } catch (err) {
      console.warn('Network status error:', err);
    }
  }

  /**
   * Get device platform
   */
  static getPlatform(): string {
    if (!window.Capacitor) {
      return 'web';
    }
    return window.Capacitor.getPlatform();
  }

  /**
   * Check if running on native platform
   */
  static isNative(): boolean {
    return window.Capacitor && this.getPlatform() !== 'web';
  }

  /**
   * Get device info
   */
  static async getDeviceInfo() {
    if (!window.Capacitor) {
      return null;
    }
    
    if (window.Capacitor.Plugins && window.Capacitor.Plugins.Device) {
      const Device = window.Capacitor.Plugins.Device;
      return await Device.getInfo();
    }
    return null;
  }

  /**
   * Trigger haptic feedback
   */
  static async vibrate(duration: number = 50) {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
        const Haptics = window.Capacitor.Plugins.Haptics;
        await Haptics.vibrate({ duration });
      }
    } catch (err) {
      console.warn('Vibration not available');
    }
  }
}

// Export for use in app
export default MobileConfig;
