$(document).ready(function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    var width = canvas.width;
    var height = canvas.height;
    var centerX = width / 2;
    var centerY = height / 2;

    // Variables para las tablas
    var octantTables = $("#octantTables");

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

    // Función para rellenar el círculo con líneas desde el centro
function fillCircle(centerX, centerY, octants) {
    ctx.strokeStyle = '#e74c3c'; // Color de las líneas de relleno
    ctx.lineWidth = 0.5; // Grosor de las líneas

    // Convertir las coordenadas del centro a coordenadas de pantalla
    let screenCenterX = centerX * scale + (canvas.width / 2);
    let screenCenterY = (canvas.height / 2) - centerY * scale;

    octants.forEach(octant => {
        octant.forEach(point => {
            // Convertir las coordenadas del punto a coordenadas de pantalla
            let screenX = point.x * scale + (canvas.width / 2);
            let screenY = (canvas.height / 2) - point.y * scale;

            // Dibujar la línea desde el centro hasta el punto
            ctx.beginPath();
            ctx.moveTo(screenCenterX, screenCenterY); // Comenzar desde el centro
            ctx.lineTo(screenX, screenY); // Dibujar hasta el punto del perímetro
            ctx.stroke();
        });
    });
}

    // Función para dibujar un círculo
    function drawCircle(centerX, centerY, radius) {
        // Enviar los valores al servidor Flask para calcular los puntos del círculo
        $.ajax({
            url: '/calculate_circle',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ r: radius, centerX: centerX, centerY: centerY }),
            success: function (octants) {
                initializeCanvas();
                drawPointsOnCanvas(octants);
                fillCircle(centerX, centerY, octants); // Rellenar el círculo
                let pk = 1 - radius; // P0 = 1 - r
                octants[0].forEach((point, k) => {
                point.n = k; // Número de iteración
                point.pk = pk; // Valor de Pk

                // Calcular Pk para la siguiente iteración
                if (pk < 0) {
                    pk = pk + 2 * (point.x - centerX) + 1;
                } else {
                    pk = pk + 2 * (point.x - centerX) + 1 - 2 * (point.y - centerY);
                }
            });

            displayOctantTables(octants);

                //displayOctantTables(octants);
            },
            error: function (error) {
                console.error("Error al calcular los puntos del círculo:", error);
            }
        });
    }

    // Función para dibujar puntos en el canvas
    function drawPointsOnCanvas(octants) {
        ctx.fillStyle = "red";
        octants.forEach(octant => {
            octant.forEach(point => {
                let screenX = centerX + point.x * scale;
                let screenY = centerY - point.y * scale;
                ctx.fillRect(screenX, screenY, 3, 3);
            });
        });
    }


    function displayOctantTables(octants) {
        octantTables.empty(); // Limpiar tablas previas
    
        octants.forEach((points, index) => {
            const table = document.createElement('table');
            table.className = 'table table-bordered mt-3'; // Aplicar clases de Bootstrap
            const caption = document.createElement('caption');
            caption.textContent = `Octante ${index + 1}`;
            table.appendChild(caption);
    
            // Encabezados de la tabla
            const headerRow = document.createElement('tr');
    
            // Agregar columnas adicionales solo para el primer octante
            if (index === 0) {
                const nHeader = document.createElement('th');
                nHeader.textContent = 'N';
                headerRow.appendChild(nHeader);
    
                const pkHeader = document.createElement('th');
                pkHeader.textContent = 'Pk';
                headerRow.appendChild(pkHeader);
            }
    
            const xHeader = document.createElement('th');
            xHeader.textContent = 'X';
            headerRow.appendChild(xHeader);
    
            const yHeader = document.createElement('th');
            yHeader.textContent = 'Y';
            headerRow.appendChild(yHeader);
    
            table.appendChild(headerRow);
    
            // Agregar cada punto a la tabla
            points.forEach((point, n) => {
                const row = document.createElement('tr');
    
                // Agregar columnas adicionales solo para el primer octante
                if (index === 0) {
                    const nCell = document.createElement('td');
                    nCell.textContent = point.n || n; // Número de iteración
                    row.appendChild(nCell);
    
                    const pkCell = document.createElement('td');
                    pkCell.textContent = point.pk || 'N/A'; // Valor de Pk
                    row.appendChild(pkCell);
                }
    
                const xCell = document.createElement('td');
                xCell.textContent = point.x;
                row.appendChild(xCell);
    
                const yCell = document.createElement('td');
                yCell.textContent = point.y;
                row.appendChild(yCell);
    
                table.appendChild(row);
            });
    
            octantTables.append(table);
        });
    }
    // Función para mostrar las tablas de los octantes
    // function displayOctantTables(octants) {
    //     octantTables.empty(); // Limpiar tablas previas

    //     octants.forEach((points, index) => {
    //         const table = document.createElement('table');
    //         table.className = 'table table-bordered mt-3';
    //         const caption = document.createElement('caption');
    //         caption.textContent = `Octante ${index + 1}`;
    //         table.appendChild(caption);

    //         // Encabezados de la tabla
    //         const headerRow = document.createElement('tr');
    //         const xHeader = document.createElement('th');
    //         xHeader.textContent = 'X';
    //         const yHeader = document.createElement('th');
    //         yHeader.textContent = 'Y';
    //         headerRow.appendChild(xHeader);
    //         headerRow.appendChild(yHeader);
    //         table.appendChild(headerRow);

    //         // Agregar cada punto a la tabla
    //         points.forEach(point => {
    //             const row = document.createElement('tr');
    //             const xCell = document.createElement('td');
    //             xCell.textContent = point.x;
    //             const yCell = document.createElement('td');
    //             yCell.textContent = point.y;
    //             row.appendChild(xCell);
    //             row.appendChild(yCell);
    //             table.appendChild(row);
    //         });

    //         octantTables.append(table);
    //     });
    // }

    // Evento para dibujar el círculo
    $("#drawCircleButton").click(function () {
        let centerX = parseInt($("#centerX").val());
        let centerY = parseInt($("#centerY").val());
        let radius = parseInt($("#radius").val());

        // Dibujar el círculo
        drawCircle(centerX, centerY, radius);
    });

    // Evento para limpiar el canvas
    $("#erasebutton").click(function () {
        initializeCanvas();
        octantTables.empty();
    });

    // Inicializar el canvas al cargar la página
    initializeCanvas();
});