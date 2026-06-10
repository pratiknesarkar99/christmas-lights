import { state, handles } from '../state.js';
import { lightBulb, dimAll, clearHandles } from '../bulb.js';

export const chase = {
    activeIndexes: [],

    start() {
        const gap = Math.floor(state.bulbColors.length / 2);
        this.activeIndexes = Array.from({ length: state.rowCount }, (_, r) => r);

        const id = setInterval(() => {
            dimAll();
            for (let r = 0; r < state.rowCount; r++) {
                const lead = this.activeIndexes[r] % state.bulbColors.length;
                const trail = (this.activeIndexes[r] + gap) % state.bulbColors.length;
                lightBulb(r, lead);
                lightBulb(r, trail);
                this.activeIndexes[r] = (this.activeIndexes[r] + 1) % state.bulbColors.length;
            }
        }, state.intervalMs);

        handles.intervals.push(id);
    },

    stop() {
        clearHandles();
        dimAll();
    },
};