// Entry point. Imports everything, wires event listeners, initializes the app.
// This is the only file that knows about the DOM controls and orchestrates
// the relationship between user input, state, and effects.

import { state } from './state.js';
import { buildStage } from './dom.js';
import { dimAll, clearHandles } from './bulb.js';
import { effects } from './effects/index.js';

let running = false;
let activeEffect = 'wave';

// --- DOM refs ---
const btnToggle = document.getElementById('btn-toggle');
const speedSlider = document.getElementById('speed-slider');
const speedVal = document.getElementById('speed-val');
const intensitySlider = document.getElementById('intensity-slider');
const intensityVal = document.getElementById('intensity-val');
const sizeSlider = document.getElementById('size-slider');
const sizeVal = document.getElementById('size-val');
const rowsSlider = document.getElementById('rows-slider');
const rowsVal = document.getElementById('rows-val');

// --- Effect switching ---
function switchEffect(name) {
    document.querySelectorAll('.effect-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.effect === name);
    });

    if (running) {
        effects[activeEffect].stop();
        activeEffect = name;
        effects[activeEffect].start();
    } else {
        activeEffect = name;
    }
}

// --- Toggle animation ---
function toggleAnimation() {
    running = !running;

    if (running) {
        btnToggle.textContent = 'Stop';
        btnToggle.classList.add('running');
        effects[activeEffect].start();
    } else {
        btnToggle.textContent = 'Start';
        btnToggle.classList.remove('running');
        effects[activeEffect].stop();
    }
}

// --- Speed ---
function onSpeedChange() {
    state.intervalMs = Number(speedSlider.value);
    speedVal.textContent = state.intervalMs + 'ms';

    if (running) {
        effects[activeEffect].stop();
        effects[activeEffect].start();
    }
}

// --- Intensity ---
function onIntensityChange() {
    state.intensityVal = parseFloat(intensitySlider.value);
    intensityVal.textContent = state.intensityVal.toFixed(1);

    document.querySelectorAll('.bulb.lit').forEach(bulb => {
        bulb.style.filter = `brightness(${state.intensityVal}) saturate(1.4)`;
    });
}

// --- Size ---
function onSizeChange() {
    state.bulbSize = Number(sizeSlider.value);
    sizeVal.textContent = state.bulbSize + 'px';

    document.querySelectorAll('.bulb').forEach(bulb => {
        bulb.style.width = state.bulbSize + 'px';
        bulb.style.height = state.bulbSize + 'px';
    });
}

// --- Rows ---
function onRowsChange() {
    state.rowCount = Number(rowsSlider.value);
    rowsVal.textContent = state.rowCount;

    const wasRunning = running;

    if (running) {
        effects[activeEffect].stop();
        running = false;
        btnToggle.textContent = 'Start';
        btnToggle.classList.remove('running');
    }

    buildStage();

    if (wasRunning) {
        running = true;
        btnToggle.textContent = 'Stop';
        btnToggle.classList.add('running');
        effects[activeEffect].start();
    }
}

// --- Event listeners ---
btnToggle.addEventListener('click', toggleAnimation);
speedSlider.addEventListener('input', onSpeedChange);
intensitySlider.addEventListener('input', onIntensityChange);
sizeSlider.addEventListener('input', onSizeChange);
rowsSlider.addEventListener('input', onRowsChange);

document.getElementById('effect-row').addEventListener('click', (e) => {
    const btn = e.target.closest('.effect-btn');
    if (btn) switchEffect(btn.dataset.effect);
});

// --- Init ---
buildStage();