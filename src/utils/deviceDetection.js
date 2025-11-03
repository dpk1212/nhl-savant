/**
 * Device Detection Utilities
 * Optimizes share feature based on device capabilities
 */

/**
 * Detect if user is on mobile device
 */
export const isMobileDevice = () => {
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detect if user is on iOS
 */
export const isIOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Detect if user is on Android
 */
export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

/**
 * Detect if device is low-end (fewer cores = slower)
 */
export const isLowEndDevice = () => {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  return cores < 4;
};

/**
 * Get optimal image scale based on device
 * Mobile/Low-end: 2x (1200x675 → 2400x1350)
 * Desktop: 3x (1200x675 → 3600x2025)
 */
export const getOptimalImageScale = () => {
  if (isLowEndDevice()) return 2; // Low-end devices
  if (isMobileDevice()) return 2; // Mobile devices (balance quality/speed)
  return 3; // Desktop (max quality)
};

/**
 * Get optimal render delay based on device
 * Faster devices can start rendering sooner
 */
export const getOptimalRenderDelay = () => {
  if (isLowEndDevice()) return 400; // Give more time to settle
  if (isMobileDevice()) return 200; // Mobile needs some settling time
  return 100; // Desktop can render quickly
};

/**
 * Check if device supports Web Share API with files
 */
export const canShareFiles = async () => {
  if (!navigator.share || !navigator.canShare) {
    return false;
  }

  try {
    // Test if we can share files
    const testFile = new File([''], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [testFile] });
  } catch (error) {
    return false;
  }
};

/**
 * Get device info for analytics/debugging
 */
export const getDeviceInfo = () => {
  return {
    isMobile: isMobileDevice(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isLowEnd: isLowEndDevice(),
    cores: navigator.hardwareConcurrency || 'unknown',
    scale: getOptimalImageScale(),
    renderDelay: getOptimalRenderDelay(),
    canShare: !!navigator.share,
    userAgent: navigator.userAgent
  };
};

/**
 * Detect Safari browser (has specific quirks)
 */
export const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

/**
 * Get optimal image quality for compression
 */
export const getOptimalImageQuality = () => {
  // Mobile can handle slightly lower quality for faster sharing
  return isMobileDevice() ? 0.92 : 0.95;
};

