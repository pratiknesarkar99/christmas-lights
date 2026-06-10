import { CONFIG } from './config.js';

export const state = {
    bulbColors: [...CONFIG.defaultColors],
    bulbLabels: [...CONFIG.defaultLabels],
    intervalMs: CONFIG.defaultIntervalMs,
    intensityVal: CONFIG.defaultIntensity,
    bulbSize: CONFIG.defaultBulbSize,
    rowCount: CONFIG.defaultRowCount,
};

export const handles = {
    intervals: [],
    timeouts: [],
};