// Stacks the outcome strips of a GH2e event card into one back image. Used by convert-gh2-cards.js.
// swiftc -O commands/gh2-event-back.swift -o /tmp/gh2-event-back
// /tmp/gh2-event-back <out.png> <joins, e.g. 10,12 or -> <bottom> <strip a> <strip b> ... [--erase x,y,w,h;x,y,w,h] [--crop y,height,zoom]
// /tmp/gh2-event-back <out.png> - 0 <front> --front: only removes the arrow (the dark right edge there is the frame)
// Each strip is moved up by its join and drawn under the strip above, hiding the copy of the torn edge every strip
// starts with. <bottom> cuts the repeated slice (second card number) off the last strip. --erase paints over
// rectangles: a card end (number and corners) that sits next to text, see below.
// Prints the top of each strip in pixels and the image height. --crop writes a zoomed slice instead, for tuning.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

var args = Array(CommandLine.arguments.dropFirst())
var crop: [Int]? = nil
// --spare x,y: where the "A." starts, if not at 17,17: a few cards are cut higher, so the letter overlaps the arrow
var spare = [17, 17]
if let i = args.firstIndex(of: "--spare") { spare = args[i + 1].split(separator: ",").map { Int($0)! }; args.removeSubrange(i...i + 1) }
let front = args.contains("--front")
args.removeAll { $0 == "--front" }
var erase: [[Int]] = []
if let i = args.firstIndex(of: "--erase") {
    erase = args[i + 1].split(separator: ";").map { $0.split(separator: ",").map { Int($0)! } }
    args.removeSubrange(i...i + 1)
}
if let i = args.firstIndex(of: "--crop") { crop = args[i + 1].split(separator: ",").map { Int($0)! }; args.removeSubrange(i...i + 1) }
let out = args[0]
let joins = args[1] == "-" ? [] : args[1].split(separator: ",").map { Int($0)! }
let bottom = Int(args[2])!
let imgs = args[3...].map { path -> CGImage in
    let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil)!
    return CGImageSourceCreateImageAtIndex(source, 0, nil)!
}
precondition(joins.count == imgs.count - 1, "need one join per pair of strips")

let w = imgs.map { $0.width }.max()!
var tops = [0]
for i in 1..<imgs.count { tops.append(tops[i - 1] + imgs[i - 1].height - joins[i - 1]) }
let h = tops.last! + imgs.last!.height - bottom
let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
                    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
// Bottom strip first, so every strip covers the top of the one below it
for i in imgs.indices.reversed() {
    ctx.draw(imgs[i], in: CGRect(x: 0, y: h - tops[i] - imgs[i].height, width: imgs[i].width, height: imgs[i].height))
}

// The scans show the dark table outside the card's bottom rounded corners: paint it with the card's colour. On the
// right only the corner itself, as the card number sits right next to it.
let px = ctx.data!.bindMemory(to: UInt8.self, capacity: ctx.bytesPerRow * h)
func lum(_ x: Int, _ y: Int) -> Int { let i = y * ctx.bytesPerRow + x * 4; return (Int(px[i]) * 3 + Int(px[i + 1]) * 6 + Int(px[i + 2])) / 10 }
let ref = 14
for y in (front ? h : max(0, h - 30))..<h {
    for x in 0..<ref where lum(ref, y) - lum(x, y) > 20 || (lum(ref, y) < 80 && lum(x, y) < lum(ref, y) - 8) {
        for c in 0..<4 { px[y * ctx.bytesPerRow + x * 4 + c] = px[y * ctx.bytesPerRow + ref * 4 + c] }
    }
    for x in (w - 7)..<w where (w - 1 - x) + (h - 1 - y) < 7 && lum(x, y) < lum(ref, y) - 20 {
        for c in 0..<4 { px[y * ctx.bytesPerRow + x * 4 + c] = px[y * ctx.bytesPerRow + ref * 4 + c] }
    }
}

// Some scans end the card (number and rounded corners) above the last text, which overflows below it with white
// margins and a second number. Each erase rectangle x,y,w,h[,source x] is filled row by row with the colour of one
// column: the given one, else the one just beside it.
for r in erase {
    let (x0, y0, rw, rh) = (r[0], r[1], r[2], r[3])
    let src = r.count > 4 ? r[4] : (x0 == 0 ? x0 + rw : x0 - 1)
    for y in max(0, y0)..<min(h, y0 + rh) {
        for x in x0..<min(w, x0 + rw) { for c in 0..<4 { px[y * ctx.bytesPerRow + x * 4 + c] = px[y * ctx.bytesPerRow + src * 4 + c] } }
    }
}

