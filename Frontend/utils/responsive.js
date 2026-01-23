import { Dimensions, Platform, StatusBar } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro)
const baseWidth = 375;
const baseHeight = 812;

/**
 * Scales a value based on the screen width
 * @param {number} size - The size to scale
 * @returns {number} - Scaled size
 */
export const scaleWidth = (size) => (SCREEN_WIDTH / baseWidth) * size;

/**
 * Scales a value based on the screen height
 * @param {number} size - The size to scale
 * @returns {number} - Scaled size
 */
export const scaleHeight = (size) => (SCREEN_HEIGHT / baseHeight) * size;

/**
 * Scales font size based on screen width
 * @param {number} size - The font size to scale
 * @returns {number} - Scaled font size
 */
export const scaleFontSize = (size) => {
    const scale = SCREEN_WIDTH / baseWidth;
    const newSize = size * scale;
    return Math.round(newSize);
};

/**
 * Moderately scales a value - useful for padding/margins
 * @param {number} size - The size to scale
 * @param {number} factor - Scale factor (default: 0.5)
 * @returns {number} - Scaled size
 */
export const moderateScale = (size, factor = 0.5) => {
    return size + (scaleWidth(size) - size) * factor;
};

/**
 * Get the status bar height
 * @returns {number} - Status bar height
 */
export const getStatusBarHeight = () => {
    if (Platform.OS === 'android') {
        return StatusBar.currentHeight || 0;
    }
    // iOS status bar heights
    if (SCREEN_HEIGHT >= 812) {
        return 44; // iPhone X and above
    }
    return 20; // Older iPhones
};

/**
 * Check if device is a tablet
 * @returns {boolean}
 */
export const isTablet = () => {
    const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
    return aspectRatio < 1.6;
};

/**
 * Check if device is small (e.g., iPhone SE)
 * @returns {boolean}
 */
export const isSmallDevice = () => {
    return SCREEN_WIDTH < 375;
};

/**
 * Get responsive padding based on device size
 * @returns {number}
 */
export const getResponsivePadding = () => {
    if (isTablet()) return 24;
    if (isSmallDevice()) return 12;
    return 16;
};

// Export dimensions
export const DIMENSIONS = {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    STATUS_BAR_HEIGHT: getStatusBarHeight(),
    IS_SMALL_DEVICE: isSmallDevice(),
    IS_TABLET: isTablet(),
};
