# Christmas Lights

An interactive Christmas lights simulator built with vanilla HTML, CSS, and JavaScript. Features six animated lighting effects, full visual controls, and support for up to seven rows of bulbs.

## Demo

Open `index.html` via a local server. ES Modules require an HTTP server — `file://` won't work.

```bash
npx serve .
```

## Features

### Lighting Effects
| Effect | Description |
|---|---|
| Ripple | One lit bulb sweeps left to right across each row, rows staggered |
| Random | Each bulb blinks independently on a randomized schedule |
| Alternate | Even and odd indexed bulbs flash in opposite phases |
| Wave | Smooth sine-wave brightness gradient rolls across the row |
| Chase | Two bulbs race across the row simultaneously with a gap between them |
| Twinkle | A random subset of bulbs lights up each tick, count changes every cycle |

### Controls
- **Start / Stop** — toggles the animation on and off
- **Speed** — sets the base interval (80ms to 1000ms), affects all effects
- **Intensity** — controls how bright the lit state gets (1.1x to 2.5x brightness)
- **Size** — scales all bulbs live without interrupting the animation (28px to 72px)
- **Rows** — adds up to seven rows of bulbs, each offset to stagger the effect
- **Color pickers** — one per bulb, changes propagate across all rows instantly

## Project Structure

```
christmas-lights/
├── index.html
├── README.md
├── styles/
│   ├── reset.css        # box-sizing, margin, padding reset only
│   ├── layout.css       # body, .app, .stage, .rows-container, .row-block
│   ├── bulb.css         # .bulb-wrap, .bulb-cap, .bulb, .dim, .lit
│   ├── controls.css     # .controls, .control-row, .btn-toggle, .effect-row
│   └── pickers.css      # .color-picker-row, color input styling
└── js/
    ├── main.js          # entry point, event listeners, effect orchestration
    ├── config.js        # all magic numbers and defaults in one place
    ├── state.js         # single shared state object
    ├── bulb.js          # lightBulb(), dimBulb(), dimAll(), clearHandles()
    ├── dom.js           # buildStage(), buildColorPickerRow()
    └── effects/
        ├── index.js     # assembles and exports the effects map
        ├── ripple.js
        ├── randomBlink.js
        ├── alternate.js
        ├── wave.js
        ├── chase.js
        └── twinkle.js
```

## How It Works

### State and DOM separation

All bulb state lives in JavaScript. The DOM is treated as write-only. Two helper functions in `bulb.js` are the only things that write bulb appearance — effect logic never touches the DOM directly.

```js
lightBulb(r, i)   // removes .dim, adds .lit, applies brightness and glow
dimBulb(r, i)     // removes .lit, adds .dim, clears inline styles
```

### Animation timing

Two timing strategies are used depending on the effect.

`setInterval` drives effects where every tick is structurally identical (Ripple, Alternate, Chase, Twinkle, Wave). One interval fires, all bulbs update, repeat.

Recursive `setTimeout` drives Random Blink, where each bulb needs its own independent variable-length delay:

```js
function blinkBulb(r, i) {
  lightBulb(r, i);
  setTimeout(() => {
    dimBulb(r, i);
    setTimeout(() => blinkBulb(r, i), randomDelay()); // reschedules itself
  }, glowDuration);
}
```

### The ripple engine

The entire ripple logic is one line:

```js
activeIndex = (activeIndex + 1) % totalBulbs;
```

Modulo wraps the index back to zero when it reaches the end, creating an infinite loop over the bulb array. Rows are staggered by initializing each row at a different starting offset.

### The wave effect

Each bulb reads a different point on the same sine wave:

```js
const offset = (i / totalBulbs) * Math.PI * 2;
const sine = Math.sin(tick + offset + rowOffset);
const brightness = minBrightness + ((sine + 1) / 2) * (intensityVal - minBrightness);
```

`tick` advances each interval, scrolling the wave forward in time. `offset` spreads bulbs across the wave spatially. The `(sine + 1) / 2` remaps the -1 to 1 sine range into 0 to 1 so brightness is never negative.

### Effect engine (strategy pattern)

Each effect is an object with `start()` and `stop()` methods:

```js
const effects = {
  ripple:      { start() {...}, stop() {...} },
  randomBlink: { start() {...}, stop() {...} },
  // ...
};

// Switching effects is always the same two lines
effects[activeEffect].stop();
effects[activeEffect].start();
```

The engine has no knowledge of what any individual effect does. Adding a new effect means creating one new file and registering it in `effects/index.js`, nothing else changes.

### Centralized configuration

All magic numbers live in `config.js`. Nothing is hardcoded across effect files.

```js
export const CONFIG = {
  glow: {
    nearAlpha: 0.35,
    midAlpha:  0.15,
    farAlpha:  0.08,
  },
  randomBlink: {
    minDelayRatio: 0.5,
    maxDelayRatio: 2.0,
    glowDuration:  0.4,
  },
  wave: {
    tickIncrement: 0.3,
    intervalRatio: 0.15,
    minBrightness: 0.2,
    maxGlowAlpha:  0.4,
  },
  // ...
};
```

To tune the feel of the entire app, edit this one file.

### Timer cleanup

Every timer ID is tracked in a `handles` object:

```js
handles = { intervals: [], timeouts: [] };
```

`clearHandles()` cancels every pending interval and timeout before switching effects or stopping the animation. Without this, old timers would keep firing and compete with the new effect over the same DOM elements.

## Key Concepts Covered

- `setInterval` and `clearInterval` for fixed-pace animation
- Recursive `setTimeout` loops for variable-pace independent timers
- Modulo arithmetic for wrapping array indexes
- Sine functions for smooth continuous animation
- Strategy pattern for swappable, isolated effect logic
- Data-driven DOM generation (bulbs and rows built from state, not hardcoded)
- Centralized configuration to eliminate scattered magic numbers
- ES Modules for clean dependency management across files
- Inline style overrides for dynamic per-bulb brightness and glow
- Timer cleanup to prevent ghost timers after effect switches

## Extending the Project

**Adding a new effect:**
1. Create `js/effects/yourEffect.js` with `start()` and `stop()` methods
2. Import and add it to the map in `js/effects/index.js`
3. Add a button in `index.html` with `data-effect="yourEffect"`

**Changing default colors:** edit `CONFIG.defaultColors` in `js/config.js`.

**Tuning glow intensity or randomness:** edit the relevant section in `js/config.js`.

**Adjusting slider ranges:** change the `min`, `max`, and `step` attributes on the relevant `<input type="range">` in `index.html`, and update the matching default in `CONFIG`.

## Browser Support

Works in all modern browsers. Requires ES Module support (`type="module"`). No build tools, no dependencies, no polyfills needed.

## Built As

Part of the [App Ideas Collection](https://github.com/florinpop17/app-ideas) Tier 1 project series.