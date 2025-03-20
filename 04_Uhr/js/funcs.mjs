
const END_ANGLE = Math.PI * 2;

export function circle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, END_ANGLE, true);
    ctx.fill();
}

export function getTime() {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hrs = now.getHours();
    if (hrs >= 12) hrs -= 12;
    return {
        sec,
        min,
        hrs,
        pSec: sec.toString().padStart(2, "0"),
        pMin: min.toString().padStart(2, "0"),
        pHrs: hrs.toString().padStart(2, "0")
    };
}

