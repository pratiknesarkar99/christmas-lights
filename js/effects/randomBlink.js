import { state, handles } from '../state.js';
import { CONFIG } from '../config.js';
import { lightBulb, dimBulb, dimAll, clearHandles } from '../bulb.js';

const { minDelayRatio, maxDelayRatio, glowDuration } = CONFIG.randomBlink;

export const randomBlink = {
    randomDelay() {
        const min = state.intervalMs * minDelayRatio;
        const max = state.intervalMs * maxDelayRatio;
        return Math.random() * (max - min) + min;
    },

    blinkBulb(r, i) {
        if (!handles._running) return;
        lightBulb(r, i);

        const dimId = setTimeout(() => {
            if (!handles._running) return;
            dimBulb(r, i);
            const nextId = setTimeout(() => this.blinkBulb(r, i), this.randomDelay());
            handles.timeouts.push(nextId);
        }, state.intervalMs * glowDuration);

        handles.timeouts.push(dimId);
    },

    start() {
        handles._running = true;
        for (let r = 0; r < state.rowCount; r++) {
            for (let i = 0; i < state.bulbColors.length; i++) {
                const id = setTimeout(
                    () => this.blinkBulb(r, i),
                    Math.random() * state.intervalMs * maxDelayRatio
                );
                handles.timeouts.push(id);
            }
        }
    },

    stop() {
        handles._running = false;
        clearHandles();
        dimAll();
    },
};