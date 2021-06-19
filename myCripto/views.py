from myCripto import app
from flask import jsonify, render_template, request
from http import HTTPStatus
import sqlite3


@app.route('/')
def index():
    return render_template("home.html")

@app.route('/api/v1/movimientos')
def movimientosAPI():

    conexion = sqlite3.connect("dbmovimientos.db")
    cur = conexion.cursor()

    cur.execute("SELECT * FROM  dbmovimientos;")

    claves = cur.description
    filas = cur.fetchall()
    
    movimientos = []
    for fila in filas:
        d={}
        for tclave, valor in zip(claves, fila):
         d[tclave[0]] = valor
        movimientos.append(d)

    conexion.close()
    
    return jsonify(movimientos)
    
    