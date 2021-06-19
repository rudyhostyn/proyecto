

/* dia 22 3:25:00*/

function muestraMovimientos() {
    const resp = JSON.parse(this.responseText)

    for (let i = 0; i < resp.length; i++){
        const movimiento = resp[i]
        const fila = document.createElement("tr")
        const dentro =`
            <td>${movimiento.date}</td>        
            <td>${movimiento.time}</td>
            <td>${movimiento.moneda_from}</td>
            <td>${movimiento.cantidad_from}</td>
            <td>${movimiento.moneda_to}</td>
            <td>${movimiento.cantidad_to}</td>
        `
        fila.innerHTML = dentro
        tbody = document.querySelector(".tabla-movimientos tbody")
        tbody.appendChild(fila)
    }
   
}

const xhr2 = new XMLHttpRequest()
xhr2.onload = muestraMovimientos

function llamaApiMovimientos() {
    
    xhr2.open('GET', `http://localhost:5000/api/v1/movimientos`, true)
    xhr2.send()
}

window.onload = function() {
    llamaApiMovimientos()
}