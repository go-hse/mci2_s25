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
    const radius = cnv.width / 5;

    function draw() {
        const { pHrs, pMin, pSec, hrs, min, sec } = getTime();

        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.translate(cnv.width / 2, cnv.height / 2);
        circle(ctx, 0, 0, 10, "#f00");

        // Sekunden 
        ctx.save(); // Zustand wird auf Stack gespeichert
        ctx.rotate(sec * Math.PI / 30);  // ganze Drehung: 2 PI; 1 Sekunde = PI / 30
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius);
        ctx.stroke();
        ctx.restore(); // Zustand wird von Stack wieder hergestellt

        // Minuten
        ctx.save(); // Zustand wird auf Stack gespeichert
        ctx.rotate(min * Math.PI / 30);  // ganze Drehung: 2 PI; 1 Sekunde = PI / 30
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#111";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius);
        ctx.stroke();
        ctx.restore(); // Zustand wird von Stack wieder hergestellt

        // Stunden
        ctx.save(); // Zustand wird auf Stack gespeichert
        ctx.rotate(hrs * Math.PI / 6 + (Math.PI / 360) * min);  // ganze Drehung: 2 PI; 1 Sekunde = PI / 30
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius / 2);
        ctx.stroke();
        ctx.restore(); // Zustand wird von Stack wieder hergestellt

        for (let i = 0; i < 60; ++i) {
            if (i % 5 === 0) {
                ctx.beginPath();
                ctx.moveTo(0, radius * .8);
                ctx.lineTo(0, radius);
                ctx.stroke();
                ctx.rotate(Math.PI / 30);
            } else {
                ctx.beginPath();
                ctx.moveTo(0, radius * .95);
                ctx.lineTo(0, radius);
                ctx.stroke();
                ctx.rotate(Math.PI / 30);
            }
        }

        const txt = `${pHrs}:${pMin}:${pSec}`;

        ctx.font = `${fontsize}px Verdana`;
        const bb = ctx.measureText(txt);
        const height = bb.actualBoundingBoxAscent + bb.actualBoundingBoxDescent;

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(-bb.width / 2, -40 - height - border, bb.width, height + 2 * border);

        ctx.fillStyle = "#fff";
        ctx.fillText(txt, -bb.width / 2, -height - border);

        console.log(txt);

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}





