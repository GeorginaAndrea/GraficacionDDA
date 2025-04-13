$(document).ready(function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    var centerX = width / 2;
    var centerY = height / 2;

    function initializeCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        // Dibujar los ejes
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Etiquetas de los ejes
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText("+X", width - 20, centerY - 5);
        ctx.fillText("-X", 10, centerY - 5);
        ctx.fillText("+Y", centerX + 5, 15);
        ctx.fillText("-Y", centerX + 5, height - 10);

        // Dibujar la cuadrícula
        ctx.strokeStyle = "green";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < width; i += 25) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 25) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    }

    function drawEllipse(centerX, centerY, rx, ry) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initializeCanvas();

        let x = 0;
        let y = ry;

        let rx2 = rx * rx;
        let ry2 = ry * ry;
        let tworx2 = 2 * rx2;
        let twory2 = 2 * ry2;
        let px = 0;
        let py = tworx2 * y;

        // Región 1
        let p = Math.round(ry2 - (rx2 * ry) + (0.25 * rx2));
        while (px < py) {
            plotEllipsePoints(centerX, centerY, x, y);
            x++;
            px += twory2;
            if (p < 0) {
                p += ry2 + px;
            } else {
                y--;
                py -= tworx2;
                p += ry2 + px - py;
            }
        }

        // Región 2
        p = Math.round(ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2);
        while (y >= 0) {
            plotEllipsePoints(centerX, centerY, x, y);
            y--;
            py -= tworx2;
            if (p > 0) {
                p += rx2 - py;
            } else {
                x++;
                px += twory2;
                p += rx2 - py + px;
            }
        }
    }

    function plotEllipsePoints(cx, cy, x, y) {
        drawLine(cx, cy, cx + x, cy + y);
        drawLine(cx, cy, cx - x, cy + y);
        drawLine(cx, cy, cx + x, cy - y);
        drawLine(cx, cy, cx - x, cy - y);
    }

    function drawLine(x0, y0, x1, y1) {
        let dx = x1 - x0;
        let dy = y1 - y0;
        let steps = Math.max(Math.abs(dx), Math.abs(dy));
        let xIncrement = dx / steps;
        let yIncrement = dy / steps;
        let x = x0;
        let y = y0;

        for (let i = 0; i <= steps; i++) {
            ctx.fillStyle = "red";
            ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
            x += xIncrement;
            y += yIncrement;
        }
    }

    $("#drawEllipseButton").click(function () {
        let rx = parseInt($("#radioX").val());
        let ry = parseInt($("#radioY").val());
        drawEllipse(centerX, centerY, rx, ry);
    });

    $("#erasebutton").click(function () {
        initializeCanvas();
    });

    initializeCanvas();
});
