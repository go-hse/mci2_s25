// import * as lib from "./js/funcs.mjs";

import { circle } from "./js/funcs.mjs"


window.onload = () => {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    let alpha = 0;
    const rect_width = 200;
    const rect_height = 20;

    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "#f00";
        ctx.translate(200, 300);

        alpha += 0.01;
        ctx.rotate(alpha);
        ctx.fillRect(0, 0, rect_width, rect_height);

        ctx.translate(0, 50);
        ctx.fillStyle = "#0f0";
        ctx.fillRect(0, 0, rect_width, rect_height);

        ctx.resetTransform();
        ctx.translate(cnv.width / 2, cnv.height / 2);
        ctx.fillStyle = "#00f";
        ctx.translate(0, 50);
        ctx.rotate(alpha);
        ctx.translate(-rect_width / 2, -rect_height / 2);
        ctx.fillRect(0, 0, rect_width, rect_height);

        ctx.scale(2, 2);
        circle(ctx, 0, 0, 50, "#f00");

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}


// window.onload = Init
// addEventListener("load", Init);


