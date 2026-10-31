#!/usr/bin/env node

// Generates the Gloomhaven 2nd Edition storyline flowchart from scenarios-gh2.json.
// Layout fixes belong in the constants below, never in gh2.svg.

const fs = require('fs');

const INPUT = 'resources/js/scenarios-gh2.json';
const OUTPUT = 'resources/svg/storylines/gh2.svg';

const R = 12;           // node radius
const COL = 39;         // node spacing inside a lane / side grid
const ROW = 52;         // main-area layer spacing
const SIDE_ROW = 39;    // side-grid row spacing
const PAD = 10;         // rect padding around nodes
const LABEL_H = 12;     // space for a chapter label (below the last row)
const LANE_GAP = 14;    // gap between lanes / side blocks
const M = 12;           // outer margin
const SIDE_COLS = 5;    // nodes per row in a side block
const LANE_ORDER = [3, 4, 2, 1, 5, 6, 7, 8, 9]; // chapter ids, left to right

const LIGHT = '#e4dedd';
const COLORS = {
    1: LIGHT, 2: '#a1243f', 3: '#1f7a85', 4: '#c9a94a', 5: '#34488a', 6: '#9a2f8a', 7: '#4f7d46', 8: '#5a6680', 9: LIGHT,
    101: '#c8673a', 102: '#7fbccc', 103: '#7a5236', 104: '#5b3a6e', 105: LIGHT,
};

const round = (n) => Math.round(n * 100) / 100;
const byId = (a, b) => a - b;

const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
const model = layout(data);
check(model, data);
fs.writeFileSync(OUTPUT, svg(model));
console.log(`landscape: '0 0 ${model.W} ${model.H}'\nportrait: '0 0 ${model.H} ${model.W}'`);

