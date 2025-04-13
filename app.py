from flask import Flask, render_template, request
from collections import defaultdict

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    region1_table = []
    region2_table = []
    ellipse_lines = defaultdict(list)  # Agrupar puntos por coordenada Y
    points = []
    
    # Cuadrantes para los puntos
    quad1_table = []
    quad2_table = []
    quad3_table = []
    quad4_table = []

    if request.method == 'POST':
        xc = int(request.form['xc'])
        yc = int(request.form['yc'])
        rx = int(request.form['rx'])
        ry = int(request.form['ry'])

        x = 0
        y = ry
        rx2 = rx ** 2
        ry2 = ry ** 2

        # Región I
        p1 = ry2 - (rx2 * ry) + (0.25 * rx2)
        dx = 2 * ry2 * x
        dy = 2 * rx2 * y
        k = 0
        while dx < dy:
            region1_table.append({'k': k, 'pk': round(p1, 2), 'x': x, 'y': y})
            add_reflection_lines(ellipse_lines, x, y, xc, yc)
            # Calculando los cuadrantes
            quad_points(x, y, xc, yc, quad1_table, quad2_table, quad3_table, quad4_table)
            if p1 < 0:
                x += 1
                dx = 2 * ry2 * x
                p1 += dx + ry2
            else:
                x += 1
                y -= 1
                dx = 2 * ry2 * x
                dy = 2 * rx2 * y
                p1 += dx - dy + ry2
            k += 1

        # Región II
        p2 = ry2 * ((x + 0.5) ** 2) + rx2 * ((y - 1) ** 2) - rx2 * ry2
        k = 0
        while y >= 0:
            region2_table.append({'k': k, 'pk': round(p2, 2), 'x': x, 'y': y})
            add_reflection_lines(ellipse_lines, x, y, xc, yc)
            # Calculando los cuadrantes
            quad_points(x, y, xc, yc, quad1_table, quad2_table, quad3_table, quad4_table)
            if p2 > 0:
                y -= 1
                dy = 2 * rx2 * y
                p2 += rx2 - dy
            else:
                x += 1
                y -= 1
                dx = 2 * ry2 * x
                dy = 2 * rx2 * y
                p2 += dx - dy + rx2
            k += 1

    return render_template(
        'index.html',
        region1_table=region1_table,
        region2_table=region2_table,
        quad1_table=quad1_table,
        quad2_table=quad2_table,
        quad3_table=quad3_table,
        quad4_table=quad4_table,
        ellipse_lines=dict(ellipse_lines),
        rx=rx if 'rx' in locals() else 0,
        ry=ry if 'ry' in locals() else 0,
        xc=xc if 'xc' in locals() else 0,
        yc=yc if 'yc' in locals() else 0,
        points=[]  # Si deseas enviar puntos calculados
    )

def add_reflection_lines(lines, x, y, xc, yc):
    points = [
        (xc + x, yc + y),
        (xc - x, yc + y),
        (xc + x, yc - y),
        (xc - x, yc - y)
    ]
    for px, py in points:
        lines[py].append(px)

def quad_points(x, y, xc, yc, quad1, quad2, quad3, quad4):
    # Cuadrante 1 (x >= 0, y >= 0)
    quad1.append({'x': xc + x, 'y': yc + y})
    # Cuadrante 2 (x <= 0, y >= 0)
    quad2.append({'x': xc - x, 'y': yc + y})
    # Cuadrante 3 (x <= 0, y <= 0)
    quad3.append({'x': xc - x, 'y': yc - y})
    # Cuadrante 4 (x >= 0, y <= 0)
    quad4.append({'x': xc + x, 'y': yc - y})

if __name__ == '__main__':
    app.run(debug=True)
