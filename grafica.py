import matplotlib.pyplot as plt
import pandas as pd

class Point:
    """Clase para representar un punto en el plano."""
    def __init__(self, xr, yr):
        self.x = xr
        self.y = yr

def dda(point1, point2):
    """Algoritmo DDA para calcular los puntos de la línea."""
    dx = point2.x - point1.x
    dy = point2.y - point1.y

    cambio = max(abs(dx), abs(dy))  # Determinar el número de pasos

    incremento_x = dx / cambio
    incremento_y = dy / cambio

    puntos = []
    x, y = point1.x, point1.y

    for i in range(int(cambio) + 1):
        puntos.append((i, round(x), round(y)))  # Guardar en formato (índice, X, Y)
        x += incremento_x
        y += incremento_y

    return puntos

def plot_line(point1, point2):
    """Función para graficar la línea generada por DDA con un plano cartesiano."""
    puntos = dda(point1, point2)

    # Extraer coordenadas x e y de los puntos
    indices, x_vals, y_vals = zip(*puntos)

    # 🔹 Imprimir en formato de tabla
    df = pd.DataFrame(puntos, columns=["#", "X", "Y"])
    print(df.to_string(index=False))  # Mostrar tabla sin índice adicional

    # 🔹 Crear la figura y los ejes
    fig, ax = plt.subplots(figsize=(8, 8))

    # Dibujar la línea generada por DDA
    ax.plot(x_vals, y_vals, color="blue", linestyle="-", linewidth=2, label="Línea DDA")  
    ax.scatter(x_vals, y_vals, color="red", marker='o', s=60, label="Puntos (DDA)")  

    # 🔹 Mejoras en el Plano Cartesiano
    ax.set_xticks(range(min(x_vals) - 2, max(x_vals) + 3))  
    ax.set_yticks(range(min(y_vals) - 2, max(y_vals) + 3))  
    ax.grid(True, which='both', linestyle="--", linewidth=0.5, color="gray")  

    # 🔹 Dibujar Ejes X y Y
    ax.axhline(0, color='black', linewidth=2)  
    ax.axvline(0, color='black', linewidth=2)  

    # 🔹 Ajustar el tamaño de los ejes
    ax.set_xlim(min(x_vals) - 2, max(x_vals) + 2)
    ax.set_ylim(min(y_vals) - 2, max(y_vals) + 2)

    # Agregar títulos y leyenda
    ax.set_title(f"Línea DDA: ({point1.x}, {point1.y}) → ({point2.x}, {point2.y})", fontsize=12)
    ax.legend()

    # Mostrar gráfico
    plt.show()

# 🔹 Prueba con los puntos solicitados
p1 = Point(10, 25)
p2 = Point(20, 40)

plot_line(p1, p2)
