from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Ruta principal para servir la página HTML
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para calcular los puntos de la línea usando el algoritmo DDA
@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    x1 = data['x1']
    y1 = data['y1']
    x2 = data['x2']
    y2 = data['y2']

    # Algoritmo DDA para calcular los puntos de la línea
    points = []
    dx = x2 - x1
    dy = y2 - y1
    steps = max(abs(dx), abs(dy))

    if steps == 0:
        points.append({'x': x1, 'y': y1})
    else:
        x_increment = dx / steps
        y_increment = dy / steps

        x = x1
        y = y1
        for _ in range(steps + 1):
            points.append({'x': round(x), 'y': round(y)})
            x += x_increment
            y += y_increment

    return jsonify(points)

# Ruta para calcular los puntos de un círculo usando el algoritmo del punto medio
@app.route('/calculate_circle', methods=['POST'])
def calculate_circle():
    data = request.get_json()
    r = data['r']
    centerX = data['centerX']
    centerY = data['centerY']

    # Algoritmo del punto medio para círculos
    octants = [[] for _ in range(8)]  # Lista de 8 octantes
    x = 0
    y = r
    p = 1 - r  # Parámetro de decisión inicial

    while x <= y:
        # Almacenar los puntos simétricos en los 8 octantes
        octants[0].append({'x': centerX + x, 'y': centerY + y})
        octants[1].append({'x': centerX - x, 'y': centerY + y})
        octants[2].append({'x': centerX + x, 'y': centerY - y})
        octants[3].append({'x': centerX - x, 'y': centerY - y})
        octants[4].append({'x': centerX + y, 'y': centerY + x})
        octants[5].append({'x': centerX - y, 'y': centerY + x})
        octants[6].append({'x': centerX + y, 'y': centerY - x})
        octants[7].append({'x': centerX - y, 'y': centerY - x})

        # Actualizar el valor del parámetro de decisión y los puntos (x, y)
        if p < 0:
            p += 2 * x + 3
        else:
            p += 2 * (x - y) + 5
            y -= 1
        x += 1

    return jsonify(octants)

if __name__ == '__main__':
    app.run(debug=True)