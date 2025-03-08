$(document).ready(function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    var width = canvas.width;
    var height = canvas.height;
    var centerX = width / 2;
    var centerY = height / 2;

    // Variables para las tablas
    var tableAB = $("#pointsTableAB");
    var tableBC = $("#pointsTableBC");
    var tableCA = $("#pointsTableCA");

    // Variable para almacenar la escala
    let scale = 1;

    // Función para inicializar el canvas
    function initializeCanvas() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        // Dibujar los ejes
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Etiquetas de los ejes
        ctx.fillStyle = "blue";
        ctx.font = "14px Arial";
        ctx.fillText("X", width - 20, centerY - 5);
        ctx.fillText("-X", 10, centerY - 5);
        ctx.fillText("Y", centerX + 5, 15);
        ctx.fillText("-Y", centerX + 5, height - 10);

        // Dibujar la cuadrícula
        ctx.strokeStyle = "green";
        ctx.lineWidth = 0.5;

        // Espacio entre cuadros (en píxeles)
        const gridSpacing = 20;

        // Dibujar cuadrícula y etiquetas en el eje X
        for (let i = 0; i <= width; i += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();

            // Calcular el valor en coordenadas
            let valueX = (i - centerX) / scale;

            // Dibujar etiqueta solo si no es el centro
            if (Math.abs(valueX) > 0.1) { // Evitar el centro (0)
                ctx.fillText(Math.round(valueX).toString(), i - 10, centerY + 15);
            }
        }

        // Dibujar cuadrícula y etiquetas en el eje Y
        for (let i = 0; i <= height; i += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();

            // Calcular el valor en coordenadas
            let valueY = (centerY - i) / scale;

            // Dibujar etiqueta solo si no es el centro
            if (Math.abs(valueY) > 0.1) { // Evitar el centro (0)
                ctx.fillText(Math.round(valueY).toString(), centerX + 5, i + 5);
            }
        }
    }

    // Algoritmo DDA para dibujar una línea
    function dda(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let steps = Math.max(Math.abs(dx), Math.abs(dy), 1); // Asegura que steps sea al menos 1

        let xInc = dx / steps;
        let yInc = dy / steps;

        let x = x1;
        let y = y1;
        let points = [];

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(centerX + x * scale, centerY - y * scale);

        for (let i = 0; i <= steps; i++) {
            let screenX = centerX + x * scale;
            let screenY = centerY - y * scale;
            ctx.lineTo(screenX, screenY);
            points.push({ x: Math.round(x), y: Math.round(y) });
            x += xInc;
            y += yInc;
        }

        ctx.stroke();
        return points;
    }

    // Función para rellenar el triángulo con líneas desde un punto fijo
    function fillTriangleWithLines(x1, y1, x2, y2, x3, y3) {
        // Convertir las coordenadas del triángulo a coordenadas de pantalla
        let p1 = { x: centerX + x1 * scale, y: centerY - y1 * scale };
        let p2 = { x: centerX + x2 * scale, y: centerY - y2 * scale };
        let p3 = { x: centerX + x3 * scale, y: centerY - y3 * scale };

        // Seleccionar el punto fijo (Xc, Yc)
        let fixedPoint = p3; // Usamos el punto C como punto fijo

        // Generar las líneas AB, BC y CA usando DDA
        let lineAB = dda(x1, y1, x2, y2);
        let lineBC = dda(x2, y2, x3, y3);
        let lineCA = dda(x3, y3, x1, y1);

        // Rellenar el triángulo con líneas desde el punto fijo
        function fillWithLines(points) {
            points.forEach(point => {
                let screenX = centerX + point.x * scale;
                let screenY = centerY - point.y * scale;

                // Dibujar una línea desde el punto fijo hasta el punto actual
                ctx.beginPath();
                ctx.moveTo(fixedPoint.x, fixedPoint.y);
                ctx.lineTo(screenX, screenY);
                ctx.strokeStyle = "red"; // Color de relleno
                ctx.lineWidth = 1;
                ctx.stroke();
            });
        }

        // Rellenar con las líneas AB, BC y CA
        fillWithLines(lineAB);
        fillWithLines(lineBC);
        fillWithLines(lineCA);

        // Actualizar las tablas con los puntos de las líneas
        updateTable(lineAB, tableAB);
        updateTable(lineBC, tableBC);
        updateTable(lineCA, tableCA);
    }

    // Función para actualizar una tabla con los puntos
    function updateTable(points, table) {
        table.empty(); // Limpiar la tabla antes de agregar nuevos puntos
        points.forEach((point, index) => {
            table.append(`
                <tr>
                    <td>${index}</td>
                    <td>${point.x}</td>
                    <td>${point.y}</td>
                </tr>
            `);
        });
    }

    // Función para dibujar un triángulo
    function drawTriangle(x1, y1, x2, y2, x3, y3) {
        // Rellenar el triángulo con líneas desde un punto fijo
        fillTriangleWithLines(x1, y1, x2, y2, x3, y3);
    }

    // Función para calcular la escala dinámica
    function calculateScale(x1, y1, x2, y2, x3, y3) {
        let maxX = Math.max(Math.abs(x1), Math.abs(x2), Math.abs(x3));
        let maxY = Math.max(Math.abs(y1), Math.abs(y2), Math.abs(y3));
        let scaleX = (width / 2) / maxX;
        let scaleY = (height / 2) / maxY;
        return Math.min(scaleX, scaleY);
    }

    // Función para dibujar el triángulo y actualizar la tabla
    function draw() {
        let x1 = parseInt($("#x1").val());
        let y1 = parseInt($("#y1").val());
        let x2 = parseInt($("#x2").val());
        let y2 = parseInt($("#y2").val());
        let x3 = parseInt($("#x3").val());
        let y3 = parseInt($("#y3").val());

        // Calcular la escala
        scale = calculateScale(x1, y1, x2, y2, x3, y3);

        // Inicializar el canvas y dibujar el triángulo
        initializeCanvas();
        drawTriangle(x1, y1, x2, y2, x3, y3);
    }

    // Eventos de los botones
    $("#submitbutton").click(draw);
    $("#erasebutton").click(function () {
        initializeCanvas();
        tableAB.empty();
        tableBC.empty();
        tableCA.empty();
    });

    // Inicializar el canvas al cargar la página
    initializeCanvas();
});