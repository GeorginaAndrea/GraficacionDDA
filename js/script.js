$(document).ready(function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    var centerX = width / 2;
    var centerY = height / 2;
    var table = $("#pointsTable");

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
        ctx.fillStyle = "white";
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

    function drawLine() {
        let x1 = parseInt($("#x1").val());
        let y1 = parseInt($("#y1").val());
        let x2 = parseInt($("#x2").val());
        let y2 = parseInt($("#y2").val());

        // Enviar los valores al servidor Flask para calcular los puntos
        $.ajax({
            url: '/calculate',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ x1: x1, y1: y1, x2: x2, y2: y2 }),
            success: function (points) {
                initializeCanvas();
                updateTable(points);
                drawPointsOnCanvas(points);
            },
            error: function (error) {
                console.error("Error al calcular los puntos:", error);
            }
        });
    }

    function updateTable(points) {
        table.empty();
        points.forEach((point, index) => {
            table.append(`<tr><td>${index}</td><td>${point.x}</td><td>${point.y}</td></tr>`);
        });
    }

    function drawPointsOnCanvas(points) {
        ctx.fillStyle = "red";
        points.forEach((point) => {
            let screenX = centerX + point.x * 5;
            let screenY = centerY - point.y * 5;
            ctx.fillRect(screenX, screenY, 3, 3);
        });
    }

    $("#submitbutton").click(drawLine);
    $("#erasebutton").click(function () {
        initializeCanvas();
        table.empty();
    });

    initializeCanvas();
});
