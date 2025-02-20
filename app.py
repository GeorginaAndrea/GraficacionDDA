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

if __name__ == '__main__':
    app.run(debug=True)
