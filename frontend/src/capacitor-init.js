export const initCapacitor = () => {
    // Only initialize if Capacitor is available (running on native device)
    if (!window.Capacitor) {
        console.log('Capacitor not available - running in web mode');
        return;
    }

    try {
        // Dynamically import App plugin if available
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
            const App = window.Capacitor.Plugins.App;

            // Handle back button
            App.addListener('backButton', ({ canGoBack }) => {
                if (!canGoBack) {
                    App.exitApp();
                } else {
                    window.history.back();
                }
            });

            // Handle app pause/resume
            App.addListener('pause', () => {
                console.log('App paused');
            });

            App.addListener('resume', () => {
                console.log('App resumed');
            });

            console.log('Capacitor initialized successfully');
        } else {
            console.log('App plugin not available');
        }
    } catch (error) {
        console.warn('Capacitor initialization error:', error);
    }
};