function lerp(min, max, amount) {
    return min + (max - min) * amount;
}


function polyIntersect(polyA, polyB) {
    for (let i = 0; i < polyA.length; i++) {
        for (let j = 0; j < polyB.length; j++) {
            const touch = getIntersection(
                polyA[i],
                polyA[(i + 1) % polyA.length],
                polyB[i],
                polyB[(j + 1) % polyB.length]
            );
            if (touch) {
                return true;
            }
        }
    }
    return false;
}

/** copy pasta */
function getIntersection(polyAStart, polyAEnd, polyBStart, polyBEnd) {
    const tTop = (polyBEnd.x - polyBStart.x) * (polyAStart.y - polyBStart.y) - (polyBEnd.y - polyBStart.y) * (polyAStart.x - polyBStart.x);
    const uTop = (polyBStart.y - polyAStart.y) * (polyAStart.x - polyAEnd.x) - (polyBStart.x - polyAStart.x) * (polyAStart.y - polyAEnd.y);

    const bottom = (polyBEnd.y - polyBStart.y) * (polyAEnd.x - polyAStart.x) - (polyBEnd.x - polyBStart.x) * (polyAEnd.y - polyAStart.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(polyAStart.x, polyAEnd.x, t),
                y: lerp(polyAStart.y, polyAEnd.y, t),
                offset: t
            }
        }
    }

}

function clamp(value, maxValue, minValue) {
    if (value >= maxValue) {
        value = maxValue;
    }
    if (value <= minValue) {
        value = minValue
    }
    return value;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

function randomBias() {
    return Math.random() * 2 - 1;
}