let pinActual = "1234";   
let saldo = 5000;
let movimientos = [];     

// Estados posibles: "inicio", "pin", "menu", "cuenta", "monto", "mensaje",
//                   "nuevoPin", "confirmarPin"
let estado = "inicio";
let pinIngresado = "";
let pinNuevo = "";
let montoIngresado = "";
let cuentaDestino = "";
const LARGO_CUENTA = 10;
let operacion = "";   // "retiro", "deposito" o "transferencia"

const pantalla = document.getElementById("pantalla");

//  Botones laterales (1-4 izquierda, 5-8 derecha) 
function presionarLateral(numero){
    if(estado === "inicio"){
        if(numero === 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8){
            pedirPin();
        }
        return;
    }

    if(estado === "menu"){
        ejecutarOpcion(numero);
    }
}

function pedirPin(){
    estado = "pin";
    pinIngresado = "";
    mostrarPin("Verde para confirmar");
}

function mostrarPin(aviso, titulo = "Ingresa tu NIP"){
    let asteriscos = "*".repeat(pinIngresado.length);
    pantalla.innerHTML =
        titulo + "<br><br>" +
        "<span class='pin'>" + (asteriscos || "&nbsp;") + "</span><br>" +
        "<small>" + aviso + "</small>";
}

// Teclado numérico 
function presionarNumero(digito){
    if(estado === "pin" && pinIngresado.length < 4){
        pinIngresado += digito;
        mostrarPin("Verde para confirmar");
    }
    else if((estado === "nuevoPin" || estado === "confirmarPin") && pinIngresado.length < 4){
        pinIngresado += digito;
        mostrarPinCambio("Verde para continuar");
    }
    else if(estado === "cuenta" && cuentaDestino.length < LARGO_CUENTA){
        cuentaDestino += digito;
        mostrarCuenta("Verde para continuar");
    }
    else if(estado === "monto" && montoIngresado.length < 6){
        montoIngresado += digito;
        mostrarMonto();
    }
}

// Amarillo: borra el último dígito
function borrar(){
    if(estado === "pin"){
        pinIngresado = pinIngresado.slice(0, -1);
        mostrarPin("Verde para confirmar");
    }
    else if(estado === "nuevoPin" || estado === "confirmarPin"){
        pinIngresado = pinIngresado.slice(0, -1);
        mostrarPinCambio("Verde para continuar");
    }
    else if(estado === "cuenta"){
        cuentaDestino = cuentaDestino.slice(0, -1);
        mostrarCuenta("Verde para continuar");
    }
    else if(estado === "monto"){
        montoIngresado = montoIngresado.slice(0, -1);
        mostrarMonto();
    }
}

// Rojo: cancela y regresa al inicio
function cancelar(){
    estado = "inicio";
    pinIngresado = "";
    pinNuevo = "";
    montoIngresado = "";
    cuentaDestino = "";
    pantalla.innerHTML = "BIENVENIDO<br><small>Presione cualquier botón.<\small>";
}

// Verde: confirma
function confirmar(){
    if(estado === "pin"){
        if(pinIngresado === pinActual){
            mostrarMenu();
        } else {
            pinIngresado = "";
            mostrarPin("NIP incorrecto. Intenta de nuevo");
        }
    }
    else if(estado === "nuevoPin" || estado === "confirmarPin"){
        procesarCambioPin();
    }
    else if(estado === "cuenta"){
        if(cuentaDestino.length === LARGO_CUENTA){
            pedirMonto("transferencia");
        } else {
            mostrarCuenta("La cuenta debe tener " + LARGO_CUENTA + " dígitos");
        }
    }
    else if(estado === "monto"){
        procesarMonto();
    }
    else if(estado === "mensaje"){
        mostrarMenu();
    }
}

// Menú
function mostrarMenu(){
    estado = "menu";
    pantalla.innerHTML =
        "<div class='menu'>" +
            "<div class='col izq'>" +
                "<span>◀ Saldo</span>" +
                "<span>◀ Retirar</span>" +
                "<span>◀ Depositar</span>" +
                "<span>◀ Salir</span>" +
            "</div>" +
            "<div class='col der'>" +
                "<span>Transferir ▶</span>" +
                "<span>Movimientos ▶</span>" +
                "<span>Cambiar NIP ▶</span>" +
                "<span>Ayuda ▶</span>" +
            "</div>" +
        "</div>";
}

function ejecutarOpcion(numero){
    switch(numero){
        case 1: mostrarMensaje("Tu saldo es:<br>$" + saldo); break;
        case 2: pedirMonto("retiro"); break;
        case 3: pedirMonto("deposito"); break;
        case 4: cancelar(); break;
        case 5: pedirCuenta(); break;
        case 6: mostrarMovimientos(); break;
        case 7: pedirNuevoPin(); break;
        case 8: mostrarAyuda(); break;
    }
}

