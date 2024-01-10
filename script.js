/*

Diputados
La idea es tener algo como el recinto: https://www.hcdn.gob.ar/diputados/recinto.html
Votaciones obtenidas de: https://votaciones.hcdn.gob.ar/


Senadores
https://www.senado.gob.ar/senadores/listados/listaSenadoRes
https://www.senado.gob.ar/votaciones/detalleActa/2418

 




Es tan facil como cambiar las propiedades del css y los colores en base a la info de los datos
    poner un background y con transparencia en la imagen
mapear candidato y que tipo de voto tuvo. 
arreglar para que no cargue siempre las imagenes desde cero
sistema que haga un scrapping de la pagina de diputados y sus votos, enlistar ésta info. 
    probar usar la api y si sigue vigente


Ver si se puede usar la librería pero para los senadores, en caso contrario hacerla con mi programa
*/




// tipos de votos
const TIPO_VOTO = {
    "AFIRMATIVO": "#6CC39F",
    "NEGATIVO": "#F0686C",
    "ABSTENCION": "#239FD9",
    "AUSENTE": "#FAB860",
    "SIN_VOTAR": "#707CD2",
    "default": "#23d978"
}


const BLOQUE = {
    "Frente De Todos": "#6c6fc3",
    "Pro": "#eef068",
    "UCR": "#F0686C",
    "Pts - Frente De Izquierda Y De Trabajadores - Unidad": "#239FD9",
    "La Libertad Avanza": "#b435ae",
    "Evolucion Radical": "#d29f70",
    "default": "#23d978"
}


// {
//         //       "DIPUTADO": "AGOST CARREÑO, OSCAR",
//         //       "BLOQUE": "Pro",
//         //       "PROVINCIA": "Córdoba",
//         //       "¿CÓMO VOTÓ?": "NEGATIVO"
//         //     },


//obtenido de https://votaciones.hcdn.gob.ar/votacion/4836
// URL del recurso https://pastebin.com/raw/iazJWx83
const titulo = "O.D. 67 - LEY 27.551, DE ALQUILERES. DICTAMEN DE MAYORIA. VOT. EN GRAL."
const url = 'resultados.json';


function obtener_votos(url){
    return fetch(url, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            },
        })
    .then(response => response.text())
    .then(response => {
        return JSON.parse(response)
    })
    .catch(error => console.error('Error fetching JSON:', error));
}


function obtener_datos_diputados(url){
    return fetch(url, {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            },
        })
    .then(response => response.text())
    .then(response => {
        return JSON.parse(response)
    })
    .catch(error => console.error('Error fetching JSON:', error));

}


obtener_datos_diputados("https://rest.hcdn.gob.ar/parla/api/diputado/").then(res => {
    console.log(res)

})



// -------------------- datos del SVG --------------------
const HEIGHT = 700
const WIDTH = 800
const cx = WIDTH/2
const cy = HEIGHT/2
const RADIO_CIRCULO = 10;
const svgns = "http://www.w3.org/2000/svg"
let container = document.getElementById( 'cont' );
container.setAttribute("height", HEIGHT)
container.setAttribute("width", WIDTH)










class Banca {
  constructor(contenedor, radio, angulo, radioCirc = RADIO_CIRCULO, color = "green", bloque = "none"){
    this.r = radio;
    this.ang = angulo
    this.contenedor = contenedor
    this.radioCirc = radioCirc
    this.color = color
    this.circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    this.fill_color = bloque
    this.draw()
  }
  
  draw(){
    // coordenadas polares
    let x = this.r * Math.cos(this.ang) + cx
    let y = this.r * -Math.sin(this.ang) + cy   //el - porque en matematicas se cuenta en sentido contrario a las agujas del reloj
    this.circle.setAttributeNS(null, 'cx', x);
    this.circle.setAttributeNS(null, 'cy', y);
    this.circle.setAttributeNS(null, 'r', this.radioCirc);
    this.circle.setAttributeNS(null, 'style', `fill: ${this.fill_color}; stroke:${this.color}; stroke-width: 2px;'` );
    this.contenedor.appendChild(this.circle);
  }
  
  update(contenedor, radio, angulo, radioCirc = RADIO_CIRCULO){
    this.r = radio;
    this.ang = angulo
    this.contenedor = contenedor
    this.radiusCirc = radioCirc
    this.draw()
  }
}



function dibujar_ejes_principales(){
    // ejes principales x e y
    var forma = document.createElementNS(svgns, "line");
                    forma.setAttributeNS(null, "x1", 0);
                    forma.setAttributeNS(null, "y1", cy);
                    forma.setAttributeNS(null, "x2", WIDTH + cx);
                    forma.setAttributeNS(null, "y2", cy);
                    forma.setAttributeNS(null, "stroke", "black");
    container.appendChild(forma);

    var forma2 = document.createElementNS(svgns, "line");
                    forma2.setAttributeNS(null, "x1", cx);
                    forma2.setAttributeNS(null, "y1", 0);
                    forma2.setAttributeNS(null, "x2", cx);
                    forma2.setAttributeNS(null, "y2", HEIGHT);
                    forma2.setAttributeNS(null, "stroke", "black");
    container.appendChild(forma2);
}

// mapea el bloque a un color
function map_bloque_color(rep){
    let color = BLOQUE[rep["BLOQUE"]]
    if(color == undefined){
        color = BLOQUE["default"]
    }
    return color
}

// mapea el tipo de voto a un color
function map_voto(rep){
    let color = TIPO_VOTO[rep["¿CÓMO VOTÓ?"]]
    if(color == undefined){
        color = TIPO_VOTO["default"]
    }
    return color
}

// dibuja en la semiesfera las bancas angularmente, es decir, empezando 
// desde un extremo y sumando el angulo de cada banca, aproximandose hacia el centro
function dibujar_bancas_angularmente(resultados){
    //contenedor circulos (luego darle forma de semi-esfera)
    const rGrande = 300
    new Banca(container, 0, 0, rGrande)

    
    // banca inicial
    const SEPARACION = 3
    let color = "red"
    let radio_coord = rGrande - RADIO_CIRCULO
    let ang_coord = 0 
    // angulo_tita = arco_circunf / radio
    let tita = (RADIO_CIRCULO*2 + SEPARACION)/radio_coord
    // Note: aca estoy aproximando arco_circunf ~= diametro
    let factor_sep_bancas = 3

    //rep = representante
    resultados.forEach(rep => {
        // si llega al final del 2do cuadrante pasa al siguiente circulo interior
        if(ang_coord > Math.PI){
            ang_coord = 0
            radio_coord = rGrande - (RADIO_CIRCULO + SEPARACION * 0.5)*factor_sep_bancas + SEPARACION*0.5
            factor_sep_bancas = factor_sep_bancas + 2
            tita = (RADIO_CIRCULO*2 + SEPARACION)/radio_coord
            color = "blue"
            
        } else {
            let c2 = new Banca(container, radio_coord, ang_coord, RADIO_CIRCULO, map_bloque_color(rep), map_voto(rep))
            // ang(n+1) = tita_i + ang(n) 
            ang_coord = tita + c2.ang
        }
    })
}




// obtiene los datos y dibuja las bancas
obtener_votos(url).then(res => {
    dibujar_bancas_angularmente(res)
})



dibujar_ejes_principales()