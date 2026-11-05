#!/usr/bin/env node

// Generates the Gloomhaven 2nd Edition storyline flowchart from games/gh2.json.
// Node positions are hand-placed in the grid below; layout fixes belong there, never in gh2.svg.

const fs = require('fs');

const INPUT = 'resources/js/games/gh2.json';
const OUTPUT = 'resources/svg/storylines/gh2.svg';

const R = 12;           // node radius
const UX = 40;          // grid column width
const UY = 44;          // grid row height
const PAD = 10;         // rect padding around nodes
const LABEL_H = 13;     // space for a chapter label (below the last row)
const M = 12;           // outer margin
const ORIGIN = M + PAD + R;

const LIGHT = '#e4dedd';
const COLORS = {
    1: LIGHT, 2: '#a1243f', 3: '#1f7a85', 4: '#c9a94a', 5: '#34488a', 6: '#9a2f8a', 7: '#4f7d46', 8: '#5a6680', 9: LIGHT,
    101: '#c8673a', 102: '#7fbccc', 103: '#7a5236', 104: '#5b3a6e', 105: LIGHT,
};
// Chapter fill: #111 at .7 opacity over the #333 background, solid so overlapping rects of one chapter merge
const FILL = '#1b1b1b';

// Main storyline: scenario id => [column, row]. Every edge points down; chapters fit together without crossings.
const NODES = {
    0: [7, 0], 1: [8, 0], 2: [8, 1],
    3: [8, 2.2], 9: [9, 2.2], 5: [8, 3.4], 28: [10.5, 3.4], 39: [10, 4.4], 42: [11, 4.4], 40: [10, 5.4], 43: [11, 5.4], 44: [10.5, 6.4],
    6: [1, 2.2], 4: [2, 2.2], 11: [1, 3.4], 7: [2, 3.4], 15: [0, 4.6], 19: [1, 4.6], 20: [2, 4.6], 26: [1.5, 5.6], 101: [1.5, 6.6],
    12: [3.5, 4.6], 8: [4.5, 4.6], 16: [5.5, 4.6], 21: [4, 5.6], 22: [5, 5.6], 24: [4.5, 6.6], 103: [4.5, 7.6],
    10: [8, 4.75], 17: [7.5, 5.75], 18: [8.5, 5.75], 102: [8, 6.75], 104: [8, 7.75],
    13: [4.5, 9.4], 14: [6.5, 9.4], 29: [4, 10.4], 32: [5, 10.4], 31: [6, 10.4], 30: [7, 10.4], 33: [5, 11.4], 34: [6, 11.4], 35: [7, 11.4],
    27: [5.5, 13],
    36: [1.5, 13], 37: [1, 14.3], 38: [2, 14.3], 41: [1, 15.3],
    45: [10.5, 9.2], 46: [10, 10.2], 47: [11, 10.2], 48: [12, 10.2], 51: [10, 11.2], 49: [11, 11.2], 50: [12, 11.2], 53: [13, 11.2], 52: [11, 12.2],
    54: [10, 15.3], 55: [11, 15.3], 56: [12, 15.3],
};

// Chapter overrides: rects in grid units [x0, y0, x1, y1] around node centers (default: bounding box), label [x, y, anchor]
const CHAPTERS = {
    1: {label: [7, 1.15, 'middle']},
    5: {rects: [[8, 2.2, 10.5, 3.4], [10, 3.4, 11, 6.4]], label: [9.45, 2.2]},
    8: {rects: [[10, 9.2, 13, 12.2], [10, 12.2, 12, 15.3]]},
};

// Edge routes: bend points in grid units (default: down, across just above the target, down)
const ROUTES = {
    '5-9': [[8.5, 3.4], [8.5, 2.2]],
    '28-53': [[13, 3.4]],
    '7-8': [[2, 3.95], [4.5, 3.95]],
    '10-13': [[6.5, 4.75], [6.5, 8.9], [4.5, 8.9]],
    '10-14': [[6.5, 4.75]],
    '31-33': [[6, 10.9], [5, 10.9]],
    '103-27': [[3, 7.6], [3, 12.5], [5.5, 12.5]],
    '104-27': [[8, 13]],
    '101-36': [],
    '45-38': [[9, 9.2], [9, 14.3]],
    '41-54': [],
};

// Side blocks per orientation: top-left node position and nodes per row
const SIDE = {
    landscape: [
        {chapter: 101, x: 14.75, y: 0, cols: 5}, {chapter: 102, x: 14.75, y: 2.6, cols: 5}, {chapter: 103, x: 14.75, y: 5.2, cols: 4},
        {chapter: 104, x: 14.75, y: 6.6, cols: 5}, {chapter: 105, x: 14.75, y: 11.2, cols: 2},
    ],
    portrait: [
        {chapter: 101, x: 0, y: 16.8, cols: 5}, {chapter: 102, x: 6.5, y: 16.8, cols: 5},
        {chapter: 104, x: 0, y: 19.4, cols: 5}, {chapter: 103, x: 6.5, y: 19.4, cols: 4}, {chapter: 105, x: 6.5, y: 20.8, cols: 2},
    ],
};