function layout(data) {
    const scenarios = data.scenarios.filter((s) => !s.solo).sort((a, b) => a.id - b.id);
    scenarios.forEach((s) => {
        if (!Number.isInteger(s.id)) throw new Error(`Scenario id ${s.id} is not an integer`);
        if (!s.chapter_id) throw new Error(`Scenario ${s.id} has no chapter_id`);
    });

    const main = scenarios.filter((s) => s.chapter_id < 100);
    const side = scenarios.filter((s) => s.chapter_id >= 100);
    const scenarioById = new Map(scenarios.map((s) => [s.id, s]));
    const introId = data.scenarios.find((s) => s.root).chapter_id;
    const chapterName = new Map(data.chapters.map((c) => [c.id, c.name]));

    const targets = (s) => [...new Set([
        ...(s.links_to || []), ...(s.choices || []), ...Object.values(s.treasures_to || {}).flat(),
    ])].sort(byId);

    const log = {skipped: [], cross: [], back: [], orphans: []};
    const mainEdges = [];
    const sideEdges = [];
    scenarios.forEach((s) => targets(s).forEach((t) => {
        const target = scenarioById.get(t);
        if (!target) return log.skipped.push(`${s.id}->${t}`);
        if (s.chapter_id < 100 && target.chapter_id < 100) mainEdges.push([s.id, t]);
        else if (s.chapter_id === target.chapter_id) sideEdges.push([s.id, t]);
        else log.cross.push(`${s.id}->${t}`);
    }));

    // Break cycles: an edge to a node on the DFS stack is a back edge
    const out = new Map(main.map((s) => [s.id, []]));
    mainEdges.forEach(([f, t]) => out.get(f).push(t));
    const state = new Map();
    const back = new Set();
    const visit = (id) => {
        state.set(id, 1);
        out.get(id).forEach((t) => {
            if (state.get(t) === 1) back.add(`${id}-${t}`);
            else if (!state.has(t)) visit(t);
        });
        state.set(id, 2);
    };
    main.forEach((s) => state.has(s.id) || visit(s.id));
    log.back = [...back];

    // Longest-path layering over the forward edges
    const forward = mainEdges.filter(([f, t]) => !back.has(`${f}-${t}`));
    const preds = new Map(main.map((s) => [s.id, []]));
    const indegree = new Map(main.map((s) => [s.id, 0]));
    forward.forEach(([f, t]) => {
        preds.get(t).push(f);
        indegree.set(t, indegree.get(t) + 1);
    });
    const layer = new Map();
    const queue = main.filter((s) => indegree.get(s.id) === 0).map((s) => s.id);
    while (queue.length) {
        const id = queue.shift();
        layer.set(id, Math.max(0, ...preds.get(id).map((p) => layer.get(p) + 1)));
        forward.filter(([f]) => f === id).forEach(([, t]) => {
            indegree.set(t, indegree.get(t) - 1);
            if (indegree.get(t) === 0) queue.push(t);
        });
    }
    if (layer.size !== main.length) throw new Error('Cycle left after removing back edges');
    log.orphans = main
        .filter((s) => !s.root && preds.get(s.id).length === 0)
        .map((s) => s.id);

    // Cells (chapter, layer) and lane geometry
    const lanes = LANE_ORDER.filter((c) => main.some((s) => s.chapter_id === c));
    main.forEach((s) => {
        if (!LANE_ORDER.includes(s.chapter_id)) throw new Error(`Chapter ${s.chapter_id} is not in LANE_ORDER`);
    });
    const cells = new Map();
    main.forEach((s) => {
        const key = `${s.chapter_id}:${layer.get(s.id)}`;
        cells.set(key, [...(cells.get(key) || []), s.id]);
    });
    const laneCols = new Map(lanes.map((c) => [c, Math.max(...main
        .filter((s) => s.chapter_id === c)
        .map((s) => cells.get(`${c}:${layer.get(s.id)}`).length))]));
    const laneBox = (c) => 2 * PAD + 2 * R + (laneCols.get(c) - 1) * COL;
    const laneX = new Map();
    let cursor = M;
    lanes.forEach((c) => {
        laneX.set(c, cursor);
        cursor += laneBox(c) + LANE_GAP;
    });
    const mainRight = cursor - LANE_GAP;

    // Order each cell by the barycenter of its placed predecessors
    const maxLayer = Math.max(...layer.values());
    const pos = new Map();
    const index = new Map();
    for (let l = 0; l <= maxLayer; l++) {
        lanes.forEach((c) => {
            const ids = cells.get(`${c}:${l}`);
            if (!ids) return;
            const bary = (id) => {
                const xs = preds.get(id).filter((p) => pos.has(p)).map((p) => pos.get(p).x);
                return xs.length ? xs.reduce((a, b) => a + b) / xs.length : Infinity;
            };
            ids.sort((a, b) => bary(a) - bary(b) || a - b);
            ids.forEach((id, i) => {
                const col = Math.floor((laneCols.get(c) - ids.length) / 2) + i;
                pos.set(id, {x: laneX.get(c) + PAD + R + col * COL, y: M + PAD + R + l * ROW});
                index.set(id, i);
            });
        });
    }

    const nodes = [];
    const chapters = [];
    const marks = (s) => ({blocked: (s.blocks_on || []).length > 0, required: (s.required_by || []).length > 0});
    main.forEach((s) => nodes.push({id: s.id, text: s.number || String(s.id), ...pos.get(s.id), ...marks(s)}));
    lanes.forEach((c) => {
        const ys = main.filter((s) => s.chapter_id === c).map((s) => pos.get(s.id).y);
        const top = Math.min(...ys) - R - PAD;
        chapters.push({
            id: c, intro: c === introId, x: laneX.get(c), y: top, w: laneBox(c),
            h: Math.max(...ys) + R + PAD + LABEL_H - top, label: chapterName.get(c), color: COLORS[c],
        });
    });

    // Side blocks, stacked top to bottom right of the main area
    const sideX = mainRight + LANE_GAP;
    let sideY = M;
    [...new Set(side.map((s) => s.chapter_id))].sort(byId).forEach((c) => {
        const members = side.filter((s) => s.chapter_id === c);
        const rows = Math.ceil(members.length / SIDE_COLS);
        members.forEach((s, i) => {
            pos.set(s.id, {
                x: sideX + PAD + R + (i % SIDE_COLS) * COL,
                y: sideY + PAD + R + Math.floor(i / SIDE_COLS) * SIDE_ROW,
            });
            nodes.push({id: s.id, text: s.number || String(s.id), ...pos.get(s.id), ...marks(s)});
        });
        const h = 2 * PAD + 2 * R + (rows - 1) * SIDE_ROW + LABEL_H;
        chapters.push({
            id: c, side: true, x: sideX, y: sideY, w: 2 * PAD + 2 * R + (Math.min(members.length, SIDE_COLS) - 1) * COL,
            h, label: chapterName.get(c), color: COLORS[c],
        });
        sideY += h + LANE_GAP;
    });

    // Edges
    const edges = [];
    forward.forEach(([f, t]) => {
        const s = pos.get(f);
        const e = pos.get(t);
        const dy = layer.get(t) - layer.get(f);
        const enterY = e.y - R - 12 - 3 * (index.get(t) % 3);
        const exitY = s.y + R + 4 + 3 * (index.get(f) % 2);
        const points = [{x: s.x, y: s.y + R}];
        if (dy > 1) {
            const cx = s.x + (e.x >= s.x ? COL / 2 : -COL / 2);
            points.push({x: s.x, y: exitY}, {x: cx, y: exitY}, {x: cx, y: enterY});
        } else {
            points.push({x: s.x, y: enterY});
        }
        points.push({x: e.x, y: enterY}, {x: e.x, y: e.y - R});
        edges.push({from: f, to: t, points: simplify(points)});
    });
    const straight = (f, t) => {
        const a = pos.get(f);
        const b = pos.get(t);
        const d = Math.hypot(b.x - a.x, b.y - a.y);
        const ux = (b.x - a.x) / d;
        const uy = (b.y - a.y) / d;
        edges.push({from: f, to: t, points: [{x: a.x + ux * R, y: a.y + uy * R}, {x: b.x - ux * R, y: b.y - uy * R}]});
    };
    [...back].map((e) => e.split('-').map(Number)).forEach(([f, t]) => straight(f, t));
    sideEdges.forEach(([f, t]) => straight(f, t));

    const W = Math.ceil(Math.max(...chapters.map((c) => c.x + c.w)) + M);
    const H = Math.ceil(Math.max(...chapters.map((c) => c.y + c.h)) + M);

    console.log(`layers: ${maxLayer + 1}, lanes: ${lanes.map((c) => `${chapterName.get(c)}=${laneCols.get(c)}`).join(', ')}`);
    console.log(`nodes: ${nodes.length} (main ${main.length}, side ${side.length}), edges: ${edges.length}`);
    console.log(`orphans: ${log.orphans.join(',') || 'none'}`);
    console.log(`back edges: ${log.back.join(',') || 'none'}`);
    console.log(`skipped (target not drawn): ${log.skipped.join(',') || 'none'}`);
    console.log(`not drawn (cross-area): ${log.cross.join(',') || 'none'}`);

    return {nodes, edges, chapters, W, H};
}

