
const descMonedas = {
    EUR: 'Euro',
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    XRP: 'XRP', 
    LTC: 'Debian', 
    BCH: 'Bitcoin Cash',
    BNB: 'Binance Coin',
    USDT: 'Tether',
    EOS: 'EOS',
    BSV: 'Bitcoin SV',
    XLM: 'Stellar',
    ADA: 'Cardano',
    TRX: 'TRON'
}
const xhr2 = new XMLHttpRequest()
const xhr3 = new XMLHttpRequest()
const xhr4 = new XMLHttpRequest()
const xhr7 = new XMLHttpRequest()
const xhr13 = new XMLHttpRequest()


var unicos = []
var saldoMon = {}
var valorActualMonedas = {}



function resultadoInversion(){
    var a = valorActualMonedas
    beneficio = 0
    console.log("valorActualMonedas al iniciar la funcion :", valorActualMonedas)
    console.log("unicos al iniciar la funcion :", unicos)
    var valor = unicos.length
    for (var i = 0; i < valor; i++){
        console.log("unicos[i] en el for :", unicos[i])
        console.log("valorActualMonedas en el for:", valorActualMonedas)
        valorMoneda=valorActualMonedas[unicos[i]]
        console.log("valorMoneda :", valorMoneda)
        console.log("saldoMon en el for:", saldoMon)
        cantidadMoneda = saldoMon[unicos[i]]
        console.log("cantidadMoneda :", cantidadMoneda)
        valorPorMoneda = valorMoneda*cantidadMoneda
        beneficio = beneficio + valorPorMoneda
    }
    var dondeColocoStatus = document.querySelector("#colocarStatus")
    fila = document.createElement("p")
    fila.innerHTML = beneficio.toFixed(2)
    dondeColocoStatus.appendChild(fila)

    var dondeColocoInversion = document.querySelector("#colocarInversion")
    fila2 = document.createElement("p")
    valorInversion = document.querySelector(".eurosInversion").innerHTML
    valorBeneficio = document.querySelector(".eurosInversion").innerHTML
    var in2 = valorInversion-valorBeneficio
    fila2.innerHTML = in2.toFixed(2)
    dondeColocoInversion.appendChild(fila2)
}




function sacaValorUnico(){
    var dondeColocoInversion = document.querySelector("#colocarInversion")
    fila2 = document.createElement("p")
    valorInversion = parseFloat(document.querySelector(".eurosInversion").innerHTML)
    valorBeneficio = parseFloat(document.querySelector("#colocarStatus").innerHTML)
    var in2 = valorInversion-valorBeneficio
    fila2.innerHTML = in2.toFixed(2)
    dondeColocoInversion.appendChild(fila2)
}

