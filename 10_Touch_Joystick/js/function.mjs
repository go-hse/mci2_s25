

function transform(ctx, x, y, alpha = 0, sc = 1) {
    ctx.resetTransform();
    ctx.translate(x, y);
    ctx.rotate(alpha);
    ctx.scale(sc, sc);

    const M = ctx.getTransform();
    return M;
}

export function createInteractivePath(ctx, x, y, path, color = "#444", touchedColor = "#f44") {
    let touchedState = false, fingerId;

    let P, L = transform(ctx, x, y, 0, 20);

    function draw(ctx) {
        if (touchedState === true) {
            fillPath(ctx, path, L, touchedColor, "#000");
        } else {
            fillPath(ctx, path, L, "#aaa", "#000");
        }
    }

    // wird im touchmove-Event aufgerufen
    function move(id, tx, ty) {
        if (id === fingerId) {
            L = transform(ctx, tx, ty).multiplySelf(P);
        }
    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        const I = (new DOMMatrix(L)).invertSelf();  // L-1
        const localTouch = I.transformPoint(new DOMPoint(tx, ty));
        touchedState = ctx.isPointInPath(path, localTouch.x, localTouch.y);
        if (touchedState === true) {
            fingerId = id;
            P = transform(ctx, tx, ty).invertSelf().multiplySelf(L);
        }
    }

    // wird in touchend-Event aufgerufen
    function reset(id) {
        if (id === fingerId) {
            touchedState = false;
            fingerId = undefined;
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
