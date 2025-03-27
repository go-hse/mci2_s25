import { createInteractivePath, createUpath } from "./js/function.mjs";

window.onload = () => {
    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    const iU = createInteractivePath(ctx, 100, 100, createUpath(), "#f00");

    const radius = 50;
    const distance = radius * 2.5;

    cnv.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            iU.isTouched(t.identifier, t.pageX, t.pageY);
        }
    });

    cnv.addEventListener("touchend", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            iU.reset(t.identifier);
        }
    });

    cnv.addEventListener("touchmove", (ev) => {
        ev.preventDefault();
        for (let t of ev.changedTouches) {
            iU.move(t.identifier, t.pageX, t.pageY);
        }
    });

    function draw() {
        ctx.font = "15px Arial";
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        iU.draw(ctx);

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}