const round = (n) => Math.round(n * 100) / 100;
const px = ([gx, gy]) => ({x: ORIGIN + gx * UX, y: ORIGIN + gy * UY});

const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
const scenarios = new Map(data.scenarios.filter((s) => !s.solo).map((s) => [s.id, s]));
const chapterName = new Map(data.chapters.map((c) => [c.id, c.name]));
const targets = (s) => [...new Set([
    ...(s.links_to || []), ...(s.choices || []), ...Object.values(s.treasures_to || {}).flat(),
])].sort((a, b) => a - b);

const models = Object.fromEntries(Object.entries(SIDE).map(([orientation, side]) => [orientation, layout(side)]));
Object.values(models).forEach(check);
fs.writeFileSync(OUTPUT, svg(models));
Object.entries(models).forEach(([orientation, m]) => console.log(`${orientation}: ${m.W} x ${m.H}`));

function layout(side) {
    const pos = new Map(Object.entries(NODES).map(([id, g]) => [Number(id), px(g)]));
    const chapters = [];

    [...new Set([...scenarios.values()].filter((s) => s.chapter_id < 100).map((s) => s.chapter_id))].sort((a, b) => a - b).forEach((c) => {
        const o = CHAPTERS[c] || {};
        const grid = [...scenarios.values()].filter((s) => s.chapter_id === c).map((s) => {
            if (!NODES[s.id]) throw new Error(`Scenario ${s.id} has no position in NODES`);
            return NODES[s.id];
        });
        const rects = o.rects || [[
            Math.min(...grid.map((g) => g[0])), Math.min(...grid.map((g) => g[1])),
            Math.max(...grid.map((g) => g[0])), Math.max(...grid.map((g) => g[1])),
        ]];
        chapters.push({id: c, rects, label: o.label, intro: data.scenarios.some((s) => s.root && s.chapter_id === c)});
    });

    side.forEach(({chapter, x, y, cols}) => {
        const order = sideOrder(chapter, cols);
        order.forEach((id, i) => pos.set(id, px([x + (i % cols), y + Math.floor(i / cols)])));
        const rows = Math.ceil(order.length / cols);
        chapters.push({id: chapter, side: true, rects: [[x, y, x + Math.min(cols, order.length) - 1, y + rows - 1]]});
    });

    chapters.forEach((c) => {
        c.boxes = c.rects.map(([x0, y0, x1, y1], i) => {
            const a = px([x0, y0]);
            const b = px([x1, y1]);
            const box = {x: a.x - R - PAD, y: a.y - R - PAD, w: b.x - a.x + 2 * (R + PAD), h: b.y - a.y + 2 * (R + PAD)};
            if (i === 0 && !c.label) box.h += LABEL_H;
            return box;
        });
        const first = c.boxes[0];
        c.labelAt = c.label
            ? {...px(c.label), anchor: c.label[2] || 'start'}
            : {x: first.x + 6, y: first.y + first.h - 9, anchor: 'start'};
    });

    const edges = [];
    scenarios.forEach((s) => targets(s).forEach((t) => {
        const target = scenarios.get(t);
        if (!target) return;
        const isSide = s.chapter_id >= 100 || target.chapter_id >= 100;
        if (isSide && s.chapter_id !== target.chapter_id) return;
        edges.push({from: s.id, to: t, points: route(pos.get(s.id), pos.get(t), isSide ? [] : ROUTES[`${s.id}-${t}`])});
    }));

    const boxes = chapters.flatMap((c) => c.boxes);
    const W = Math.ceil(Math.max(...boxes.map((b) => b.x + b.w)) + M);
    const H = Math.ceil(Math.max(...boxes.map((b) => b.y + b.h)) + M);

    return {pos, chapters, edges, W, H};
}

// Side-chapter nodes in id order, linked pairs adjacent and never split over two rows
function sideOrder(chapter, cols) {
    const linked = (id) => targets(scenarios.get(id)).length > 0 || order.some((o) => targets(scenarios.get(o)).includes(id));
    const order = [];
    [...scenarios.values()].filter((s) => s.chapter_id === chapter).sort((a, b) => a.id - b.id).forEach((s) => {
        if (order.includes(s.id)) return;
        order.push(s.id);
        targets(s).filter((t) => scenarios.get(t)?.chapter_id === chapter && !order.includes(t)).forEach((t) => order.push(t));
    });
    for (let i = cols; i < order.length; i += cols) {
        if (!targets(scenarios.get(order[i - 1])).includes(order[i])) continue;
        const j = order.findIndex((id, k) => k > i && !linked(id));
        if (j > 0) order.splice(i - 1, 0, ...order.splice(j, 1));
    }
    return order;
}

