// Central configuration for all magic numbers and defaults.
// Tune the feel of the entire app from this one file.

export const CONFIG = {

    // Default bulb colors (order matches the row left to right)
    defaultColors: [
        '#e24b4a',
        '#ef9f27',
        '#f0e040',
        '#63c41a',
        '#40bcd8',
        '#378add',
        '#c065d4',
    ],

    defaultLabels: ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Violet'],

    // Default control values (should match the HTML slider default values)
    defaultIntervalMs: 300,
    defaultIntensity: 1.3,
    defaultBulbSize: 48,
    defaultRowCount: 1,

    // Glow appearance on a lit bulb
    glow: {
        nearAlpha: 0.35,   // innermost ring opacity
        midAlpha: 0.15,   // middle ring opacity
        farAlpha: 0.08,   // outermost ring opacity
    },

    // Random blink timing ratios (multiplied against intervalMs)
    randomBlink: {
        minDelayRatio: 0.5,   // minimum next-blink delay = intervalMs * 0.5
        maxDelayRatio: 2.0,   // maximum next-blink delay = intervalMs * 2.0
        glowDuration: 0.4,   // how long a bulb stays lit  = intervalMs * 0.4
    },

    // Wave effect
    wave: {
        tickIncrement: 0.3,    // how fast the wave scrolls forward each frame
        intervalRatio: 0.15,   // wave interval = intervalMs * 0.15 (runs faster than base)
        minBrightness: 0.2,    // brightness floor (fully dim point on the sine)
        maxGlowAlpha: 0.4,    // peak glow opacity at the sine crest
    },

    // Debounce delay for the rows slider (ms)
    // Prevents rebuilding the stage on every pixel of drag
    rowsDebounceMs: 150,
};