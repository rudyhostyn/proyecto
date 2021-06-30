
const descMonedas = {
    EUR: 'Euro',
    BTC: 'Bitcoin', 
/*    ETH: 'Ethereum',
    XRP: 'XRP', 
    LTC: 'Debian', 
    BCH: 'Bitcoin Cash',
    BNB: 'Binance Coin',
    USDT: 'Tether',
    EOS: 'EOS',
    BSV: 'Bitcoin SV',
    XLM: 'Stellar',
    ADA: 'Cardano',
    TRX: 'TRON'*/
}

function sacaValorUnico(){
    var status = 0
    var listaMonedasCod = Object.keys(descMonedas)
    var listaMonedasVal = Object.values(descMonedas)
    for (var i = 0; i < listaMonedasCod.length; i++) {  
        codMoneda = listaMonedasCod[i]
        codMonedaVal = listaMonedasVal[i]
        var tt = document.getElementsByClassName(`v_${codMoneda}`)
        if (tt.length > 0){
        cantidadMonedas = `document.querySelector('.c_${codMoneda}').innerHTML` 
        Cantidadmonedas = eval(cantidadMonedas)
        valorMonedaStr = valorActualMonedas[codMonedaVal]
        valorMonedaFlt = parseFloat(valorMonedaStr)
        status = parseFloat(status) + parseFloat(valorMonedaFlt) * parseFloat(Cantidadmonedas)
        }
    }
    var dondeColocoStatus = document.querySelector("#colocarStatus")
    fila = document.createElement("p")
    fila.innerHTML = status
    dondeColocoStatus.appendChild(fila)

    var dondeColocoInversion = document.querySelector("#colocarInversion")
    fila2 = document.createElement("p")
    valor2 = document.querySelector(".c_EUR").innerHTML
    fila2.innerHTML = -valor2
    dondeColocoInversion.appendChild(fila2)
    console.log(status-valor2)

    var colocarSaldoActual = document.querySelector("#colocarSaldoActual")
    fila2 = document.createElement("p")
    valor3 = status-valor2
    fila2.innerHTML = valor3
    colocarSaldoActual.appendChild(fila2)
}
const xhr2 = new XMLHttpRequest()

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
    sacaValorUnico();
}
var ultimaCantidadFromActualizada
function grabaCantidadAComprar() {
    /* Creamos esta variable para evitar grabar un valor sin actualizar previamente */
    valor = document.querySelector("#cantidadFrom").value
    ultimaCantidadFromActualizada = parseFloat(valor)
    console.log(ultimaCantidadFromActualizada)    
}

var unicos =[]

