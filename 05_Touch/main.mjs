import { circle, createButton, Button, createUpath, fillPath } from "./js/funcs.mjs"

window.onload = () => {
    const cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    const u_path = createUpath();

    let counter = 0;
    function onBtn() {
        ++counter;
        console.log("Button", counter);
    }

    const interactiveObjects = [];

    interactiveObjects.push(createButton(100, 50, 40, onBtn));
    interactiveObjects.push(createButton(100, 150, 40, () => {
        console.log("Button 2", counter)
    }));
    interactiveObjects.push(new Button(ctx, 100, 250, 40, onBtn, "#f00"));

    let cx, cy;
    // callback: innere Funktion
    function onTouchStart(ev) {
        for (let event of ev.changedTouches) {
            cx = event.pageX;
            cy = event.pageY;
            let id = event.identifier;
            console.log("Touchstart", cx, cy, id);
            for (let io of interactiveObjects) {
                io.isTouched(id, cx, cy);
            }
        }
    }

    function onTouchEnd(ev) {
        for (let event of ev.changedTouches) {
            let id = event.identifier;
            console.log("Touchend", id);
            for (let io of interactiveObjects) {
                io.reset(id);
            }
        }
    }

    cnv.addEventListener("touchstart", onTouchStart);
    cnv.addEventListener("touchend", onTouchEnd);

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        circle(ctx, cx, cy, 10, "#f00");
        for (let io of interactiveObjects) {
            io.draw(ctx);
        }

        fillPath(ctx, u_path, 200, 200, 30);

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}





