const pantalla = document.getElementById('pantalla');
const botones = document.getElementById('.calculadora button');
const OPERADORES = ["+", "-", "/", "*"];
let expresion = "0";
let mostrandoResultado = false;

function cambiarTexto() {
    document.getElementById("mensaje").textContent="¡Gracias por registrarte!" // ID del texto
}

function cambiarNumero1() {
    document.getElementById("1").textContent="¡33!" // ID del texto
}

function cambiarNumero2(){
    document.getElementById("2").textContent="¡67!" // ID del texto
}

// Funciones para la calculadora

function actualizarPantalla(){
    pantalla.value = expresion;
}

function numeroActual(){
    const partes = expresion.split(/[+\-*]/) // Arreglo con los operadores
    return partes[partes.length[-1]]
}

function ultimoCaracter(){
    return expresion.slice(-1);
}

function limpiar(){
    expresion = "0";
    mostrandoResultado = false;
    actualizarPantalla()
}

function borrar(){
    if (mostrandoResultado || expresion == "Error"){
        limpiar();
        return;
    }

    expresion = expresion.slice(0, -1);
    if(expresion === "" || expresion === "-") expresion = "0";
        actualizarPantalla();
}

function agregarDigito(digito){

}