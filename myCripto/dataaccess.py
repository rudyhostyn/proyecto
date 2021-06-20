import sqlite3

    
class DBmanager():
    def __init__(self, ruta_baseDatos):
        self.database_path = ruta_baseDatos

    def __toDict__(self, cur):
        # Obtenemos los datos de la consulta
        claves = cur.description
        filas = cur.fetchall()

        # Procesar los datos para devolver una lista de diccionarios. Un diccionario por fila
        resultado = []
        for fila in filas:
            d = {}
            for tclave, valor in zip(claves, fila):
                d[tclave[0]] = valor
            resultado.append(d)

        return resultado

    def modificaTablaSQL(self, query, parametros=[]):
        conexion = sqlite3.connect(self.database_path)
        cur = conexion.cursor()

        cur.execute(query, parametros)

        conexion.commit()
        conexion.close()

