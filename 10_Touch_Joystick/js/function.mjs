

function transform(ctx, x, y, alpha = 0, sc = 1) {
    ctx.resetTransform();
    ctx.translate(x, y);
    ctx.rotate(alpha);
    ctx.scale(sc, sc);

    const M = ctx.getTransform();
    return M;
}

export function arrow() {
    let upath = new Path2D();
    upath.moveTo(-1, -2);
    upath.lineTo(1, -2);
    upath.lineTo(1, 0);
    upath.lineTo(1.5, 0);
    upath.lineTo(0, 1.5);
    upath.lineTo(-1.5, 0);
    upath.lineTo(-1, 0);
    upath.closePath();
    return upath;
}

const END_ANGLE = Math.PI * 2;

export function circle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, END_ANGLE, true);
    ctx.fill();
}

function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}


export function createJoystick(ctx, x, y, path, radius, color = "#444", touchedColor = "#f44") {
    let fingerId, xi, yi, xa, ya;
    let dx, dy, px = 100, py = 100;


    let player_matrix = transform(ctx, px, py, Math.PI, 30);


    function draw(ctx) {
        if (fingerId !== undefined) {
            circle(ctx, x, y, radius, color, "#000");
            circle(ctx, xi, yi, radius / 5, "#fff", "#000");
            circle(ctx, xa, ya, radius / 5, "#fff", "#000");
        } else {
            circle(ctx, x, y, radius, "#555", "#000");
        }

        if (dx !== undefined) {
            px += dx;
            py += dy;
            player_matrix = transform(ctx, px, py, Math.PI, 30);
        }

        fillPath(ctx, path, player_matrix, "#f0f");
    }

    const TRANSFACTOR = 0.01;

    // wird im touchmove-Event aufgerufen
    function move(id, tx, ty) {
        if (id === fingerId) {
            const d = distance(tx, ty, x, y);
            if (d > radius && xa === undefined) {
                xa = tx;
                ya = ty;

                dx = (tx - xi) * TRANSFACTOR;
                dy = (ty - yi) * TRANSFACTOR;
            }
        }


    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        const d = distance(tx, ty, x, y);
        if (d < radius) {
            fingerId = id;
            xi = tx;
            yi = ty;
        }

    }

    // wird in touchend-Event aufgerufen
    function reset(id) {
        if (id === fingerId) {
            fingerId = undefined;
            xa = undefined;
        }

    }

    return { draw, isTouched, reset, move };

}


export function createUpath() {
    let upath = new Path2D();
    upath.moveTo(-2, -2);
    upath.lineTo(-2, 2);
    upath.lineTo(-1, 2);
    upath.lineTo(-1, -1);
    upath.lineTo(1, -1);
    upath.lineTo(1, 2);
    upath.lineTo(2, 2);
    upath.lineTo(2, -2);
    upath.closePath();
    return upath;
}

export function fillPath(ctx, path, M, fillStyle = "#fff", strokeStyle = "#000", lineWidth = 0.1) {
    ctx.save();  // Speichern des Zustands mit der aktuellen Matrix auf Stack
    ctx.setTransform(M);
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fill(path);
    ctx.stroke(path);
    ctx.restore(); // Holen der gespeicherten Matrix vom Stack
}


export function image(ctx, src, width) {
    let img = new Image();
    img.src = src;
    let offsetX = 0, offsetY = 0;
    let sc = 1;

    img.addEventListener('load', () => {
        sc = width / img.naturalWidth;
        offsetX = -img.naturalWidth / 2;
        offsetY = -img.naturalHeight / 2;
        console.log('Imaged loaded: ', offsetX, offsetY, width, sc);
    });

    // Rueckgabe: Zeichen-Funktion
    return (x, y, angle) => {
        if (offsetX < 0) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(sc, sc);
            ctx.translate(offsetX, offsetY);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
        }
    }
}
