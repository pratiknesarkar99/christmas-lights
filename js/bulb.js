import { state, handles } from './state.js';
import { CONFIG } from './config.js';

export function getBulb(r, i) {
    return document.getElementById(`bulb-${r}-${i}`);
}

export function lightBulb(r, i) {
    const bulb = getBulb(r, i);
    if (!bulb) return;

    const { nearAlpha, midAlpha, farAlpha } = CONFIG.glow;

    bulb.classList.remove('dim');
    bulb.classList.add('lit');
    bulb.style.filter = `brightness(${state.intensityVal}) saturate(1.4)`;
    bulb.style.boxShadow = `
    0 0 8px 3px rgba(255,255,255,${nearAlpha}),
    0 0 20px 8px rgba(255,255,255,${midAlpha}),
    0 0 40px 12px rgba(255,255,255,${farAlpha})
  `;
}

export function dimBulb(r, i) {
    const bulb = getBulb(r, i);
    if (!bulb) return;
    bulb.classList.remove('lit');
    bulb.classList.add('dim');
    bulb.style.filter = '';
    bulb.style.boxShadow = '';
}

export function dimAll() {
    for (let r = 0; r < state.rowCount; r++) {
        for (let i = 0; i < state.bulbColors.length; i++) {
            dimBulb(r, i);
        }
    }
}

export function clearHandles() {
    handles.intervals.forEach(id => clearInterval(id));
    handles.timeouts.forEach(id => clearTimeout(id));
    handles.intervals.length = 0;
    handles.timeouts.length = 0;
}