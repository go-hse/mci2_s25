

function transform(ctx, x, y, alpha = 0, sc = 1) {
    ctx.resetTransform();
    ctx.translate(x, y);
    ctx.rotate(alpha);
    ctx.scale(sc, sc);

    const M = ctx.getTransform();
    return M;
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


export function createInteractivePath(ctx, x, y, path, color = "#444", touchedColor = "#f44") {
    let fingerIdOne, fingerIdTwo, x1, y1, x2, y2, initialDistance;

    console.log("createInteractivePath", new Date());
    let P, L = transform(ctx, x, y, 0, 20);

    function draw(ctx) {
        if (fingerIdOne !== undefined) {
            fillPath(ctx, path, L, touchedColor, "#000");
        } else {
            fillPath(ctx, path, L, "#aaa", "#000");
        }

        if (fingerIdOne !== undefined) {
            circle(ctx, x1, y1, 10, "#fff");
        }

        if (fingerIdTwo !== undefined)
            circle(ctx, x2, y2, 10, "#f0f");

    }

    // wird im ggfs. 2x im touchmove-Event aufgerufen
    function move(id, tx, ty) {
        if (id === fingerIdOne) {
            x1 = tx; y1 = ty;
        }
        if (id === fingerIdTwo) {
            x2 = tx; y2 = ty;
        }

        if (fingerIdOne !== undefined && fingerIdTwo !== undefined) {
            // 2 Finger aktiv: nur Translation und Drehung
            const currentDistance = distance(x1, y1, x2, y2);
            const alpha = Math.atan2(y2 - y1, x2 - x1);
            L = transform(ctx, x1, y1, alpha, currentDistance / initialDistance).multiplySelf(P); // L = Tn * P
        } else if (fingerIdOne !== undefined) {
            // nur 1 Finger aktiv Translation, keine Drehung
            L = transform(ctx, x1, y1, 0).multiplySelf(P); // L = Tn * P

        }
    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        if (fingerIdOne === undefined) {
            const I = (new DOMMatrix(L)).invertSelf();  // L-1
            const localTouch = I.transformPoint(new DOMPoint(tx, ty));
            let touchedState = ctx.isPointInPath(path, localTouch.x, localTouch.y);
            if (touchedState) {
                fingerIdOne = id;
                x1 = tx; y1 = ty;
                console.log("1", id);
                P = transform(ctx, x1, y1).invertSelf().multiplySelf(L);  // Formel für P = Ti-1 Li
            }
        } else {
            if (fingerIdTwo === undefined) {
                fingerIdTwo = id;
                x2 = tx; y2 = ty;
                initialDistance = distance(x1, y1, x2, y2);
                const alpha = Math.atan2(y2 - y1, x2 - x1);
                console.log("2", id);
                P = transform(ctx, x1, y1, alpha).invertSelf().multiplySelf(L);  // Formel für P = Ti-1 Li
            }
        }
    }

    // wird in touchend-Event aufgerufen
    function reset(id) {
        if (id === fingerIdOne) {
            fingerIdOne = undefined;
            fingerIdTwo = undefined;
        }
        if (id === fingerIdTwo) {
            fingerIdTwo = undefined;
            P = transform(ctx, x1, y1).invertSelf().multiplySelf(L);  // Formel für P = Ti-1 Li
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
