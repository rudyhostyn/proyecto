

/* dia 22 3:25:00*/

function muestraMovimientos() {
    
    if (this.readyState === 4 && this.status === 200) {
        const resp = JSON.parse(this.responseText)

        if (resp.status !== 'success') {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }
        
        for (let i = 0; i < resp.movimientos.length; i++){
            const movimiento = resp.movimientos[i]
            const fila = document.createElement("tr")
            fila.classList.add('paraBorrar')
            const dentro =`
                <td id="c_date">${movimiento.date}</td>        
                <td id="c_time">${movimiento.time}</td>
                <td id="c_moneda_from">${movimiento.moneda_from}</td>
                <td id="c_cantidad_from">${movimiento.cantidad_from}</td>
                <td id="c_moneda_to">${movimiento.moneda_to}</td>
                <td id="c_cantidad_to">${movimiento.cantidad_to}</td>
            `
            fila.innerHTML = dentro
            tbody = document.querySelector(".tabla-movimientos tbody")
            tbody.appendChild(fila)
        }
    } 
}
function capturaFormMovimiento() {
    const grabacion = {}
    grabacion.date = "2021-01-19"
    grabacion.time = "10:25:45.000"
    grabacion.moneda_from = document.querySelector("#monedaFrom").value
    grabacion.cantidad_from = document.querySelector("#cantidadFrom").value
    grabacion.moneda_to = document.querySelector("#monedaTo").value
    grabacion.cantidad_to = "58"
    return grabacion    
}
function borrado(){
    document.querySelectorAll('.paraBorrar').forEach(e => e.remove());
    muestraMovimientos
    console.log("hola")
}
function llamaApiCreaMovimiento() {

    const grabacion = capturaFormMovimiento()

    xhr2.open("POST", `http://localhost:5000/api/v1/movimiento`, true)
    xhr2.onload = borrado

    xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

    xhr2.send(JSON.stringify(grabacion))
}

const xhr2 = new XMLHttpRequest()
xhr2.onload = muestraMovimientos

function llamaApiMovimientos() {
    
    xhr2.open('GET', `http://localhost:5000/api/v1/movimientos`, true)
    xhr2.send()
}


window.onload = function() {
    llamaApiMovimientos()
    document.querySelector("#grabaValor")
        .addEventListener("click", llamaApiCreaMovimiento)
}