// import * as lib from "./js/funcs.mjs";

import { circle } from "./js/funcs.mjs"

// äußere Funktion
window.onload = () => {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");

    // innere Funktionen
    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    let ball = {
        x: 0,
        y: 0,
        radius: 50,
        color: "#f00"
    };

    let ball_speed = {
        x: 10,
        y: 10
    };


    let start_time = new Date();


    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        circle(ctx, ball.x, ball.y, ball.radius, ball.color);
        ball.x += ball_speed.x;
        ball.y += ball_speed.y;

        if (ball.x + ball.radius > cnv.width || ball.x - ball.radius < 0) {
            ball_speed.x *= -1;
        }
        if (ball.y + ball.radius > cnv.height || ball.y - ball.radius < 0) {
            ball_speed.y *= -1;
        }
        let now = new Date();
        let elapsed = now - start_time;
        let framerate = 1000 / elapsed;

        start_time = now;

        console.log(`${framerate} fps ${elapsed} ms`);
        window.requestAnimationFrame(draw);
    }
    resize();

    ball.x = cnv.width / 2;
    ball.y = cnv.height / 2;

    draw();
}