// Every scan has a white expand arrow with a soft shadow in the top-left corner, just above and left of the "A.".
let arrow = [
    "..........+#+###", "...........#####", "............####", "............+###", "............#..#",
    "...........#...#", "..........#.....", ".........#......", "........#.......", ".......#........",
    "......#.........", "#....#..........", "##..#...........", "####............", "####............",
    "####+...........", "######..........",
]
func spared(_ x: Int, _ y: Int) -> Bool { x >= spare[0] && y >= spare[1] }
// The arrow grown by `grow` pixels, sparing the "A." area right of and below it
func arrowArea(grow: Int) -> Set<Int> {
    var area = Set<Int>()
    for (dy, row) in arrow.enumerated() {
        for (dx, ch) in row.enumerated() where ch != "." {
            for y in (7 + dy - grow)...(7 + dy + grow) { for x in (7 + dx - grow)...(7 + dx + grow)
                where x >= 0 && y >= 0 && !spared(x, y) { area.insert(y * w + x) } }
        }
    }
    return area
}
func setColour(_ x: Int, _ y: Int, _ colour: [UInt8]) { for c in 0..<4 { px[y * ctx.bytesPerRow + x * 4 + c] = colour[c] } }
if front {
    // Artwork: fill from the outside in, each pixel the average of its already known neighbours
    var unknown = arrowArea(grow: 3)
    while !unknown.isEmpty {
        var filled: [(Int, [UInt8])] = []
        for p in unknown {
            let (x, y) = (p % w, p / w)
            var sum = [0, 0, 0, 0], n = 0
            for ny in (y - 1)...(y + 1) { for nx in (x - 1)...(x + 1) where nx >= 0 && ny >= 0 && !unknown.contains(ny * w + nx) {
                for c in 0..<4 { sum[c] += Int(px[ny * ctx.bytesPerRow + nx * 4 + c]) }; n += 1
            } }
            if n > 0 { filled.append((p, sum.map { UInt8($0 / n) })) }
        }
        for (p, colour) in filled { setColour(p % w, p / w, colour); unknown.remove(p) }
    }
} else {
    // Plain background with horizontal gradients: replace the arrow, its shadow and the dark table in the corner with
    // the row's background. In the "A." area, cards keep the letter and the pixels next to it.
    let area = arrowArea(grow: 2)
    for y in 0..<32 {
        // the plain left margin, or right of the arrow in the rows of the dark corner
        let samples = y < 10 ? Array(30..<40) : Array(1..<4)
        let bg = samples.sorted { lum($0, y) < lum($1, y) }[samples.count / 2]
        let bgColour = (0..<4).map { px[y * ctx.bytesPerRow + bg * 4 + $0] }
        let b = lum(bg, y), light = b > 128
        for x in 0..<34 {
            let l = lum(x, y)
            let nearText = ((y - 1)...(y + 1)).contains { ny in ny >= 0 && ((x - 1)...(x + 1)).contains { nx in nx >= 0 && lum(nx, ny) < 110 } }
            // light cards have a dark letter, so white in its area is still the arrow
            let isArrow = (area.contains(y * w + x) || (light && spared(x, y) && x < 26 && y < 26)) && l > b + 6
            let isShadow = light ? l < b - 6 && (!spared(x, y) || (l > 150 && !nearText)) : l < b - 4
            if isArrow || isShadow || x + y < 9 || (light && !spared(x, y) && l > b + 6) { setColour(x, y, bgColour) }
        }
    }
}

// Most scans have a grey-blue stripe along the right edge, plus one blended column: paint it with the background.
// Not cropped, as the card number reaches into it.
func colourDiff(_ x1: Int, _ x2: Int, _ y: Int) -> Int {
    (0..<3).map { abs(Int(px[y * ctx.bytesPerRow + x1 * 4 + $0]) - Int(px[y * ctx.bytesPerRow + x2 * 4 + $0])) }.reduce(0, +) / 3
}
let edgeRows = front ? [] : (0..<h).filter { colourDiff(w - 1, w - 12, $0) > 12 }
var stripe = 0
if edgeRows.count * 2 > h {
    stripe = 1
    while stripe < 12 && edgeRows.filter({ colourDiff(w - 1 - stripe, w - 1, $0) < 18 }).count * 10 >= edgeRows.count * 7 { stripe += 1 }
    stripe += 1
}
if stripe > 0 {
    // The stripe's colour: the median last-column pixel of the rows that have it
    let mid = edgeRows.sorted { lum(w - 1, $0) < lum(w - 1, $1) }[edgeRows.count / 2]
    let stripeColour = (0..<3).map { Int(px[mid * ctx.bytesPerRow + (w - 1) * 4 + $0]) }
    func isStripe(_ x: Int, _ y: Int) -> Bool { (0..<3).map { abs(Int(px[y * ctx.bytesPerRow + x * 4 + $0]) - stripeColour[$0]) }.reduce(0, +) / 3 < 30 }
    // In the bottom rows, keep what differs from both the stripe and the background: the card number
    for y in 0..<h { for x in (w - stripe)..<w where y < h - 40 || isStripe(x, y) || colourDiff(x, 3, y) < 40 {
        // the column next to it, unless that is text (far from the left margin's background)
        let source = colourDiff(w - stripe - 1, 3, y) > 80 ? 3 : w - stripe - 1
        setColour(x, y, (0..<4).map { px[y * ctx.bytesPerRow + source * 4 + $0] })
    } }
}

var result = ctx.makeImage()!
if let c = crop {
    let part = result.cropping(to: CGRect(x: 0, y: c[0], width: result.width, height: min(c[1], h - c[0])))!
    let zoomed = CGContext(data: nil, width: part.width * c[2], height: part.height * c[2], bitsPerComponent: 8, bytesPerRow: 0,
                           space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    zoomed.interpolationQuality = .none
    zoomed.draw(part, in: CGRect(x: 0, y: 0, width: zoomed.width, height: zoomed.height))
    result = zoomed.makeImage()!
}
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: out) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, result, nil)
CGImageDestinationFinalize(dest)
print((tops + [h]).map(String.init).joined(separator: " "))