var ultimaCantidadFromActualizada
function grabaCantidadAComprar() {
    /* Creamos esta variable para evitar grabar un valor sin actualizar previamente */
    valor = document.querySelector("#cantidadFrom").value
    ultimaCantidadFromActualizada = parseFloat(valor)
    console.log(ultimaCantidadFromActualizada)    
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
        }else{
            alert("Ha cambiado la cantidad a vender y no has actualizado")
            valida5()
        }    
}
function valida5(){
    /* No se realiza la operación si se cambia la cantidad a comprar y no se actualiza */
    valorStr = document.querySelector("#cantidadFrom").value
    if (isNaN(valorStr)){
            alert("Introduce un valor numerico positivo")
            borrado()
        }else{
            llamaApiCreaMovimiento()
        }
    
}
function llamaApiCreaMovimiento() {

    const grabacion = capturaFormMovimiento()
        
    xhr2.open("POST", `http://localhost:5000/api/v1/movimiento`, true)
    xhr2.onload = borrado

    xhr2.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

    xhr2.send(JSON.stringify(grabacion))
}
function ImporteInvertido() {
    
    if (this.readyState === 4 && this.status === 200) {
        const resp = JSON.parse(this.responseText)

        if (resp.status !== 'success') {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }
        
        const movimiento = resp.movimientos[0]
        const fila = document.createElement("p")
        fila.classList.add('eurosInversion')
        const dentro = movimiento.total
        fila.innerHTML = dentro.toFixed(2)
        tbody = document.querySelector("#colocarInversion2")
        tbody.appendChild(fila)
    }
}
function llamaApiImporteInvertido() {
    
    xhr3.open('GET', `http://localhost:5000/api/v1/inversion`, true)
    xhr3.onload = ImporteInvertido
    xhr3.send()
}
function sacaValorMoneda(){
    for (let i = 0; i < unicos.length; i++) {
        console.log("sacavalor moneda - unicos: ", unicos)
        var url = `http://localhost:5000/api/v1/par/${unicos[i]}/EUR`
        let xhr6 = new XMLHttpRequest();
        xhr6.open("GET", url);
        xhr6.onreadystatechange = function() {
            if(xhr6.readyState === XMLHttpRequest.DONE && xhr6.status === 200) {
                var data = JSON.parse(xhr6.responseText);
                divisa2 = Object.keys(data.data.quote)[0]
                valor = `data.data.quote.${divisa2}.price`    
                valorActualMonedas[data.data.symbol] = eval(valor)
                valorActualMonedas["EUR"] = 1
            }                   
        }
        xhr6.send();
    }
    resultadoInversion();
}
function historicoMovimientos() {
    
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
    sacaValorMoneda();
}
function llamaApiHistoricoMovimientos() {
    
    xhr2.open('GET', `http://localhost:5000/api/v1/movimientos`, true)
    xhr2.onload = historicoMovimientos
    xhr2.send()
}
function diccionarioCantidad(){
    
    if (this.readyState === 4 && this.status === 200) {
        const resp1 = JSON.parse(this.responseText)

        if (resp1.status !== 'success') {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }
        /* Tabla que muestra las monedas que tienen saldo y su saldo */
        
        for (let i = 0; i < resp1.movimientos.length; i++){
            const movimiento = resp1.movimientos[i]
            if (movimiento.monedaSaldo !== 0.0) {            
            saldoMon[movimiento.monedaCodigo] = movimiento.monedaSaldo
            }
        }       
    }
    llamaApiHistoricoMovimientos(); 
}
function llamaApiDiccionarioCantidad(){ 
    const grabacion = capturaFormMovimiento()
    xhr13.open('GET', `http://localhost:5000/api/v1/saldo`, true)
    xhr13.onload = diccionarioCantidad
    xhr13.send()
}
function tablaMonedasCantidad(){
    
    if (this.readyState === 4 && this.status === 200) {
        const resp1 = JSON.parse(this.responseText)

        if (resp1.status !== 'success') {
            alert("Se ha producido un error en la consulta de movimientos")
            return
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
            /*saldoMonedas[movimiento.monedaCodigo] = movimiento.monedaSaldo*/
            aaa.appendChild(fila)  
            }
        }       
    }
    llamaApiDiccionarioCantidad();
    
        
}
function llamaApiTablaMonedasCantidad() {
    const grabacion = capturaFormMovimiento()

    xhr7.open("GET", `http://localhost:5000/api/v1/saldo`, true)
    xhr7.onload = tablaMonedasCantidad
    xhr7.send()
}
function MonedasConSaldo(){
    if (this.readyState === 4 && this.status === 200) {
        const resp = JSON.parse(this.responseText)

        if (resp.status !== 'success') {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }        
        for (let i = 0; i < resp.movimientos.length; i++){
            const movimiento = resp.movimientos[i]
            const filas = document.createElement("option")
            filas.setAttribute("value", movimiento[i])
            const monedaDentro =`<td id='c_moneda_from'>${movimiento.monedaCodigo ? descMonedas[movimiento.monedaCodigo] : ""}</td>`
            filas.innerHTML = monedaDentro
            monedasStock = document.querySelector("#monedaFrom")
            monedasStock.appendChild(filas)
            unicos.push(movimiento.monedaCodigo)
        }
    }
    llamaApiTablaMonedasCantidad();
}
function llamaApiMonedasConSaldo() {
    
    xhr4.open('GET', `http://localhost:5000/api/v1/unicos`, true)
    xhr4.onload = MonedasConSaldo
    xhr4.send()
}
window.onload = function() {
    llamaApiMonedasConSaldo();  
    llamaApiImporteInvertido();
    
    document.querySelector("#grabaValor")
        .addEventListener("click", valida1)
    document.querySelector("#actualizaValor")
        .addEventListener("click", grabaCantidadAComprar)    
}