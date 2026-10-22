let numero1 = null;

function sumar(numero){
    
    if(numero1 === null){
        
        numero1 = numero;
        document.getElementById('display').textContent= 
        'Primer numero: ' + numero1;

    }else{
        let resultado = numero1 + numero;
        document.getElementById('display').textContent= 
        'Resultado: ' + resultado;
        numero1==null;
    }
}


function restar(numero){
    if(numero1 === null){
        numero1 = numero;
        document.getElementById('display').textContent= 
        'Primer numero: ' + numero1;
    }else{
        let resultado = numero1 - numero;
        document.getElementById('display').textContent= 
        'Resultado: ' + resultado;
        numero1==null;
    }
}

function dividir(numero){
    if(numero1 === null){
        numero1 = numero;
        document.getElementById('display').textContent= 
        'Primer numero: ' + numero1;
    } 
    else{
        let resultado = numero1 / numero;
        document.getElementById('display').textContent= 
        'Resultado: ' + resultado;
        numero1==null;
    }
}


function reiniciar(){
    numero1 = null;
    document.getElementById('display').textContent= 
        'Resultado: 0';
}