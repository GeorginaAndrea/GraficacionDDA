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

        // 📌 Dibujar los ejes
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // 📌 Etiquetas de los ejes
        ctx.fillStyle = "blue";
        ctx.font = "14px Arial";
        ctx.fillText("X", width - 20, centerY - 5);
        ctx.fillText("-X", 10, centerY - 5);
        ctx.fillText("Y", centerX + 5, 15);
        ctx.fillText("-Y", centerX + 5, height - 10);

        // 📌 Dibujar la cuadrícula
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

    function dda(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let steps = Math.max(Math.abs(dx), Math.abs(dy));
        let xInc = dx / steps;
        let yInc = dy / steps;

        let x = x1;
        let y = y1;
        let points = [];

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(centerX + x * scale, centerY - y * scale); // Mover al primer punto

        for (let i = 0; i <= steps; i++) {
            let screenX = centerX + x * scale;
            let screenY = centerY - y * scale;
            ctx.lineTo(screenX, screenY);  // Conectar al siguiente punto
            points.push({ x: Math.round(x), y: Math.round(y) });
            x += xInc;
            y += yInc;
        }

        ctx.stroke();  // Traza la línea

        return points;
    }

    // 📌 Función para calcular la escala dinámica
    function calculateScale(x1, y1, x2, y2) {
        let maxX = Math.max(Math.abs(x1), Math.abs(x2));
        let maxY = Math.max(Math.abs(y1), Math.abs(y2));
        
        // Calculamos un factor de escala, por ejemplo, que el mayor valor no ocupe más de 1/2 del canvas
        let scaleX = width / (2 * maxX);
        let scaleY = height / (2 * maxY);
        
        return Math.min(scaleX, scaleY); // Elegir el mínimo de ambos para que todo se vea en el canvas
    }

    function drawLine() {
        let x1 = parseInt($("#x1").val());
        let y1 = parseInt($("#y1").val());
        let x2 = parseInt($("#x2").val());
        let y2 = parseInt($("#y2").val());

        // 📌 Calcular la escala adecuada
        scale = calculateScale(x1, y1, x2, y2);

        initializeCanvas();
        let points = dda(x1, y1, x2, y2);
        updateTable(points);
    }

    function updateTable(points) {
        table.empty();
        points.forEach((point, index) => {
            table.append(`<tr><td>${index}</td><td>${point.x}</td><td>${point.y}</td></tr>`);
        });
    }

    $("#submitbutton").click(drawLine);
    $("#erasebutton").click(function () {
        initializeCanvas();
        table.empty();
    });

    let scale = 5; // Inicializamos la escala con un valor predeterminado
    initializeCanvas();
});
