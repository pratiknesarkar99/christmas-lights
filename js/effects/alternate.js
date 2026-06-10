import { state, handles } from '../state.js';
import { lightBulb, dimBulb, dimAll, clearHandles } from '../bulb.js';

export const alternate = {
    phase: false,

    start() {
        this.phase = false;

        const id = setInterval(() => {
            for (let r = 0; r < state.rowCount; r++) {
                for (let i = 0; i < state.bulbColors.length; i++) {
                    const shouldLight = this.phase ? i % 2 === 0 : i % 2 !== 0;
                    shouldLight ? lightBulb(r, i) : dimBulb(r, i);
                }
            }
            this.phase = !this.phase;
        }, state.intervalMs);

        handles.intervals.push(id);
    },

    stop() {
        clearHandles();
        dimAll();
    },
};