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

export function createButton(x, y, radius, callback, color = "#444", touchedColor = "#f44") {
    let touchedState = false, fingerId;

    function draw(ctx) {
        if (touchedState === true) {
            circle(ctx, x, y, radius, touchedColor);
        } else {
            circle(ctx, x, y, radius, color);
        }
    }

    // wird in touchstart-Event aufgerufen
    function isTouched(id, tx, ty) {
        touchedState = distance(x, y, tx, ty) <= radius;
        if (touchedState === true) {
            fingerId = id;
            callback();
        }
    }

    // wird in touchend-Event aufgerufen
    function reset(id) {
        if (id === fingerId) {
            touchedState = false;
            fingerId = undefined;
        }

    }

    return { draw, isTouched, reset };

}


export class Button {
    constructor(ctx, x, y, radius = 100, callback, color = "#f00", touchedColor = "#ff0") {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.touchedColor = touchedColor;
        this.isTouched = false;
        this.touchID = undefined;
        this.callback = callback;
    }

    draw() {
        if (this.isTouched)
            circle(this.ctx, this.x, this.y, this.radius, this.touchedColor);
        else
            circle(this.ctx, this.x, this.y, this.radius, this.color);
    }

    isTouched(id, tx, ty) {
        this.isTouched = distance(this.x, this.y, tx, ty) < radius;
        if (this.isTouched) {
            this.touchID = id;
            this.callback();
        }
    }

    reset(id) {
        if (this.touchID === id) {
            this.touchID = undefined;
            this.isTouched = false;
        }
    }

}
