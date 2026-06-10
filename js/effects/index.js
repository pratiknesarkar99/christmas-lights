// Assembles and exports the full effects map.
// main.js imports from here, never from individual effect files directly.

import { ripple } from './ripple.js';
import { randomBlink } from './randomBlink.js';
import { alternate } from './alternate.js';
import { wave } from './wave.js';
import { chase } from './chase.js';
import { twinkle } from './twinkle.js';

export const effects = {
    ripple,
    randomBlink,
    alternate,
    wave,
    chase,
    twinkle,
};