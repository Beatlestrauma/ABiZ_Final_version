import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DeviceContext = createContext({
    deviceType: 'desktop',
    serverDeviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
});

// Primary detection: viewport width (always accurate, even in DevTools responsive mode)
function detectDeviceFromWidth() {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
}

export function DeviceProvider({ children }) {
    const [viewportDevice, setViewportDevice] = useState(() => detectDeviceFromWidth());
    const [serverDevice, setServerDevice] = useState(null);

    // Track viewport resizes in real-time
    const handleResize = useCallback(() => {
        const newType = detectDeviceFromWidth();
        setViewportDevice(newType);
        document.body.setAttribute('data-device', newType);
    }, []);

    useEffect(() => {
        // Set initial data-device attribute
        document.body.setAttribute('data-device', viewportDevice);

        // Listen for resize events
        window.addEventListener('resize', handleResize);

        // Also fetch server-side detection for reference (e.g., logging, analytics)
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        fetch(`${API_BASE}/api/device`)
            .then(res => res.json())
            .then(data => {
                if (data.deviceType) {
                    setServerDevice(data.deviceType);
                }
            })
            .catch(() => {
                // Server unavailable — viewport detection is sufficient
            });

        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    // Viewport width is the primary source of truth
    // It works correctly in ALL scenarios: real devices, DevTools responsive mode, window resizing
    const deviceType = viewportDevice;

    const value = {
        deviceType,
        serverDeviceType: serverDevice,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
    };

    return (
        <DeviceContext.Provider value={value}>
            {children}
        </DeviceContext.Provider>
    );
}

export function useDevice() {
    return useContext(DeviceContext);
}

export default DeviceContext;
