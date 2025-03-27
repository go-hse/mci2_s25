function polygon(ctx, x, y, noOfCorners, radius, fillStyle = "#aaa", strokeStyle = "#000", lineWidth = "3", txt = "") {
    ctx.save();
    const angle = 2 * Math.PI / noOfCorners;

    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(radius, 0);

    for (let i = 0; i < noOfCorners; ++i) {
        ctx.rotate(angle);
        ctx.lineTo(radius, 0);
    }

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.fillText(txt, 0, 0);

    ctx.restore();
}


window.onload = () => {
    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    const radius = 50;
    const distance = radius * 2.5;

    const Touches = {};
    cnv.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            Touches[t.identifier] = {
                x: t.pageX,
                y: t.pageY
            }
        }
    });

    cnv.addEventListener("touchend", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            delete Touches[t.identifier];
        }
    });

    cnv.addEventListener("touchmove", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            Touches[t.identifier] = {
                x: t.pageX,
                y: t.pageY
            }
        }
    });

    function draw() {
        ctx.font = "15px Arial";
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        const identifiers = Object.keys(Touches);
        for (let identifier of identifiers) {
            const touch = Touches[identifier];
            polygon(ctx, touch.x, touch.y, 3, 30);
        }

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}





