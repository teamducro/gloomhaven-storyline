// Gloomhaven 2e world map: sticker coordinates + sticker images, called by the gh2 conversion script.
const fs = require('fs')
const {execFileSync} = require('child_process')
const data = require('./gh2-coordinates.json')

// Must match GameData.mapSettings(gh2)
const WIDTH = 2500, HEIGHT = 2217, Y_OFFSET = 283
const SOURCE_SIZE = 4000
const STICKERS = 'docs/GH 2nd/cards/wordhaven/map-stickers/large/'
const OUT = 'resources/img/scenarios/gh2/'
const ROWS = 'ABCDEFGHIJKLMNOPQRST'

function coordinates(index, id) {
    const entry = data.scenarios[index]
    if (!entry) {
        return {}
    }
    const point = entry.point || cellCenter(entry.cell)
    if (cellOf(point) !== entry.cell) {
        throw new Error(`gh2 map: scenario ${index} point ${point} is not in ${entry.cell}`)
    }
    const [w, h] = writeSticker(index, id)
    const f = WIDTH / SOURCE_SIZE
    return {
        name: entry.cell,
        x: percentage((point[0] * f - w / 2) / WIDTH),
        y: percentage((point[1] * f - Y_OFFSET - h / 2) / HEIGHT),
    }
}

function achievementX(slug) {
    return data.achievements[slug]
}

function cellOf([x, y]) {
    const {cols, rows} = data.grid
    const c = cols.findIndex((b, i) => x >= b && x < cols[i + 1])
    const r = rows.findIndex((b, i) => y >= b && y < rows[i + 1])
    return ROWS[r] + (c + 1)
}

function cellCenter(cell) {
    const {cols, rows} = data.grid
    const r = ROWS.indexOf(cell[0]), c = parseInt(cell.slice(1)) - 1
    return [(cols[c] + cols[c + 1]) / 2, (rows[r] + rows[r + 1]) / 2]
}

function stickerSource(index) {
    if (['23A', '23B', '24'].includes(index)) return '23-24.png'
    if (['25A', '25B', '26'].includes(index)) return '25-26.png'
    return index + '.png'
}

// Map.vue hides stickers at x/y <= 0
function percentage(fraction) {
    return Math.max(0.1, Math.round(fraction * 10000) / 100)
}

function writeSticker(index, id) {
    const png = OUT + id + '.png'
    if (!fs.existsSync(png)) {
        fs.mkdirSync(OUT, {recursive: true})
        const source = STICKERS + stickerSource(index)
        const width = fs.readFileSync(source).readUInt32BE(16)
        execFileSync('sips', ['--resampleWidth', String(Math.round(width / 2)), source, '--out', png])
        // ponytail: completed sticker = same art (no ticked checkbox); add an overlay if the map should show completion
        fs.copyFileSync(png, OUT + id + '_c.png')
        for (const name of [id, id + '_c']) {
            execFileSync('cwebp', ['-quiet', '-q', '85', OUT + name + '.png', '-o', OUT + name + '.webp'])
        }
    }
    const header = fs.readFileSync(png)
    return [header.readUInt32BE(16), header.readUInt32BE(20)]
}

module.exports = {coordinates, achievementX}
