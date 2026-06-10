import { state, handles } from '../state.js';
import { lightBulb, dimAll, clearHandles } from '../bulb.js';

export const twinkle = {
    start() {
        const id = setInterval(() => {
            dimAll();
            for (let r = 0; r < state.rowCount; r++) {
                const count = Math.floor(Math.random() * (state.bulbColors.length / 2)) + 1;
                const indexes = [...Array(state.bulbColors.length).keys()]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, count);
                indexes.forEach(i => lightBulb(r, i));
            }
        }, state.intervalMs);

        handles.intervals.push(id);
    },

    stop() {
        clearHandles();
        dimAll();
    },
};