function muestraSaldoMonedas(){
    if (this.readyState === 4 && this.status === 200) {
        const resp1 = JSON.parse(this.responseText)

        if (resp1.status !== 'success') {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }

        
        console.log(this.responseText)
        /*Calculamos las monedas que tienen saldo -> unicos*/
        const distinto = (valor, indice, self) => {
            return self.indexOf(valor) === indice;
        }
        var unique =[] 
        for (let i = 0; i < resp1.movimientos.length; i++){
            const movimiento = resp1.movimientos[i]
            if (movimiento.monedaSaldo !== 0.0) {
                var total = unique.push(movimiento.monedaCodigo)
            }
        }
        if (resp1.movimientos.length === 0){        
            var total = unique.push("EUR")
        }
        var unicos = unique.filter(distinto)
        console.log(this.responseText)
            
        /* Campo lista desplegable: solo aparecen valores que tengan saldo y siempre euro */
        for (let i = 0; i < unique.length; i++){
            const filas = document.createElement("option")
            filas.setAttribute("value", unique[i])
            const monedaDentro =`<td id="c_moneda_from">${unique[i] ? descMonedas[unique[i]] : ""}</td>`
            filas.innerHTML = monedaDentro
            monedasStock = document.querySelector("#monedaFrom")
            monedasStock.appendChild(filas)
        }
        /* Tabla que muestra las monedas que tienen saldo y su saldo */
        aaa=document.querySelector("#situacionMonedas")
        for (let i = 0; i < resp1.movimientos.length; i++){
            const movimiento = resp1.movimientos[i]
            if (movimiento.monedaSaldo !== 0.0) {
            const fila = document.createElement("tr")
            const monedaCod =`
                <td class ="v_${movimiento.monedaCodigo}">${movimiento.monedaCodigo ? descMonedas[movimiento.monedaCodigo] : ""}</td>        
                <td class ="c_${movimiento.monedaCodigo}">${movimiento.monedaSaldo}</td>
                `
            fila.innerHTML = monedaCod
            aaa.appendChild(fila)  
            }
        }       
    } 
    llamaApiMovimientos();       
    
}
function capturaFormMovimiento() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const grabacion = {}
    grabacion.date = date
    grabacion.time = time
    grabacion.moneda_from = document.querySelector("#monedaFrom").value
    grabacion.cantidad_from = document.querySelector("#cantidadFrom").value
    grabacion.moneda_to = document.querySelector("#monedaTo").value
    grabacion.cantidad_to = document.querySelector("#cantidadTo").innerHTML
    return grabacion    
}
function borrado(){

    document.querySelectorAll('.paraBorrar').forEach(e => e.remove());
    /*llamaApiMovimientos();
    actualizaSaldoMonedas();
    sacaValorUnico();*/
    window.location.reload()
}
function valida1(){
    /* control de no vender y comprar la misma moneda */
    var monedaAvender = document.querySelector("#monedaFrom").value
    var monedaAcomprar = document.querySelector("#monedaTo").value
    if (monedaAcomprar === monedaAvender) {
        alert("La moneda a comprar y a vender no pueden ser las mismas")
        borrado()
    }else{
    valida2();
    }
}
function valida2(){
    /* Control de no vender mas de lo que tenemos excepto el Euro*/ 
    var cantidadMaximaVenta = 0
    var cantidadAVenderStr = document.querySelector("#cantidadFrom").value
    var cantidadAVenderFlt = parseFloat(cantidadAVenderStr)
       
    if (document.querySelector("#situacionMonedas").innerHTML.length === 0) {
        var cantidadMaximaVenta = cantidadAVenderFlt+1
    }else{
        var cantidadMaximaVenta = document.querySelector(`.c_${document.querySelector("#monedaFrom").value}`).innerHTML
    }
        if(document.querySelector("#monedaFrom").value !== "EUR"){
            if((cantidadMaximaVenta-cantidadAVenderFlt)>=0){
                valida3();
                }else{
                    alert("No puedes vender tantas monedas")
                    borrado()
                }
            }else{
                valida3();
            }
    
}
function valida3(){    
    /* Cantidad a vender sin valor */
    valorCasillaCantidadAComprarStr = document.querySelector("#cantidadTo").innerHTML
    valorCasillaCantidadAComprarFlt = parseFloat(valorCasillaCantidadAComprarStr)
    if (valorCasillaCantidadAComprarFlt !== 0 && valorCasillaCantidadAComprarStr !== ""){
        valida4();
        }else{
            alert("No has puesto valor de venta")
            borrado()
        }
    }    
function valida4(){
    /* No se realiza la operación si se cambia la cantidad a comprar y no se actualiza */
    valorStr = document.querySelector("#cantidadFrom").value
    valorFlt = parseFloat(valorStr)
    if (ultimaCantidadFromActualizada === valorFlt){
        llamaApiCreaMovimiento()
        }else{
            alert("Ha cambiado la cantidad a vender y no has actualizado")
            borrado()
        }
    
}
function llamaApiCreaMovimiento() {

    const grabacion = capturaFormMovimiento()
        
    xhr2.open("POST", `http://localhost:5000/api/v1/movimiento`, true)
    xhr2.onload = borrado

    xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

    xhr2.send(JSON.stringify(grabacion))
}
function actualizaSaldoMonedas() {
    const grabacion = capturaFormMovimiento()

    xhr2.open("GET", `http://localhost:5000//api/v1/saldo`, true)
    xhr2.onload = muestraSaldoMonedas
    xhr2.send()
}
function llamaApiMovimientos() {
    
    xhr2.open('GET', `http://localhost:5000/api/v1/movimientos`, true)
    xhr2.onload = muestraMovimientos
    xhr2.send()
}

var index = Object.keys(descMonedas)
var valorActualMonedas = {}
var claveApi = "0b92c0c3-80c0-40a5-8611-295434c86c96"

function sacaValorMonedas(){
    for (var i = 0; i < index.length; i++) {
        var url = `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&symbol=${index[i]}&convert=EUR&CMC_PRO_API_KEY=0b92c0c3-80c0-40a5-8611-295434c86c96`
        let xhr6 = new XMLHttpRequest();
        xhr6.open("GET", url);
        xhr6.onreadystatechange = function() {
            if(xhr6.readyState === XMLHttpRequest.DONE && xhr6.status === 200) {
                var data = JSON.parse(xhr6.responseText);
                divisa2 = Object.keys(data.data.quote)[0]
                valor = `data.data.quote.${divisa2}.price`    
                valorActualMonedas[data.data.name] = eval(valor)
            }
            actualizaSaldoMonedas();       
        }
    xhr6.send();
    }
}
window.onload = function() {
    sacaValorMonedas();     
    document.querySelector("#grabaValor")
        .addEventListener("click", valida1)
    document.querySelector("#actualizaValor")
        .addEventListener("click", grabaCantidadAComprar)    
}