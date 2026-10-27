/*
@param {number} nuevoPorcentaje
*/

function actualizarBarra(nuevoPorcentaje){
    if(nuevoPorcentaje < 0)
        nuevoPorcentaje=0;

    if(nuevoPorcentaje > 100)
        nuevoPorcentaje=100;

    const barraRelleno=document.getElementById('customBar');
    const textoRelleno=document.getElementById('customText');

    barraRelleno.style.width = nuevoPorcentaje + '%'
    textoRelleno.innerText= nuevoPorcentaje + '%'


}