import { state, handles } from '../state.js';
import { CONFIG } from '../config.js';
import { getBulb, dimAll, clearHandles } from '../bulb.js';

const { tickIncrement, intervalRatio, minBrightness, maxGlowAlpha } = CONFIG.wave;

export const wave = {
    tick: 0,

    start() {
        this.tick = 0;

        const id = setInterval(() => {
            for (let r = 0; r < state.rowCount; r++) {
                for (let i = 0; i < state.bulbColors.length; i++) {
                    const bulb = getBulb(r, i);
                    if (!bulb) continue;

                    const offset = (i / state.bulbColors.length) * Math.PI * 2;
                    const rowOffset = (r / Math.max(state.rowCount, 1)) * Math.PI;
                    const sine = Math.sin(this.tick + offset + rowOffset);
                    const brightness = minBrightness + ((sine + 1) / 2) * (state.intensityVal - minBrightness);

                    bulb.classList.remove('lit', 'dim');
                    bulb.style.filter = `brightness(${brightness.toFixed(2)}) saturate(1.2)`;

                    if (sine > 0) {
                        const glowAlpha = ((sine + 1) / 2) * maxGlowAlpha;
                        bulb.style.boxShadow = `
              0 0 8px 3px rgba(255,255,255,${glowAlpha.toFixed(2)}),
              0 0 20px 8px rgba(255,255,255,${(glowAlpha * 0.4).toFixed(2)})
            `;
                    } else {
                        bulb.style.boxShadow = '';
                    }
                }
            }
            this.tick += tickIncrement;
        }, state.intervalMs * intervalRatio);

        handles.intervals.push(id);
    },

    stop() {
        clearHandles();
        document.querySelectorAll('.bulb').forEach(bulb => {
            bulb.style.filter = '';
            bulb.style.boxShadow = '';
            bulb.classList.remove('lit');
            bulb.classList.add('dim');
        });
    },
};