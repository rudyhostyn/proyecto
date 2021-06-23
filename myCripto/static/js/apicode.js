var datoValor = document.querySelector("#datoValor")
datoValor.classList.add("row")

function gestionaRespuestaAsincrona(){
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
        /*resultadoCambio = document.createElement("p")
        resultadoCambio.setAttribute("id", "cantidadComprar")
        cantidadTo.appendChild(resultadoCambio)*/
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
        xhr.open('GET', `https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1&symbol=${monedaFrom}&convert=${monedaTo}&CMC_PRO_API_KEY=6ba44227-d5e7-47c9-8d3f-2148e0dcbeb9`, true)
        xhr.send()
    })