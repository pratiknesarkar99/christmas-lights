// Responsible for building and rebuilding the stage DOM.
// Called on init and whenever rowCount or bulbSize changes.

import { state } from './state.js';

export function buildStage() {
    const stage = document.querySelector('.stage');
    stage.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'rows-container';

    for (let r = 0; r < state.rowCount; r++) {
        const rowBlock = document.createElement('div');
        rowBlock.className = 'row-block';

        const wire = document.createElement('div');
        wire.className = 'row-wire';

        const bulbRow = document.createElement('div');
        bulbRow.className = 'bulb-row';
        bulbRow.id = `bulb-row-${r}`;

        state.bulbColors.forEach((color, i) => {
            const wrap = document.createElement('div');
            wrap.className = 'bulb-wrap';

            const cap = document.createElement('div');
            cap.className = 'bulb-cap';

            const bulb = document.createElement('div');
            bulb.className = 'bulb dim';
            bulb.id = `bulb-${r}-${i}`;
            bulb.style.background = color;
            bulb.style.width = state.bulbSize + 'px';
            bulb.style.height = state.bulbSize + 'px';

            wrap.appendChild(cap);
            wrap.appendChild(bulb);
            bulbRow.appendChild(wrap);
        });

        rowBlock.appendChild(wire);
        rowBlock.appendChild(bulbRow);

        // Color pickers only on the first row,
        // one set controls all rows
        if (r === 0) {
            rowBlock.appendChild(buildColorPickerRow());
        }

        container.appendChild(rowBlock);
    }

    stage.appendChild(container);
}

function buildColorPickerRow() {
    const pickerRow = document.createElement('div');
    pickerRow.className = 'color-picker-row';

    state.bulbColors.forEach((color, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'color-picker-wrap';

        const label = document.createElement('span');
        label.className = 'color-picker-label';
        label.textContent = state.bulbLabels[i];

        const picker = document.createElement('input');
        picker.type = 'color';
        picker.value = color;
        picker.title = `Pick color for bulb ${i + 1}`;

        picker.addEventListener('input', (e) => {
            state.bulbColors[i] = e.target.value;
            for (let r = 0; r < state.rowCount; r++) {
                const bulb = document.getElementById(`bulb-${r}-${i}`);
                if (bulb) bulb.style.background = e.target.value;
            }
        });

        wrap.appendChild(picker);
        wrap.appendChild(label);
        pickerRow.appendChild(wrap);
    });

    return pickerRow;
}