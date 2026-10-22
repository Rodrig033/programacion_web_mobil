const pantalla = document.getElementById("pantalla");
const botones = document.querySelectorAll(".calculadora button");
const OPERADORES = ["+", "-", "*", "/"];
let expresion = "0";
let mostrandoResultado = false; 

function actualizarPantalla() {
    pantalla.value = expresion;
}

function ultimoCaracter() {
    return expresion.slice(-1);
}

function numeroActual() {
    const partes = expresion.split(/[+\-*/]/);
    return partes[partes.length - 1];
}

function limpiar() {
    expresion = "0";
    mostrandoResultado = false;
    actualizarPantalla();
}

function borrar() {
    if (mostrandoResultado || expresion === "Error") {
        limpiar();
        return;
    }
    expresion = expresion.slice(0, -1);
    if (expresion === "" || expresion === "-") expresion = "0";
    actualizarPantalla();
}

function agregarDigito(digito) {
    if (mostrandoResultado || expresion === "Error") {
        expresion = "0";
        mostrandoResultado = false;
    }
    if (numeroActual() === "0") {
        expresion = expresion.slice(0, -1) + digito;
    } else {
        expresion += digito;
    }
    actualizarPantalla();
}

function agregarPunto() {
    if (mostrandoResultado || expresion === "Error") {
        expresion = "0";
        mostrandoResultado = false;
    }

    if (numeroActual().includes(".")) return;
    if (OPERADORES.includes(ultimoCaracter())) expresion += "0";
    expresion += ".";
    actualizarPantalla();
}

function agregarOperador(op) {
    if (expresion === "Error") return;
    mostrandoResultado = false;

    if (expresion === "0" && op === "-") {
        expresion = "-";
        actualizarPantalla();
        return;
    }
    if (OPERADORES.includes(ultimoCaracter())) {
        expresion = expresion.slice(0, -1) + op;
    } else {
        if (ultimoCaracter() === ".") expresion = expresion.slice(0, -1);
        expresion += op;
    }
    actualizarPantalla();
}

function evaluar(expr) {
    const tokens = expr.match(/\d+\.?\d*|\.\d+|[+\-*/]/g);
    if (!tokens) return 0;

    if (tokens[0] === "-") {
        tokens.splice(0, 2, "-" + tokens[1]);
    }

    if (OPERADORES.includes(tokens[tokens.length - 1])) tokens.pop();

    const pila = [parseFloat(tokens[0])];
    for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const num = parseFloat(tokens[i + 1]);
        if (op === "*") {
            pila.push(pila.pop() * num);
        } else if (op === "/") {
            if (num === 0) throw new Error("División entre cero");
            pila.push(pila.pop() / num);
        } else {
            pila.push(op, num);
        }
    }

    let resultado = pila[0];
    for (let i = 1; i < pila.length; i += 2) {
        resultado = pila[i] === "+" ? resultado + pila[i + 1] : resultado - pila[i + 1];
    }

    return parseFloat(resultado.toFixed(10));
}

function calcular() {
    if (expresion === "Error") return;
    try {
        const resultado = evaluar(expresion);
        expresion = isFinite(resultado) ? String(resultado) : "Error";
    } catch {
        expresion = "Error";
    }
    mostrandoResultado = true;
    actualizarPantalla();
}

function manejarEntrada(valor) {
    if (valor === "C") limpiar();
    else if (valor === "←") borrar();
    else if (valor === "Resultado" || valor === "=") calcular();
    else if (valor === ".") agregarPunto();
    else if (OPERADORES.includes(valor)) agregarOperador(valor);
    else if (/^\d$/.test(valor)) agregarDigito(valor);
}

botones.forEach((boton) => {
    boton.addEventListener("click", () => manejarEntrada(boton.textContent.trim()));
});

document.addEventListener("keydown", (e) => {
    if (/^\d$/.test(e.key) || OPERADORES.includes(e.key) || e.key === ".") {
        manejarEntrada(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calcular();
    } else if (e.key === "Backspace") {
        borrar();
    } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
        limpiar();
    }
});

actualizarPantalla();