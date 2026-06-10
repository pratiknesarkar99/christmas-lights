import { state, handles } from '../state.js';
import { lightBulb, dimBulb, dimAll, clearHandles } from '../bulb.js';

export const ripple = {
    activeIndexes: [],

    start() {
        this.activeIndexes = Array.from(
            { length: state.rowCount },
            (_, r) => r - 1
        );

        const id = setInterval(() => {
            for (let r = 0; r < state.rowCount; r++) {
                const prev = (
                    (this.activeIndexes[r] % state.bulbColors.length)
                    + state.bulbColors.length
                ) % state.bulbColors.length;

                dimBulb(r, prev);
                this.activeIndexes[r] = (this.activeIndexes[r] + 1) % state.bulbColors.length;
                lightBulb(r, this.activeIndexes[r]);
            }
        }, state.intervalMs);

        handles.intervals.push(id);
    },

    stop() {
        clearHandles();
        dimAll();
    },
};