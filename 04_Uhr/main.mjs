import { circle, getTime } from "./js/funcs.mjs"

window.onload = () => {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    const fontsize = cnv.width / 20;
    const border = fontsize / 6;

    function draw() {
        const { pHrs, pMin, pSec, hrs, min, sec } = getTime();

        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.translate(cnv.width / 2, cnv.height / 2);
        circle(ctx, 0, 0, 10, "#f00");

        const txt = `${pHrs}:${pMin}:${pSec}`;
        // console.log(txt);

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}





