from myCripto import app
from flask import jsonify, render_template, request
from http import HTTPStatus
import sqlite3
from myCripto.dataaccess import DBmanager

dbManager = DBmanager(app.config.get('DATABASE'))

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
    try:
        return jsonify({'status': 'success', 'movimientos': movimientos})
    except sqlite3.Error as e:
        return jsonify({'status': 'fail', 'mensaje': str(e)})
    
@app.route('/api/v1/movimiento', methods=['POST'])
def grabar():
    dbManager.modificaTablaSQL("""
        INSERT INTO dbmovimientos 
                    (date, time, moneda_from, cantidad_from, moneda_to, cantidad_to)
            VALUES (:date, :time, :moneda_from, :cantidad_from, :moneda_to, :cantidad_to) 
        """, request.json)
    return jsonify({"status": "success", "mensaje": "registro creado"})

@app.route('/api/v1/saldo')
def saldo():
    conexion = sqlite3.connect("dbmovimientos.db")
    cur = conexion.cursor()

    cur.execute("""WITH resultado AS
            (
            SELECT dbmovimientos.moneda_from AS moneda , -Sum(dbmovimientos.cantidad_from) AS total FROM dbmovimientos GROUP by moneda_from
            UNION ALL
            SELECT dbmovimientos.moneda_to AS moneda , Sum(dbmovimientos.cantidad_to) AS total FROM dbmovimientos GROUP BY	moneda_to
            )
            SELECT moneda, sum(total) FROM resultado GROUP BY moneda;""")
    
    claves = cur.description
    filas = cur.fetchall()
    
    movimientos = []
    for fila in filas:
        d={}
        for tclave, valor in zip(claves, fila):
         d[tclave[0]] = valor
        movimientos.append(d)

    conexion.close()
    try:
        return jsonify({'status': 'success', 'movimientos': movimientos})
    except sqlite3.Error as e:
        return jsonify({'status': 'fail', 'mensaje': str(e)})