function simplify(points) {
    return points.filter((p, i) => {
        const a = points[i - 1];
        const b = points[i + 1];
        if (a && p.x === a.x && p.y === a.y) return false;
        return !(a && b && ((a.x === p.x && p.x === b.x) || (a.y === p.y && p.y === b.y)));
    });
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

function svg(model) {
    return `<!-- Generated by commands/generate-storyline-svg.js from ${INPUT}. Do not edit by hand. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${model.W} ${model.H}" text-anchor="middle" dominant-baseline="central" font-size="12">
 <style>svg{background:#333}text{fill:white;font-family:"Pirata One",sans-serif}.label{font-size:10px}.node{fill:black;stroke:white}.line{fill:none;stroke:white}.arrow{fill:white;stroke:white}</style>
 <g class="landscape">
${group(model, false)}
 </g>
 <g class="portrait">
${group(model, true)}
 </g>
</svg>
`;
}

function group(model, swap) {
    const p = (point) => (swap ? {x: point.y, y: point.x} : point);
    const lines = [];

    model.chapters.forEach((c) => {
        const r = swap ? {x: c.y, y: c.x, w: c.h, h: c.w} : c;
        const label = `<text class="label" x="${r.x + 6}" y="${swap ? r.y + r.h + 7 : r.y + r.h - 7}" text-anchor="start">{{ $t(${JSON.stringify(c.label)}) }}</text>`;
        const box = `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="10" ry="10" fill="#111" fill-opacity=".7" stroke="${c.color}"/>`;
        lines.push(c.side
            ? `  ${box}${label}`
            : `  <g class="chapter${c.intro ? ' intro' : ''}" id="chapter${c.id}">${box}${label}</g>`);
    });

    model.edges.forEach((e) => {
        const a = arrow(e.points.map(p));
        lines.push(`  <g class="edge edge${e.from}" id="edge${e.from}-${e.to}"><path class="line" d="${a.line}"/><path class="arrow" d="${a.arrow}"/></g>`);
    });

    model.nodes.forEach((n) => {
        const c = p(n);
        const marks = (n.blocked ? `<text class="blocked" x="${c.x - 12}" y="${c.y - 16}" font-size="20">×</text>` : '')
            + (n.required ? `<text class="required" x="${c.x - 14}" y="${c.y - 12}" font-weight="bold">!</text>` : '');
        lines.push(`  <g class="scenario" id="node${n.id}"><circle class="node" cx="${c.x}" cy="${c.y}" r="${R}"/><text x="${c.x}" y="${c.y}">${n.text}</text>${marks}</g>`);
    });

    return lines.join('\n');
}

function check(model, data) {
    const drawn = data.scenarios.filter((s) => !s.solo);
    const ids = model.nodes.map((n) => n.id);
    if (new Set(ids).size !== ids.length) throw new Error('Duplicate node ids');
    drawn.forEach((s) => {
        if (!ids.includes(s.id)) throw new Error(`Scenario ${s.id} has no node`);
    });
    if (ids.length !== drawn.length) throw new Error('Node count differs from non-solo scenario count');

    const edgeIds = model.edges.map((e) => `${e.from}-${e.to}`);
    if (new Set(edgeIds).size !== edgeIds.length) throw new Error('Duplicate edge ids');
    model.edges.forEach((e) => {
        if (!ids.includes(e.from) || !ids.includes(e.to)) throw new Error(`Edge ${e.from}-${e.to} has no node`);
    });

    model.nodes.forEach((a, i) => model.nodes.slice(i + 1).forEach((b) => {
        if (Math.hypot(a.x - b.x, a.y - b.y) < 2 * R) throw new Error(`Nodes ${a.id} and ${b.id} overlap`);
    }));

    if (!model.chapters.some((c) => c.intro)) throw new Error('No intro chapter');
}