//  Operaciones
function pedirCuenta(){
    estado = "cuenta";
    cuentaDestino = "";
    mostrarCuenta("Verde para continuar");
}

function mostrarCuenta(aviso){
    pantalla.innerHTML =
        "Cuenta destino<br><br>" +
        (cuentaDestino || "&nbsp;") +
        "<small>" + aviso + "</small>";
}

function pedirMonto(tipo){
    estado = "monto";
    operacion = tipo;
    montoIngresado = "";
    mostrarMonto();
}

function mostrarMonto(){
    let titulo;
    if(operacion === "retiro"){
        titulo = "Monto a retirar";
    } else if(operacion === "deposito"){
        titulo = "Monto a depositar";
    } else {
        titulo = "Monto a transferir<br><small>A la cuenta " + cuentaDestino + "</small>";
    }
    pantalla.innerHTML =
        titulo + "<br><br>$" + (montoIngresado || "0") +
        "<br><small>Verde para confirmar</small>";
}

function procesarMonto(){
    let monto = Number(montoIngresado);
    if(monto <= 0){
        mostrarMonto();
        return;
    }
    if(operacion === "retiro"){
        retirar(monto);
    } else if(operacion === "transferencia"){
        transferir(monto);
    } else {
        saldo += monto;
        registrarMovimiento("Depósito", monto);
        mostrarMensaje("Depositaste $" + monto + "<br>Saldo: $" + saldo);
    }
}

function retirar(monto){
    if(monto > saldo){
        mostrarMensaje("Saldo insuficiente");
    } else {
        saldo -= monto;
        registrarMovimiento("Retiro", -monto);
        mostrarMensaje("Retira tu efectivo<br>$" + monto);
    }
}

function transferir(monto){
    if(monto > saldo){
        mostrarMensaje("Saldo insuficiente");
    } else {
        saldo -= monto;
        registrarMovimiento("Transferencia", -monto);
        mostrarMensaje("Transferiste $" + monto +
            "<br><small>A la cuenta " + cuentaDestino + "</small>" +
            "Saldo: $" + saldo);
    }
}

//  Movimientos 
function registrarMovimiento(tipo, monto){
    movimientos.unshift({ tipo: tipo, monto: monto });   // el más reciente primero
}

function mostrarMovimientos(){
    if(movimientos.length === 0){
        mostrarMensaje("Aún no hay movimientos");
        return;
    }
    let filas = "";
    // Solo caben 4 en la pantalla
    for(let i = 0; i < movimientos.length && i < 4; i++){
        let m = movimientos[i];
        let signo = (m.monto < 0) ? "-$" : "+$";
        filas += "<div><span>" + m.tipo + "</span><span>" +
                 signo + Math.abs(m.monto) + "</span></div>";
    }
    mostrarMensaje("Movimientos<div class='lista'>" + filas + "</div>");
}

// Cambiar NIP 
function pedirNuevoPin(){
    estado = "nuevoPin";
    pinIngresado = "";
    pinNuevo = "";
    mostrarPinCambio("Verde para continuar");
}

function mostrarPinCambio(aviso){
    let titulo = (estado === "nuevoPin") ? "Nuevo NIP" : "Confirma tu nuevo NIP";
    mostrarPin(aviso, titulo);
}

function procesarCambioPin(){
    if(pinIngresado.length !== 4){
        mostrarPinCambio("El NIP debe tener 4 dígitos");
        return;
    }
    if(estado === "nuevoPin"){
        if(pinIngresado === pinActual){
            pinIngresado = "";
            mostrarPinCambio("Debe ser distinto al actual");
            return;
        }
        pinNuevo = pinIngresado;
        pinIngresado = "";
        estado = "confirmarPin";
        mostrarPinCambio("Escríbelo otra vez");
    } else {
        if(pinIngresado === pinNuevo){
            pinActual = pinNuevo;
            mostrarMensaje("NIP actualizado");
        } else {
            estado = "nuevoPin";
            pinIngresado = "";
            pinNuevo = "";
            mostrarPinCambio("No coinciden. Empieza de nuevo");
        }
    }
}

// Ayuda
function mostrarAyuda(){
    mostrarMensaje(
        "Ayuda" +
        "<div class='lista'>" +
            "<div><span>Botones laterales</span><br><span>Elegir opción</span></div>" +
            "<div><span>Verde -> </span><span>Confirmar</span></div>" +
            "<div><span>Amarillo -> </span><span>Borrar</span></div>" +
            "<div><span>Rojo -> </span><span>Cancelar</span></div>" +
        "</div>"
    );
}

function mostrarMensaje(texto){
    estado = "mensaje";
    pantalla.innerHTML = texto + "<br><small>Verde para volver al menú</small>";
}