function polygon(ctx, x, y, noOfCorners, radius, fillStyle, strokeStyle, lineWidth, txt) {
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

    function draw() {
        ctx.font = "15px Arial";

        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        for (let i = 3; i <= 8; ++i) {
            polygon(ctx, (i - 2) * distance, distance, i, radius, "#aaa", "#000", 3, `${i}-Eck`);
        }


        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}





