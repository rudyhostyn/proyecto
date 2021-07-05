from werkzeug.wrappers import response
from myCripto import app
from flask import jsonify, render_template, request
from http import HTTPStatus
import sqlite3
from myCripto.dataaccess import DBmanager
from config import API_COINMARKET

import requests

dbManager = DBmanager(app.config.get('DATABASE'))

@app.route('/')
def index():
    return render_template("home.html")

@app.route('/api/v1/movimientos')
def movimientosAPI():        
    query = "SELECT * FROM dbmovimientos;"
    movimientos = dbManager.consultaMuchasSQL(query)
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
    query = """	WITH resultado AS
            (
            SELECT dbmovimientos.moneda_from AS monedaCodigo , -Sum(dbmovimientos.cantidad_from) AS total FROM dbmovimientos GROUP by moneda_from
            UNION ALL
            SELECT dbmovimientos.moneda_to AS monedaCodigo , Sum(dbmovimientos.cantidad_to) AS total FROM dbmovimientos GROUP BY	moneda_to
            )
            SELECT monedaCodigo, sum(total) AS monedaSaldo FROM resultado GROUP BY monedaCodigo;"""
    movimientos = dbManager.consultaMuchasSQL(query)

    try:
        return jsonify({'status': 'success', 'movimientos': movimientos})
    except sqlite3.Error as e:
        return jsonify({'status': 'fail', 'mensaje': str(e)})

@app.route('/api/v1/par/<_from>/<_to>/<quantity>')
@app.route('/api/v1/par/<_from>/<_to>')
def par(_from, _to, quantity = 1.0):
    clave = API_COINMARKET
    url = f"https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount={quantity}&symbol={_from}&convert={_to}&CMC_PRO_API_KEY={API_COINMARKET}"
      
    res = requests.get(url)
    return res.text

@app.route('/api/v1/inversion')
def inversionAPI():

    conexion = sqlite3.connect("dbmovimientos.db")
    cur = conexion.cursor()

    cur.execute('''SELECT dbmovimientos.moneda_from AS monedaCodigo , Sum(dbmovimientos.cantidad_from) AS total 
                    FROM dbmovimientos 
                    WHERE moneda_from="EUR" 	
                    GROUP by moneda_from;''')

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

@app.route('/api/v1/unicos')
def unicos():
    query = """	
            WITH unicos AS (
                WITH resultado AS (
                    SELECT dbmovimientos.moneda_from AS monedaCodigo , -Sum(dbmovimientos.cantidad_from) AS total FROM dbmovimientos GROUP by moneda_from
                    UNION ALL
                    SELECT dbmovimientos.moneda_to AS monedaCodigo , Sum(dbmovimientos.cantidad_to) AS total FROM dbmovimientos GROUP BY	moneda_to
                )
                SELECT monedaCodigo, sum(total) AS monedaSaldo FROM resultado GROUP BY monedaCodigo
            )
            SELECT monedaCodigo  FROM unicos WHERE monedaSaldo <> 0;"""
    movimientos = dbManager.consultaMuchasSQL(query)

    try:
        return jsonify({'status': 'success', 'movimientos': movimientos})
    except sqlite3.Error as e:
        return jsonify({'status': 'fail', 'mensaje': str(e)})