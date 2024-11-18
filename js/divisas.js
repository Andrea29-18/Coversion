const API_URL_BASE = "https://openexchangerates.org/api/";
const API_APP_ID = "dfb828d69fbd4142982558925a6ef21b";
const API_MXM_CURRENCY = "MXN";
let pesos_a_dolares = true;

window.onload = function () {
    actualizarImagenesMonedas();
};

function intercambiarTipoConversion() {
    pesos_a_dolares = !pesos_a_dolares;
    actualizarImagenesMonedas();
}

function actualizarImagenesMonedas() {
    const titulo = document.getElementById("h1_titulo");
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");

    if (pesos_a_dolares) {
        titulo.innerText = "Conversor de Divisas: Pesos a Dólares";
        img1.src = "/resource/mxn.png"; 
        img2.src = "/resource/usa.png";
    } else {
        titulo.innerText = "Conversor de Divisas: Dólares a Pesos";
        img1.src = "/resource/usa.png";
        img2.src = "/resource/mxn.png"; 
    }
}

function convertir(event) {
    event.preventDefault();
    const importe = parseFloat(document.getElementById("txt_importe").value);
    const res = document.getElementById("txt_resultado");
    const txtasa = document.getElementById("txt_tasa");

    if (isNaN(importe) || importe <= 0) {
        alert("Por favor, introduce un importe válido.");
        return;
    }

    const request = new XMLHttpRequest();
    request.open(
        "GET",
        `${API_URL_BASE}latest.json?app_id=${API_APP_ID}&symbols=${API_MXM_CURRENCY}`,
        true
    );

    request.onerror = function () {
        alert("No se puede consultar el API en este momento.");
    };

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            const data = JSON.parse(this.response);
            const tasa = parseFloat(data.rates[API_MXM_CURRENCY]);

            if (!isNaN(tasa) && tasa > 0.0) {
                txtasa.value = tasa.toFixed(4);
                res.value = pesos_a_dolares
                    ? (importe / tasa).toFixed(2)
                    : (importe * tasa).toFixed(2);
            }
        } else {
            alert("No se puede consultar las tasas de cambio en este momento.");
        }
    };

    request.send();
}