function route(a, b, bends) {
    let points;
    if (bends) points = [a, ...bends.map(px), b];
    else if (a.x === b.x || a.y === b.y) points = [a, b];
    else {
        const y = b.y > a.y ? b.y - UY / 2 : b.y + UY / 2;
        points = [a, {x: a.x, y}, {x: b.x, y}, b];
    }
    points = points.filter((p, i) => !i || p.x !== points[i - 1].x || p.y !== points[i - 1].y);
    // Start and end on the node circles
    const clip = (p, q) => {
        const d = Math.hypot(q.x - p.x, q.y - p.y);
        return {x: p.x + (q.x - p.x) / d * R, y: p.y + (q.y - p.y) / d * R};
    };
    points[0] = clip(points[0], points[1]);
    points[points.length - 1] = clip(points[points.length - 1], points[points.length - 2]);
    return points;
}

// Notched arrow head; returns the line path (ending at the arrow base) and the arrow path
function arrow(points) {
    const tip = points[points.length - 1];
    const prev = points[points.length - 2];
    const len = Math.hypot(tip.x - prev.x, tip.y - prev.y);
    const d = {x: (tip.x - prev.x) / len, y: (tip.y - prev.y) / len};
    const n = {x: -d.y, y: d.x};
    const at = (back, side) => `${round(tip.x - back * d.x + side * n.x)} ${round(tip.y - back * d.y + side * n.y)}`;
    const base = {x: tip.x - 3.78 * d.x, y: tip.y - 3.78 * d.y};
    return {
        line: 'M' + [...points.slice(0, -1), base].map((p) => `${round(p.x)} ${round(p.y)}`).join(' L'),
        arrow: `M${round(tip.x)} ${round(tip.y)} L${at(5.03, 2.52)} L${at(3.78, 0)} L${at(5.03, -2.52)} Z`,
    };
}

function svg(models) {
    return `<!-- Generated by commands/generate-storyline-svg.js from ${INPUT}. Do not edit by hand. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${models.landscape.W} ${models.landscape.H}" text-anchor="middle" dominant-baseline="central" font-size="12">
 <style>svg{background:#333}text{fill:white;font-family:"Pirata One",sans-serif}.label{font-size:10px}.node{fill:black;stroke:white}.line{fill:none;stroke:white}.arrow{fill:white;stroke:white}</style>
 <g class="landscape">
${group(models.landscape)}
 </g>
 <g class="portrait">
${group(models.portrait)}
 </g>
</svg>
`;
}

function group(model) {
    const lines = [];
    const rect = (b, attributes) => `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" ry="10" ${attributes}/>`;

    model.chapters.forEach((c) => {
        // Multi-rect chapters: outlines first, then slightly inset fills hide the inner borders
        const shape = c.boxes.length === 1
            ? rect(c.boxes[0], `fill="${FILL}" stroke="${COLORS[c.id]}"`)
            : c.boxes.map((b) => rect(b, `fill="none" stroke="${COLORS[c.id]}"`)).join('')
                + c.boxes.map((b) => rect({x: b.x + 1, y: b.y + 1, w: b.w - 2, h: b.h - 2}, `fill="${FILL}"`)).join('');
        const label = `<text class="label" x="${round(c.labelAt.x)}" y="${round(c.labelAt.y)}" text-anchor="${c.labelAt.anchor}">{{ $t(${JSON.stringify(chapterName.get(c.id))}) }}</text>`;
        lines.push(c.side
            ? `  ${shape}${label}`
            : `  <g class="chapter${c.intro ? ' intro' : ''}" id="chapter${c.id}">${shape}${label}</g>`);
    });

    model.edges.forEach((e) => {
        const a = arrow(e.points);
        lines.push(`  <g class="edge edge${e.from}" id="edge${e.from}-${e.to}"><path class="line" d="${a.line}"/><path class="arrow" d="${a.arrow}"/></g>`);
    });

    model.pos.forEach((c, id) => {
        const s = scenarios.get(id);
        const marks = ((s.blocks_on || []).length ? `<text class="blocked" x="${c.x - 12}" y="${c.y - 16}" font-size="20">×</text>` : '')
            + ((s.required_by || []).length ? `<text class="required" x="${c.x - 14}" y="${c.y - 12}" font-weight="bold">!</text>` : '');
        lines.push(`  <g class="scenario" id="node${id}"><circle class="node" cx="${c.x}" cy="${c.y}" r="${R}"/><text x="${c.x}" y="${c.y}">${s.number || String(id)}</text>${marks}</g>`);
    });

    return lines.join('\n');
}

function check(model) {
    scenarios.forEach((s) => {
        if (!model.pos.has(s.id)) throw new Error(`Scenario ${s.id} has no node`);
    });
    if (model.pos.size !== scenarios.size) throw new Error('Node count differs from non-solo scenario count');
    Object.keys(ROUTES).forEach((key) => {
        if (!model.edges.some((e) => `${e.from}-${e.to}` === key)) throw new Error(`Route ${key} is not an edge`);
    });

    const nodes = [...model.pos.entries()];
    nodes.forEach(([a, p], i) => nodes.slice(i + 1).forEach(([b, q]) => {
        if (Math.hypot(p.x - q.x, p.y - q.y) < 2 * R + 8) throw new Error(`Nodes ${a} and ${b} overlap`);
    }));

    if (!model.chapters.some((c) => c.intro)) throw new Error('No intro chapter');
}
