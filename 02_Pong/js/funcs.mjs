
const END_ANGLE = Math.PI * 2;

export function circle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, END_ANGLE, true);
    ctx.fill();
}

