/*var datoValor = document.querySelector("#datoValor")
datoValor.classList.add("row")*/

function gestionaRespuestaAsincrona(){
    console.log(valorActualMonedas);

    if (this.readyState === 4 && this.status === 200) {
        console.log(this.responseText)
       
        respuesta = JSON.parse(this.responseText)
        }
    const rdo = respuesta.data

divisa2 = Object.keys(rdo.quote)[0]
valor = `rdo.quote.${divisa2}.price`

var tipoCambio = eval(valor) 
var cantidadFrom = document.querySelector("#cantidadFrom").value
var cantidadTo = document.querySelector("#cantidadTo")
        cantidadTo.innerHTML = tipoCambio * cantidadFrom
var exchangeRate = document.querySelector("#exchangeRate")
        cambio = document.createElement("p")
        exchangeRate.appendChild(cambio)
        cambio.innerHTML = eval(valor)
}

const  xhr = new XMLHttpRequest()
xhr.onload = gestionaRespuestaAsincrona

document.querySelector("#actualizaValor")
    .addEventListener("click", () => {
        const monedaFrom = document.querySelector("#monedaFrom").value
        const monedaTo = document.querySelector("#monedaTo").value
        xhr.open('GET', `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&symbol=${monedaFrom}&convert=${monedaTo}&CMC_PRO_API_KEY=0b92c0c3-80c0-40a5-8611-295434c86c96`, true)
        /*xhr.open('GET', `https://sandbox-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&symbol=${monedaFrom}&convert=${monedaTo}&CMC_PRO_API_KEY=b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c`, true)*/
        xhr.send();
            })