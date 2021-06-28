
/*const descMonedas = {
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
    TRX: 'TRON',
}*/

const descMonedas = {
    EUR: 'Euro',
    BTC: 'Bitcoin'    
}
var descMonedas3 = {}
function sacaUnicos(){
    var listaMonedasCod = Object.keys(descMonedas)
    var listaMonedasVal = Object.values(descMonedas)
    for (var i = 0; i < listaMonedasCod.length; i++) {  
        codMoneda = listaMonedasCod[i]
        codMonedaVal = listaMonedasVal[i]
        var tt = document.getElementsByClassName(`v_${codMoneda}`)
        if (tt.length > 0){
            descMonedas3[codMoneda] = codMonedaVal
            /*descMonedas3 = localStorage.setItem(codMoneda, codMonedaVal);*/
        }
    }
}
/*Local storage:  https://rolandocaldas.com/html5/localstorage-en-html5 

// Creamos un objeto
var object = { 'uno' : '1', 'dos' : '2' };
// Lo guardamos en localStorage pasandolo a cadena con JSON
localStorage.setItem('key', JSON.stringify(object));
// Creamos una nueva variable object2 con el valor obtenido de localStorage usando JSON recuperar el objeto inicial
var object2 = JSON.parse(localStorage.getItem('key'));
// La alerta mostrará 1 por pantalla
alert(object2.uno);*/

var status = 0
function sacaValorUnico(){
    var listaMonedasCod = Object.keys(descMonedas2)
    var listaMonedasVal = Object.values(descMonedas2)
    for (var i = 0; i < listaMonedasCod.length; i++) {  
        codMoneda = listaMonedasCod[i]
        codMonedaVal = listaMonedasVal[i]
        var tt = document.getElementsByClassName(`v_${codMoneda}`)
        if (tt.length > 0){
        cantidadMonedas = `document.querySelector('.c_${codMoneda}').innerHTML` 
        Cantidadmonedas = eval(cantidadMonedas)
        valorMonedaStr = valorActualMonedas[codMonedaVal]
        valorMonedaFlt = parseFloat(valorMonedaStr)
        console.log("codMoneda: " + codMoneda)
        console.log("Cantidadmonedas: " + Cantidadmonedas)
        console.log("cantidadMonedas: " + cantidadMonedas)
        console.log("codMonedaVal: " + codMonedaVal)
        console.log("valorMonedaStr: " + valorMonedaStr)
        console.log("valorMonedaFlt: " + valorMonedaFlt)
        status = parseFloat(status) + parseFloat(valorMonedaFlt) * parseFloat(Cantidadmonedas)
        }
    }
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
        /* Calculamos las monedas que tienen saldo -> unicos */
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
      
        
        /* Campo lista desplegable: solo aparecen valores que tengan saldo y siempre euro */
        for (let i = 0; i < unicos.length; i++){
            const filas = document.createElement("option")
            filas.setAttribute("value", unicos[i])
            const monedaDentro =`<td id="c_moneda_from">${unicos[i] ? descMonedas[unicos[i]] : ""}</td>`
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
    sacaValorMonedas();
    sacaUnicos();
    
    console.log(valorActualMonedas);
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
    llamaApiMovimientos();
    actualizaSaldoMonedas();
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


window.onload = function() {
    actualizaSaldoMonedas();
    document.querySelector("#grabaValor")
        .addEventListener("click", valida1)
    document.querySelector("#status")
        .addEventListener("click", sacaValorUnico)
    document.querySelector("#actualizaValor")
        .addEventListener("click", grabaCantidadAComprar)
    
}